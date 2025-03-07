import axios from "axios";
axios.defaults.withCredentials = true;
let endpoint = localStorage["endpoint"];

// PARTIALLY DONE
export async function GetAllJobHistory(businessID, accessToken) {
    /*
    Gets all the current jobs for a business
    Parameters:
        businessID: the businesses ID
        accessToken: the access token from the backend
    Returns:
        string: json object with all the job history
    */
    let base = localStorage["endpoint"];
    let data = null;
    await axios.get(
        base + "/jobs/history/" + businessID, // REQUEST ENDPOINT
        {
            headers: {
                // REQUEST HEADERS
                "Authorization": "Bearer " + accessToken,
            },
        },
    ).then((res) => data = res);
    return data;
}

export async function GetCurrentJobsForEmployee(businessID, employeeID, accessToken)
{
    let data = null;
    let base = localStorage["endpoint"];
    await axios.get(
        base + "/jobs/current/" + businessID + "/" + employeeID,
        {
            headers: {
                "Authorization": "Bearer " + accessToken,
            },
        }
    ).then(res => data = res)
    return data;
}

//DONE
export async function AssignJobToEmployee(businessID, employeeID, accessToken)
{
    let data = null;
    let base = localStorage["endpoint"];
    await axios.post(
        base + "/jobs/assign_job/" + businessID + "/" + employeeID,
        {

            headers: {
                "Authorization": "Bearer " + accessToken,
            },
        }
    ).then(res => data = res)
    return data;
}

export async function Notify(businessID, jobID, accessToken, messageBody = null, messageTitle = null)
{
    let data = null;
    let base = localStorage["endpoint"];
    await axios.post(
        base + "/notify/" + businessID + "/" + jobID,
        {
            title: messageTitle,
            message: messageBody,
            headers: {
                "Authorization": "Bearer " + accessToken,
            },
        }
    ).then(res => data = res)
    return data;
}

//================== NEW ==================

export async function GetCurrentJobs()
{
    let data = null;
    await axios.get(`${endpoint}/jobs/current/${localStorage["userID"]}`,
        {
            businessID: localStorage["businessID"],
        }
    )
    .then(res => data = res)
    return data;
}

export async function GetJobHistory()
{
    let data = null;
    await axios.get(`${endpoint}/jobs/history`,
        {
            businessID: localStorage["businessID"],
            userID: localStorage["userID"],
        }
    )
    .then(res => data = res);
    return data;
}

export async function CreateJob(description, deadline, userID)
{
    let data = null;
    await axious.post(endpoint + "/jobs/new",
        {
            description: description,
            dueData: deadline,
            userID: userID,
            businessID: localStorage["businessID"],
        }
    ).then(res => data = res)
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
    ).then(res => {data = res})
    return data;
}