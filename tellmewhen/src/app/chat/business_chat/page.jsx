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
        <div className="!overflow-y-hidden w-full flex flex-col">
            {/* Top header bar */}

            {/* Chat area */}
            <div className="" style={style.container}>
                <BusinessChatComponent data={data} />
            </div>
        </div>
    );
}
const style = {
    container: {
        height: "calc(100vh - 85px)",
    }
}
