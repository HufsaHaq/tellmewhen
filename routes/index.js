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
import { getJobHistory, getOpenJobs, getNotifications, closeDB } from '../dbhelper.js';
// import { sendNotification } from 'web-push'; 
import { countOpenJobs, getBusinessPhoto, addUser, login,registerBusinessAndAdmin, getBusinessId, searchEmployees} from '../managementdbfunc.js';
import {authMiddleWare, adminMiddleWare, moderatorMiddleWare} from '../authMiddleWare.js';
import { checkData } from '../datacheck.js';

dotenv.config('../')
console.log(process.env.NODE_ENV)
// set up the keys for authentication
const privateKey = fs.readFileSync('jwtRSA256-private.pem','utf-8');
const publicKey = fs.readFileSync('jwtRSA256-public.pem','utf-8');


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
    res.status(400).json({message: "Missing fields from client"});
    return 0;
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

      const workerId = employeeInfo.User_ID

      // create new jwt
      const accessToken = jwt.sign({ username: username, role: privilige, workerId  }, privateKey, { expiresIn: '1h', algorithm: 'RS256' })
      res.status(200).json({ accessToken: accessToken })
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

export { indexRouter }; 