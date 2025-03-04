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
const createJobChannel = async (jobId, userId) => {
  try {
      const channel = streamChat.channel("messaging", `job-${jobId}`, {
          name: `Job Chat - ${jobId}`,
          members: [
              { user_id: `worker-${userId}`, role: "channel_moderator" }, // Worker
              { user_id: `guest-${jobId}`, role: "guest" }, // Customer
          ],
      });

      await channel.create();

      //  automatic welcome message to the customer
      await channel.sendMessage({
          text: `Hello! This is the chat for Job #${jobId}. If you have any issues, please message here.`,
          user_id: `worker-${userId}`, 
      });

      console.log(`Channel for job ${jobId} created and welcome message sent`);
      return channel;
  } catch (error) {
      console.error("Error creating channel or sending message:", error.message);
      throw error;
  }
};

export{
  chatRouter,
  generateBusinessToken,
  generateGuestToken,
  createJobChannel,
  streamChat,
 };
