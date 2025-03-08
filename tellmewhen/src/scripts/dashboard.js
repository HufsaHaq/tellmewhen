import axios from "axios";
axios.defaults.withCredentials = true;

//================== NEW ==================

export async function GetCurrentJobs()
{
    let data = null;
    let endpoint = localStorage["endpoint"];
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
    let endpoint = localStorage["endpoint"];
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
    let endpoint = localStorage["endpoint"];
    console.log(deadline)
    await axios.post(endpoint + "/jobs/new",
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
    let endpoint = localStorage["endpoint"];
    await axios.post(endpoint + "/jobs/complete/" + jobID, 
        {
            userId: localStorage["userID"],
            remarks: remarks,
        }
    ).then(res => {data = res})
    return data;
}