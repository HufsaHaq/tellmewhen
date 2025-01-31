/*
  This file contains the routes for the main page of the application.
  Reference for web-push: https://www.npmjs.com/package/web-push
*/

import express from 'express';
import { getJobHistory, getOpenJobs, getNotifications } from '../dbhelper.js';
import { sendNotification } from 'web-push';
import { countOpenJobs, getBusinessPhoto } from '../managementdbfunc.js';


const keys = { publicKey: 'BBMhViKggz_SberAlf-lNtJ5fkVUyFqVj5X_brgnK3d01tYkjxCsbl23C374X62gPiyLSHIrFjDMBQVBoLTxqLE',
  privateKey: '1kNp0x3SkWbgAdG_Yj6B076Akm33S2YTIKLSE7fdfwE'}

var indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
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

indexRouter.get('/notify/:bid/:jid', async (req, res) => {
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
  const notifcation = sendNotification(pushSubscription, payload).
  then(() => {console.log("Notification Sent !")}).
  catch((err) => res.json({ error: err }));
 
});

export { indexRouter }; 