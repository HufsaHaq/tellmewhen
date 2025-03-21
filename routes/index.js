/*
  This file contains the routes for the main page of the application.
  Reference for web-push: https://www.npmjs.com/package/web-push
*/

import express from 'express';
import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import { getJobHistory, getOpenJobs, getNotifications, closeDB, freezeUser, addToken, blockToken, addSubscription } from '../dbhelper.js';
import { countOpenJobs, getBusinessPhoto, addUser, login,registerBusinessAndAdmin, getBusinessId, searchEmployees} from '../managementdbfunc.js';
import {authMiddleWare, adminMiddleWare, moderatorMiddleWare} from '../authMiddleWare.js';
import { blackListToken, checkToken } from '../blacklist.js';
import { decryptJobId } from '../qr_generation.js';
import { businessRouter } from './manageBusiness.js';

dotenv.config('../')

// set up the keys for authentication
const accessPrivateKey = fs.readFileSync('jwtRSA256-private.pem','utf-8');
const publicKey = fs.readFileSync('jwtRSA256-public.pem','utf-8');

// set up keys for refresh
const refreshPrivateKey = fs.readFileSync('refresh-private.pem');
const refreshPublicKey = fs.readFileSync('refresh-public.pem');

const accessCookieOptions = {
  httpOnly: false,  // Prevent access via JavaScript
  secure: process.env.NODE_ENV === "production", // Only in HTTPS
  sameSite: "Strict",
  partitioned: true,  // Prevent CSRF
  maxAge:  60 * 60 * 1000 // 1 hour
};

const refreshCookieOptions = {
  httpOnly: false,  // Prevent access via JavaScript
  secure: process.env.NODE_ENV === "production", // Only in HTTPS
  sameSite: "Strict",
  partitioned: true,  // Prevent CSRF
  maxAge: 24 * 60 * 60 * 1000 // 1 day
};

const indexRouter = express.Router();

/**
 * @route POST /login
 * @description Authenticates a user and returns access & refresh tokens.
 * @access Public
 *
 * @requestBody
 * @param {string} req.body.name - The business name the user is associated with.
 * @param {string} req.body.username - The username of the user attempting to log in.
 * @param {string} req.body.password - The user's password.
 *
 * @response
 * @returns {JSON} 200 - Successfully authenticated.
 * - Cookies:
 *   - `access` (HTTP-only, valid for 1 hour) - The access token.
 *   - `refresh` (HTTP-only, valid for 1 day) - The refresh token.
 * - JSON response:
 *   ```json
 *   {
 *     "message": "access token and refresh cookie sent in cookies",
 *     "userId": "<userId>",
 *     "businessId": "<businessId>"
 *   }
 *   ```
 * @returns {JSON} 400 - Bad Request (Missing required fields).
 * @returns {JSON} 401 - Unauthorized:
 *   - `"Passwords do not match"` (Incorrect credentials).
 *   - `"Unable to retrieve credentials from DB"` (User not found).
 * @returns {JSON} 500 - Internal Server Error (Failed to store tokens in DB).
 *
 * @authentication
 * - Uses **RS256 JWT tokens**:
 *   - **Access Token** (1h expiry) includes:
 *     - `username` - The user's username.
 *     - `role` - The user's privilege level.
 *     - `userId` - The user’s unique ID.
 *     - `businessId` - The business ID the user belongs to.
 *   - **Refresh Token** (1d expiry) is signed separately for re-authentication.
 *
 * @notes
 * - Tokens are stored in **HTTP-only cookies** for security.
 * - Passwords are securely hashed and verified using **bcrypt**.
 */

