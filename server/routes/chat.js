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
      members: [`guest-${jobId}`, businessUserId], // Add customer and business worker
    });
  
    await channel.create();
    return channel;
  };

chatRouter.get("/login/:id", async (req, res) => {
    /*
    Returns a token from stream to allow for login
    */
    try{
        const id = req.params.id;

        // Checks to see if the parameters fail to be sent in the body
        if (id == null || id == "") {
            res.status(400).json({ message: "Invalid ID" });
            return 0;
        }
        /*const users = await streamChat.queryUsers({id});

        // Checks to see if the user from the query exists
        if(users == null || users==undefined || users.length == 0)
        {
            res.status(401).json({ message: "User not found" });
            return 0;
        }
        // Selects the first user (incase id wasn't unique)
        const user = users["users"]

        // Catches errors if there was an error getting the specified user
        if(user == null || user == undefined || user.length == 0)
        {
            res.status(401).json({ message: "User not found" });
            return 0;
        } 

        // Stream Chat token for authentication on frontend
        const token = streamChat.createToken(id);
        console.log("Log In Successful! Token aquired");
        res.json(
            {
                token: token,
                user: user[0],
            }
        );*/
        // Generate a token for the business employee
        const token = generateBusinessToken(id);

        console.log(`Business user ${id} logged in successfully`);
        res.status(200).json({ token });
    } catch (error) {
        console.error("Business login error:", error.message);
        res.status(500).json({ message: "server error" });
    }
});

chatRouter.post("/create_user", async (req, res) => {
    /*const id = req.body.id;
    const username = req.body.username;
    // Image could be set since we might consider to have this (maybe image relating to job?)
    // Note this is an optional parameter in the body
    const image = req.body.image || null;

    // Checks to see if the parameters fail to be sent in the body
    if (id == null || username == null || id == "" || username == "") {
        res.status(400).json({ message: "Username and/or id passed in are invalid." });
        return 0;
    }
    // First need to check to see if the user already exists
    // If it does, then we can't create a new user
    const existingUser = await streamChat.queryUsers({ id });
    if (existingUser.users.length > 0) {
        res.status(400).json({ message: "User with the given id " + id + " already exist." });
        return 0;
    }

    // if the user doesn't exist, then we can make one
    await streamChat.upsertUser({ id, username, image });
    console.log("User created successfully")
    res.status(200).json({ message: "User created successfully." });
    */
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
    /*// The name of the channel
    const name = req.body.name;

    // The ID of the client/user
    const id = req.body.id;

    if(id == null || name == null || id == "" || name == "" || name == undefined || id == undefined)
    {
        res.status(400).json({ message: "Invalid channel name or id passed in." });
        return 0;
    }

    // Creates the structure of the new channel, including properties
    const channel = streamChat.channel("messaging",
        {
            created_by_id: process.env.STREAM_ADMIN_ID,
            members: [
                {user_id: process.env.STREAM_ADMIN_ID, role: "channel_moderator"},
                {user_id: id, role: "member"}
            ],
            name: name, // Maybe use the JobID for this?? Or a brief summary
    })

    // creates the channel
    await channel.create().then(() => {
        console.log("Channel created successfully");
        res.status(200).json({ message: "Channel created successfully." });
 
    });
})   */
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