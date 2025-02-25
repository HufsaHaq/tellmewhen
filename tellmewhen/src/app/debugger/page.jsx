"use client";
import { Input, Button, FormLabel } from "@mui/joy";
import { useState, useEffect } from "react";
import { Register, Login } from "@/scripts/login";
import {
        GetAllJobHistory,
        GetCurrentJobsForEmployee
        } from "@/scripts/dashboard";

import { ChangeProfilePhoto, GetNumberOfOpenJobs,
        GetNumberOfTotalJobs, 
        GetProfileData} from "@/scripts/account";

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

                <FormLabel>Email</FormLabel>
                <Input id="email" placeholder="email" onChange={(event) => { SetEmail(event.target.value) }} value={Email}></Input>
                
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

                <Button color="neutral" className="w-[100%]" onClick={()=>{Register(Email, Username, Password).then(res=>console.log(res))}}>Register <h1 className="ml-[5px] italic font-bold">(Email, Business Name, Pasword)</h1></Button>
                <Button color="neutral" className="w-[100%]" onClick={()=>{Login(Email, Username, Password).then(res=>{console.log(console.log(res.data))})}}>Login <h1 className="ml-[5px] italic font-bold">(Email, Business Name, Pasword)</h1></Button>
                
                <h1 className="font-bold">DASHBOARD</h1>
                <Button className="w-[100%]" disabled = {true} onClick={()=>{GetAllCurrentJobs(ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Get All Current Jobs <h1 className="ml-[5px] italic font-bold">(Business ID, Token)</h1></Button>
                <Button className="w-[100%]" onClick={()=>{GetAllJobHistory(ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Get All Job History <h1 className="ml-[5px] italic font-bold">(Business ID, Token)</h1></Button>
                <Button color="primary" className="w-[100%]" onClick={()=>{GetCurrentJobsForEmployee(ID, EmpID, localStorage["accessToken"]).then(res => console.log(res))}}>Get Employee Current Jobs<h1 className="ml-[5px] italic font-bold">(Business ID, Employee ID, Token)</h1></Button>

                <h1 className="font-bold">ACCOUNT</h1>
                <Button color="primary" className="w-[100%]" onClick={()=>{GetNumberOfOpenJobs(ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Get No. Open Jobs <h1 className="ml-[5px] italic font-bold">(Business ID, Token)</h1></Button>
                <Button color="primary"className="w-[100%]" onClick={()=>{GetNumberOfTotalJobs(ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Get No. Total Jobs <h1 className="ml-[5px] italic font-bold">(Business ID, Token)</h1></Button>
                <Button color="danger" className="w-[100%]" onClick={()=>{DeleteBusiness(ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Delete Business <h1 className="ml-[5px] italic font-bold">(Business ID, Token)</h1></Button>
                <Button color="danger" className="w-[100%]" onClick={()=>{DeleteUser(ID, EmpID, localStorage["accessToken"]).then(res=>console.log(res))}}>Delete User <h1 className="ml-[5px] italic font-bold">(Business ID, Employee ID, Token)</h1></Button>
                <Button className="w-[100%]" onClick={()=>{GetProfileData(ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Get Business Details <h1 className="ml-[5px] italic font-bold">(Business ID, Token)</h1></Button>
                
                <hr/>
                <FormLabel>New Password</FormLabel>
                <Input id="newpasswordemp" placeholder="password" onChange={(event) => { SetNewPasswordEmployee(event.target.value) }} value={NewPasswordEmployee}></Input>
                <Button disabled={true} className="w-[100%]" onClick={()=>{return; ChangeEmployeePassword(ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Get Business Details <h1 className="ml-[5px] italic font-bold">(?)</h1></Button>
                
                <hr/>
                <FormLabel>New Business Name</FormLabel>
                <Input id="newname" placeholder="business name" onChange={(event) => { SetNewBusinessName(event.target.value) }} value={NewBusinessName}></Input>
                <Button className="w-[100%]" onClick={()=>{ChangeEmployeePassword(NewBusinessName, ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Change Business Name<h1 className="ml-[5px] italic font-bold">(Name, Business ID, Token)</h1></Button>
                
                <hr/>
                <FormLabel>Profile Photo (Base64)</FormLabel>
                <Input id="photo" placeholder="photo (base64)" onChange={(event) => { SetNewPhoto(event.target.value) }} value={NewPhoto}></Input>
                <Button className="w-[100%]" onClick={()=>{ChangeProfilePhoto(NewProilePhoto, ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Change Profile Photo<h1 className="ml-[5px] italic font-bold">(Photo, Business ID, Token)</h1></Button>
                
                <hr/>
                <FormLabel>Search Employee</FormLabel>
                <Input disabled={true} placeholder="employee name" onChange={(event) => { return;SetNewPhoto(event.target.value) }} value={""}></Input>
                <Button disabled={true} className="w-[100%]" onClick={()=>{return; ChangeProfilePhoto(NewProilePhoto, ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Search Employee<h1 className="ml-[5px] italic font-bold">(?)</h1></Button>
                
                <hr/>
                <FormLabel>Employee Name</FormLabel>
                <Input placeholder="employee name" onChange={(event) => { SetNewEmployeeName(event.target.value) }} ></Input>
                <FormLabel>Email</FormLabel>
                <Input placeholder="email" onChange={(event) => { SetNewPhoto(event.target.value) }}></Input>
                <FormLabel>Password</FormLabel>
                <Input placeholder="password" onChange={(event) => { return;SetNewPhoto(event.target.value) }} value={""}></Input>
                <FormLabel>Privilege</FormLabel>
                <Input type="number" placeholder="password" onChange={(event) => { return;SetNewPhoto(event.target.value) }} value={""}></Input>
                <Button className="w-[100%]" onClick={()=>{return; ChangeProfilePhoto(NewProilePhoto, ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Create New Employee<h1 className="ml-[5px] italic font-bold">(Name, Email, Password, Privilege, Business ID, Token)</h1></Button>
                <hr/>

                <h1 className="font-bold">QR CODE</h1>
                <FormLabel>URL</FormLabel>
                <Input id="qrurl" placeholder="qr url" onChange={(event) => { SetQRURL(event.target.value) }} value={QRURL}></Input>
                <Button disabled={true} className="w-[100%]" onClick={()=>{return; GetProfileData(ID, localStorage["accessToken"]).then(res=>console.log(res))}}>Get QR Code <h1 className="ml-[5px] italic font-bold">(URL, Token)</h1></Button>

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