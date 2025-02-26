"use client";
import React, { useState, useEffect } from "react";
import { Button, Select, Option } from "@mui/joy";

function EmployeeDetailsModal({ isOpen, employeeData, onClose, onConfirm }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempData, setTempData] = useState(employeeData);

    useEffect(() => {
        setTempData(employeeData);
    }, [employeeData]);

    if (!isOpen) return null;

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Validate Name (Only Letters)
        if (!/^[a-zA-Z\s]+$/.test(tempData.name)) {
            alert("Name should contain only letters.");
            return;
        }

        onConfirm(tempData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempData(employeeData);
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white max-tablet620:w-full min-w-[33%] max-w-[90%] rounded-lg shadow-lg p-6">
                <h2 className="text-center text-2xl font-semibold mb-6">
                    {isEditing ? "Edit Employee" : "Employee Details"}
                </h2>

                <form>
                    {/* Employee ID (Uneditable) */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Employee ID:
                        </label>
                        <input
                            type="text"
                            readOnly
                            className="w-full p-3 border rounded-lg disabled:bg-gray-100 cursor-not-allowed"
                            value={tempData.id || ""}
                        />
                    </div>

                    {/* Name Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Name:
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            disabled={!isEditing}
                            value={tempData.name || ""}
                            onChange={(e) =>
                                setTempData((prev) => ({ ...prev, name: e.target.value }))
                            }
                        />
                    </div>

                    {/* Role Selection (Dropdown) */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Role:
                        </label>
                        <Select
                            id="role"
                            disabled={!isEditing}
                            placeholder="Select role"
                            className="w-full"
                            value={tempData.role || ""}
                            onChange={(event, newValue) =>
                                setTempData((prev) => ({ ...prev, role: newValue }))
                            }
                        >
                            <Option value="Employee">Employee</Option>
                            <Option value="Manager">Manager</Option>
                            <Option value="Admin">Admin</Option>
                        </Select>
                    </div>

                    <div className="flex justify-between">
                        {!isEditing ? (
                            <>
                                <Button
                                    onClick={onClose}
                                    variant="soft"
                                    color="neutral"
                                    className="px-4 py-2"
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={handleEdit}
                                    variant="solid"
                                    color="primary"
                                    className="px-4 py-2"
                                >
                                    Edit
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleCancel}
                                    variant="soft"
                                    color="neutral"
                                    className="px-4 py-2"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    variant="solid"
                                    color="primary"
                                    className="px-4 py-2"
                                >
                                    Save
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmployeeDetailsModal;
