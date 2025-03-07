import axios from "axios";
axios.defaults.withCredentials = true;
let endpoint = localStorage["endpoint"];

export async function GetJobDetails(jobID)
{
    let data = null;
    await axios.get(endpoint + "/customer/my_job/" + jobID)
    .then(res => data = res)
    return data;
    
}

export async function GetNotifications() {}

