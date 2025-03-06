/*
  This file contains the routes for the main page of the application.
  Reference for web-push: https://www.npmjs.com/package/web-push
*/

import express from 'express';
import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import webPush from 'web-push';
import dotenv from 'dotenv';
import { getJobHistory, getOpenJobs, getNotifications, closeDB, freezeUser, addToken, blockToken, addSubscription } from '../dbhelper.js';
// import { sendNotification } from 'web-push'; 
import { countOpenJobs, getBusinessPhoto, addUser, login,registerBusinessAndAdmin, getBusinessId, searchEmployees} from '../managementdbfunc.js';
import {authMiddleWare, adminMiddleWare, moderatorMiddleWare} from '../authMiddleWare.js';
import { blackListToken, checkToken } from '../blacklist.js';
import { decryptJobId } from '../qr_generation.js';

dotenv.config('../')
console.log(process.env.NODE_ENV)
// set up the keys for authentication
const accessPrivateKey = fs.readFileSync('jwtRSA256-private.pem','utf-8');
const publicKey = fs.readFileSync('jwtRSA256-public.pem','utf-8');
// set up keys for refresh
const refreshPrivateKey = fs.readFileSync('refresh-private.pem');
const refreshPublicKey = fs.readFileSync('refresh-public.pem');

const accessCookieOptions = {
  httpOnly: true,  // Prevent access via JavaScript
  secure: process.env.NODE_ENV === "production", // Only in HTTPS
  sameSite: "Strict",  // Prevent CSRF
  maxAge:  60 * 60 * 1000 // 1 hour
};

const refreshCookieOptions = {
  httpOnly: true,  // Prevent access via JavaScript
  secure: process.env.NODE_ENV === "production", // Only in HTTPS
  sameSite: "Strict",  // Prevent CSRF
  maxAge: 24 * 60 * 60 * 1000 // 1 day
};

const indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
  
indexRouter.post('/login', async (req, res) => {
  // authenticate the user through their credentials and generate a JWT token

  const businessName = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  console.log(username)

  if(!(username||password)||!businessName){
    return res.status(400).json({message: "Missing fields from client"});
  }
  
  const businessId = await getBusinessId(businessName);
  // check the database for the user
  const loginCredentials = await login(businessName,username)
  
  if (loginCredentials){
    const privilige = loginCredentials.Privilege_level;
    console.log(loginCredentials)
    let isMatch = await bcrypt.compare(password, loginCredentials.Hashed_Password)
    console.log(`Password Match: ${isMatch}`)
    if (isMatch){
      // get the workerId
      const employeeInfo = await searchEmployees(username,businessId)

      const workerId = employeeInfo[0].User_ID; 
      console.log(workerId)

      // create new jwt
      const accessToken = jwt.sign({ username: username, role: privilige, workerId:workerId  }, accessPrivateKey, { expiresIn: '1h', algorithm: 'RS256' })
      // create new refresh token
      const refreshToken = jwt.sign({ username: username }, refreshPrivateKey, {expiresIn: '1d', algorithm: 'RS256' })
      try{
        await addToken(loginCredentials.User_ID,accessToken);
        await addToken(loginCredentials.User_ID,refreshToken);
      }catch(err){
        console.log(`Error when populating tokens: ${err}`)
        res.status(500).json({ message:'Unable to append tokens to db'})
      }
      res.status(200).cookie('access',accessToken,accessCookieOptions).
      cookie('refresh',refreshToken,refreshCookieOptions).
      json({message:'access token and refresh cookie sent in cookies',
        userId: workerId,
        businessId : businessId

      });
    }else{
      res.status(401).json({error: "Passwords do not match"});
    }
  }else{
    res.status(401).json({error: "Unable to retrieve credentials from DB"});
  }

});

// register a new business and admin
indexRouter.post('/register', async (req, res) => {
  
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  console.log(`Registering ${name}`)

  if(name && username && password){

    const hashedPassword = await bcrypt.hash(password, 10);
    registerBusinessAndAdmin(name, username, hashedPassword).then((attempt) => {
      if (attempt != null) {
          res.status(200).json({ message: 'Success Business Registered' });
      } else {
          res.status(400).json({ message: 'Error registering business and admin' });
      }
  })

  }else{
    res.status(400).json({message: "missing fields"})
  }
});

//refresh the current access token using a refresh token
indexRouter.post('/refresh', async(req,res) => {
  //check if refresh token is valid, if so then return a new access token

  //extract request data

  const username = req.body.username;
  const id = req.body.workerId;
  // const privilegeLevel = req.body.privilegeLevel;

  if(req.cookies?.refresh){
    const token = req.cookies.refresh
    jwt.verify(token, refreshPublicKey,
      async(err,decoded) => {
        console.log(decoded)
        if (err) {
          // Wrong Refesh Token
          return res.status(406).json({ message: 'Error in decoding' });
      }
      else {
        //Check wether the token has been blacklisted
        console.log(`REFRESH TOKEN:${token}`)
        const validToken = await checkToken(token)

        if(!validToken){
          await freezeUser(id);
          return res.status(400).json({ message:"Invalid token used"});
        }
          // Correct token we send a new access token
          if(decoded.username === username){

            const accessToken = jwt.sign({ username:username, workerId: id, privilegeLevel:1 }, accessPrivateKey, {expiresIn: '1hr',algorithm:'RS256'});
            const newRefreshToken = jwt.sign({ username:username }, refreshPrivateKey, {expiresIn:'1d',algorithm:'RS256'});
            // add new token to db
            await addToken(id, newRefreshToken);
            // blacklist used token
            await blackListToken(token);
            //return new tokens to client
            return res.status(200).cookie('access',accessToken,accessCookieOptions).
            cookie('refresh',newRefreshToken,refreshCookieOptions).
            json({message:"New token generated"})

          }else{

            //logs user out
            freezeUser(id) 
            blackListToken(token)
            
            return res.status(406).json({message: 'The refresh token provided does not match the user'})
          }
      }
      }
    )

  }else{
    res.status(406).json({ message: "Unauthorised, no refresh token provided. Please sign out and login again"})
  }
})
//save info about new Push-API subscription
indexRouter.post('/save-new-subscription', async(req,res) => {
  // Extract info about subscription object
  const notifcation = req.body;
  const encryptedJobId = req.body.jobId;
  const businessId = req.body.businessId;

  //recover the actual job ID
  const decryptJobId = decryptJobId(encryptedJobId);

  //save subscription to DB
  
  await addSubscription(decryptJobId,businessId,notifcation.endpoint, notifcation.keys.auth, notifcation.keys.p256dh).
  then(() => {
    res.status(200).json({ message:'subscription succesfully saved' })
  }).catch((err) =>{
    res.status(500).json({error:err})
  })
  
})
//clear cookies
indexRouter.post('/clearCookies', (req,res) =>{
  //clear access and refresh tokens to log user out
  try{
    res.clearCookie('access')
    res.clearCookie('refresh')
  }catch (err){
    res.status(500).json({ error:'err' })
  }
})
export { indexRouter }; 