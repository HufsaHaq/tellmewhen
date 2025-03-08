import axios from "axios";
axios.defaults.withCredentials = true;

export async function GetJobDetails(jobID)
{
    let data = null;
    let endpoint = localStorage["endpoint"];
    await axios.get(endpoint + "/customer/my_job/" + jobID)
    .then(res => data = res)
    return data;
    
}

export async function GetNotifications() {}

