"use client";

import { useState } from "react";
import { LogIn } from "@/scripts/chat";
import { ClientChatComponent } from "@/components/Chat/ClientChatComponent";
export default function Page() {

    const [chatData, setChatData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    
    useEffect(() => {

    async function initChat() {
        try {
        setErrorMessage("");
        setLoading(true);
        
        // 1) Create a new user for the chat
        const { token } = await GuestLogin(jobId);
        
        let userId = localStorage["userID"];
        
        // Check if the token and userId are returned
        if (!token || !userId) {
            throw new Error("No token or userId returned from GuestLogin");
        }

        // 2) Set the chat data state with the token and userId
        setChatData({
            token: token,
            user: { id: userId },
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
                <ClientChatComponent data={chatData} jobId={jobId}></ClientChatComponent>
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