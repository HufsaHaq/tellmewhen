import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import webPush from 'web-push'
// db helper functions
import { getJobHistory, getOpenJobs, createNewJob, assignJobToUser, completeJob } from '../dbhelper.js';
import { countOpenJobs, getBusinessPhoto, addUser, login,registerBusinessAndAdmin, countTotalJobs} from '../managementdbfunc.js';
//middleware functions for encyrption, authentication and data integrity
import {authMiddleWare, adminMiddleWare, moderatorMiddleWare} from '../authMiddleWare.js';
import { checkData } from '../datacheck.js';
import { JWTClaimValidationFailed } from 'jose/errors';

//provide path to .env file
dotenv.config('../')

const jobRouter = express.Router();

jobRouter.get('/history/:bid',authMiddleWare, async (req, res) => {
    const businessId = req.params.bid;
    getJobHistory(businessId)
      .then((history) => res.json(history))
      .catch((err) => res.json({ error: err }));
});

jobRouter.get('/open_jobs/:bid', authMiddleWare, async(req,res) => {
    
    const businessId = req.params.bid;

    try{
        countOpenJobs() //follow up
    } catch (err) {
        res.json( { error:err })
    }
})
// returns total number of jobs ever for a business
jobRouter.get('/total_jobs/:bid', authMiddleWare, async(req,res) => {

    //extract business id
    const businessId = req.params.bid;

    try{
      countTotalJobs();
    }catch (err) {
      res.json( {error:err});
    }
})
jobRouter.get('/current/:bid/:uid',authMiddleWare, async (req, res) => {
    const businessId = req.params.bid;
    const userId = req.params.uid;
    getOpenJobs(businessId,userId)
      .then((jobs) => res.json(jobs))
      .catch((err) => res.json({ error: err }));
  });

// assign a job to a worker
jobRouter.post('/assign_job',authMiddleWare, moderatorMiddleWare, async (req,res) => {
    const data = req.body // get the request data

    const jobId = data.jid;
    const userId = data.uid;

    try{
        assignJobToUser(userId,jobId)
    }catch (err) {
        res.json({error: err})
    }
    res.sendStatus(200).json({message : `Job ${jobId} assigned to worker with id: ${userId}`})

})

jobRouter.post('/new', authMiddleWare, async (req,res) => {
    // create new job in the db
    const jobData = req.body;

    const description = jobData.description;
    const url = jobData.url;
    const dueDate = jobData.dueDate

    try{
        createNewJob(description,url,dueDate)
    } catch (err) {
        res.json({error : err})
    }

    res.sendStatus(200).json({message: "New job succesfully registered"})
    // Notify the user that the job has been registered
})

//needs updating to check right user has marked a job as complete
jobRouter.post('/complete/:jid',authMiddleWare, async (req,res) =>{
    const jobId = req.params.jid
    //extract JSON data from request 
    const data = req.params.body
    const userId = data.uid
    const remarks = data.remarks

    try{
        completeJob(userId,jobId,remarks)
    }catch (err) {
        res.json( { error : err } )
    }

    res.sendStatus(200).json( { message: 'Job marked as complete'})
})

//send customer a notification
jobRouter.post('/notify/:bid/:jid',authMiddleWare, async (req, res) => {
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
        publicKey: process.env.VAPID_PUBLIC,
        privateKey: process.env.VAPID_PRIVATE
      }};
    //send notifcation using PUSH API
    const notifcation = webPush.sendNotification(pushSubscription, payload).
    then(() => {console.log("Notification Sent !")}).
    catch((err) => res.json({ error: err }));
   
})

export {jobRouter}