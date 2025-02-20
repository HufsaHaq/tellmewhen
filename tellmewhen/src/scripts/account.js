import axios from "axios";
import { RefreshAccessToken } from "./session_management";

export function AddWorker(name, password, businessID, privilegeLevel, accessToken)
{
    /* 
    Adds a worker to the business

    Parameters:
        name: The name of the worker
        password: The password for the worker (THIS NEEDS TO BE UNHASHED, THIS IS HANDLED IN THIS FUNCTION!)
        businessID: The ID of the business the worker will be added to
        privilegeLevel: The privilege level of the worker
        accessToken: The access token for the user performing the operation
    Returns:
        bool: Whether the operation was successful

    */
    let base = localStorage["endpoint"];
    let attempt = axios.post(
        base + "/" + businessID + "/addUser",
        {
            headers:
            {
                'Authorization': 'Bearer' + accessToken
            },
            body:{
                name: name,
                password:  "",// NEED TO IMPLEMENT THE PASSWORD HASH
                privLevel: privilegeLevel
            }
        }
    ).then((res) => {
        // if the token is invalid or expired
        if (res.statusCode === 401) {
            console.log(res.message);
            // checks to see if the refresh access token was valid
            if (RefreshAccessToken(accessToken) === true) {
                // Recalls the function with the correct access token
                return AddWorker(name, password, businessID, privilegeLevel, localStorage["accessToken"]);
            }
            else {
                // If the access token passed is completely invalid, then we need to get a valid one
                GetTokens()
                return false;
            }
        }
        // if the API call returned valid data
        else {
            return true;
        }
    })

}

export async function DeleteWorker(workeridTARGET, accessToken) {
    /*
    Deletes a worker

    Returns:
        bool: whether the operation was successful
    */
    let base = localStorage["endpoint"];
    let attempt = await axios.post(
        base + "/delete/user/" + workeridTARGET,
        {
            headers: {
                'Authorization': 'Bearer' + accessToken
            }
        }.then((res) => {
            // if the token is invalid or expired
            if (res.statusCode === 401) {
                console.log(res.message);
                // checks to see if the refresh access token was valid

                newTokens = RefreshAccessToken(accessToken);
                
                if (newTokens !== null) {
                    // Recalls the function with the correct access token
                    return DeleteWorker(workerID, localStorage["accessToken"]);
                }
                else {
                    // If the access token passed is completely invalid, then we need to get a valid one
                    window.location.href = "/auth";
                    return false;
                }
            }
            // if the API call returned valid data
            else {
                return true;
            }
        })
    )
}

export function EditUserLogin(workerID, username, password, accessToken)
{
    /*
    :)

    */
}

export async function DeleteBusiness(businessID, accessToken) {
    /*
    Deletes the business
    Returns:
        bool: whether the action was successful or not
    */
    let base = localStorage["endpoint"];
    let attempt = await axios.post(
        base + "/delete/" + businessID,
        {
            headers: {
                'Authorization': 'Bearer' + accessToken
            }
        }
    ).then((res) => {
        // if the token is invalid or expired
        if (res.statusCode === 401) {
            console.log(res.message);
            // checks to see if the refresh access token was valid
            if (RefreshAccessToken(accessToken) === true) {
                // Recalls the function with the correct access token
                return GetAllCurrentJobs(businessID, localStorage["accessToken"]);
            }
            else {
                // If the access token passed is completely invalid, then we need to get a valid one
                window.location.href = "/auth";
                return null;
            }
        }
        // if the API call returned valid data
        else if (res.statusCode === 200) {
            return res;
        }
    });
}

export function CountOpenJobs(businessID, accessToken)
{

}

export function CountTotalJobs(businessID, accessToken)
{

}

export function SearchEmployees(searchTerm, accessToken)
{

}

export function GetBusinessDetails(businessID, accessToken) {

}

export function RenameBusiness(businessID, newName, accessToken) {

}

export function ChangeBusinessProfilePhoto(businessID, base64img, accessToken) {

}
