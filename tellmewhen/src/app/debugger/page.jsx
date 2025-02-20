"use client";
import { Input, Button } from "@mui/joy";
import { useState, useEffect } from "react";
import { Register, Login } from "@/scripts/login";
import { GetAllCurrentJobs, GetAllJobHistory } from "@/scripts/dashboard";

function Debugger() {
    const [Endpoint, SetEndPoint] = useState("");
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");
    const [Username, SetUsername] = useState("");
    

    useEffect(() => {
        if(typeof window === "undefined") return;
        SetEndPoint(localStorage["endpoint"]);
        SetEmail(localStorage["email"]);
        SetUsername(localStorage["username"]);
        SetPassword(localStorage["password"]);

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
            <div className="space-y-[10px] mx-auto px-[20px] w-[90%] rounded-md py-[10px] bg-white shadow-lg">
                <h1 className="font-bold">ENDPOINTS</h1>
                <Input placeholder="email" onChange={(event) => { SetEmail(event.target.value) }} value={Email}></Input>
                <Input placeholder="username" onChange={(event) => { SetUsername(event.target.value) }} value={Username}></Input>
                <Input placeholder="password" onChange={(event) => { SetPassword(event.target.value) }} value={Password}></Input>
                <Button className="w-[100%]" onClick={()=>{Register(Email, Username, Password).then(res=>console.log(res))}}>Register</Button>
                <Button className="w-[100%]" onClick={()=>{Login(Email, Username, Password).then(res=>{console.log(res.data["accessToken"]); (console.log(res.data)); localStorage["accessToken"] == res.data["accessToken"]})}}>Login</Button>
                <Button className="w-[100%]" onClick={()=>{GetAllCurrentJobs(2, localStorage["accessToken"]).then(res=>console.log(res))}}>Get Current Jobs</Button>
                <Button className="w-[100%]" onClick={()=>{GetAllJobHistory(2, localStorage["accessToken"]).then(res=>console.log(res))}}>Get Job History</Button>

            </div>

        </span>
        <div className="w-full flex justify-center bottom-[25px] fixed">
            <Button className="text-[50px]" onClick={SaveResultsToLocal}>Save to Local Storage</Button>
        </div>
        </>


    );
    function SaveResultsToLocal() {
        if (typeof window === "undefined") return;
        localStorage["endpoint"] = Endpoint;
        localStorage["email"] = Email;
        localStorage["username"] = Username;
        localStorage["password"] = Password;
    }

}

export default Debugger;