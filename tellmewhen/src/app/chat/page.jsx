"use client";
import { Input, Button } from "@mui/joy";
import { useState, useEffect } from "react";
function Debugger() {
    const [Endpoint, SetEndPoint] = useState("");
    const [EndpointChat, SetEndPointChat] = useState("");
    const [APIKey, SetAPIKey] = useState("");
    const [AdminID, SetAdminID] = useState("");

    useEffect(() => {
        if(typeof window === "undefined") return;
        SetEndPoint(localStorage["endpoint"]);
        SetEndPointChat(localStorage["endpointChat"]);
        SetAPIKey(localStorage["apiKey"]);
        SetAdminID(localStorage["adminID"]);

    }, []);
    return (
        <>
        <span className="w-[90%] mx-auto mt-[10px] justify-center tablet1080:space-x-[25px] tablet1080:inline max-tablet1080:space-y-[15px] tablet1080:flex">
            <div className="mx-auto px-[20px] w-[90%] rounded-md py-[10px] bg-white shadow-lg">
                <h1 className="font-bold">GENERAL</h1>
                <span className="inline flex">
                    <h1 className="mr-[10px]">Endpoint URL base: </h1>
                    <Input onChange={(event) => { SetEndPoint(event.target.value) }} value={Endpoint}></Input>
                    <h1 className="ml-[10px]">Stored at "endpoint"</h1>
                </span>
            </div>

            <div className="mx-auto space-y-[10px] px-[20px] w-[90%] rounded-md py-[10px] bg-white shadow-lg">
                <h1 className="font-bold">CHAT</h1>
                <span className="inline flex align-items-center justify-between px-[10px]">
                    <h1 className="mr-[10px]">Endpoint: </h1>
                    <Input className="w-[80%]" onChange={(event) => { SetEndPointChat(event.target.value) }} value={EndpointChat}></Input>
                </span>
                <span className="inline flex align-items-center justify-between px-[10px]">
                    <h1 className="mr-[10px]">Admin Account ID: </h1>
                    <Input className="w-[80%]" onChange={(event) => { SetAdminID(event.target.value) }} value={AdminID}></Input>
                </span>
                <span className="inline flex align-items-center justify-between px-[10px]">
                    <h1 className="mr-[10px]">API Key: </h1>
                    <Input className="w-[80%]" onChange={(event) => { SetAPIKey(event.target.value) }} value={APIKey}></Input>
                </span>
                <Button className="w-[100%]" onClick={()=>{window.location.href="/chat/newuser"}}>Add New User</Button>
                <Button className="w-[100%]" onClick={()=>{window.location.href="/chat/newchannel"}}>Add New Channel/Chat</Button>

                <Button className="w-[100%]" onClick={()=>{window.location.href="/chat/business_chat"}}>Business Chat Client</Button>
                <Button className="w-[100%]" onClick={()=>{window.location.href="/chat/client_chat"}}>User Chat Client</Button>

            </div>

        </span>
            <div className="w-full flex justify-center bottom-[25px] absolute">
                <Button className="text-[50px]" onClick={SaveResultsToLocal}>Save to Local Storage</Button>
            </div>
        </>


    );
    function SaveResultsToLocal() {
        if (typeof window === "undefined") return;
        localStorage["endpoint"] = Endpoint;
        localStorage["endpointChat"] = EndpointChat;
        localStorage["adminID"] = AdminID;
        localStorage["apiKey"] = APIKey;
    }

}

export default Debugger;