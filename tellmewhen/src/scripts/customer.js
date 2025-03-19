import axios from "axios";
import { GetServerEndpoint } from "./script-settings";
let endpoint = GetServerEndpoint();
axios.defaults.withCredentials = true;


export async function GetJobDetails(jobID)
{
    let data = null;
    await axios.get(endpoint + "/customer/my_job/" + jobID)
    .then(res =>
        {
            console.log(res)
            data = res
    })
    return data;
    
}

export async function GetNotifications() {}