indexRouter.post('/login', async (req, res) => {

    const businessName = req.body.name;
    const username = req.body.username;
    const password = req.body.password;



    if(!(username||password)||!businessName){
        return res.status(400).json({message: "Missing fields from client"});
    }
  
    const businessId = await getBusinessId(businessName);
    // check the database for the user
    console.log(`Business Name: ${businessName}\nBusinessID: ${businessId}`)

    const loginCredentials = await login(businessName,username)
  
    if (loginCredentials){
    
        let isMatch = await bcrypt.compare(password, loginCredentials.Hashed_Password)

        if (isMatch){
            // prepare empolyee information for token
            const userId = loginCredentials.User_ID;
            const role = loginCredentials.Role;
            const businessId = loginCredentials.Business_ID;

            // create new jwt
            const accessToken = jwt.sign({
                username: username,
                role: role,
                userId:userId,
                businessId:businessId 
                },
                    accessPrivateKey,
                {
                    expiresIn: '1h',
                    algorithm: 'RS256' 
            });
            // create new refresh token
            const refreshToken = jwt.sign({ 
                username: username,
                businessId: businessId
                }, 
                refreshPrivateKey, 
                {
                    expiresIn: '1d',
                    algorithm: 'RS256' 
            });

            try{

                await addToken(loginCredentials.User_ID,accessToken);
                await addToken(loginCredentials.User_ID,refreshToken);

            }catch(err){

                console.log(`Error when populating tokens: ${err}`)
                res.status(500).json({ message:'Unable to append tokens to db'})
            }

            return res.status(200).
            cookie('access',accessToken,accessCookieOptions).
            cookie('refresh',refreshToken,refreshCookieOptions).
            json({message:'access token and refresh cookie sent in cookies',
            userId: userId,
            businessId : businessId
            });
        }else{

        return res.status(401).json({error: "Passwords do not match"});

    }

    }else{
        
        return res.status(500).json({error: "Unable to retrieve credentials from DB"});

    }
});

// register a new business and admin
/**
 * @route POST /register
 * 
 * @description Registers a new business with the service if one with its name does not already exist in our DB
 * 
 * @param {string} req.body.name - the name of the new business
 * @param {string} req.body.username - the account username of the default admin 
 * @param {string} req.password - the plaintext password of the default admin
 * 
 * Responses:
 * - 201 (Created) if the new business registers successfully
 * - 400 (Bad Request) if one or more of the request params are missing
 * - 409 (Conflict) if a business with that name already exists in our DB
 * Notes:
 * - As the first user to register the business is the only user, they are admin by default
 */
indexRouter.post('/register', async (req, res) => {
  
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    if(name && username && password){

        const hashedPassword = await bcrypt.hash(password, 10);
        await registerBusinessAndAdmin(name, username, hashedPassword).then((attempt) => {
        if (attempt != null) {
            res.status(201).json({ message: 'Success, Business Registered' });
        } else {
            res.status(409).json({ error: 'Fail' });
        }
    })

    }else{
        res.status(400).json({message: "missing fields"})
    }
});

/**
 * @route POST /refresh
 * 
 * @description Refreshes a user's access token if they have a valid refresh token
 * @access Public
 * 
 * @param {String} req.body.username - the user's account name
 * @param {String} req.body.userId - the user's ID number
 * 
 * 
 * @param {Object} req - Express request object
 * @returns {JSON} 201 - Created new tokens
 * @returns {JSON} 400 - Missing fields in request parameters
 * @returns {JSON} 401 - Unauthorised request
 * @returns {JSON} 403 - Forbidden
 * @returns {JSON} 500 - Internal Server Error
 */
