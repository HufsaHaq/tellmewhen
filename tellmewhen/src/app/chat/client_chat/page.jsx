"use client";

import { useState } from "react";
import { LogIn } from "@/scripts/chat";
import { ClientChatComponent } from "@/components/ClientChatComponent";
export default function Page() {

    const [id, SetID] = useState("");
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(null);
    const [data, setData]  =useState(null);
    async function HandleSave() {
        let res = await LogIn(id);
        if (res.status === 200) {
            setUserData(res.data.user);
            setToken(res.data.token);
            setData(res.data);
        }
    }

    return (
        <>
            {id == null || userData == null ?
                <div className="space-y-[10px] px-[10px] mx-auto py-[10px] rounded-md shadow-lg mt-[35px] max-tablet620:w-[95%] tablet620:w-[50%] bg-white">
                    <h1 className="w-[100%] font-semibold text-[30px]">Login</h1>
                    <input onChange={(e) => { SetID(e.target.value) }} value={id} type="text" placeholder="User ID" className="px-[5px] w-[100%] h-[35px] outline outline-[1px]"></input>
                    <button onClick={() => { HandleSave() }} className="bottom-[10px]  font-semibold text-white w-[100%] h-[45px] mx-auto bg-[#0A5397]">Create</button>
                </div>
                :
                <div className="!overflow-y-hidden w-full flex flex-col">
                    
                    <div style = {style.container}>
                    <ClientChatComponent data={data}></ClientChatComponent>
                    </div>

                </div>
            }
        </>
    )
}

const style = {
    container: {
        height: "calc(100vh - 85px)",
    }
}