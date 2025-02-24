"use client";
import { Input, Button } from "@mui/joy";
import { useState, useEffect } from "react";
import { Register, Login } from "@/scripts/login";
import {
        GetAllJobHistory,
        GetJobsForEmployee
        } from "@/scripts/dashboard";

import { GetNumberOfOpenJobs,
        GetNumberOfTotalJobs } from "@/scripts/account";

function Debugger() {
    const [Endpoint, SetEndPoint] = useState("");
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");
    const [Username, SetUsername] = useState("");
    const [ID, SetID] = useState("");
    const [EmpID, SetEmpID] = useState("");

    useEffect(() => {
        if(typeof window === "undefined") return;
        SetEndPoint(localStorage["endpoint"]);
        SetEmail(localStorage["email"]);
        SetUsername(localStorage["username"]);
        SetPassword(localStorage["password"]);
        SetID(localStorage["id"]);
        SetEmpID(localStorage["empid"]);

    }, []);
    return (
        <>
        <span className="w-[90%] mx-auto mt-[10px] justify-center tablet1080:space-x-[25px] tablet1080:inline max-tablet1080:space-y-[15px] tablet1080:flex">
            <div className="space-y-[10px] mx-auto px-[20px] w-[90%] rounded-md py-[10px] bg-white shadow-lg">
                <h1 className="font-bold">ENDPOINTS</h1>
                <Input placeholder="endpoint" onChange={(event) => { SetEndPoint(event.target.value) }} value={Endpoint}></Input>

                <Input placeholder="email" onChange={(event) => { SetEmail(event.target.value) }} value={Email}></Input>
                <Input placeholder="username" onChange={(event) => { SetUsername(event.target.value) }} value={Username}></Input>
                <Input placeholder="password" onChange={(event) => { SetPassword(event.target.value) }} value={Password}></Input>
                <Input placeholder="business id" onChange={(event) => { SetID(event.target.value) }} value={ID}></Input>
                <Input placeholder="employee id" onChange={(event) => { SetEmpID(event.target.value) }} value={EmpID}></Input>

                <Button className="w-[100%]" onClick={()=>{Register(Email, Username, Password).then(res=>console.log(res))}}>Register</Button>
                <Button className="w-[100%]" onClick={()=>{Login(Email, Username, Password).then(res=>{console.log(console.log(res.data))})}}>Login</Button>
                
                <h1 className="font-bold">DASHBOARD</h1>
                <Button className="w-[100%]" disabled = {true} onClick={()=>{GetAllCurrentJobs(ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Get Current Jobs</Button>
                <Button className="w-[100%]" onClick={()=>{GetAllJobHistory(ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Get Job History</Button>
                <Button color="danger" className="w-[100%]" onClick={()=>{GetJobsForEmployee(ID, EmpID, localStorage["accessToken"]).then(res => console.log(res))}}>Get Jobs For Emp</Button>
                <Button></Button>


                <h1 className="font-bold">ACCOUNT</h1>
                <Button color="danger" className="w-[100%]" onClick={()=>{GetNumberOfOpenJobs(ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Get # Open Jobs</Button>
                <Button color="danger"className="w-[100%]" onClick={()=>{GetNumberOfTotalJobs(ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Get # Total Jobs</Button>


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
        localStorage["id"] = ID;
        localStorage["empid"] = EmpID;
    }

}

export default Debugger;