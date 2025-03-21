import axios from "axios";
axios.defaults.withCredentials = true;
import { GetServerEndpoint } from "./script-settings";
let endpoint = GetServerEndpoint();

// Helper function for key parameter
// function urlB64ToUint8Aqrray(base64String) {
//     const padding = '='.repeat((4 - base64String.length % 4) % 4);
//     const base64 = (base64String + padding)
//         .replace(/-/g, '+')
//         .replace(/_/g, '/');
//     const rawData = window.atob(base64);
//     const outputArray = new Uint8Array(rawData.length);

//     for (let i = 0; i < rawData.length; i++) {
//         outputArray[i] = rawData.charCodeAt(i);
//     }
//     return outputArray;
// }



export async function SaveSubscription(subscription, jobId, businessId)
{

    let data = null
    let sub = JSON.parse(JSON.stringify(subscription));
    console.log("Subscription: ", subscription)
    console.log("jobId: ", jobId)
    console.log("businessId: ", businessId)
    let json = {
        jobId: jobId,
        endpoint: sub.endpoint,
        businessId: businessId,
        keys: sub.keys,
    }

    console.log(json);
    await axios.post(endpoint  + "/save-new-subscription",
        json
    ).then(res => data = res)
    return data
}

export async function NotifyCustomer(jobId, title, body)
{

    let data = null
    await axios.post(endpoint  + "/jobs/notify/" + jobId,
        {
            title: title,
            message: body,
        }
    ).then(res => data = res);

    return data;
}

export async function RegisterServiceWorker()
{
    const registration = await navigator.serviceWorker.register('/serviceworker.js', {scope: '/'});
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BNErQOX0hbGYSQNR-wAtxuQmBu9ONQCB1jcCEkZo_wIFtHDuvp9478VhcMbOgBIBbFpFDqV6YHo5QNgsCGLaofg',
    });
    console.log(subscription);
    return subscription;
}