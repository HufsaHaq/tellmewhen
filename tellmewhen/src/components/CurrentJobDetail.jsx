import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";

function CurrentJobDetail({ isOpen, jobData, onClose, onConfirm }) {
  const [isEditing, setIsEditing] = useState(false);
  // Keep a local copy of job data so we can revert on cancel
  const [tempData, setTempData] = useState(jobData);

  useEffect(() => {
    // If the props change, keep tempData in sync
    setTempData(jobData);
  }, [jobData]);

  if (!isOpen) return null;

  const handleChange = () => {
    // Switch to edit mode, using the latest jobData
    setTempData(jobData);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Pass updated data back to the parent
    onConfirm(tempData);
    // Return to view mode
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert to original data
    setTempData(jobData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-1/3 rounded-lg shadow-lg p-6">
        <h2 className="text-center text-2xl font-semibold mb-6">
          {isEditing ? "Edit Job" : "Job Details"}
        </h2>

        {!isEditing && (
          /* --- View Mode --- */
          <div className="mb-6">
            <p className="mb-4">
              <strong>ID:</strong> {jobData.id}
            </p>
            <p className="mb-4">
              <strong>Description:</strong> {jobData.description}
            </p>
            <p className="mb-4">
              <strong>Deadline:</strong> {jobData.deadline}
            </p>
            <div className="flex justify-end space-x-4">
              <Button onClick={onClose} variant="soft" color="neutral">
                Close
              </Button>
              <Button onClick={handleChange} variant="solid" color="primary">
                Change
              </Button>
            </div>
          </div>
        )}

        {isEditing && (
          /* --- Edit Mode --- */
          <form>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter job description"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tempData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="deadline"
                className="block text-gray-700 font-medium mb-2"
              >
                Deadline:
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tempData.deadline || ""}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-4">
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
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CurrentJobDetail;
