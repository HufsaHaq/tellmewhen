import axios from "axios";
import {GetTokens, RefreshAccessToken} from "./session_management";

//THIS ONE DONE, USE AS TEMPLATE!!!!!
async function GetAllCurrentJobs(businessID, accessToken) {
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
                if(RefreshAccessToken(accessToken) === true){
                    // Recalls the function with the correct access token
                    return GetAllCurrentJobs(businessID, localStorage["accessToken"]);
                }
                else{
                    // If the access token passed is completely invalid, then we need to get a valid one
                    GetTokens()
                    return null;
                }
            }
            // if the API call returned valid data
            else if(res.statusCode === 200){
                return res;
            }
        });
}

async function GetActiveJobs(userID, accessToken) {
    throw new Error("NOT IMPLEMENTED");
    let base = localStorage["endpoint"];
    let attempt = await axios.get(base + "");
}

async function GetAllJobHistory(businessID, accessToken) {
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
            if (res.statusCode === 401) {
                // if the token is invalid or expired
                console.log(res.message);
                RefreshAccessToken(accessToken);
                return null;
            }
            else {
                return res;
            }
        });
}
function GetJobHistory(userID, accessToken) {}

function AddJob(userID, jobID, description, url, dueDate, accessToken) {}

function AssignJobToWorker(userID, jobID, accessToken) {}

function CompleteJob(userID, jobID, remarks, accessToken) {}
