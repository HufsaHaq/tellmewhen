import express from 'express';
import dotenv from 'dotenv';
import bycrpt from 'bcrypt';
// db helper functions
import { countOpenJobs, editUserLogin, addUser,renameBusiness,changeBusinessPhoto, getBusinessDetails, searchEmployees} from '../managementdbfunc.js';
//middleware functions for encyrption, authentication and data integrity
import {authMiddleWare, adminMiddleWare, moderatorMiddleWare} from '../authMiddleWare.js';

//provide path to .env file
dotenv.config('../')

const businessRouter = express.Router();
/** 
* @route /business/info
* @method GET
* @access User
* 
* @description Gets adminstrative info about the business for account page

* @middleware authMiddleWare: Verifies JWT access token decoded user info put in req.user 
* 
* Request Context
* @property {string} req.user.businessId - the ID of the business
* 
* @param {Object} req - Express request object.
* @param {Object} res - Express response object.
* @returns {JSON} 200 - Success response.
* @returns {JSON} 401 - Unauthorized if authentication fails.
* @returns {JSON} 500 - Internal Server Error, DB error .
* 
*/ 
businessRouter.get('/info', authMiddleWare, async (req,res) =>{
    const buisnessId = req.user.buisnessId;

    let data;
    try{
        data = await getBusinessDetails(buisnessId);
    } catch (err) {
        res.status(500).json( {error:err});
    }

    if(!(data === null)){
        res.status(200).json(data);
    }else{
        res.status(500).json({message:'Unable to retrieve the data'});
    }
})


/** 
* @route /business/change_password
* @method POST
* @description  Changes the password for an employee
* 
*@middleware authMiddleWare - Verifies the JWT and attaches the decoded token to req.user
*@middleware adminMiddleWare - Verfies the user has admin priviliges
*
* @param {Object} req - express request object
* @param {string} req.body.newPassword - the worker's new password
* @param {string} req.body.username - the username of the worker whose password is being changed
* 
* @param {Object} res - express response object
* @returns {JSON} 201 - Created, password changed
* @returns {JSON} 401  - Unauthorised, user lacks privilige
* @returns {JSON} 500 - Internal Server Error
*/
businessRouter.post('/change_password', authMiddleWare, adminMiddleWare, async (req,res) => {

    
    const username = req.body.username;
    const newPassword = req.body.newPassword;
    const workerId = req.body.userId;


    const hashedPwd = bycrpt(newPassword,10);

    try{
        await editUserLogin(workerId,username,hashedPwd);
    } catch (err) {
        res.json( { error: err });
    }

    res.status(200).json( { message : 'Password changed'});
})

/** 
 * @route /business/change_name
 * @method POST
 * @access Admin
 * 
 * @description  Renames the business by updating the record in the DB
 *  Middleware:
 * 
 * @middleware authMiddleWare: Verifies the JWT and attaches the decoded token to req.user
 * @middleware adminMiddleWare:  Verfies the user has admin priviliges
 * 
 * @param {Object} req - express request object
 * @param {String} req.body.name - the new name for the business
 * @param {Int} req.user.businessId - the Id of the business undergoing the name change
 * 
 * @param {Object} res - express response object
 * @returns {JSON} 201 - Created, the business name is changed
 * @returns {JSON} 401 - Unauthorised if the user does not have the right permission
 * @returns {JSON} 500 - Internal server error, error in changing the db record
 */
businessRouter.post('/change_name', authMiddleWare,adminMiddleWare, async (req,res) =>{

    const newName = req.body.name;
    const businessId = req.user.buisnessId;

    try{
        await renameBusiness(businessId,newName);
    }catch (err) {
        res.status(500).json( { error: err } );
    }

    res.status(201).json( {message: `Business renamed to ${newName}`})
})

// changes business photo
/** POST /business/change_photo
 * @route /business/change_photo
 * @method POST
 * @access Admin
 * 
 * @description changes a business profile picture
 * 
 * @middleware authMiddleWare: Verifies the JWT and attaches the decoded token to req.user
 * @middleware adminMiddleWare: Verfies the user has admin priviliges
 * 
 * @param {Object} req - express request object
 * @param {Base64URLString} req.body.newPhoto - a base64 encoded image of the new photo
 * 
 * 
 * @returns {JSON} 201 - Created if the photo is successfully updated
 * @returns {JSON} 401 - Unauthorised if user cannot be authenticated through JWT
 * @returns {JSON} 500 - Internal Server Error if a DB error occurrs
 */
