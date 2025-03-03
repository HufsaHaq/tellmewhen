"use client";

import { useState, useEffect } from "react";
import { LogIn } from "@/scripts/chat";
import { BusinessChatComponent } from "@/components/BusinessChatComponent";

export default function Page() {
    const [id, setID] = useState("");
    const [userData, setUserData] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            // Make sure localStorage is accessible:
            const storedID = typeof window !== "undefined" ? localStorage["adminID"] : "";
            setID(storedID);

            // Attempt login using that ID
            const res = await LogIn(storedID);
            if (res.status === 200) {
                setUserData(res.data.user);
                setData(res.data);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <h1>Loading...</h1>;

    if (!data) {
        return <h1>Error: Could not load user or token</h1>;
    }

    return (
        <div className="w-full h-screen flex flex-col">
            {/* Top header bar */}
            <div
                className={`
          sticky top-0 z-10
          bg-[rgba(233,233,233,1)]
          border-b border-gray-400
          px-6 py-3
          flex justify-between items-center
        `}
            >
                <h1 className="font-semibold">Username: {userData.username}</h1>
                <h1 className="font-semibold">ID: {userData.id}</h1>
            </div>

            {/* Chat area */}
            <div className="flex-1">
                <BusinessChatComponent data={data} />
            </div>
        </div>
    );
}
