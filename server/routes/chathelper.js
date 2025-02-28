import express from 'express';
import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

// loads env
dotenv.config("./");

// API endpoints for the chat functionality
const chatRouter = express.Router();

// Creates or gets an instance of StreamChat from the API keys
const streamChat = StreamChat.getInstance(
    process.env.STREAM_API_KEY,
    process.env.STREAM_SECRET_API_KEY
);

// token for businesses
const generateBusinessToken = (userId) => {
    return streamChat.createToken(userId);
  };

// temp token for customers
const generateGuestToken = (jobId) => {
    return streamChat.createToken(`guest-${jobId}`, {
      role: "guest", // restrict permissions 
    });
  };

// a channel for a job
const createJobChannel = async (jobId, businessUserId) => {
    const channel = streamChat.channel("messaging", `job-${jobId}`, {
      name: `Job Chat - ${jobId}`,
      members: [
        {user_id : `guest-${jobId}`, role: "guest"},
        {user_id : businessUserId, role: "channel_moderator"},
    ], // Add customer and business worker
    });

    return await channel.create();
  };

export{
  chatRouter,
  generateBusinessToken,
  generateGuestToken,
  createJobChannel,
  streamChat,
 };
