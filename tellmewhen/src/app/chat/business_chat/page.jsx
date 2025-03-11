"use client";

import { useState, useEffect } from "react";
import { LogIn } from "@/scripts/chat";
import { useMediaQuery } from "react-responsive";
import { BusinessChatComponent } from "@/components/BusinessChatComponent";

export default function Page() {
    const [id, setID] = useState("");
    const [userData, setUserData] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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
            {/* Chat area */}
            <div className="" style={style.container}>
                <BusinessChatComponent data={data} isMobile={isMobile} />
            </div>
        </div>
    );
}
const style = {
    container: {
        height: "calc(100vh - 85px)",
    }
}