indexRouter.post('/refresh', async(req,res) => {
  

    //extract request data

    const username = req.body.username;
    const id = req.body.userId;
    // const privilegeLevel = req.body.privilegeLevel;

    if(req.cookies?.refresh){

        const token = req.cookies.refresh

        jwt.verify(token, refreshPublicKey,
        async(err,decoded) => {
            console.log(decoded)
            if (err) {
            // Wrong Refesh Token
            return res.status(406).json({ message: 'Error in decoding' });
        }
        else {
            //Check wether the token has been blacklisted
            const validToken = await checkToken(token)

            if(!validToken){

                await freezeUser(id);
                return res.status(400).json({ message:"Invalid token used"});

            }
            // Correct token we send a new access token
            if(decoded.username === username){  
                //look up user in DB 
                const businessId = decoded.businessId;
                try{

                    const user_data = await searchEmployees(username,businessId);
                    console.log(user_data[0].Privilege_level);

                    const accessToken = jwt.sign({ 
                        username:username, 
                        userId: id,
                        role:user_data[0].Role,
                        businessId: businessId
                    },
                        accessPrivateKey,
                    {
                        expiresIn: '1hr',
                        algorithm:'RS256'
                    });

                    const newRefreshToken = jwt.sign({ 
                        username:username,
                        businessId:businessId 
                    }, 
                        refreshPrivateKey, 
                    {
                        expiresIn:'1d',
                        algorithm:'RS256'
                    });

                    // add new token to db
                    await addToken(id, newRefreshToken);
                    // blacklist old  token
                    await blackListToken(token);
                    //return new tokens to client
                    return res.status(201).
                    cookie('access',accessToken,accessCookieOptions).
                    cookie('refresh',newRefreshToken,refreshCookieOptions).
                    json({message:"New tokens generated"});

                }catch(err){

                    return res.status(500).json({ error:'Error whilst looking up DB' });

                }

            }else{

                //logs user out
                freezeUser(id) 
                blackListToken(token)
                
                return res.status(403).json({message: 'The refresh token provided does not match the user'})
            }
        }
        }
        )

    }else{

        return res.status(406).json({ message: "Unauthorised, no refresh token provided. Please sign out and login again"});

  }
})


/**
 * @route POST /save-new-subscription
 * @acces Public
 * 
 * @description Stores a new PUSH-API subscription in the DB, needed to send a notification
 * 
 * @param {Object} req - express request object
 * @param {String} req.body.endpoint - the web-push endpoint
 * @param {JSONWebKeySet} req.body.keys - authentication key pair
 * @param {String} req.body.encryptedJobId - the encrypted Job Id as appears in the user url
 * @param {Int} req.body.businessId - the business ID of the business responsible for the job
 * 
 * @param {Object} res - express response object
 * @return {JSON} 201 - subscription successfully saved
 * @return {JSON} 500 - internal server error
 */
indexRouter.post('/save-new-subscription', async(req,res) => {
  
  
  const endpoint = req.body.endpoint;
  const keys = req.body.keys;
  const encryptedJobId = req.body.jobId;
  const businessId = req.body.businessId;

  //recover the actual job ID
  const jobId = await decryptJobId(encryptedJobId);

  //save subscription to DB
  try{

    await addSubscription(jobId,businessId,endpoint, keys.auth, keys.p256dh)

  }catch(err){

    res.status(500).json({error:err})

  }
  
})
/**
 * @route POST /clearCookies
 * @access Public
 * 
 * @description Clears the http-Only cookies set by the server
 * 
 * @param {Object} res - express response object
 * @return {JSON} 204 - No content, cookies have been cleared
 * @return {JSON} 500 - Internal Server Error
 */
indexRouter.post('/clearCookies', (req,res) =>{
  //clear access and refresh tokens to log user out
  try{
    res.clearCookie('access');
    res.clearCookie('refresh');
  }catch (err){
    return res.status(500).json({ error:'err' });
  }

  return res.sendStatus(204);
})


/**
 * @route /adminTest
 * @access Dev-only/Admin
 * 
 * @description Tests the admin token decoding. Only for use in development
 * 
 * @param {Object} res - express response object
 * @returns {JSON} 200 - returns businessId if user is admin
 * @returns {JSON} 500 - Invalid route 
 */
indexRouter.get('/adminTest',authMiddleWare, adminMiddleWare, (req,res)=>{
  if(process.env.NODE_ENV === 'development'){

    res.json({message:`congrats you are an admin for business with id: ${req.user.businessId}`});

  }else{

    return res.status(500).json({error: 'invalid route'})

  }
})
export { indexRouter }; 
