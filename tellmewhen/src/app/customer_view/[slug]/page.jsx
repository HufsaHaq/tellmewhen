"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useParams } from "next/navigation";
import { GetJobDetails } from "@/scripts/customer";
import React, { use } from "react";
import { RegisterServiceWorker, SaveSubscription } from "@/scripts/webpush";
import { Button } from "@mui/joy";
import Switch, { switchClasses } from '@mui/joy/Switch';

/* 

                            DYNAMIC ROUTING
This will allow for data to be added to the end of the URL in the form of

            localhost:PORT:/customer_view/......

This then can be accessed using params.slug
(only name that works as far as i know :( )

*/

// function Page({params}) {

function Page() {
    const [text, setText] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [errorDetails, setErrorDetails] = useState("");
    // const parameters = React.use(params)
    const [decryptedJobID, setDecryptedJobID] = useState("");
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const params = useParams();
    let jobID = params.slug;

    useEffect(() => {
        checkSubscriptionStatus();
    }, []);

    async function saveSubscription(subscription) {
        let endpoint = localStorage["endpoint"];
        let res = await SaveSubscription(subscription, params.slug, localStorage["businessID"]);
    }

    const checkSubscriptionStatus = async () => {
        if ("serviceWorker" in navigator) {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setNotificationsEnabled(subscription);
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
            data: { url: `/customer_view/${params.slug}` },
        });
    };

    const enableNotifications = async () => {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            alert("Notification permission denied.");
            return false;
        }


        //job/display_code/:jId
        try {
            let subscription = await RegisterServiceWorker();
            await saveSubscription(subscription);
            setNotificationsEnabled(true);
            return true;
        } catch (error) {
            console.error("Error enabling notifications:", error);
        }
        setNotificationsEnabled(true);
        return false;
    };

    const disableNotifications = async () => {
        if ("serviceWorker" in navigator) {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                setNotificationsEnabled(false);
            }
        }
    };

    useEffect(() => {
        async function fetchJobDetails() {
            try {
                const details = await GetJobDetails(params.slug);
                if (details.status === 200) {
                    setBusinessName(details.data.Business_Name || "");
                    setJobDescription(details.data.Description || "");
                    setDecryptedJobID(details.data.Job_ID || "");
                    console.log(details.data.Job_ID);
                    setErrorDetails("");
                } else {
                    setErrorDetails("Cannot connect to server");
                }
            } catch (error) {
                setErrorDetails("Cannot connect to server");
            }
        }

        if (params.slug) {
            fetchJobDetails();
        }
    }, [params.slug]); // Use params.slug as the dependency

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
                <button onClick={testNotification} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 mb-8">
                    Show Test Notification
                </button>

                {/* Radio buttons to enable/disable notifications */}
                <div className="flex justify-center gap-8 mb-8">
                    <p className="font-semibold text-xl text-gray-700">Enable Notifications:</p>
                    <Switch
                        key={notificationsEnabled}
                        checked={notificationsEnabled}
                        onChange={async(event) => {
                            if(event.target.checked)
                            {
                                setNotificationsEnabled(true);
                                await enableNotifications()
                                
                            }else{
                                await disableNotifications();
                                setNotificationsEnabled(false);
                            }
                        }}
                        sx={(theme) => ({
                            '--Switch-thumbShadow': '0 3px 7px 0 rgba(0 0 0 / 0.12)',
                            '--Switch-thumbSize': '27px',
                            '--Switch-trackWidth': '51px',
                            '--Switch-trackHeight': '31px',
                            '--Switch-trackBackground': theme.vars.palette.background.level3,
                            [`& .${switchClasses.thumb}`]: {
                                transition: 'width 0.2s, left 0.2s',
                            },
                            '&:hover': {
                                '--Switch-trackBackground': theme.vars.palette.background.level3,
                            },
                            '&:active': {
                                '--Switch-thumbWidth': '32px',
                            },

                        })}
                    />
                </div>

                {/* Details Section */}
                <div className="text-center mb-6">
                    <h2 className="font-bold text-3xl text-gray-900">Details</h2>
                </div>

                {/* Business details */}
                <div className="w-full max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-6">
                    {errorDetails ? (
                        <div className="text-red-500 text-sm mt-2">{errorDetails}</div>
                    ) : (
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

                <div className="flex justify-center">
                    <Button href={`/chat/client_chat/${decryptedJobID}`} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">
                        Chat
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Page;
