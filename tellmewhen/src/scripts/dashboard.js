import axios from "axios";

async function GetAllCurrentJobs(businessID, accessToken) {
    let base = localStorage["endpoint"];
    let attempt = await axios.get(
            base + "/current_jobs/" + businessID, // REQUEST ENDPOINT
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
