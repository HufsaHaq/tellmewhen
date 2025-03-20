"use client";

import { useState, useEffect } from "react";
import { GuestLogin } from "@/scripts/chat";
import { ClientChatComponent } from "@/components/Chat/ClientChatComponent";

export default function Page() {

    const [chatData, setChatData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const jobId = localStorage["jobID"];
    
    useEffect(() => {

    async function initChat() {
        try {
        setErrorMessage("");
        setLoading(true);
        
        // 1) Create a new user for the chat
        console.log("GuestLogin")
        console.log(jobId)
        const res = await GuestLogin(jobId);
        guest_token = res.data.token;
        guest_channel = res.data.channel;
        
        let guestId = 'guest-'+localStorage["jobID"];
        
        // Check if the token and userId are returned
        if (!token || !userId) {
            throw new Error("No token or userId returned from GuestLogin");
        }

        // 2) Set the chat data state with the token and userId
        setChatData({
            token: token,
            user: { id: guestId },
        });

        } catch (err) {
        console.error("Failed to create guest user:", err);
        setErrorMessage("Could not create guest user for chat.");
        } finally {
        setLoading(false);
        }
    }

    // If the jobId is available, initialize the chat
    if (jobId) {
        initChat();
    }
    }, [jobId]);

    if (loading) {
    return <div>Loading chat...</div>;
    }
    if (errorMessage) {
    return <div className="text-red-600">{errorMessage}</div>;
    }
    if (!chatData) {
    return <div>Unable to load chat data.</div>;
    }

    return (
        <>
            <div className="!overflow-y-hidden w-full flex flex-col">
                
                <div style = {style.container}>
                <ClientChatComponent data={chatData}></ClientChatComponent>
                </div>

            </div>
            
        </>
    )
}

const style = {
    container: {
        height: "calc(100vh - 85px)",
    }
}