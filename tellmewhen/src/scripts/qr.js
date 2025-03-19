import axios from "axios";
axios.defaults.withCredentials = true;
import { GetServerEndpoint } from "./script-settings";
let endpoint = GetServerEndpoint();
// DONE
export async function GetCode(jobID) {
    /*
    Gets a QR code for the user to add a job
    Parameters:
        jobID: string
    Returns:
        string: Base64 encoded image
    
    */

    let data = null;
    await axios.get(
        endpoint  + "/jobs/display_code/"+jobID,
    ).then((res) => {
        data = res
    }).catch(err => console.error(err));
    return data;
}
