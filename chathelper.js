import express from 'express';
import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
import { executeQuery } from './db.js';

// loads env
dotenv.config("./");

// API endpoints for the chat functionality
const chatRouter = express.Router();

// Creates or gets an instance of StreamChat from the API keys
const streamChat = StreamChat.getInstance(
    process.env.STREAM_API_KEY,
    process.env.STREAM_API_SECRET
);

// token for businesses
const generateBusinessToken = (userId) => {
    return streamChat.createToken(`worker-${userId}`, 36000 )};

// temp token for customers
const generateGuestToken = (jobId) => {
    return streamChat.createToken(`guest-${jobId}`, 36000)};

// a channel for a job
const createJobChannel = async (jobId, userId) => {
  try {
      const serverClient = new StreamChat( process.env.STREAM_API_KEY,process.env.STREAM_API_SECRET);
      const users = await QuerybyUser(jobId)
      if(users.users.length === 0 || users == undefined || users == []){
          await streamChat.upsertUser({id: "guest-" + jobId})
      }
      const channel = serverClient.channel("messaging", {
          created_by_id: "worker-"+ userId,
          members: 
          [
              { user_id: `worker-${userId}`, role: "channel_moderator" }, // Worker
              { user_id: `guest-${jobId}`, role: "guest" }, // Customer
          ],
          name: `Job Chat - ${jobId}`,
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
      //console.error("Error creating channel or sending message:", error.message);
      throw error;
  }
};

const QuerybyName = async (jobId) => {
  const chatClient = new StreamChat( process.env.STREAM_API_KEY,process.env.STREAM_API_SECRET);
  const filter = { name: { $in: [`Job Chat - ${jobId}`] } };
  const sort = [{last_updated: -1}];
  const channels = await chatClient.queryChannels(filter, sort,{
      watch: true, // this is the default
      state: true,
    });
  return channels;
  };

const QuerybyUser = async (jobId) => {
    const chatClient = new StreamChat( process.env.STREAM_API_KEY,process.env.STREAM_API_SECRET);
    const id = "guest-" + jobId;
    const users = await chatClient.queryUsers({  id });
    return users;
    };

const deleteChannel= async (jobId) => {
  try {
      const checkHistoryQuery = `
          SELECT * FROM JOB_HISTORY WHERE Job_ID = ?;
      `;
      const historyResult = await executeQuery(checkHistoryQuery, [jobId]);

      // If the job is not in the history table, do nothing
      if (historyResult.length === 0) {
          console.log(`Job ${jobId} is not in the history table. Channel not deleted.`);
          return;
      }

      // If the job is in the history table, delete the chat channel
      const channels = await QuerybyName(jobId);
      console.log(channels)
      const cid = channels[0].cid;

      await streamChat.deleteChannels([cid])
      return;
  } catch (error) {
      console.error("Error deleting channel:", error.message);
      throw error;
  }
};

export{
  chatRouter,
  generateBusinessToken,
  generateGuestToken,
  createJobChannel,
  QuerybyName,
  QuerybyUser,
  streamChat,
  deleteChannel,
 };
