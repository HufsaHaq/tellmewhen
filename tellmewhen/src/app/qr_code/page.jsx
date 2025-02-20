'use client'
import { Button } from "@mui/joy"
import React, { useState, useEffect } from "react"
import Header from "@/components/Header";
import DashboardButton from "@/components/Dashboard";
import { GetCode } from "@/scripts/qr";

function Page() {
    const [qrCode, getQrCode] = useState(" ");
    const [error, setError] = useState(null);
    
    const fetchQRCode = async () =>{
        //fetching and setting the qr code string
        try {
            const jobID = "job-id"; // Replace this with the actual jobID
            const qrCodeBase64 = await GetCode(jobID); 
            getQrCode(qrCodeBase64);
            setError(null);
        } catch (error) {
            // console.error("Error fetching QR code:", error);
            setError("Failed to fetch QR code. Please try again later.");
        }
        
    };

    useEffect(() => {
        fetchQRCode();
    }, []);

    return (
        <div className="min-h-screen flex flex-col pt-20 pb-8">
            <div className="flex flex-col items-center justify-start mt-8">
                {error && (
                <div className="text-red-500 text-3xl font-semibold mb-4">
                    {error}
                </div>
                )}
                {/* QR Code */}
                <div className="text-center mb-4">
                    <img 
                        src={qrCode}
                        alt="QR Code"
                        className="mx-auto w-[80vw] max-w-[400px] h-auto border-4 border-gray-300 rounded-[15px] shadow-[0_0_10px_rgba(25,31,52,0.5)] mb-[50px]"
                    />
                </div>

                {/* Text */}
                <div className="text-center mb-4">
                    <p className="font-semibold text-2xl px-8 py-2 bg-gray-200 txt-black-500 inline-block rounded-[15px] border-4 border-gray-400
                     rounded-[15px] shadow-[0_0_10px_rgba(25,31,52,0.5)] mb-[40px]">
                        Scan to Receive Notifications
                    </p>
                </div>

                {/* DashboardButton */}
                <div className="flex item-center justify-center mb-10">
                    <DashboardButton />
                </div>
            </div>
        </div>
    );
}

export default Page;


