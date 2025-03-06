import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import webPush from 'web-push'
// db helper functions
import { getJobHistory, getOpenJobs, createNewJob, assignJobToUser, completeJob } from '../dbhelper.js';
import { countOpenJobs, getBusinessPhoto, addUser, login,registerBusinessAndAdmin, countTotalJobs} from '../managementdbfunc.js';
//middleware functions for encyrption, authentication and data integrity
import {authMiddleWare, adminMiddleWare, moderatorMiddleWare} from '../authMiddleWare.js';
import { generate_qr, decryptJobId } from "../qr_generation.js";


//provide path to .env file
dotenv.config('../')

const jobRouter = express.Router();

jobRouter.get('/history/:bid/:uid',authMiddleWare, async (req, res) => {
    const businessId = req.params.bid;
    const userId = req.params.userId
    await getJobHistory(businessId,userId)
      .then((history) => res.json(history))
      .catch((err) => res.json({ error: err }));
});

jobRouter.get('/open_jobs/:bid', authMiddleWare, async(req,res) => {
    
    const businessId = req.params.bid;

    try{
        await countOpenJobs() //follow up
    } catch (err) {
        res.json( { error:err })
    }
})
// returns total number of jobs ever for a business
jobRouter.get('/total_jobs/:bid', authMiddleWare, async(req,res) => {

    //extract business id
    const businessId = req.params.bid;

    try{
      await countTotalJobs();
    }catch (err) {
      res.json( {error:err});
    }
})
jobRouter.get('/current/:bid/:uid',authMiddleWare, async (req, res) => {
    const businessId = req.params.bid;
    const userId = req.params.uid;
    await getOpenJobs(businessId,userId)
      .then((jobs) => res.json(jobs))
      .catch((err) => res.json({ error: err }));
  });

// assign a job to a worker
jobRouter.post('/assign_job',authMiddleWare, moderatorMiddleWare, async (req,res) => {
    const data = req.body // get the request data

    const encryptedJobId = data.jid;
    const jobId = decryptJobId(encryptedJobId);
    const userId = data.uid;
    try{
        await assignJobToUser(userId,jobId)
    }catch (err) {
        res.json({error: err})
    }
    res.status(200).json({message : `Job ${jobId} assigned to worker with id: ${userId}`})

})

jobRouter.post('/new', authMiddleWare, async (req,res) => {
    // create new job in the db
    const jobData = req.body;
    const description = jobData.description;
    const dueDate = jobData.dueDate;
    const userId = jobData.userId;
    const businessId = jobData.businessId
    try{
        const result = await createNewJob(businessId,userId,description,dueDate);
        //extract random job id
        const randomJobId = result.randomJobId;
        //generate qr code
        const qr_url = await generate_qr(randomJobId);
        res.status(200).json({
            message: "New job succesfully registered", // Notify the user that the job has been registered
            qrCode: qr_url
        })
    } catch (err) {
        res.status(500).json({error : err})
    }
})

//needs updating to check right user has marked a job as complete
jobRouter.post('/complete/:jid',authMiddleWare, async (req,res) =>{
    const encryptedJobId = req.params.job_id;
    const jobId = decryptJobId(encryptedJobId);
    //extract JSON data from request 
    const data = req.params.body
    const userId = data.uid
    const remarks = data.remarks

    try{
        await completeJob(userId,jobId,remarks)
    }catch (err) {
        res.json( { error : err } )
    }

    res.status(200).json( { message: 'Job marked as complete'})
})

//send customer a notification
jobRouter.post('/notify/:bid/:jid',authMiddleWare, async (req, res) => {
    // Notify the customer and update the notification table
    const businessId = req.params.bid;
    const encryptedJobId = req.params.job_id;
    const jobId = decryptJobId(encryptedJobId);
    const messageBody = req.body.message || 'Your job is ready for pickup';
    const messageTitle = req.body.title || 'There is an update to your job';
    const photo = getBusinessPhoto(businessId);
    let pushSubscription;
    try{
       pushSubscription = getNotifications(businessId, jobId);
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
    webPush.sendNotification(pushSubscription, payload, options).
    then(() => {console.log("Notification Sent !")}).
    catch((err) => res.json({ error: err }));
   
})

export {jobRouter};