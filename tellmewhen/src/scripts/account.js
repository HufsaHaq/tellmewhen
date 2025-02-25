import axios from "axios";

export async function GetNumberOfOpenJobs(businessID, accessToken) {
    /*
    Gets the number of open jobs for a business (used on accounts page)
    */


    let base = localStorage["endpoint"]
    let data = null;
    await axios.get(
        base + "/jobs/open_jobs/" + businessID, // REQUEST ENDPOINT
        {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        }
    ).then(res => { data = res; })
    return data;
}

export async function GetNumberOfTotalJobs(businessID, accessToken) {
    /*
    Gets the number of open jobs for a business (used on accounts page)
    */
    let base = localStorage["endpoint"]
    let data = null;
    await axios.get(
        base + "/jobs/total_jobs/" + businessID, // REQUEST ENDPOINT
        {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        }).then(res => { data = res; })
    return data;
}

export async function DeleteBusiness(businessID, accessToken)
{
    //THIS NEEDS UPDATING ON BACKEND
    let data = null;
    let base = localStorage["endpoint"];
    await axios.post(
        base + "/delete/" + businessID,
        {
            headers: {
                'Authorization': 'Bearer '+ accessToken
            }
        }
    ).then((res) => { data = res })
    return data;
}

export async function DeleteUser(businessID, userid, accessToken)
{

    // THIS NEEDS UPDATING ON BACKEND
    let data = null;
    let base = localStorage["endpoint"];
    await axios.post(
        base + "/delete/user/" + businessID,
        {
            headers: {
                'Authorization': 'Bearer '+ accessToken
            }
        }
    ).then((res) => { data = res })
    return data;
}

export async function GetProfileData(businessID, accessToken)
{
    let base = localStorage["endpoint"];
    let data = null;
    await axios.get(
        base + "/business/info/" + businessID,
        {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }
    ).then((res) => { data = res; })
    return data;
}

export async function ChangeEmployeePassword(employeeID, username, password, accessToken)
{
    return;
    let base = localStorage["endpoint"];
    let data = null;
    await axios.post(
        base + "/business/change_password",
        {
            headers: {
                'Authorization': 'Bearer'+ localStorage["accessToken"]
            }
        }
    ).then((res) => {
        data = res
    })
    
}

export async function ChangeBusinessName(name, businessID, accessToken)
{
    let base = localStorage["endpoint"];
    let data = null;
    await axios.post(
        base + "/business/change_name",
        {
            name: name,
            bid: businessID,
            headers: {
                'Authorization': 'Bearer'+ accessToken
            }
        }
    ).then((res) => {
        data = res
    })
    return data;
}

export async function ChangeProfilePhoto(photo, businessID, accessToken)
{
    let base = localStorage["endpoint"];
    let data = null;
    await axios.post(
        base + "/business/change_photo",
        {
            newPhoto: photo,
            bid: businessID,
            headers: {
                'Authorization': 'Bearer'+ accessToken
            }
        }
    ).then((res) => {
        data = res
    })
    return data;
}

export async function SearchEmployee(){}

export async function AddEmployee(name, email, password, privilege, businessID, accessToken)
{
    let base = localStorage["endpoint"];
    let data = null;
    await axios.post(
        base + "/business/addUser" + businessID,
        {
            name: name,
            email: email,
            password: password,
            privLevel: privilege,
            headers: {
                'Authorization': 'Bearer'+ accessToken
            }
        }
    ).then((res) => { data = res })
    return data;
}