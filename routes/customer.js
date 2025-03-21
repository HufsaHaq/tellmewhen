/*
To Do:
- Decrypt  */
import express from 'express';
import { getJobHistory, getOpenJobs, getNotifications, getCustomerJobDetails } from '../dbhelper.js';
import { decrypt } from 'dotenv';
import { decryptJobId } from '../qr_generation.js';


const customerRouter = express.Router();

//return information about a given job
customerRouter.get('/my_job/:job_id', async (req, res) => {
    
    const jobId = req.params.job_id

    try{
        const decyptedId = decryptJobId(jobId)

        let results = await getCustomerJobDetails(decyptedId)


        results["jobId"] = decyptedId;
        console.log(results)
        
        return res.status(200).json(results)
    }catch (err){
        console.log(err)
        return res.status(500).json({ error:`Error in looking up job with ID: ${jobId}`})
    }
    
})

export {customerRouter};


