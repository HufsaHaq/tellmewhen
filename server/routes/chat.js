import express from 'express';
import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
import { chatRouter, generateBusinessToken, generateGuestToken, createJobChannel, streamChat } from 'chathelper.js';
import { executeQuery } from './db.js';
// loads env
dotenv.config("./");

/*chatRouter.get("/login/:id", async (req, res) => {
    //Returns a token from stream to allow for login
    try{
        const id = req.params.id;

        // Checks to see if the parameters fail to be sent in the body
        if (id == null || id == "") {
            res.status(400).json({ message: "Invalid ID" });
            return 0;
        }
        const token = generateBusinessToken(id);

        console.log(`Business user ${id} logged in successfully`);
        res.status(200).json({ token });
    } catch (error) {
        console.error("Business login error:", error.message);
        res.status(500).json({ message: "server error" });
    }
}); 
*/
chatRouter.get("/worker/login/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        // Authenticate the worker (check if they exist in the database)
        const workerQuery = 'SELECT * FROM WORKER_TABLE WHERE User_ID = ?;';
        const workerResult = await executeQuery(workerQuery, [userId]);

        if (workerResult.length === 0) {
            return res.status(404).json({ message: "Worker not found" });
        }

        const token = generateBusinessToken(userId);

        //jobs assigned to the worker
        const jobsQuery = 'SELECT Job_ID FROM JOB_TABLE WHERE User_ID = ?;';
        const jobsResult = await executeQuery(jobsQuery, [userId]);

        // create chat channels for each job
        const channels = [];
        for (const job of jobsResult) {
            const jobId = job.Job_ID;
            const channelId = `job-${jobId}`;

            // channel already exists?
            let channel = streamChat.channel("messaging", channelId);
            const channelState = await channel.watch();

            if (!channelState) {
                // Create the channel if it doesn't exist
                channel = await createJobChannel(jobId, userId);
            }

            channels.push(channel);
        }

        console.log(`Worker ${userId} logged in successfully`);
        res.status(200).json({ token, channels });
    } catch (error) {
        console.error("Worker login error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});


chatRouter.post("/create_user", async (req, res) => {
    try {
        const { jobId } = req.body;
    
        // Validate input
        validateRequiredFields(["jobId"], req.body);
    
        // Generate a token for the guest
        const token = generateGuestToken(jobId);
    
        console.log(`Guest for job ${jobId} created successfully`);
        res.status(200).json({ token });
    } catch (error) {
        console.error("Create guest error:", error.message);
        res.status(400).json({ message: "server error" });
    }
});

chatRouter.post("/channels/create_channel", async (req, res) => {
    try {
        const jobId = req.body.jobId;
        const businessUserId  = req.body.businessUserId;

        // Create the job channel
        const channel = await createJobChannel(jobId, businessUserId);
    
        console.log(`Channel for job ${jobId} created successfully`);
        res.status(200).json({ channel });
      } catch (error) {
        console.error("Create job channel error:", error.message);
        res.status(400).json({ message: "Internal server error" });
      }
});

export { chatRouter };