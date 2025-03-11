import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import webPush from 'web-push'
// db helper functions
import { getJobHistory, getOpenJobs, createNewJob, assignJobToUser, completeJob, getJobDetails } from '../dbhelper.js';
import { countOpenJobs, getBusinessPhoto, addUser, login,registerBusinessAndAdmin, countTotalJobs} from '../managementdbfunc.js';
//middleware functions for encyrption, authentication and data integrity
import {authMiddleWare, adminMiddleWare, moderatorMiddleWare} from '../authMiddleWare.js';
import { generate_qr, decryptJobId } from "../qr_generation.js";


//provide path to .env file
dotenv.config('../')

const jobRouter = express.Router();

/**
 * @route GET /jobs/history
 * @access User
 * 
 * @description Retrieves a business's job history for an authenticated user.
 * 
 * @middleware authMiddleWare - Validates the user's JWT access token.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Decoded JWT payload containing user details.
 * @param {string} req.user.businessId - The ID of the business the user belongs to.
 * @param {string} req.user.userId - The ID of the authenticated user.
 * 
 * @param {Object} res - Express response object.
 * 
 * @returns {JSON} 200 - OK. Returns the job history.
 *   ```json
 *   [
 *     {
 *       "jobId": "<string>",
 *       "title": "<string>",
 *       "status": "<string>",
 *       "completionDate": "<ISO date>",
 *       "remarks": "<String>"
 *     }
 *   ]
 *   ```
 * @returns {JSON} 401 - Unauthorized. If the user is not authenticated.
 * @returns {JSON} 500 - Internal Server Error. If an error occurs while querying the database.
 * 
 * @notes
 * - The user must be **authenticated** to access this endpoint.
 * - The job history is retrieved based on the user's associated `businessId`.
 */

jobRouter.get('/history',authMiddleWare, async (req, res) => {

    const businessId = req.user.businessId;
    const userId = req.user.userId;

    let result;
    try{

      result = await getJobHistory(businessId,userId);

      return res.status(200).json(result);

    }catch(err){

      return res.status(500).json({ error:err});

    }
});

/**
 * @route GET /jobs/open_jobs/:bid
 * @access User
 * 
 * @description Retrieves the count of open jobs for a given business.
 * 
 * @middleware authMiddleWare - Validates the user's JWT access token.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Decoded JWT payload containing user details.
 * @param {string} req.user.businessId - The ID of the business the user belongs to.
 * @param {Object} res - Express response object.
 * 
 * @returns {JSON} 200 - OK. Returns the count of open jobs.
 *   ```json
 *   {
 *     "data": <number>
 *   }
 *   ```
 * @returns {JSON} 401 - Unauthorized. If the user is not authenticated.
 * @returns {JSON} 500 - Internal Server Error. If an error occurs while querying the database.
 * 
 * @notes
 * - The `businessId` is extracted from the authenticated user's JWT.
 * - The count of open jobs is retrieved using the `countOpenJobs` function.
 */
jobRouter.get('/open_jobs/:bid', authMiddleWare, async(req,res) => {
    
    const businessId = req.user.businessId
    let result;
    try{

        result = await countOpenJobs(businessId) 
        return res.status(200).json({ data:result });

    } catch (err) {

        res.status(500).json( { error:err });

    }
})



/**
 * @route GET /jobs/total_jobs/:bid
 * @access User
 * 
 * @description Retrieves the total number of jobs associated with a given business.
 * 
 * @middleware authMiddleWare - Validates the user's JWT access token.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Decoded JWT payload containing user details.
 * @param {string} req.user.businessId - The ID of the business the user belongs to.
 * @param {Object} res - Express response object.
 * 
 * @returns {JSON} 200 - OK. Returns the total number of jobs.
 *   ```json
 *   {
 *     "data": <number>
 *   }
 *   ```
 * @returns {JSON} 401 - Unauthorized. If the user is not authenticated.
 * @returns {JSON} 500 - Internal Server Error. If an error occurs while querying the database.
 * 
 * @notes
 * - The `businessId` is extracted from the authenticated user's JWT.
 * - The total job count is retrieved using the `countTotalJobs` function.
 */
jobRouter.get('/total_jobs/:bid', authMiddleWare, async(req,res) => {

    //extract business id
    const businessId = req.user.businessId;
    let result;
    try{

      result = await countTotalJobs(businessId);
      return res.status(200).json({ data:result});


    }catch (err) {

      return res.status(500).json( {error:err});

    }
});


