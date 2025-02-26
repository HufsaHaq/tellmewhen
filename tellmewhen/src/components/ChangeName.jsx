import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";

function ChangeName({ isOpen, businessName, onClose, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBusinessName, setTempBusinessName] = useState(businessName);

  useEffect(() => {
    if (isOpen){
      setIsEditing(false);
    }
    setTempBusinessName(businessName);
  }, [isOpen,businessName]);

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
      <div className="bg-white max-tablet620:w-full min-w-[33%] max-w-[90%] rounded-lg shadow-lg p-6">
        <h2 className="text-center text-2xl font-semibold mb-6">
          {isEditing ? "Edit Business Name" : "Business Name"}
        </h2>

        <form>
          {/* Business Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Business Name:</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Enter New Business Name"
              value={tempBusinessName}
              disabled={!isEditing}
              onChange={(e) => setTempBusinessName(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            {!isEditing && (
              <div className="space-x-3">
                <Button
                  onClick={handleChange}
                  variant="solid"
                  color="primary"
                  className="px-4 py-2"
                >
                  Edit Name
                </Button>
              </div>
            )}

            {isEditing && (
              <div className="space-x-3">
                <Button
                  onClick={handleSave}
                  variant="solid"
                  color="primary"
                  className="px-4 py-2"
                >
                  Save
                </Button>
              </div>
            )}

            <Button
              onClick={onClose}
              variant="soft"
              color="neutral"
              className="px-4 py-2"
            >
              Close
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeName;
