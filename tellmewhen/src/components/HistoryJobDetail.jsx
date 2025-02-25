import React from "react";
import { Button } from "@mui/joy";

const HistoryJobDetailModal = ({ isOpen, jobData, onClose }) => {
    if (!isOpen) return null;

    const { id, userId, remarks, completionDate, worker } = jobData;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-1/3 rounded-lg shadow-lg p-6">
                <h2 className="text-center text-2xl font-semibold mb-6">Job Details</h2>
                <div className="mb-4">
                    <p className="text-gray-700 font-medium">Job ID:</p>
                    <p className="p-3 border rounded-lg bg-gray-100">{id}</p>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 font-medium">User ID:</p>
                    <p className="p-3 border rounded-lg bg-gray-100">{userId}</p>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 font-medium">Worker Name:</p>
                    <p className="p-3 border rounded-lg bg-gray-100">{worker}</p>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 font-medium">Remarks:</p>
                    <p className="p-3 border rounded-lg bg-gray-100">{remarks}</p>
                </div>
                <div className="mb-6">
                    <p className="text-gray-700 font-medium">Completion Date:</p>
                    <p className="p-3 border rounded-lg bg-gray-100">{completionDate}</p>
                </div>
                <div className="flex justify-end">
                    <Button onClick={onClose} variant="soft" color="neutral">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HistoryJobDetailModal;
