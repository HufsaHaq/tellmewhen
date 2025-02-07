import express from "express";
import { deleteBusiness,deleteUser } from "../managementdbfunc.js";
import {authMiddleWare} from '../authMiddleWare.js';

const deletionRouter = express.Router()

deletionRouter.post("/:bid",authMiddleWare,(req,res) =>{
    const access_token = req.access_token;

    //do validaion
    res.json('')
    const businessId = req.params.bid

    deleteBusiness(businessId)

})

deletionRouter.post('/user/:uid',(req,res) =>{
    const access_token = req.access_token;
    //do validation
    const userId = req.params.uid
    deleteUser()
})

export { deletionRouter }