// pages/customer_chat/[jobId].jsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { NewUser } from "@/scripts/chat";
import { ClientChatComponent } from "@/components/Chat/ClientChatComponent";

export default function CustomerChatPage() {
  const params = useParams();
  const jobId = params.jobId;

  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {

    async function initChat() {
      try {
        setErrorMessage("");
        setLoading(true);
        
        // 1) Create a new user for the chat
        const { token, userId } = await NewUser(jobId);

        // Check if the token and userId are returned
        if (!token || !userId) {
          throw new Error("No token or userId returned from NewUser");
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
    <div className="w-full h-screen flex flex-col">
      <h1 className="p-4 text-2xl font-bold">
        Customer Chat for Job #{jobId}
      </h1>

      <div className="flex-1">       
        <ClientChatComponent data={chatData} jobId={jobId} />
      </div>
    </div>
  );
}
