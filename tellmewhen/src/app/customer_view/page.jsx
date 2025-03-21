"use client";

import PageLoad from "@/components/PageLoad";
import { useEffect } from "react";
export default function Page()
{
    useEffect(() => {
        if(localStorage["encryptedJobID"] == "undefined"  || localStorage["encryptedJobID"] === undefined)
        {
            window.location.href = "/"

        }
        else{
            window.location.href = "/customer_view/" + localStorage["encryptedJobID"]
        }
    }, [])
    return <PageLoad></PageLoad>
}