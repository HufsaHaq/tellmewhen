import axios from "axios";

function AddWorker(username, password, businessID, privilegeLevel, accessToken)
{
    let base = localStorage["endpoint"];

}

function DeleteWorker(workeridTARGET, workeridSENDER)
{

}

function EditUserLogin(workerID, username, password, accessToken)
{

}

async function DeleteBusiness(businessID, accessToken)
{
    let base = localStorage["endpoint"];
    let attempt = await axios.post(
        base + "/" + businessID,
        {
            headers: {
                'Authorization': 'Bearer'+ accessToken
            }
        }
    ).then(
            res => {
                return res
            });
}

function CountOpenJobs(businessID, accessToken)
{

}

function CountTotalJobs(businessID, accessToken)
{

}

function SearchEmployees(searchTerm, accessToken)
{

}


function ChangePrivilege(workerID, newLevel, accessToken)
{

}

function GetBusinessDetails(businessID, accessToken)
{

}

function RenameBusiness(businessID, newName, accessToken)
{

}

function ChangeBusinessProfilePhoto(businessID, base64img, accessToken)
{

}