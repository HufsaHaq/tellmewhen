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
        const expireyAccess = new Date();
        const expireyRefresh = new Date();
        expireyAccess.setTime(expireyAccess.getTime() + (3600));
        expireyRefresh.setTime(expireyRefresh.getTime() + (3600 * 24));
        localStorage["accessToken"] = res.data["accessToken"];
        // Creates the new cookies (change to httponly later on)

        
        document.cookie = `accessToken=${res.data["accessToken"]}; expires = ${expireyAccess.toUTCString()}; path=/; SameSite=strict; HttpOnly=false;`;
        document.cookie = `refreshToken=${res.data["refreshToken"]}; expires = ${expireyRefresh.toUTCString()}; path=/; SameSite=Strict; HttpOnly=false;`;
        localStorage["businessID"] = "";
        localStorage["userID"] = "";
        
        /*
        data.data = {
            accessToken: res.data["accessToken"],
            refreshToken: res.data["refreshToken"] || null,
            businessID: res.data["businessID"] || null,
            userID: res.data["userID"] || null,
        }*/
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