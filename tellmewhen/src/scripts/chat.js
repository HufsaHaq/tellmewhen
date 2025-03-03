import axois from "axios";
export async function NewUser(username, id) {
    let base = localStorage["endpointChat"];
    if (localStorage["endpointChat"] == null || localStorage["endpointChat"] == "") throw new Error("Endpoint not defined.");

    await axois.post(base + "/chat/create_user",
        {
            username: username,
            id: id
        }
    ).then(res => {
        console.log(res.statusCode);
        if (res.statusCode === 200) {
            alert("User created successfully");
            window.location.href = "/chat";
        }
    })
}

export async function LogIn(id) {
    let base = localStorage["endpointChat"];
    let data;
    if (localStorage["endpointChat"] == null || localStorage["endpointChat"] == "") throw new Error("Endpoint not defined.");

    await axois.get(base + "/chat/login/" + id,
    ).then(async res => {
        data = res;
    })
    return data;

}

export async function NewChannel(name, id)
{
    let base = localStorage["endpointChat"];
    if (localStorage["endpointChat"] == null || localStorage["endpointChat"] == "") throw new Error("Endpoint not defined.");

    await axois.post(base + "/chat/channels/create_channel",
        {
            name: name,
            id: id
        }
    ).then(res => {
        console.log(res.statusCode);
        if (res.statusCode === 200) {
            alert("Channel created successfully");
            window.location.href = "/chat";
        }
    })
}