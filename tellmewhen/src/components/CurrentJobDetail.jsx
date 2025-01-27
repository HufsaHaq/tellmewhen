import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";

function CurrentJobDetail({ isOpen, jobData, onClose, onConfirm }) {
  const [isEditing, setIsEditing] = useState(false);
  // Local copy of the jobData so we can discard changes on cancel
  const [tempData, setTempData] = useState(jobData);

  useEffect(() => {
    // Sync with any new jobData from the parent
    setTempData(jobData);
  }, [jobData]);

  if (!isOpen) return null;

  const handleChange = () => {
    setTempData(jobData);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Return updated data to the parent
    onConfirm(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Discard local changes
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

        <form>
          {/* ID field (optional) */}
          <div className="mb-4">
            <label
              htmlFor="jobId"
              className="block text-gray-700 font-medium mb-2"
            >
              Job ID:
            </label>
            <input
              type="text"
              id="jobId"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              value={tempData.id || ""}
              disabled={!isEditing}
              onChange={(e) => handleInputChange("id", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Description:
            </label>
            <textarea
              id="description"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                         disabled:bg-gray-100 resize-y overflow-auto max-h-40"
              rows={5}
              value={tempData.description || ""}
              disabled={!isEditing}
              onChange={(e) =>
                handleInputChange("description", e.target.value)
              }
            />
          </div>

          {/* Deadline */}
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
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              value={tempData.deadline || ""}
              disabled={!isEditing}
              onChange={(e) =>
                handleInputChange("deadline", e.target.value)
              }
            />
          </div>

          <div className="flex justify-end space-x-4">
            {!isEditing && (
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
                  onClick={handleChange}
                  variant="solid"
                  color="primary"
                  className="px-4 py-2"
                >
                  Change
                </Button>
              </>
            )}

            {isEditing && (
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

export default CurrentJobDetail;
