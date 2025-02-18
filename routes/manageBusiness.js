import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
// db helper functions
import { getJobHistory, getOpenJobs, getNotifications, closeDB } from '../dbhelper.js';
import { countOpenJobs, getBusinessPhoto, addUser, login,registerBusinessAndAdmin} from '../managementdbfunc.js';
//middleware functions for encyrption, authentication and data integrity
import {authMiddleWare, adminMiddleWare, moderatorMiddleWare} from '../authMiddleWare.js';
import { checkData } from '../datacheck.js';

//provide path to .env file
dotenv.config('../')

businessRouter = express.Router();

businessRouter.get('/info/:bid', authMiddleWare,adminMiddleWare, async (req,res) =>{
    // return info about business
})

businessRouter.post('/change/name/:bid', authMiddleWare,adminMiddleWare, async (req,res) =>{
    // rename business and send an okay
})

businessRouter.post('/change/photo/:bid', authMiddleWare,adminMiddleWare, async (req,res) =>{
    // change photo in db
})

businessRouter.get('/search/:uid', authMiddleWare, moderatorMiddleWare, async (req,res) =>{
    // return info about worker with uid
})

businessRouter.get('/total_jobs', authMiddleWare, async (req,res) => {
    // return number of open jobs
})




