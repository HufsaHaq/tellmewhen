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
import { countOpenJobs, getBusinessPhoto, addUser, login,registerBusinessAndAdmin} from '../managementdbfunc.js';
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

  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password; 
  if(!(username||password)){
    res.status(400).json({message: "Missing fields from client"});
    return 0;
  }
  // check the database for the user
  const loginCredentials = await login(name,username, password)

  if (loginCredentials){
    const privilige = loginCredentials.Privilege_level;

    let isMatch = bcrypt.compare(password, loginCredentials.Hashed_Password)

    
    if (isMatch){
      // create new jwt
      const accessToken = jwt.sign({ username: username, role: privilige }, privateKey, { expiresIn: '1h', algorithm: 'RS256' })
      res.json({ accessToken: accessToken })
    }else{
      res.json({error: "Passwords do not match"});
    }
  }else{
    res.json({error: "Unable to retrieve credentials from DB"});
  }

});

// register a new business and admin
indexRouter.post('/register', async (req, res) => {
  
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  if(name && username && password){

    const hashedPassword = await bcrypt.hash(password, 10);
    registerBusinessAndAdmin(name, username, hashedPassword)
    res.status(200).json({message:"Business registered"})
  }else{
    res.status(400).json({message: "missing fields"})
  }
});

export { indexRouter }; 