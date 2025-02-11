import express from 'express';
import { getJobHistory, getOpenJobs, getNotifications } from '../dbhelper.js';
import { sendNotification } from 'web-push';

const customerRouter = express.Router();


customerRouter.get('/my_job', async (req, res) => {
  const userId = req.job_id;
  getOpenJobs(userId)
    .then((jobs) => res.json(jobs))
    .catch((err) => res.json({ error: err }));
})


