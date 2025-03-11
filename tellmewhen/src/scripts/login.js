import axios from "axios";
axios.defaults.withCredentials = true;

export async function Login(name, businessName, password)
{
    let data = null;
    let base = localStorage["endpoint"];
    await ClearCookies()
    await axios.post(base + "/login",
        {
            name: businessName,
            username: name,
            password: password
        }
    ).then(res => {
        localStorage["businessID"] = res.data["businessId"]
        localStorage["userID"] = res.data["userId"]
        localStorage["username"] = name;
        data = res;
        localStorage["loggedIn"] = true;
    })
    return data;
}

export async function Register(username, password)
// Creates a new business with the default username "admin"
{
    let data = null;
    let base = localStorage["endpoint"];
    await axios.post(base + "/register",
        {
            name: username,
            username: "admin",
            password: password
        }
    ).then(async res => {
        data = res;
    })
    return data;

}
export async function ClearCookies()
// Creates a new business with the default username "admin"
{
    let data = null;
    let base = localStorage["endpoint"];
    await axios.post(base + "/clearCookies").then(res => data = res);
    return data;
}

export async function RefreshToken() 
{
    // Refreshes an expired access token
    let data = null;
    let base = localStorage["endpoint"]
    await axios.post(base + "/refresh",
        {
            username: localStorage["username"],
            userId: localStorage["userID"],
            businessId: localStorage["businessID"]
        }
    ).then(res => {data = res; console.log(data)})
    return data;
}

export async function HandleUnauthorised()
{
    // func will be the original function
    let tryRefresh = await RefreshToken();
    if(tryRefresh.status === 201)
    {
        window.location.reload();
    }
    else
    {
        window.location.href = "/auth";
        return;
    }
}