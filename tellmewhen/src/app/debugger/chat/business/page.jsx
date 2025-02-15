"use client";

import { useState } from "react";
import { LogIn } from "@/scripts/chat";
import { ChatComponent } from "@/components/ChatComponent";
import { useEffect } from "react";
export default function Page() {

    const [id, SetID] = useState(typeof window === undefined ? "" : localStorage["adminID"]);
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(null);
    const [data, setData] = useState(null);
    useEffect(() => {
        async function fetchData(){
        SetID(localStorage["adminID"]);
        let res = await LogIn(id);
        if (res.status === 200) {
            setUserData(res.data.user);
            setToken(res.data.token);
            setData(res.data);
        }}
        fetchData();
    }, []);

    if(data == null) return <h1>Loading...</h1>
    return (
        <>
            <div className="w-[100%]">
                <span className={`px-[25px] z-10 transition ease-in-out sticky top-[15px] bg-[rgba(233,233,233,1)] border-[1px] mb-[10px] border-[#A0A0A0] w-[98%] m-auto rounded-lg shadow-lg flex mt-[20px] justify-between items-center h-[60px]`}>
                    <h1 className="font-semibold tablet620:text-[20px]">Username: {userData.username}</h1>
                    <h1 className="font-semibold tablet620:text-[20px]">ID: {userData.id}</h1>
                </span>
                <ChatComponent className="h-[100vh]" data={data}></ChatComponent>
            </div>

        </>
    )
}