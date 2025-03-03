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
                <div className="w-[100%]">
                    <span className={`px-[25px] z-10 transition ease-in-out sticky top-[15px] bg-[rgba(233,233,233,1)] border-[1px] mb-[10px] border-[#A0A0A0] w-[98%] m-auto rounded-lg shadow-lg flex mt-[20px] justify-between items-center h-[60px]`}>
                        <h1 className="font-semibold tablet620:text-[20px]">Username: {userData.username}</h1>
                        <h1 className="font-semibold tablet620:text-[20px]">ID: {userData.id}</h1>
                        <button
                            className="bg-[#0A5397] px-[30px] py-[7px] text-white text-[17px] font-semibold rounded-md"
                            onClick={() => {
                                setUserData(null)
                                setToken(null);
                            }}
                        >
                            Change User
                        </button>
                    </span>
                    <ClientChatComponent data={data}></ClientChatComponent>
                </div>
            }
        </>
    )
}