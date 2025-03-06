/* archie stuff 
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
            window.location.href = "/debugger";
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
            window.location.href = "/debugger";
        }
    })
}
*/
import axios from "axios";

export async function NewUser(jobId) {
    let base = localStorage["endpointChat"];
    if (localStorage["endpointChat"] == null || localStorage["endpointChat"] == "") {
        throw new Error("Endpoint not defined.");
    }

    await axios.post(base + "/chat/create_user", {
        jobId: jobId,
    }).then(res => {
        console.log(res.status);
        if (res.status === 200) {
            console.log("Guest user created successfully");
            return res.data.token; // return the guest token
        }
    });
}

export async function LogIn(userId, businessId) {
    let base = localStorage["endpointChat"];
    let data;
    if (localStorage["endpointChat"] == null || localStorage["endpointChat"] == "") {
        throw new Error("Endpoint not defined.");
    }

    await axios.get(base + "/chat/worker/login/" + userId + "/" + businessId)
        .then(res => {
            console.log(res.status);
            if (res.status === 200) {
                console.log("Worker logged in successfully");
                data = res.data; // rturn the token and channels
            }
        });

    return data;
}

export async function NewChannel(jobId, businessId) {
    let base = localStorage["endpointChat"];
    if (localStorage["endpointChat"] == null || localStorage["endpointChat"] == "") {
        throw new Error("Endpoint not defined.");
    }

    await axios.post(base + "/chat/channels/create_channel/" + businessId, {
        jobId: jobId,
    }).then(res => {
        console.log(res.status);
        if (res.status === 200) {
            console.log("Channel created successfully");
            return res.data.channel; // return the created channel
        }
    });
}

export async function DeleteChannel(jobId) {
    let base = localStorage["endpointChat"];
    if (localStorage["endpointChat"] == null || localStorage["endpointChat"] == "") {
        throw new Error("Endpoint not defined.");
    }

    await axios.delete(base + "/chat/channels/delete_channel", {
        data: { jobId: jobId },
    }).then(res => {
        console.log(res.status);
        if (res.status === 200) {
            console.log("Channel deleted successfully");
            return res.data; // return the deletion result
        }
    });
}
