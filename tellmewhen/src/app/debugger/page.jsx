"use client";
import { Input, Button, FormLabel } from "@mui/joy";
import { useState, useEffect } from "react";
import { Register, Login, HandleUnauthorised } from "@/scripts/login";

function Debugger() {
    const [Endpoint, SetEndPoint] = useState("");
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");
    const [Username, SetUsername] = useState("");
    const [ID, SetID] = useState("");
    const [EmpID, SetEmpID] = useState("");
    const [QRURL, SetQRURL] = useState("");
    const [NewPasswordEmployee, SetNewPasswordEmployee] = useState("");
    const [NewBusinessName, SetNewBusinessName] = useState("");
    const [NewPhoto, SetNewPhoto] = useState("");

    const [NewEmployeeName, SetNewEmployeeName] = useState("");
    const [NewEmployeeEmail, SetNewEmployeeEmail] = useState("");
    const [NewEmployeePassword, SetNewEmployeePassword] = useState("");
    const [NewEmployeePrivilege, SetNewEmployeePrivilege] = useState("");


    useEffect(() => {
        if(typeof window === "undefined") return;
        SetEndPoint(localStorage["endpoint"] || "");
        SetEmail(localStorage["email"] || "");
        SetUsername(localStorage["username"] || "");
        SetPassword(localStorage["password"] || "");
        SetID(localStorage["id"] || "");
        SetEmpID(localStorage["empid"] || "");

    }, []);
    return (
        <>
        <span className="max-w-[1000px] mx-auto mt-[10px] justify-center tablet1080:space-x-[25px] tablet1080:inline max-tablet1080:space-y-[15px] tablet1080:flex">
            <div className="mb-[90px] space-y-[10px] mx-auto px-[20px] w-[90%] rounded-md py-[10px] bg-white shadow-lg">
                <h1 className="font-bold">ENDPOINT TESTING</h1>
                <h1>The output of these actions are inside of the console</h1>

                <FormLabel>Server Endpoint</FormLabel>
                <Input id="endpoint" placeholder="endpoint" onChange={(event) => { SetEndPoint(event.target.value) }} value={Endpoint}></Input>

                <FormLabel>Username</FormLabel>
                <Input id="username" placeholder="username" onChange={(event) => { SetEmail(event.target.value) }} value={Email}></Input>
                
                <FormLabel>Business Name</FormLabel>
                <Input id="username" placeholder="business name" onChange={(event) => { SetUsername(event.target.value) }} value={Username}></Input>
                
                <FormLabel>Password</FormLabel>
                <Input id="password" placeholder="password" onChange={(event) => { SetPassword(event.target.value) }} value={Password}></Input>
                
                <FormLabel>Business ID</FormLabel>
                <Input id="bid" placeholder="business id" onChange={(event) => { SetID(event.target.value) }} value={ID}></Input>
                
                <FormLabel>Employee ID</FormLabel>
                <Input id = "eid"placeholder="employee id" onChange={(event) => { SetEmpID(event.target.value) }} value={EmpID}></Input>
                <hr/>
                <h1 className="mt-[10px] font-bold">AUTH</h1>

                <Button color="neutral" className="w-[100%]" onClick={()=>{Register(Username, Password).then(res=>console.log(res))}}>Register <h1 className="ml-[5px] italic font-bold">(Email, Business Name, Pasword)</h1></Button>
                <Button color="neutral" className="w-[100%]" onClick={()=>{Login(Email, Username, Password).then(res=>{console.log(console.log(res.data))})}}>Login <h1 className="ml-[5px] italic font-bold">(Email, Business Name, Pasword)</h1></Button>
                <Button color="neutral" className="w-[100%]" onClick={()=>{console.log(HandleUnauthorised(Email, Username, Password))}}>Refresh</Button>

            </div>
        </span>

        <div className="justify-center bottom-[25px] fixed ml-[50%] translate-x-[-50%]">
            <Button className="text-[50px] shadow-lg outline outline-[#074682] outline-[2px]" onClick={SaveResultsToLocal}>Save to Local Storage</Button>
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