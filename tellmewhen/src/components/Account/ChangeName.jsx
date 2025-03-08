import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";

function ChangeName({ isOpen, businessName, errorMessage, onClose, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempBusinessName, setTempBusinessName] = useState(businessName);

    useEffect(() => {
        if (isOpen) {
            setIsEditing(false);
        }
        setTempBusinessName(businessName);
    }, [isOpen, businessName]);

    if (!isOpen) return null;

    const handleChange = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        onSave(tempBusinessName);
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white max-h-[95vh] overflow-y-scroll max-tablet620:w-full min-w-[33%] max-w-[90%] rounded-lg shadow-lg p-6">
                <h2 className="text-center text-2xl font-semibold mb-6">
                    {isEditing ? "Edit Business Name" : "Business Name"}
                </h2>

                <form>
                    {/* Business Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Business Name:
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            placeholder="Enter New Business Name"
                            value={tempBusinessName}
                            disabled={!isEditing}
                            onChange={(e) =>
                                setTempBusinessName(e.target.value)
                            }
                        />
                        {errorMessage && (
                            <div className="text-red-500 text-sm mt-2">
                                {errorMessage}
                            </div>
                        )}
                    </div>

                    <div className="max-tablet620:grid max-tablet620:grid-cols-1 tablet620:flex tablet620:justify-end tablet620:space-x-4 max-tablet620:gap-2">
                        <Button
                            onClick={onClose}
                            variant="soft"
                            color="neutral"
                            className="row-start-2 min-w-[100px] max-tablet620:w-full px-4 py-2"
                        >
                            Close
                        </Button>
                        {!isEditing && (
                            <div className="space-x-3">
                                <Button
                                    onClick={handleChange}
                                    variant="solid"
                                    color="primary"
                                    className="max-tablet620:w-full min-w-[100px] px-4 py-2"
                                >
                                    Edit Name
                                </Button>
                            </div>
                        )}

                        {isEditing && (
                            <div className="">
                                <Button
                                    onClick={handleSave}
                                    variant="solid"
                                    color="primary"
                                    className="max-tablet620:w-full min-w-[100px] px-4 py-2"
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangeName;
