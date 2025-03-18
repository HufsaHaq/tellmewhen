import axios from "axios";
axios.defaults.withCredentials = true;


// Helper function for key parameter
function urlB64ToUint8Aqrray(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}



export async function SaveSubscription(subscription, jobId, businessId)
{
    let endpoint = localStorage["endpoint"];
    let data = null
    let sub = JSON.parse(JSON.stringify(subscription));

    let json = {
        jobId: jobId,
        endpoint: sub.endpoint,
        businessId: businessId,
        keys: sub.keys,
    }

    await axios.post(endpoint + "/save-new-subscription",
        json
    ).then(res => data = res)
    return data
}

export async function NotifyCustomer(jobId, title, body)
{
    let endpoint = localStorage["endpoint"];
    let data = null
    await axios.post(endpoint + "/jobs/notify/" + jobId,
        {
            title: title,
            body: body,
        }
    ).then(res => data = res);

    return data;
}