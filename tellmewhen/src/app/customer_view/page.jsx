"use client";

import PageLoad from "@/components/PageLoad";
import { useEffect } from "react";
export default function Page()
{

            window.location.href = "/customer_view/" + localStorage["encryptedJobID"]

    return <PageLoad></PageLoad>
}