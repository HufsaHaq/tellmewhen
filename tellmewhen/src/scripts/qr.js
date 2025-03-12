import axios from "axios";
axios.defaults.withCredentials = true;
// DONE
export async function GetCode(jobID) {
    /*
    Gets a QR code for the user to add a job
    Parameters:
        jobID: string
    Returns:
        string: Base64 encoded image
    
    */
    let base = localStorage["endpoint"];
    let data = null;
    await axios.post(
        base + "/jobs/display_code",
        {
            jobId: jobID,
        }
    ).then((res) => {
        data = res
    }).catch(err => console.error(err));
    return data;
}
