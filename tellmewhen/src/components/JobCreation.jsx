import React from "react";
import { Button } from "@mui/joy";

const JobModal = ({ isOpen, onClose, onConfirm, formData, onInputChange }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-1/3 rounded-lg shadow-lg p-6">
                <h2 className="text-center text-2xl font-semibold mb-6">Create a job</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                            Description:
                        </label>
                        <textarea id="description" name="description" placeholder="Enter job description" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.description} onChange={onInputChange} />
                        {!formData.description && <p className="text-red-500 text-sm">Description is required.</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="deadline" className="block text-gray-700 font-medium mb-2">
                            Deadline:
                        </label>
                        <input type="date" id="deadline" name="deadline" lang="en-GB" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.deadline} onChange={onInputChange} />
                        {!formData.deadline && <p className="text-red-500 text-sm">Deadline is required.</p>}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button onClick={onClose} variant="soft" color="neutral" className="px-4 py-2">
                            Cancel
                        </Button>
                        <Button onClick={onConfirm} variant="solid" color="primary" className="px-4 py-2" disabled={!formData.description || !formData.deadline}>
                            Generate QR Code
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobModal;
