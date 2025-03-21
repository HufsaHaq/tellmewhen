"use client";

import { useState, useEffect } from "react";
import { GuestLogin } from "@/scripts/chat";
import { ClientChatComponent } from "@/components/Chat/ClientChatComponent";
import { useParams } from "next/navigation";
import PageLoad from "@/components/PageLoad";

export default function Page() {

    const [guest_token, setToken] = useState(null);
    const [guest_channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const params = useParams()
    const jobId = params.slug;
    
    useEffect(() => {

    async function initChat() {
        try {
        setErrorMessage("");
        setLoading(true);
        
        // 1) Create a new user for the chat
        console.log("GuestLogin")
        console.log(jobId)
        let res = await GuestLogin(jobId);

        setChannel(res.channel);
        setToken(res.token);
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

    const data = {
        channels: guest_channel,
        token: guest_token,
        user: 'guest-'+localStorage["jobID"],
    };
    console.log("data")
    console.log(data);
    if (loading) {
    return <PageLoad message="Loading Chat"/>;
    }
    if (errorMessage) {
    return <PageLoad message={errorMessage}></PageLoad>;
    }
    if (!data) {
    return <PageLoad message="Unable to load chat data"></PageLoad>;
    }

    return (
        <>
            <div className="!overflow-y-hidden bg-[#F5F5F5] w-full flex flex-col">
                
                <div style = {style.container}>
                <ClientChatComponent data={data}></ClientChatComponent>
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