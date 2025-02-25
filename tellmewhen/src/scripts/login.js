import axios from "axios";

export async function Login(email, username, password)
{
    let data = null;
    let base = localStorage["endpoint"];
    await axios.post(base + "/login",
        {
            name: username,
            username: email,
            password: password
        }
    ).then(res => {
        data = res;
        localStorage["accessToken"] = res.data["accessToken"];
    })
    return data;
}

export async function Register(email, username, password)
{
    let data = null;
    let base = localStorage["endpoint"];
    await axios.post(base + "/register",
        {
            name: username,
            username: email,
            password: password
        }
    ).then(res => {
        data = res
    })
    return data;

}