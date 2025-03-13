"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useParams } from "next/navigation";
import { GetJobDetails } from "@/scripts/customer";

function Page() {
  const [text, setText] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const { jobID } = useParams();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  function urlB64ToUint8Array(base64String) {
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

  async function saveSubscription(subscription) {
    let endpoint = localStorage["endpoint"];
    const response = await fetch(endpoint + '/save-new-subscription', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...subscription,
            jobId: window.location.pathname.split('/').pop()
        })
    });
}
  const checkSubscriptionStatus = async () => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setNotificationsEnabled(!!subscription);
    } 
  };

  const testNotification = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      alert("Notifications are not supported in this browser.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Notification permission denied.");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    registration.showNotification("Test Notification", {
      body: "This is a dummy notification for testing purposes.",
      data: { url: "https://youtube.com" },
    });
  };

  const enableNotifications = async () => {
    if (!("serviceWorker" in navigator)) {
      alert("Service Workers are not supported in your browser.");
      return;
    }

    //job/display_code/:jId
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered:", registration);

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Push notifications permission denied.");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(
          "BO9BkKD8IykLzyJ6djlVMziBKTtwIjhhVk_S-W_0gzfP2dC26ytBsDMSdngvT9rCd_0oX8jUGW_e54b_xEXr4LQ"
        ),
      });

      console.log("Push Subscription:", subscription);

      await saveSubscription(subscription);

      setNotificationsEnabled(true);
      alert("Push notifications enabled!");
    } catch (error) {
      console.error("Error enabling notifications:", error);
    }
  };

  const disableNotifications = async () => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        setNotificationsEnabled(false);
        alert("Push notifications disabled!");
      }
    }
  };


  useEffect(() => {

    async function fetchJobDetails() {
      let details;
      try {
        details = await GetJobDetails(jobID);
        if (details.status === 200) {
          setBusinessName(details.data);
          setJobDescription(details.data);
          setErrorDetails("");
        }
        else 
          setErrorDetails("Cannot connect to server");
      } 
      catch (error) {
        setErrorDetails("Cannot connect to server");
        return;
      }
    }
    fetchJobDetails();
  }, [jobID]);
  

  return (
    <div className="min-h-screen flex flex-col pt-20 pb-8 bg-gray-100">
      <div className="flex flex-col items-center justify-start mt-12 px-6">
      
        {/* Notification Section */}
        <div className="text-center mb-6">
          <h2 className="font-bold text-3xl text-gray-900 mb-4">Notifications</h2>
          <p className="text-lg text-gray-600">{text}</p>
        </div>

        {/* Notification text */}
        <div className="w-full max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-8 mb-8">
          <p className="text-base text-gray-700">{text}</p>
        </div>

        {/* Button to test notifications */}
        <button
          onClick={testNotification}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 mb-8"
        >
          Show Test Notification
        </button>

        {/* Radio buttons to enable/disable notifications */}
        <div className="flex justify-center gap-8 mb-8">
          <p className="font-semibold text-xl text-gray-700">Enable Notifications:</p>
          <label className="flex items-center space-x-2 text-xl cursor-pointer">
            <input
              type="radio"
              name="notifications"
              value="on"
              checked={notificationsEnabled}
              onChange={enableNotifications}
              className="h-6 w-6"
            />
            <span>On</span>
          </label>
          <label className="flex items-center space-x-2 text-xl cursor-pointer">
            <input
              type="radio"
              name="notifications"
              value="off"
              checked={!notificationsEnabled}
              onChange={disableNotifications}
              className="h-6 w-6"
            />
            <span>Off</span>
          </label>
        </div>

        {/* Details Section */}
        <div className="text-center mb-6">
          <h2 className="font-bold text-3xl text-gray-900">Details</h2>
        </div>

        {/* Business details */}
        <div className="w-full max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-6">
          {errorDetails ? (<div className="text-red-500 text-sm mt-2">{errorDetails}</div>) : (
          <>
            <div className="mb-4">
              <p className="font-semibold text-gray-700">Business:</p>
              <p className="text-gray-600">{businessName}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Job Description:</p>
              <p className="text-gray-600">{jobDescription}</p>
            </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
