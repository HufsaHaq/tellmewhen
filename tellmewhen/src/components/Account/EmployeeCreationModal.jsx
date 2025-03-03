"use client";
import React, { useState } from "react";
import { Button, Select, Option } from "@mui/joy";

/**
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - onConfirm: function(newEmployeeArray) => void
 *  - existingEmployees: array of employee objects
 */
const EmployeeCreationModal = ({ isOpen, onClose, onConfirm, existingEmployees }) => {
    if (!isOpen) return null;

    const [name, setName] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [role, setRole] = useState("");

    // Validate Name (Only Letters)
    const isValidName = /^[a-zA-Z\s]+$/.test(name) || name === "";

    const handleCreate = () => {
        // Check if ID is unique
        const isDuplicateId = existingEmployees.some(emp => emp[1] === employeeId);

        if (isDuplicateId) {
            alert("Employee ID must be unique.");
            return;
        }

        if (!isValidName) {
            alert("Name should contain only letters.");
            return;
        }

        // Create and pass the new employee array
        const newEmployee = [name, employeeId, role];
        onConfirm(newEmployee);

        // Reset fields
        setName("");
        setEmployeeId("");
        setRole("");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white max-h-[95vh] overflow-y-scroll max-tablet620:w-full min-w-[33%] max-w-[90%] rounded-lg shadow-lg p-6">
                <h2 className="text-center text-2xl font-semibold mb-6">Create Employee</h2>

                {/* Name Input */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter employee name"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {!isValidName && <p className="text-red-500 text-sm">Only letters are allowed.</p>}
                </div>

                {/* Employee ID Input */}
                <div className="mb-4">
                    <label htmlFor="employeeId" className="block text-gray-700 font-medium mb-2">
                        Employee ID:
                    </label>
                    <input
                        type="text"
                        id="employeeId"
                        placeholder="Enter employee ID"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                    />
                    {!employeeId && <p className="text-red-500 text-sm">Employee ID is required.</p>}
                </div>

                {/* Role Selection (Dropdown) */}
                <div className="mb-6">
                    <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                        Role:
                    </label>
                    <Select
                        id="role"
                        placeholder="Select role"
                        className="w-full"
                        value={role}
                        onChange={(event, newValue) => setRole(newValue)}
                    >
                        <Option value="Employee">Employee</Option>
                        <Option value="Manager">Manager</Option>
                        <Option value="Admin">Admin</Option>
                    </Select>
                </div>

                <div className="max-tablet620:grid max-tablet620:grid-cols-1 tablet620:flex tablet620:justify-end tablet620:space-x-4 max-tablet620:gap-2">
                    <Button
                        onClick={onClose}
                        variant="soft"
                        color="neutral"
                        className="row-start-2 min-w-[100px] px-4 py-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        variant="solid"
                        color="primary"
                        className="px-4 min-w-[100px] py-2"
                        disabled={!name || !employeeId || !role}
                    >
                        Create Employee
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeCreationModal;