businessRouter.post('/change_photo', authMiddleWare,adminMiddleWare, async (req,res) =>{
    
    const businessId  = req.body.businessId
    //extract photo from request JSON
    const newPhoto = req.body.newPhoto;

    try{
        await changeBusinessPhoto(newPhoto);
    } catch (err) {
        res.status(500).json( { error: err } );
    }

    return res.status(200).json({ message:'Photo succesfully changed'});
})
// return info about worker with uid
businessRouter.get('/search_employees', authMiddleWare, async (req,res) =>{
    /** GET /business/search_employees
     * 
     * Returns information stored in the database about an employee(s). If an employee ID
     * is not specified then it will return information about all employees
     * 
     * Middleware:
     * - `authMiddleWare`: Verifies the JWT and attaches the decoded token to req.user
     * 
     * Request Parameters
     * @param {Int} req.body.userId - the user Id of the employee being searched for
     * @param {Int} req.body.limit - the maximum number of records to return
     * 
     * Request Context (Injected by middleware)
     * @param {Int} req.user.businessId - the ID number of the business to which the user belongs
     * 
     * @returns
     * - 200 (OK) if the employee(s) look up processes successfully
     * - 401 (Unauthorised) if a valid access token is missing
     *      - If credentials do not match (`"Passwords do not match"`).
     *      - If user credentials cannot be retrieved from the database (`"Unable to retrieve credentials from DB"`).
     * - 500 (Internal server error) if an error occurs in the DB lookup
     */

    
    const userId = req.body.userId | null;
    const searchLimit = req.body.limit |null;
    const businessId = req.user.businessId;

    let data;
    try{

        data = await searchEmployees(userId,businessId,searchLimit);

    }catch(err){

        return res.status(500).json({error:err });

    }

    return res.status(200).json(data);
})

// return number of open jobs
businessRouter.get('/total_jobs/', authMiddleWare, async (req,res) => {
    /** GET /business/total_jobs
     * 
     * Returns the total number of jobs a business has created with the service.
     * This includes active and completed jobs
     * 
     * Middleware:
     * - `authMiddleWare`: Verifies the JWT and attaches the decoded token to req.user
     * 
     * Request Context (Injected by middleware)
     * @param req.user.buisnessId - The ID number of the business to which the user belongs
     * 
     * @returns
     * - 200 (OK) if the number of jobs can be counted from the DB records
     *  - JSON
     *      ```json
     *      {  
     *          "data":"<numberOfOpenJobs>"
     *      }
     *      ```
     * - 401 (Unauthorised) if there is no valid access token provided
     * - 500 (Internal Server Error) if the DB look-up fails
     * 
    */

    // extract businessId from access token
    const businessId = req.user.businessId;

    let data;
    try{
        
        data = await countOpenJobs(businessId)

    }catch(err){

        return res.status(500).json({ error:err })
    }

    return res.status(200).json( {data:data} )
})

// adds new user to business
businessRouter.post('/addUser/',authMiddleWare,adminMiddleWare, async(req,res) =>{
    /** POST /business/addUser
    * This endpoint handles the process of adding a new user to the businesses'
    * account. 
    * 
    *  Middleware:
    * - `authMiddleWare`: Verifies the JWT and attaches the decoded token to req.user
    * - `adminMiddleWare`: Verfies the user has admin priviliges
    * 
    * Request Paramters:
    * @param {string} req.body.username - The username of the worker being added
    * @param {string} req.body.password - The plaint text password of the worker being added
    * @param {Int} req.body.privLevel - The assigned privilliged level of the new worker
    * 
    * Request Context (Injected by middleware):
    * @param {Int} req.user.businessId - The ID number of the business which the user belongs to
    * 
    * @returns
    * - 201 (Created) if the new worker account has been created successfully
    * - 401 (Unauthorised) if a non admin account tries to add a new worker
    * - 500 (Internal Server Error) if the new worker account fails to be added to the db
    
    */
    const businessId = req.user.Business_ID;
  
    const username = req.body.username;
    const pwd = req.body.password;
    const privLevel = req.body.privLevel;

    // hash new password
    const hashedPassword = bycrpt.hash(pwd,10);

    try{

        await addUser(username, email, hashedPassword, businessId, privLevel);

    }catch(err){

        return res.status(500).json({ error:err });

    }   

    return res.status(201).json({ message:'New user successfully added!' });

  })



export {businessRouter};

