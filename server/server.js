/*
                              __HOW IT WORKS__
Chats are stored on the Stream Chat service automatically


Frontend:

On the frontend, there are two new pages which are
                        /debugger/chat/business 
                        /debugger/chat/user
which will help simulate what an interaction would be like

In order to create users, there is a page on the frontend called
                        /debugger/chat/newuser
This is purely for testing that the system works and will not be present in final implementation


                              __ENDPOINTS__
/chat/create_user
    - Creates a new user on the Stream Chat service
    - Parameters into body:
        id
        username
        image: optional

/chat/login
    - Logs into the Stream Chat service
    - Parameters into body:
        username

                              __ENV FORMAT__
PORT_CHAT = ...                     port for the server
STREAM_API_KEY = ...                api key from the stream chat dashboard
STREAM_SECRET_API_KEY = ...         secret key from the stream chat dashboard
STREAM_ADMIN_ID = ...               admin id for the business account

*/

import express from "express";
import dotenv from "dotenv";
import {chatRouter} from "./routes/chat.js"
import cors from "cors";
import bodyParser from 'body-parser';

// loads environment variables
dotenv.config();

// Might use the same server as regular backend??
const app = express();
app.use(express.json());
app.use(bodyParser.json());

// This allows requests to be made from the frontend
// Currently this is allowing requests from anywhere (not so good :( )
// For security, replace the origin with allowed URLs
app.use(cors({ origin: "*" })); 
// app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));


// Routes
app.use("/chat", chatRouter);

app.listen({port: parseInt(process.env.PORT_CHAT)});