'use client'
import { Button } from "@mui/joy"
import React from "react"
import Header from "@/components/Header";
import DashboardButton from "@/components/Dashboard";
function Page()
{

    return (
    	<div className = "page container flex flex-col h-full pt-20 pb-8">
        {/*Text*/}
            <div className="text-center mb-4">
                <p className="font-semibold px-8 py-2 bg-gray-200 txt-black-500 inline-block rounded-[15px] border-4 border-gray-400
                 rounded-[15px] shadow-[0_0_10px_rgba(25,31,52,0.5)] ml-[205px] mb-[40px]">Scan to Receive Notifications</p>
            </div>
    	{/* DashboardButton */}
                <div className="flex item-center justify-center mt-auto ml-[205px]">
                    <DashboardButton />
                </div>
        </div>
    );
}

export default Page;