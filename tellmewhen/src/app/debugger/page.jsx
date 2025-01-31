"use client";
import {Input, Button} from "@mui/joy";
import { useState } from "react";
function Debugger()
{
    const [Endpoint, SetEndPoint] = useState(localStorage["endpoint"]);
    return(
        <>
        <div className="ml-[20px] mt-[20px]">
            <span className="inline flex">
                <h1 className="mr-[10px]">Endpoint URL base: </h1>
                <Input onChange={(event) => {SetEndPoint(event.target.value)}} value={Endpoint}></Input>
                <h1 className="ml-[10px]">Stored at "endpoint"</h1>
            </span>
            <Button className="" onClick={SaveResultsToLocal}>Submit to Cache</Button>
        </div>
        
        </>

    );
    function SaveResultsToLocal()
    {
        localStorage["endpoint"] = Endpoint;
    }

}

export default Debugger;