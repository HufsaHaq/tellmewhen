import express from "express";
import { deleteBusiness,deleteUser } from "../managementdbfunc.js";
import {authMiddleWare, adminMiddleWare, moderatorMiddleWare} from '../authMiddleWare.js';

const deletionRouter = express.Router()

//delete a business' whole account 
deletionRouter.post("/:bid",authMiddleWare,adminMiddleWare, async(req,res) =>{
    /** POST /delete/:bid
    * This endpoint is used to delete a business from the database and service. There must
    * be sufficient validation done on the front end to make sure a business doesn't delete 
    * its account by accident
    * Middleware:
    * - `authMiddleWare`: Verifies the JWT and attaches the decoded token to req.user
    * - `adminMiddleWare`: Verfies the user has admin priviliges
    * 
    * Request Parameters
    * @param {string} req.params.bid - The business ID of the business being deleted
    * 
    * Request Context (Injected by middleware)
    * @param {Int} req.user.businessId - The business ID to which the user belongs
    * 
    * Responses
    * - 204 (No content) if the deletion processes successfully
    * - 401 (Unauthorised) if the user does not have an admin account
    *   - If credentials do not match (`"Passwords do not match"`).
    *   - If user credentials cannot be retrieved from the database (`"Unable to retrieve credentials from DB"`).
    * - 500 (Internal server error) if the db helper function fails
    */
    const businessId = parseInt(req.params.bid)
    
    if(!(businessId === req.user.Business_ID)){

        return res.status(403).json({ error:'Unable to delete another business'});

    }
    try{

        await deleteBusiness(businessId);
        
    }catch(err){

        return res.status(500).json({ error:err });

    }

})
// Delete a worker from a business
/**
     * @route POST /user/:uid
     * @access Admin
     * 
     * @description Deletes a user from the business database and revokes their access & refresh token
     *
     * @middleware authMiddleWare: Verifies the JWT and attaches the decoded token to req.user
     * @middleware adminMiddleWare: Verfies the user has admin priviliges
     * 
     * Request Parameters:
     * @param {string} req.params.uid - The user ID of the worker being deleted.
     * @param {string} req.body.businessId - The business ID to which the user belongs.
     * 
     * Request Context:
     * @param {Int} req.user.User_ID - the ID number of the user making the deletion.
     * 
     * Responses
     * - 204 (No Content) if deletion is successful.
     * - 409 (Conflict) if a user tries to delete themselves.
     * - 401 (Unauthorized) if a non-admin account tries to delete a user.
     */
deletionRouter.post('/user/:uid',authMiddleWare, adminMiddleWare, async(req,res) =>{
    
    const userId = req.params.uid;

    const currentId = req.user.User_ID;
    try{

        await deleteUser(userId,currentId);

   }catch(err){

        return res.status(409).json({error:err});

   }

   return res.sendStatus(204);
})

export { deletionRouter }