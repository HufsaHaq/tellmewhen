import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";

function CurrentJobDetail({ isOpen, jobData, onClose, onConfirm, onOpenFinish }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(jobData);

  useEffect(() => {
    setTempData(jobData);
  }, [jobData]);

  if (!isOpen) return null;

  const handleChange = () => {
    setTempData(jobData);
    setIsEditing(true);
  };

  const handleSave = () => {
    onConfirm(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(jobData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-1/3 rounded-lg shadow-lg p-6">
        <h2 className="text-center text-2xl font-semibold mb-6">
          {isEditing ? "Edit Job" : "Job Details"}
        </h2>

        <form>
          {/* ID (uneditable) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Job ID:
            </label>
            <input
              type="text"
              readOnly
              className="w-full p-3 border rounded-lg disabled:bg-gray-100 cursor-not-allowed"
              value={tempData.id || ""}
            />
          </div>

          {/*Assigned Worker*/}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Worker Name:
            </label>
            <input
              type="text"
              readOnly
              className="w-full p-3 border rounded-lg disabled:bg-gray-100 cursor-not-allowed"
              value={tempData.worker || ""}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description:
            </label>
            <textarea
              className="w-full p-3 border rounded-lg focus:outline-none
                         focus:ring-2 focus:ring-blue-500 resize-y
                         overflow-auto max-h-40 disabled:bg-gray-100"
              rows={5}
              value={tempData.description || ""}
              disabled={!isEditing}
              onChange={(e) =>
                setTempData((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          {/* Deadline */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Deadline:
            </label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={!isEditing}
              value={tempData.deadline || ""}
              onChange={(e) =>
                setTempData((prev) => ({ ...prev, deadline: e.target.value }))
              }
            />
          </div>

          <div className="flex justify-between">
            {!isEditing && (
              <>
              <span className="inline space-x-3">
                <Button
                  onClick={onOpenFinish}
                  variant="solid"
                  color="success"
                  className="px-4 py-2"
                >
                  Finish
                </Button>
                <Button
                  onClick={()=>{window.location.href = "/qr_code"}}
                  variant="solid"
                  color="primary"
                  className="px-4 py-2 mx-[10px]"
                >
                  View QR Code
                </Button>
              </span>
              <span className="space-x-3">
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
                  Edit
                </Button>
              </span>
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
