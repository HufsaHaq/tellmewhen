import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";

function ChangePassword({ isOpen, password, onClose, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPassword, setTempPassword] = useState(password);

  useEffect(() => {
    if (isOpen){
      setIsEditing(false);
    }
    setTempPassword(password);
  }, [isOpen,password]);

  if (!isOpen) return null;

  const handleChange = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(tempPassword);
    setIsEditing(false);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-1/3 rounded-lg shadow-lg p-6">
        <h2 className="text-center text-2xl font-semibold mb-6">
          {isEditing ? "Edit Password" : "Password"}
        </h2>

        <form>
          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Password:</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Enter New Password"
              value={tempPassword}
              disabled={!isEditing}
              onChange={(e) => setTempPassword(e.target.value)}
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
                  Change
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

export default ChangePassword;
