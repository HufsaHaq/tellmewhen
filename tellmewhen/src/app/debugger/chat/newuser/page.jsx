"use client";

import { useState } from "react";
import { NewUser } from "../../../../scripts/chat";
export default function Page()
{
    const [username, SetUserName] = useState("");
    const [id, SetID] = useState("");

    function HandleSave(){
        NewUser(username, id);
    }

    return(
        <div className="space-y-[10px] px-[10px] mx-auto py-[10px] rounded-md shadow-lg mt-[35px] max-tablet620:w-[95%] tablet620:w-[50%] bg-white">
            <h1 className="w-[100%] font-semibold text-[30px]">Create User</h1>
            <input onChange={(e)=>{SetUserName(e.target.value)}} value={username} type="text" placeholder="Username" className="px-[5px] w-[100%] h-[35px] outline outline-[1px]"></input>
            <input onChange={(e)=>{SetID(e.target.value)}} value={id} type="text" placeholder = "User ID" className="px-[5px] w-[100%] h-[35px] outline outline-[1px]"></input>
            <button onClick={()=>{HandleSave()}} className="bottom-[10px]  font-semibold text-white w-[100%] h-[45px] mx-auto bg-[#0A5397]">Create</button>
        </div>
    )
}