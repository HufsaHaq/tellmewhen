import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import bycrpt from 'bcrypt';
// db helper functions
import { countOpenJobs, editUserLogin, addUser,renameBusiness,changeBusinessPhoto, getBusinessDetails} from '../managementdbfunc.js';
//middleware functions for encyrption, authentication and data integrity
import {authMiddleWare, adminMiddleWare, moderatorMiddleWare} from '../authMiddleWare.js';

//provide path to .env file
dotenv.config('../')

const businessRouter = express.Router();

businessRouter.get('/info/:bid', authMiddleWare,adminMiddleWare, async (req,res) =>{
    // return info about business
    const buisnessId = req.params.bid;

    let data;
    try{
        data = await getBusinessDetails(buisnessId);
    } catch (err) {
        res.json( {error:err})
    }

    if(!(data === null)){
        res.sendStatus(200).json(data)
    }else{
        res.json({message:'Unable to retrieve the data'})
    }
})

//changes an employees' password
businessRouter.post('/change_password', authMiddleWare, adminMiddleWare, async (req,res) => {
    //extract the info from the request JSON
    const data = req.body;

    const newPwd = data.password;
    const workerId = data.uid;
    const username = data.usernamel;

    const hashedPwd = bycrpt(newPwd,10);

    try{
        editUserLogin(workerId,username,hashedPwd);
    } catch (err) {
        res.json( { error: err });
    }

    res.sendStatus(200).json( { message : 'Password changed'})
})
//renames business
businessRouter.post('/change_name', authMiddleWare,adminMiddleWare, async (req,res) =>{
    // extract json request data
    const newName = req.body.name;
    const businessId = req.body.bid;

    try{
        renameBusiness(businessId,newName);
    }catch (err) {
        res.json( { error: err } );
    }

    res.sendStatus(200).json( {message: `Business renamed to ${newName}`})
})

// changes business photo
businessRouter.post('/change_photo/:uid', authMiddleWare,adminMiddleWare, async (req,res) =>{
    //get the business id
    const businessId  = req.params.uid;
    //extract photo from request JSON
    const newPhoto = req.body.newPhoto;

    try{
        changeBusinessPhoto(newPhoto)
    } catch (err) {
        res.json( { error: err } )
    }

    res.sendStatus(200).json({ message:'Photo succesfully changed'})
})

businessRouter.get('/search_employees', authMiddleWare, moderatorMiddleWare, async (req,res) =>{
    // return info about worker with uid
    const reqData = req.body;

    // get info from db...
})

// return number of open jobs
businessRouter.get('/total_jobs/:bid', authMiddleWare, async (req,res) => {
    /* 
    Returns the number of open jobs a business currently has on the platform
    
    Args:
    (bid) businessId, the businesses id number
    
    Returns:
    (200)OK: Json object with the number of open jobs 
    (400)Bad request: the supplied business id is invalid
    */

    const buisnessId = req.params.bid;
    await countOpenJobs(buisnessId).
    then((result) => {
        res.status(200).json({ message:result} )
    }).catch((err) =>{
        res.status(400).json( {error:err})
    })
})

// adds new user to business
businessRouter.post('/addUser/:bid',authMiddleWare,adminMiddleWare, async(req,res) =>{
    // extract data from JSON request body
    const businessId = req.params.bid;
  
    const username = req.bodyusername;
    const pwd = req.body.password;
    const privLevel = req.body.privLevel;

    // hash new password
    const hashedPassword = bycrpt.hash(pwd,10)
  
    await addUser(username, email, hashedPassword, businessId, privLevel).
    catch((err) =>{
        res.status(500).json({ error:`Database error occurred when adding user ${err}`});
    }).then((result) => {
        res.status(200).json({message:`New user added: username:${username} privillige level:${privLevel}`});
    })
  
    
  
  })

export {businessRouter};

