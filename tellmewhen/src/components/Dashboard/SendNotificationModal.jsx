import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";
import { NotifyCustomer } from "@/scripts/webpush";

function NotificationModal({ isOpen, jobID, close }) {

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [errorEnabled, setErrorEnabled] = useState(false)
    async function sendNotification()
    {
        let res = await NotifyCustomer(jobID, title, body).catch(err => setErrorEnabled(true));
        console.log(res)
        if (res.status === 200)
        {
            close();
            return
        }
        setErrorEnabled(true)
    }
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 items-center flex justify-center z-50">
            <div className="bg-white max-h-[95vh] overflow-y-scroll max-tablet620:w-full min-w-[33%] w-auto max-w-[90%] rounded-lg shadow-lg p-6">
                <h2 className="text-center text-2xl font-semibold mb-6">Send Notification</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Title:
                    </label>
                    <input
                        type="text"
                        className="w-full p-3 border rounded-lg disabled:bg-gray-100"
                        value={title || ""}
                        onChange={(e) => { setTitle(e.target.value); }}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Body:
                    </label>
                    <textarea
                        className="w-full p-3 border rounded-lg focus:outline-none
                         focus:ring-2 focus:ring-blue-500 resize-y
                         overflow-auto max-h-40 disabled:bg-gray-100"
                        rows={5}
                        value={body || ""}
                        onChange={(e) => { setBody(e.target.value); }}
                    />
                </div>
                {errorEnabled && <h1 className="text-red-500 text-sm my-2">An error occured whilst sending the notification</h1>}
                <div className="max-tablet620:grid max-tablet620:grid-cols-1 tablet620:flex tablet620:justify-end tablet620:space-x-4 max-tablet620:gap-2">
                    <Button
                        onClick={close}
                        variant="soft"
                        color="neutral"
                        className="row-start-2 max-tablet620:w-full min-w-[100px] px-4 py-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={()=>sendNotification()}
                        variant="solid"
                        color="primary"
                        className="max-tablet620:w-full min-w-[100px] px-4 py-2"
                    >
                        Send
                    </Button>
                </div>

            </div>
        </div>
    );
}

export default NotificationModal;
