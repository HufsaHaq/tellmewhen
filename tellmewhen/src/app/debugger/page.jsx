"use client";
import { NotifyCustomer } from "@/scripts/webpush";
import { Input, Button, FormLabel } from "@mui/joy";
import { useState, useEffect } from "react";



function Debugger() {
    const [Endpoint, SetEndPoint] = useState("");
    const [jobID, setJobID] = useState("");

    useEffect(() => {
        if(typeof window === "undefined") return;
        SetEndPoint(localStorage["endpoint"] || "");

    }, []);
    return (
        <>
        <span className="max-w-[1000px] mx-auto mt-[10px] justify-center tablet1080:space-x-[25px] tablet1080:inline max-tablet1080:space-y-[15px] tablet1080:flex">
            <div className="mb-[90px] space-y-[10px] mx-auto px-[20px] w-[90%] rounded-md py-[25px] bg-white shadow-lg">
                <h1 className="font-bold">ENDPOINT TESTING</h1>
                <h1>The output of these actions are inside of the console</h1>

                <h1 className="font-semibold text-[#FF0000]">THIS HAS BEEN MOVED TO THE FOLDER: "scripts/script-settings.js"</h1>
                <Input readOnly disabled id="endpoint" placeholder="endpoint" onChange={(event) => { SetEndPoint(event.target.value) }} value={Endpoint}></Input>
                <br className="mx-[20px]"/>
                <Input placeholder="Job ID" onChange={(event) => { setJobID(event.target.value) }} value={jobID}></Input>

                <Button className="w-full" onClick={() => { NotifyCustomer(jobID, null, null) }}>Notify</Button>
                
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
    }

}

export default Debugger;