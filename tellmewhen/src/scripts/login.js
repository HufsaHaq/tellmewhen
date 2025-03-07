import axios from "axios";
axios.defaults.withCredentials = true;
let endpoint = localStorage["endpoint"];

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
    ).then(res => {
        data = res
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
            id: localStorage["userID"]
        }
    ).then(res => data = res)
    return data;
}