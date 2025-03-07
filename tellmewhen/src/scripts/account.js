import axios from "axios";
axios.defaults.withCredentials = true;
let endpoint = localStorage["endpoint"];

// DONE
export async function GetNumberOfOpenJobs(businessID, accessToken) {
    /*
    Gets the number of open jobs for a business (used on accounts page)
    */

    
    let base = localStorage["endpoint"]
    // let data = null;
    /*
    await axios.get(
        base + "/jobs/open_jobs/" + businessID, // REQUEST ENDPOINT
        {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        }
    ).then(res => { data = res; })  */

    let data = {
        status: 200,
        message: 'successfull'
    };

    return data;
}

// DONE
export async function GetNumberOfTotalJobs(businessID, accessToken) {
    /*
    Gets the number of open jobs for a business (used on accounts page)
    */
    let base = localStorage["endpoint"]
    /*
    let data = null;
    
    await axios.get(
        base + "/jobs/total_jobs/" + businessID, // REQUEST ENDPOINT
        {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        }).then(res => { data = res; }) */

    // Just for testing, to be deleted
    let data = {
        status: 200,
        message: 'successfull'
    };

    return data;
}

export async function oldDeleteBusiness(businessID, accessToken)
{
    //THIS NEEDS UPDATING ON BACKEND
    //let data = null;
    let base = localStorage["endpoint"];
    /*
    await axios.post(
        base + "/delete/" + businessID,
        {
            headers: {
                'Authorization': 'Bearer '+ accessToken
            }
        }
    ).then((res) => { data = res })*/
    let data = {
        status: 200,
        message: 'successfull'
    };
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

// PARTIALLY DONE
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

// DONE
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

//DONE
export async function oldChangeProfilePhoto(photo, businessID, accessToken)
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

export async function oldSearchEmployee(){}

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


//================== NEW ==================
export async function GetAccountDetails()
{
    // This will return the Business Photo and name
    let data = null;
    await axios.get(
        endpoint + "/business/info/" + businessID
    ).then((res) => { data = res; })
    return data;
}

export async function GetCurrentJobCount()
{
    // This will get the number of currently active job the whole business has
    let data = null;
    await axios.get(endpoint + "/jobs/open_jobs",
        {
            businessID: localStorage["businessID"]
        }
    ).then((res) => { data = res; })
    return data;
}

export async function GetTotalJobCount(){
    // This will get the total number of jobs ever posted by the whole business
    let data = null;
    await axios.get(endpoint + "/jobs/total_jobs",
        {
            businessID: businessID
        }
    ).then(res => { data = res; })
    return data;
}

export async function RenameAccount(name)
{
    // This will rename the business (not the employees username)
    let data = null;
    await axios.post(endpoint + "/business/change_name",
        {
            newName: name,
            businessID: localStorage["businessID"]
        }
    ).then((res) => { data = res; })
    return data;
}

export async function ChangeProfilePhoto(photob64)
{
    // This will change the businesses photo to a base 64 encoded image
    let data = null;
    await axios.post(endpoint + "/business/change_photo",
        {
            newPhoto: photob64,
            businessID: localStorage["businessID"]
        }
    ).then(res => {data = res;})
    return res;
}

export async function ChangeAdminPassword()
{
    // Changes the account password for the username "admin"

}

export async function DeleteBusiness()
{
    // Deletes the whole business
    await axios.post(endpoint + "/delete/" + localStorage["businessID"]).then((res) => { data = res })
}

export async function CreateEmployee(username, password, privilege)
{
    // This will create a new employee
    let data = null;
    await axios.post(
        endpoint + "/business/addUser",
        {
            username: username,
            pwd: password,
            privLevel: privilege,
        }
    ).then((res) => { data = res })
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
    await axios.post(endpoint + "/delete/user/" + userID,
        {
            businessID: localStorage["businessID"],
        }
    ).then((res) => data = res)
    return data;
}

export async function SearchEmployee(userID, limit)
{
    // Searches for the employee in the database, (no UID will return all)
    let data = null;
    await axious.get(endpoint + "/business/search_employees",
        {
            userID: userID,
            limit: limit,
            businessID: localStorage["businessID"]
        }
    ).then(res => { data = res; })
    return data;

}
