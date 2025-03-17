import dotenv from "dotenv";
import { chatRouter, generateBusinessToken, generateGuestToken, createJobChannel, QuerybyName ,QuerybyUser,streamChat,deleteChannel} from '../chathelper.js';
import { executeQuery } from '../db.js';
// loads env
dotenv.config("./");

chatRouter.get("/worker/login/:userId/:businessId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const businessId = req.params.businessId;
        if (!userId) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        const workerQuery = 'SELECT * FROM WORKER_TABLE WHERE User_ID = ? AND Business_ID = ?;';
        const workerResult = await executeQuery(workerQuery, [userId, businessId]);

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
            const result = await QuerybyName(jobId);

            if (result.length === 0) {
                // Create the channel if it doesn't exist
                let channel = await createJobChannel(jobId, userId);
                channels.push(channel);
            }

        }

        console.log(`Worker ${userId} logged in successfully`);
        res.status(200).json({ token:token, channels:channels });
    } catch (error) {
        console.error("Worker login error:", error.message);
        res.status(404).json({ message: "Server error" });
    }
});

chatRouter.get("/guest/login/:jobId", async (req, res) => {
    const jobId = req.params.jobId;
    if (!jobId) {
        return res.status(400).json({ message: "Invalid Job ID" });
    }
    try{
    const result = await QuerybyUser(jobId);
    if (result.users.length === 0) {
        await streamChat.upsertUser({id: "guest-" + jobId});
    }

    const guestToken = generateGuestToken(jobId);
    res.status(200).json({token:guestToken});
    }
    catch (error) {
        console.error("Guest login error:", error.message);
        res.status(404).json({ message: "Server error" });
    }
});


chatRouter.post("/channels/delete_channel", async (req, res) => {
    try {
        const jobId  = req.body.jobId;

        if (!jobId) {
            return res.status(400).json({ message: "jobId is required" });
        }

        await deleteChannel(jobId);

        console.log('Channel deleted');
        res.status(200).json({ success: true, message: `Channel for job ${jobId} deleted` });
    } catch (error) {
        console.error("Error deleting channel:", error.message);
        res.status(400).json({ message: "Internal server error" });
    }
});

export { chatRouter };