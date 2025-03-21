"use client";

import PageLoad from "@/components/PageLoad";
import { useEffect } from "react";
export default function Page()
{
    useEffect(() => {

            window.location.href = "/customer_view/" + localStorage["encryptedJobID"]
        
    }, [])
    return <PageLoad></PageLoad>
}