import axios from "axios";
import { GetTokens, RefreshAccessToken } from "./session_management";
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
    let attempt = await axios.get(
        base + "/jobs/history/" + businessID, // REQUEST ENDPOINT
        {
            headers: {
                // REQUEST HEADERS
                "Authorization": "Bearer " + accessToken,
            },
        },
    )
        .then((res) => {
            if(res.statusCode === 200)
            {
                data = res.data
            }
            else{
                data = res;
            }
            
        });
    return data;
}

export async function GetNumberOfOpenJobs(businessID, accessToken)
{
    /*
    Gets the number of open jobs for a business (used on accounts page)
    */
   let base = localStorage["endpoint"]
   let data = null;
   let attempt = await axios.get(
       base + "/jobs/open_jobs/" + businessID, // REQUEST ENDPOINT
       {
            headers:{
                "Authorization": "Bearer " + accessToken
            }
       }
    ).then(res => {
        data = res.data;
    })
    return data;
}
