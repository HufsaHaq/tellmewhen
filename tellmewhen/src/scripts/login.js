import axios from "axios";

export async function Login(email, username, password)
{
    let data = null;
    let base = localStorage["endpoint"];
    await axios.post(base + "/login",
        {
            name: email,
            username: username,
            password: password
        }
    ).then(res => {
        data = res
        localStorage["token"] = res.data["accessToken"];
    })
    return data;
}

export async function Register(email, username, password)
{
    let data = null;
    let base = localStorage["endpoint"];
    await axios.post(base + "/register",
        {
            name: email,
            username: username,
            password: password
        }
    ).then(res => {
        data = res
    })
    return data;

}