/**
 * @route GET /jobs/current/:uid
 * @access User
 * 
 * @description Retrieves the currently open jobs assigned to a specific user within a business.
 * 
 * @middleware authMiddleWare - Validates the user's JWT access token.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Decoded JWT payload containing user details.
 * @param {string} req.user.businessId - The ID of the business the user belongs to.
 * @param {string} req.params.uid - The ID of the user whose open jobs are being retrieved.
 * @param {Object} res - Express response object.
 * 
 * @returns {JSON} 200 - OK. Returns a JSON object containing open job details.
 *   ```json
 *   {
 *     "jobId": "<job_id>",
 *     "description": "<job_title>",
 *     "Due_Date": "<ISO time> ",
 *     "user_ID": "<user_id>",
 *   }
 *   ```
 * @returns {JSON} 401 - Unauthorized. If the user is not authenticated.
 * @returns {JSON} 500 - Internal Server Error. If an error occurs while querying the database.
 * 
 * @notes
 * - The `businessId` is extracted from the authenticated user's JWT.
 * - The `userId` is taken from the request parameters.
 * - Open job details are retrieved using the `getOpenJobs` function.
 */
jobRouter.get('/current/:uid',authMiddleWare, async (req, res) => {

    const businessId = req.user.businessId;
    const userId = req.params.uid;
    console.log(userId)
    
    let result;
    try{

        result = await getOpenJobs(businessId,userId); // returns a JSON object

        return res.status(200).json(JSON.parse(result));

    }catch(err){
      
      return res.status(500).json({ error:err });

    }
});



/**
 * @route POST /jobs/assign_job
 * @access Moderator
 * 
 * @description Assigns a job to a specific user within the business.
 * 
 * @middleware authMiddleWare - Ensures the user is authenticated via JWT.
 * @middleware moderatorMiddleWare - Ensures the user has moderator privileges.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request payload containing job assignment details.
 * @param {string} req.body.jid - The encrypted job ID to be assigned.
 * @param {string} req.body.uid - The user ID of the worker receiving the job.
 * @param {Object} res - Express response object.
 * 
 * @returns {JSON} 201 - Created. Job successfully assigned.
 *   ```json
 *   {
 *     "message": "Job <jobId> assigned to worker with id: <userId>"
 *   }
 *   ```
 * @returns {JSON} 401 - Unauthorized. If the user lacks authentication or sufficient privileges.
 * @returns {JSON} 500 - Internal Server Error. If an error occurs during job assignment.
 * 
 * @notes
 * - The `jid` (encrypted job ID) is decrypted before assigning the job.
 * - Only users with **moderator** privileges can assign jobs.
 * - Uses `assignJobToUser` to store the assignment in the database.
 */
jobRouter.post('/assign_job',authMiddleWare, moderatorMiddleWare, async (req,res) => {
    const data = req.body; // get the request data

    const encryptedJobId = data.jid;
    const jobId = encryptedJobId;
    const userId = data.uid;
    try{

        await assignJobToUser(userId,jobId);

        return res.status(201).json({message : `Job ${jobId} assigned to worker with id: ${userId}`});

    }catch (err) {

        return res.status(500).json({error: err});

    }
    

});



/**
 * @route POST /jobs/new
 * @access User
 * 
 * @description Creates a new job in the database and generates a corresponding QR code.
 * 
 * @middleware authMiddleWare - Ensures the user is authenticated via JWT.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request payload containing job details.
 * @param {string} req.body.description - The description of the job.
 * @param {string} req.body.dueDate - The due date for job completion.
 * @param {string} req.body.userId - The ID of the user assigned to the job.
 * @param {Object} res - Express response object.
 * 
 * @returns {JSON} 200 - OK. Job successfully created.
 *   ```json
 *   {
 *     "message": "New job successfully registered",
 *     "qrCode": "<qr_url>",
 *     "jobId": "<job unique identifier>"
 *   }
 *   ```
 * @returns {JSON} 401 - Unauthorized. If the user lacks authentication.
 * @returns {JSON} 500 - Internal Server Error. If an error occurs while creating the job or generating the QR code.
 * 
 * @notes
 * - Uses `createNewJob` to store the job in the database.
 * - A unique job ID is generated and used to create a QR code.
 * - The QR code URL is returned in the response.
 */
jobRouter.post('/new', authMiddleWare, async (req,res) => {

    const jobData = req.body;
    const description = jobData.description;
    const dueDate = jobData.dueDate;
    var userId = req.user.userId;
    const assignedId = jobData.assignedId;
    const businessId = req.user.businessId;
    console.log(req.user)

    //check if the user has the right permissions
    if(assignedId){

        if(req.user.role === 3){

            return res.status(403).json({ message:"This action requires escalated permissions"})

        }
        //replace the userId from the middleware with the assinged userId
        userId = assignedId;

        try{

            const result = await createNewJob(businessId,userId,description,dueDate);
            //extract random job id
            const randomJobId = result.randomJobId;
            //generate qr code
            const qr_url = await generate_qr(randomJobId);

            return res.status(201).json({message: "New job succesfully created", 
                qrCode: qr_url,
                jobId: randomJobId
            });

        } catch (err) {

            return res.status(500).json({error : err})

        }
    }

})

