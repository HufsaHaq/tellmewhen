import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";
import { GetCode } from "@/scripts/qr";

function CurrentJobDetail({ isOpen, jobData, onClose, onConfirm, onOpenFinish, onDelete }) {
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
      <div className="bg-white max-h-[95vh] overflow-y-scroll max-tablet620:w-full min-w-[33%] max-w-[90%] rounded-lg shadow-lg p-6">
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

          <div className="max-tablet620:grid max-tablet620:grid-cols-1 tablet620:flex tablet620:justify-end tablet620:space-x-4 max-tablet620:gap-2">
            {!isEditing && (
              <span className="space-y-[10px] items-center tablet620:space-x-3 grid w-full max-tablet620:grid-cols-2 tablet620:grid-cols-4">
                <Button
                  onClick={onOpenFinish}
                  variant="solid"
                  color="success"
                  className="top-[5px] px-4 max-tablet620:w-[98%] min-w-[100px] py-2 h-[30px]"
                >
                  Complete
                </Button>

                <Button
                  onClick={async ()=>{
                    let res = await GetCode(tempData.id);
                    console.log(res.data)
                    if(res.status === 201) window.location.href = "/qr_code/" + res.data.qrCode.slice(22);
                  }}
                  variant="solid"
                  color="primary"
                  className="relative px-4 justify-self-end max-tablet620:w-[98%] min-w-[100px] py-2 h-[30px]"
                >
                  View QR Code
                </Button>
                <Button
                  onClick={onClose}
                  variant="soft"
                  color="neutral"
                  className="max-tablet620:col-span-2 max-tablet620:row-start-4 min-w-[100px] px-4 py-2"
                >
                  Close
                </Button>
                <Button
                  onClick={handleChange}
                  variant="solid"
                  color="primary"
                  className="max-tablet620:col-span-2 min-w-[100px] px-4 py-2"
                >
                  Edit
                </Button>
              </span>
            )}

            {isEditing && (
              <>
                <Button
                  onClick={handleCancel}
                  variant="soft"
                  color="neutral"
                  className="row-start-2 min-w-[100px] px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="solid"
                  color="primary"
                  className="min-w-[100px] px-4 py-2"
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
