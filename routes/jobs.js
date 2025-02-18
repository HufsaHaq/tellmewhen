import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
// db helper functions
import { getJobHistory, getOpenJobs, createNewJob } from '../dbhelper.js';
import { countOpenJobs, getBusinessPhoto, addUser, login,registerBusinessAndAdmin} from '../managementdbfunc.js';
//middleware functions for encyrption, authentication and data integrity
import {authMiddleWare, adminMiddleWare, moderatorMiddleWare} from '../authMiddleWare.js';
import { checkData } from '../datacheck.js';

//provide path to .env file
dotenv.config('../')

const jobRouter = express.Router();

jobRouter.get('/history/:bid',authMiddleWare, async (req, res) => {
    const businessId = req.params.bid;
    getJobHistory(businessId)
      .then((history) => res.json(history))
      .catch((err) => res.json({ error: err }));
  });

jobRouter.get('/current/:bid/:jid',authMiddleWare, async (req, res) => {
    const businessId = req.params.bid;
    getOpenJobs(businessId,)
      .then((jobs) => res.json(jobs))
      .catch((err) => res.json({ error: err }));
  });

jobRouter.post('/complete/:jid',authMiddleWare, async (req,res) =>{
    const jobId = req.params.jid

    // Notify customer of complete job
    // Update db to reflect changes
})

jobRouter.post('new', authMiddleWare, async (req,res) => {
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


