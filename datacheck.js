/* This file handles the checking that the data displayed on the front-end is up to date and remedying any 
out-of-date data */
import { get } from "jase"
import { getOpenJobs } from "./dbhelper.js"

export const checkData = async(res,req,next) =>{
    /*
    Checks whether the data currently being displayed on the front-end is up to date with any changes made
    */
    data = req.body;
    businessId = data.businessId;
    field = data.field;

    currentData = data.current;

    let db_data;
    switch(field){
        case('currentJobs'):
            db_data = await getOpenJobs(businessId)
        case('history'):
            db_data = await getHistoryJobs(businessId)
        default:
            db_data = null
    }

    if(db_data === currentData){
        res.status(200).json({message : "Data is up to date"})
    }else{
        res.json(db_data)
    }
    next()
}