/*
  This file contains the routes for the main page of the application.
  Reference for web-push: https://www.npmjs.com/package/web-push
*/

import express from 'express';
import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import webPush from 'web-push';
import { getJobHistory, getOpenJobs, getNotifications } from '../dbhelper.js';
// import { sendNotification } from 'web-push'; 
import { countOpenJobs, getBusinessPhoto, addUser, getLoginCredentials} from '../managementdbfunc.js';
import {authMiddleWare} from '../authMiddleWare.js';


// set up the keys for authentication
const privateKey = fs.readFileSync('private.pem','utf-8');
const publicKey = fs.readFileSync('public.pem','utf-8');

const keys = { publicKey: 'BBMhViKggz_SberAlf-lNtJ5fkVUyFqVj5X_brgnK3d01tYkjxCsbl23C374X62gPiyLSHIrFjDMBQVBoLTxqLE',
  privateKey: '1kNp0x3SkWbgAdG_Yj6B076Akm33S2YTIKLSE7fdfwE'}

var indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

indexRouter.post('/login', async (req, res) => {
  // authenticate the user through their credentials and generate a JWT token
  const username = req.body.username;
  const password = req.body.password; // this should be hashed

  // check the database for the user
  const loginCredentials = await getLoginCredentials(username, password);
  const privilige = loginCredentials.Privilege_Level;
  if (loginCredentials){

    const isMatch = await bcrypt.compare(password, loginCredentials.password);

    if (isMatch){
      const accessToken = jwt.sign({ username: username, role: privilige }, privateKey, { expiresIn: '1h', algorithm: 'RS256' });
      res.json({ accessToken: accessToken })
    }else{
      res.json({error: "Invalid credentials"});
    }
  }else{
    res.json({error: "Invalid credentials"});
  }

});

indexRouter.get('/current_jobs/:bid', async (req, res) => {
  const businessId = req.params.bid;
  getOpenJobs(businessId)
    .then((jobs) => res.json(jobs))
    .catch((err) => res.json({ error: err }));
});

indexRouter.get('/job_history/:bid', async (req, res) => {
  const businessId = req.params.bid;
  getJobHistory(businessId)
    .then((history) => res.json(history))
    .catch((err) => res.json({ error: err }));
});

indexRouter.post('/notify/:bid/:jid',authMiddleWare, async (req, res) => {
  // Notify the customer and update the notification table
  const businessId = req.params.bid;
  const jobId = req.params.jid;
  const messageBody = req.body.message || 'Your job is ready for pickup';
  const messageTitle = req.body.title || 'There is an update to your job';
  const photo = getBusinessPhoto(businessId);

  try{
    const pushSubscription = getNotifications(businessId, jobId);
  } catch (err) {
    res.json({ error: err });
  }

  const payload = JSON.stringify({
    title: messageTitle,
    body: messageBody,
    icon: photo
  })

  const options = {
    vapidDetails: {
      subject: 'mailto:https://tellmewhen.co.uk',
      publicKey: keys.publicKey,
      privateKey: keys.privateKey
    }};
  //send notifcation using PUSH API
  const notifcation = webPush.sendNotification(pushSubscription, payload).
  then(() => {console.log("Notification Sent !")}).
  catch((err) => res.json({ error: err }));
 
});

indexRouter.post('/manage/:bid/addUser',authMiddleWare,(req,res) =>{
  const access_token = req.access_token;
  const businessId = req.params.bid;

  const name = req.body.name;
  const email = req.body.email;
  const pwd = req.body.Hpassword;
  const privLevel = req.body.privLevel;

  if (privLevel < 0 || privLevel > 2){
    res.json({error: "Invalid privLevel"});
  }


  
  addUser(name, email, pwd, businessId, privLevel)
})



export { indexRouter }; 