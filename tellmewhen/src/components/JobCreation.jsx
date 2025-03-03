import React from "react";
import { Button, Autocomplete, TextField } from "@mui/joy";

const JobModal = ({ isOpen, onClose, onConfirm, formData, onInputChange, errorMessageAssign }) => {
    if (!isOpen) return null;
const worker_Options = ["worker1", "worker2", "worker3", "worker4", "worker5", "worker6", "worker7", "worker8", "worker9", "worker10"];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white max-h-[95vh] overflow-y-scroll max-tablet620:w-full min-w-[33%] max-w-[90%] rounded-lg shadow-lg p-6">
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

                    <div className="mb-6">
                        <label htmlFor="assigning-worker" className="block text-gray-700 font-medium mb-2">
                            Assign Worker:
                        </label>
                        <Autocomplete id="assigning-worker" options={worker_Options} sx={{ width: 300 }} value={formData.worker} onChange={(event, newValue) => onInputChange(event, 'worker', newValue)}/>
                        {!formData.worker && <p className="text-red-500 text-sm">Assigning a worker is required.</p>}
                        {errorMessageAssign && ( <div className="text-red-500 text-sm mt-2">{errorMessageAssign}</div> )}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button onClick={onClose} variant="soft" color="neutral" className="px-4 py-2">
                            Cancel
                        </Button>
                        <Button onClick={onConfirm} variant="solid" color="primary" className="px-4 py-2" disabled={!formData.description || !formData.deadline || !formData.worker}>
                            Generate QR Code
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobModal;
