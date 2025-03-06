"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";

function Page() {
  const [text, setText] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);


  const checkSubscriptionStatus = async () => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setNotificationsEnabled(!!subscription);
    }
  };

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
  };

  async function saveSubscription(subscription) {
    let endpoint = localStorage["endpoint"];
    const response = await fetch(endpoint + '/save-new-subscription',{
        method:"POST",
        headers:{ 'Content-type': 'application/json'},
        body: JSON.stringify(subscription)
    });
  };

  const enableNotifications = async () => {
    if (!("serviceWorker" in navigator)) {
      alert("Service Workers are not supported in your browser.");
      return;
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered:", registration);

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Push notifications permission denied.");
        return;
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(
          "BO9BkKD8IykLzyJ6djlVMziBKTtwIjhhVk_S-W_0gzfP2dC26ytBsDMSdngvT9rCd_0oX8jUGW_e54b_xEXr4LQ"
        ),
      });

      console.log("Push Subscription:", subscription);

      // Save subscription to backend
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
          <div className="mb-4">
            <p className="font-semibold text-gray-700">Business:</p>
            <p className="text-gray-600">{businessName}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Job Description:</p>
            <p className="text-gray-600">{jobDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
