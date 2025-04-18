import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";

function ChangePasswordModal({ isOpen, password, onClose, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (isOpen){
      setIsEditing(false);
    }
    setTempPassword(password);
    setConfirmPassword("");
    setPasswordError("");
  }, [isOpen,password]);

  if (!isOpen) return null;

  const handleChange = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (tempPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    onSave(tempPassword);
    setIsEditing(false);
    setPasswordError("");
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 items-center flex justify-center z-50">
      <div className="bg-white max-h-[95vh] overflow-y-scroll max-tablet620:w-full min-w-[33%] w-auto max-w-[90%] rounded-lg shadow-lg p-6">
        <h2 className="text-center text-2xl font-semibold mb-6">
          {isEditing ? "Edit Password" : "Password"}
        </h2>

        <form>
          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Password:</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Enter New Password"
              value={tempPassword}
              disabled={!isEditing}
              onChange={(e) => setTempPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Confirm Password:</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Confirm New Password"
              value={confirmPassword}
              disabled={!isEditing}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Password Error Message */}
          {passwordError && (
            <div className="text-red-500 text-sm mt-2">{passwordError}</div>
          )}

          <div className="max-tablet620:grid max-tablet620:grid-cols-1 tablet620:flex tablet620:justify-end tablet620:space-x-4 max-tablet620:gap-2">
            <Button
              onClick={onClose}
              variant="soft"
              color="neutral"
              className="row-start-2 max-tablet620:w-full min-w-[100px] px-4 py-2"
            >
              Close
            </Button>
            {!isEditing && (
              <div className="space-x-3">
                <Button
                  onClick={handleChange}
                  variant="solid"
                  color="primary"
                  className="max-tablet620:w-full min-w-[100px] px-4 py-2"
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
                  className="max-tablet620:w-full min-w-[100px] px-4 py-2"
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
