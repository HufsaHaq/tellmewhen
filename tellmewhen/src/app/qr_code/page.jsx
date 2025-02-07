'use client'
import { Button } from "@mui/joy"
import React, { useState, useEffect } from "react"
import Header from "@/components/Header";
import DashboardButton from "@/components/Dashboard";

function Page() {
    const [qrCode, getQrCode] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOMSURBVO3BQa7cVgADweaD7n/ljhdZcCVA0Mx37LAq/sLMvw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPl4qUk/CSVloSm0pLQVFoS7qi0JNxRaUn4SSpvHGbKYaYcZsrFh6l8UhLuqLyh8oTKGyqflIRPOsyUw0w5zJSLL0vCEypPJKGp3EnCGyotCU3liSQ8ofJNh5lymCmHmXLxh1N5QuWNJPzNDjPlMFMOM+Xify4Jd1SaSkvC3+QwUw4z5TBTLr5M5ZuS0FSeUHlD5Q2V/5LDTDnMlMNMufiwJPxJktBUWhKaSktCU7mThP+yw0w5zJTDTLl4SeV3Urmj0pLQVL5J5U9ymCmHmXKYKRcvJaGptCQ0lSeScEflThI+KQlN5YkkNJU7SWgqLQlN5Y3DTDnMlMNMufiwJDSVJ5LQVJ5IQlN5IglNpSWhJaGptCQ8kYSm0pLwTYeZcpgph5ly8ZJKS0JLQlN5IglN5YkkNJWWhDdUWhLuqDyRhKbSkvBJh5lymCmHmXLxmyXhjsoTKi0JT6h8UxKeULmj8kmHmXKYKYeZcvFhKi0JbyShqbQkNJU3kvCGSkvCHZU3ktBU3jjMlMNMOcyUi99M5YkkfJPKnSS0JDSVb0rCNx1mymGmHGbKxUtJuKPSkvCGSkvCHZUnkvCESkvCE0l4QqUl4ZMOM+UwUw4zJf7CD0pCU3kiCU2lJaGptCTcUbmThCdUWhLuqPxOh5lymCmHmXLxUhK+KQlNpSWhqbQkNJU7Sbij0pJwJwmflISm8kmHmXKYKYeZcvGSyjep/E4qT6g8kYQ7SWgqLQlN5Y3DTDnMlMNMuXgpCT9J5U4SmkpLQlNpKp+UhKZyJwlN5ScdZsphphxmysWHqXxSEu6otCTcUbmThKbSkvCEyhMqd5LQVD7pMFMOM+UwUy6+LAlPqHxSEn5SEt5IQlO5k4Sm8sZhphxmymGmXPzlVO4koancUbmThKZyJwl3knBH5ZMOM+UwUw4z5eIPl4Sm0pLQVO4k4QmVT1K5k4SWhKbyxmGmHGbKYaZcfJnKN6m0JDSVloQ7Ki0JTaUl4U4SPknlmw4z5TBTDjPl4sOS8JOS0FRaEprKnSR8k8qdJDSVO0loKm8cZsphphxmSvyFmX8dZsphphxmymGmHGbKYaYcZsphphxmymGmHGbKYaYcZsphphxmyj9erIcnY1eO7gAAAABJRU5ErkJggg==");

    const fetchQRCode = async () =>{
        //fetching and setting the qr code string
    };

    useEffect(() => {
        fetchQRCode();
    }, []);

    return (
        <div className="min-h-screen flex flex-col pt-20 pb-8">
            <div className="flex flex-col items-center justify-start mt-8">
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
