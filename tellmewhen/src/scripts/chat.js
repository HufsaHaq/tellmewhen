import axios from "axios";
import  {GetServerEndpoint}  from "../scripts/script-settings";

export async function GuestLogin(jobId) {
    let base = GetServerEndpoint();
    await axios.post(base + "/chat/guest/login" + jobId).then(res => {
        console.log(res.status);
        if (res.status === 200) {
            console.log("Guest user created successfully");
            return res.data.token; // return the guest token
        }
    });
}

export async function LogIn(userId, businessId) {
    let base = GetServerEndpoint();
    let data;

    await axios.get(base + "/chat/worker/login/" + userId + "/" + businessId)
        .then(res => {
            console.log(res.status);
            if (res.status === 200) {
                console.log("Worker logged in successfully");
                data = res.data; // rturn the token and channels
                console.log(data);
            }
        });

    return data;
}

export async function DeleteChannel(jobId) {
    let base = GetServerEndpoint();

    await axios.post(base + "/chat/channels/delete_channel", {
        jobId: jobId,
    }).then(res => {
        console.log(res.status);
        if (res.status === 200) {
            console.log("Channel deleted successfully");
            return res.data; // return the deletion result
        }
    });
}
