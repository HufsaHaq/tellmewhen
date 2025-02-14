import axios from "axios";
import { GetTokens, RefreshAccessToken } from "./session_management";

async function GetAllCurrentJobs(businessID, accessToken) {
    /*
    Gets all the current jobs for a business
    Parameters:
        businessID: the businesses ID
        accessToken: the access token from the backend
    Returns:
        string: json object with all the current jobs

    */
    let base = localStorage["endpoint"];
    let attempt = await axios.get(
        base + "/current_jobs/" + businessID,
        {
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        },
    )
        .then((res) => {
            // if the token is invalid or expired
            if (res.statusCode === 401) {
                console.log(res.message);
                // checks to see if the refresh access token was valid
                if (RefreshAccessToken(accessToken) === true) {
                    // Recalls the function with the correct access token
                    return GetAllCurrentJobs(businessID, localStorage["accessToken"]);
                }
                else {
                    // If the access token passed is completely invalid, then we need to get a valid one
                    GetTokens()
                    return null;
                }
            }
            // if the API call returned valid data
            else if (res.statusCode === 200) {
                return res;
            }
        });
}

async function GetActiveJobs(userID, accessToken)
{
    let base = localStorage["endpoint"];
    
}

async function GetAllJobHistory(businessID, accessToken) {
    /*
    Gets all the current jobs for a business
    Parameters:
        businessID: the businesses ID
        accessToken: the access token from the backend
    Returns:
        string: json object with all the job history
    */
    let base = localStorage["endpoint"];
    let attempt = await axios.get(
        base + "/job_history/" + businessID, // REQUEST ENDPOINT
        {
            headers: {
                // REQUEST HEADERS
                Authorization: "Bearer " + accessToken,
            },
        },
    )
        .then((res) => {
            // if the token is invalid or expired
            if (res.statusCode === 401) {
                console.log(res.message);
                // checks to see if the refresh access token was valid
                if (RefreshAccessToken(accessToken) === true) {
                    // Recalls the function with the correct access token
                    return GetAllCurrentJobs(businessID, localStorage["accessToken"]);
                }
                else {
                    // If the access token passed is completely invalid, then we need to get a valid one
                    window.location.href = "/auth";
                    return null;
                }
            }
            // if the API call returned valid data
            else if (res.statusCode === 200) {
                return res;
            }
        });
}
function GetJobHistory(workerID, accessToken) {
    /* 

    :)

    Gets the current job history that is assigned to a specific worker 
    Parameters:
        workerID: employees ID
        accessToken: access token from the backend
    Returns:
        string: json object with job history
    */

    let base = localStorage["endpoint"];
    let attempt = await axios.get(
        base + "/job_history/" + workerID, // REQUEST ENDPOINT
        {
            headers: {
                // REQUEST HEADERS
                Authorization: "Bearer " + accessToken,
            },
        },
    )
}

function AddJob(workerID, description, dueDate, accessToken) {
    /*

    :)

    Adds a new job for a given user
    Parameters:
        workerID: employees ID
        jobID: job ID
        description: job description
        url: job URL
        dueDate: job due date
        accessToken: access token from the backend
    Returns:
        bool: whether the action was successful
    */
}

function AssignJobToWorker(workerID, accessToken) {
    /*

    :)

    Assigns a job to a worker 
    Parameters:
        workerID: employees ID
        jobID: job ID
        accessToken: access token from the backend
    Returns:
        bool: whether the action was successful
    */
}

function CompleteJob(workerID, jobID, remarks, accessToken)
{
    /*

    :>

    Completes a job
    Parameters:
        workerID: employees ID
        jobID: job ID
        remarks: job completion remarks
        accessToken: access token from the backend
    Returns:
        bool: whether the action was successful
    */
}
