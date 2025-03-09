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
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [role, setRole] = useState("");

    const PrivilegeLookup = {
        "Admin": 1,
        "Manager": 2,
        "Employee": 3,
    }
    // Validate Name (Only Letters)
    const isValidName = name === "";

    const handleCreate = () => {
        // Check if ID is unique
        /*const isDuplicateId = existingEmployees.some(emp => emp[1] === password);

        if (isDuplicateId) {
            alert("Employee ID must be unique.");
            return;
        }

        if (!isValidName) {
            alert("Name should contain only letters.");
            return;
        }*/

        if(password1 === "" || password2 === "" || password1 !== password2)
        {
            alert("Invalid Password");
            return
        }
        if(name === "")
        {
            alert("Username must not blank");
            return
        }
        console.log(role)
        if(role != "Admin" && role != "Manager" && role != "Employee")
        {
            alert("Invalid Privileges")
            return
        }
        let privilegelvl = PrivilegeLookup[role];
        // Create and pass the new employee array
        const newEmployee = [name, password1, privilegelvl];
        onConfirm(newEmployee);

        // Reset fields
        setName("");
        setPassword1("");
        setPassword2("");
        setRole("");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white max-h-[95vh] overflow-y-scroll max-tablet620:w-full min-w-[33%] max-w-[90%] rounded-lg shadow-lg p-6">
                <h2 className="text-center text-2xl font-semibold mb-6">Create Employee</h2>

                {/* Name Input */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter username"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {name==="" && <p className="text-red-500 text-sm">Username cannot be blank.</p>}
                </div>

                {/* Employee ID Input */}
                <div className="mb-4 space-y-3">
                    <label htmlFor="password1" className="block text-gray-700 font-medium mb-2">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password1"
                        placeholder="Enter Password"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                    />
                    <input
                        type="password"
                        id="password2"
                        placeholder="Confirm Password"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                    {(password1 !== password2) && password1 !== "" && <p className="text-red-500 text-sm">Passwords do not match</p>}
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
                        disabled={!name || !password1 || !password2 || !role || (password1 !== password2)}
                    >
                        Create Employee
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeCreationModal;