/**
 * @route POST /jobs/complete/:jid
 * @access User
 * 
 * @description Marks a job as complete
 * 
 * @middleware authMiddleWare - Ensures the user is authenticated via JWT.
 * 
 * @param {Object} req - express request object
 * @param {Int} req.params.job_id - the encrypted unique jobId
 * @param {Object} req.body - the request payload
 * @param {String} req.user.userId - the user who has submitted the request, injected by middleware
 * @param {String} req.body.remarks - remarks relating to the job completion
 * 
 * @param {Object} res - express respsonse object
 * @returns {JSON} 201 - Created if the job is marked as complete successfully
 * @returns {JSON} 401 - Unauthorized. If the user lacks authentication.
 * @returns {JSON} 403 - Forbidden. If a worker tries to mark another worker's job as complete
 * @returns {JSON} 500 - Internal Server Error. If an error occurs while updating the DB record
 */
jobRouter.post('/complete/:jid',authMiddleWare, async (req,res) =>{
    const jobId = req.params.jid;
    //extract JSON data from request 
    const data = req.body;
    const userId = req.user.userId;
    const remarks = data.remarks;

    // find worker who the job was assigned to

    if(req.user.role === 3){

      const jobDetails = await getJobDetails(decryptJobId);

      if(jobDetails[0].User_ID != req.user.userId){

        return res.status(403).json({ message: 'A worker cannot complete another workers job'})

      }
    }

    try{

        await completeJob(userId,jobId,remarks)

        return res.status(201).json( { message: 'Job marked as complete'})

    }catch (err) {

        return res.status(500).json( { error : err } )

    }

    
})

//send customer a notification
/**
 * @route POST /notify/:bid/:jid
 * @access User
 * 
 * @description sends a notification to the customer
 * 
 * @param {Object} req - express request object
 * @param {String} req.params.jid - encrypted job ID
 * @param {Int} req.user.businessId - the business ID to which the user belongs
 * @param {String} req.body.title - the notification title 
 * @param {String} req.body.message - the message to be placed in the notification
 * 
 * @param {Object} res - express response object
 * @returns {JSON} 200 - OK if the notification is successfully sent
 * @returns {JSON} 500 - Internal server error
 * 
 */
jobRouter.post('/notify/:jid',authMiddleWare, async (req, res) => {
    // Notify the customer and update the notification table
    const businessId = req.user.businessId;
    const encryptedJobId = req.params.job_id;
    const jobId = decryptJobId(encryptedJobId);

    const messageBody = req.body.message || 'Your job is ready for pickup';
    const messageTitle = req.body.title || 'There is an update to your job';
    const photo = getBusinessPhoto(businessId);

    let pushSubscription;
    try{

       pushSubscription = await getNotifications(businessId, jobId);

    } catch (err) {

      res.status(500).json({ error: err });

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
    try{

      webPush.sendNotification(pushSubscription, payload, options)

      return res.status(200).json({ message:'Notification sent'})

    }catch(err){
      return res.status(500).json({ error:err })
    }
   
})

/**
 * @route GET /jobs/display_code/:jid
 * @access User 
 * 
 * @description Returns the base 64 encoded string representing the qr code for a given job
 * 
 * @middleware authMiddleWare - Ensures the user is authenticated via JWT.
 * 
 * @param {Object} req - express request object
 * @param {String} req.body.jobId - the job unique identifier
 * 
 * @param {Object} res - express response object
 * @returns {JSON} 201 - Created, qr code successfully regened
 * ```json
 * {
 *  "qrCode":"<base64 encoded qr code>"
 * }
 * @returns {JSON} 401 - Unauthorised, the user cannot be authenicated
 * @returns {JSON} 404 - Not found, a job does not exist in the DB
 * @returns {JSON} 500 - Internal server error, the server failed to create the qr code 
 */
jobRouter.get('/display_code', authMiddleWare, async(req,res) =>{

    //extract jobId from the body
    const jobId  = req.body.jobId

    //check DB to see if jobId exists

    try{

        const result = await getJobDetails(jobId)
        if(!result){

            return res.status(404).json({ error:'No such job ID found in db'})

        }
    }catch(err){

        return res.status(500).json({ error:`Error in looking up Job Id in DB: ${err}`})
    }

    try{ 

        const qrResult = await generate_qr(jobId)

        return res.status(201).json({
            qrCode : qrResult
        })

    }catch (err){

        return res.status(500).json({ error:`Error in generating qrCode ${err}`})
    }

})

export {jobRouter};