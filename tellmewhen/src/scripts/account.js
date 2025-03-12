import axios from "axios";
import { HandleUnauthorised } from "./login";
axios.defaults.withCredentials = true;

//================== NEW ==================
export async function GetAccountDetails()
{
    // This will return the Business Photo and name
    let data = null;
    let endpoint = localStorage["endpoint"];
    await axios.get(
        endpoint + "/business/info",
        {
            businessId: localStorage["businessID"]
        }
    ).then(async (res) => {
        data = res;
    }).catch(async (err) => {
        if(err.status === 401) await HandleUnauthorised();
        else data = err
    });
    return data;
}

export async function GetCurrentJobCount()
{
    // This will get the number of currently active job the whole business has
    let data = null;
    let endpoint = localStorage["endpoint"];
    await axios.get(endpoint + "/jobs/open_jobs/" + localStorage["businessID"] ,
    ).then(async (res) => {
        data = res;
    }).catch(async (err) => {
        if(err.status === 401) await HandleUnauthorised();
        else data = err
    });
    return data;
}

export async function GetTotalJobCount(){
    // This will get the total number of jobs ever posted by the whole business
    let data = null;
    let endpoint = localStorage["endpoint"];
    await axios.get(endpoint + "/jobs/total_jobs/" + localStorage["businessID"]
    ).then(async (res) => {
        data = res;
    }).catch(async (err) => {
        if(err.status === 401) await HandleUnauthorised();
        else data = err
    });
    return data;
}

export async function RenameAccount(name)
{
    // This will rename the business (not the employees username)
    let data = null;
    let endpoint = localStorage["endpoint"];
    await axios.post(endpoint + "/business/change_name",
        {
            name: name,
        }
    ).then(async (res) => {
        data = res;
    }).catch(async (err) => {
        if(err.status === 401) await HandleUnauthorised();
        else data = err
    });
    return data;
}

export async function ChangeBusinessPhoto(photob64)
{
    // This will change the businesses photo to a base 64 encoded image
    let data = null;
    let endpoint = localStorage["endpoint"];
    await axios.post(endpoint + "/business/change_photo",
        {
            newPhoto: photob64,
            //businessID: localStorage["businessID"]
        }
    ).then(async (res) => {
        data = res;
    }).catch(async (err) => {
        if(err.status === 401) await HandleUnauthorised();
        else data = err
    });
    return data;
}

export async function DeleteBusiness()
{
    // Deletes the whole business
    let endpoint = localStorage["endpoint"];
    await axios.post(endpoint + "/delete/" + localStorage["businessID"], {timeout: 5000}).then((res) => { data = res })
}

export async function CreateEmployee(username, password, privilege)
{
    // This will create a new employee
    let data = null;
    let endpoint = localStorage["endpoint"];

    await axios.post(
        endpoint + "/business/addUser",
        {
            username: username,
            password: password,
            privLevel: privilege,
        }
    ).then(async (res) => {
        data = res;
    });
    return data;
}

export async function EditEmployee()
{
    // Modifies an existing employee
}

export async function DeleteEmployee(userID)
{
    // Deletes an employee
    let data = null;
    let endpoint = localStorage["endpoint"];
    await axios.post(endpoint + "/delete/user/" + userID,
        {
            businessID: localStorage["businessID"],
        }
    ).then(async (res) => {
        data = res;
    });
    return data;
}

export async function SearchEmployee(userID, limit)
{
    // Searches for the employee in the database, (no UID will return all)
    let data = null;
    let endpoint = localStorage["endpoint"];
    await axious.get(endpoint + "/business/search_employees",
        {
            userID: userID,
            limit: limit,
            businessID: localStorage["businessID"]
        }
    ).then(async (res) => {
        data = res;
    });
    return data;
}

export async function GetEmployees()
{
    let data = null;
    let endpoint = localStorage["endpoint"];
    await axios.get(endpoint + "/business/search_employees",)
    .then(res => { data = res; })
    return data;
}

export async function GetPrivilegeLevel(userId)
{
    let employees = await GetEmployees()
    
    employees = employees.data;
    for(let i = 0; i < employees.length; i++)
    {
        if(employees[i].User_ID == userId)
        {
            return employees[i].Role;
        } 
    }
    return 0;
}

export async function ChangePassword(username, password, userId)
{
    let data = null;
    let endpoint = localStorage["endpoint"];
    await axios.post(endpoint + "/business/change_password",
        {
            username: username,
            newPassword: password,
            userId: userId,
        }
    ).then(async (res) => {
        data = res;
    });
    return data;
}