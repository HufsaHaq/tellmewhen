import axios from "axios";
axios.defaults.withCredentials = true;
import { GetServerEndpoint } from "./script-settings";
let endpoint = GetServerEndpoint();

//================== NEW ==================

export async function GetCurrentJobs()
{
    let data = null;
    await axios.get(`${endpoint }/jobs/current/${localStorage["userID"]}`,
        {
            businessID: localStorage["businessID"],
        }
    ).then(async (res) => {
        data = res;
    }).catch(async (err) => {
        if(err.status === 401) await HandleUnauthorised();
        else data = err
    });
    return data;
}

export async function GetJobHistory()
{
    let data = null;

    await axios.get(`${endpoint }/jobs/history`,
        {
            businessID: localStorage["businessID"],
            userID: localStorage["userID"],
        }
    ).then(async (res) => {
        data = res;
    }).catch(async (err) => {
        if(err.status === 401) await HandleUnauthorised();
        else data = err
    });
    return data;
}

export async function CreateJob(description, deadline, userID)
{
    let data = null;

    console.log(userID)
    await axios.post(endpoint + "/jobs/new",
        {
            description: description,
            dueDate: deadline,
            assignedId: userID,
        }
    ).then(async (res) => {
        data = res;
    }).catch(async (err) => {
        console.log(err)
        if(err.status === 401) await HandleUnauthorised();
        else data = err
    });
    return data;
}

export async function EditCurrentJob()
{

}

export async function CompleteJob(jobID, remarks)
{
    let data = null;

    await axios.post(endpoint + "/jobs/complete/" + jobID, 
        {
            userId: localStorage["userID"],
            remarks: remarks,
        }
    ).then(async (res) => {
        data = res;
    }).catch(async (err) => {
        if(err.status === 401) await HandleUnauthorised();
        else data = err
    });
    return data;
}

export async function AssignJob(jobID, userID)
{
    let data = null;

    await axios.post(endpoint + "/jobs/assign_job", 
        {
            jid: jobID,
            uid: userID
        }
    ).then(async (res) => {
        data = res;
    }).catch(async (err) => {
        if(err.status === 401) await HandleUnauthorised();
        else data = err
    });
    return data;
}