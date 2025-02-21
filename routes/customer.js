/*
To Do:
- Decrypt  */
import express from 'express';
import { getJobHistory, getOpenJobs, getNotifications } from '../dbhelper.js';
import { sendNotification } from 'web-push';
import { job_id_to_random_job_id } from 'qr_generation.js'

const customerRouter = express.Router();

//return information about a given job
customerRouter.get('/my_job/:job_id', async (req, res) => {
  // do decyption first !
  const userId = req.job_id;
  getOpenJobs(userId)
    .then((jobs) => res.json(jobs))
    .catch((err) => res.json({ error: err }));
})

export {customerRouter};


