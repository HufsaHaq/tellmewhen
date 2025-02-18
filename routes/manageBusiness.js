import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import bycrpt from 'bcrypt';
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

businessRouter.post('/addUser/:bid',authMiddleWare,adminMiddleWare,(req,res) =>{
    const access_token = req.access_token;
    const businessId = req.params.bid;
  
    const name = req.body.name;
    const email = req.body.email;
    const pwd = req.body.password;
    const privLevel = req.body.privLevel;

    // hash new password
    const hashedPassword = bycrpt.hash(pwd,10)
  
    addUser(name, email, hashedPassword, businessId, privLevel)
  
    res.status(200).json({message:`New user added: username:${name} privillige level:${privLevel}`})
  
  })



