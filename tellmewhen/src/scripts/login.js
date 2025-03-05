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
    await axios.post(base + "/clear-cookies");
}