'use client'
import { useState, useEffect } from 'react';
import Header from "@/components/Header"
function Page()
{
    const [text, setText] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const fetchData = async () =>{
        //fetching and setting the requirede data
    };

    useEffect(() => {
        fetchData();
    }, []);

    return(
        <div className = "min-h-screen flex flex-col pt-20 pb-8">
            <div className="flex flex-col items-center justify-start mt-12">
            {/*Notification*/}
                <div className="text">
                    <p className="font-bold text-3xl txt-black-500 mr-[1000px] mt-[20px]">NOTIFICATIONS</p>
                </div>
            {/*notification text*/}
                <div className="w-[570px] h-[100px] border-4 border-gray-300 mr-[700px] rounded-[15px] shadow-[0_0_10px_rgba(25,31,52,0.5)]  mt-[5px] p-3 text-left break-words overflow-auto">{text}
                </div>
            {/*radio button*/}
            <div className="mt-[50px] flex items-center space-x-4 mr-[800px]">
                    <p className="font-semibold text-3xl">Enable Notifications:</p>
                    <label className="flex items-center space-x-2 text-3xl cursor-pointer">
                        <input
                            type="radio"
                            name="notifications"
                            value="on"
                            checked={notificationsEnabled}
                            onChange={() => setNotificationsEnabled(true)}
                        />
                        <span>On</span>
                    </label>
                    <label className="flex items-center space-x-2 text-3xl cursor-pointer">
                        <input
                            type="radio"
                            name="notifications"
                            value="off"
                            checked={!notificationsEnabled}
                            onChange={() => setNotificationsEnabled(false)}
                        />
                        <span>Off</span>
                    </label>
                </div>

            {/*Details*/}
                <div className = "text1">
                    <p className = "font-bold text-3xl txt-black-500 mr-[1100px] mt-[100px]">DETAILS</p>
                </div>
                {/*business details*/}
                <div className="w-[1270px] h-[150px] border-4 border-gray-300 rounded-[15px] shadow-[0_0_10px_rgba(25,31,52,0.5)] mt-[5px] p-3 text-left break-words overflow-auto">
                    <div className=" flex mb-1">
                        <p className="font-semibold txt-black-500">Business:     </p>
                        <p className="txt-black-500 ml-2">{businessName}</p>
                    </div>
                    <div className=" flex mb-1">
                        <p className="font-semibold txt-black-500">Job Description:     </p>
                        <p className="txt-black-500 ml-2">{jobDescription}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;