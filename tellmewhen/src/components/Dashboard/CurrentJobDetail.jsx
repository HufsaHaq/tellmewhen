import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";
import { GetCode } from "@/scripts/qr";
import { QrCode2, Close } from "@mui/icons-material";
import NotificationModal from "./SendNotificationModal";
function CurrentJobDetail({ isOpen, jobData, onClose, onConfirm, onOpenFinish, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(jobData);
  const [NotificationModalOpen, SetNotificationModalOpen] = useState(false);


  useEffect(() => {
    setTempData(jobData);
  }, [jobData]);

  if (!isOpen) return null;

  const handleChange = () => {
    return
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
      <div className="bg-white max-h-[95vh] overflow-y-scroll max-tablet620:w-full tablet620:min-w-[500px] tablet620:max-w-[40%] max-tablet620:max-w-[90%] rounded-lg shadow-lg p-6">
        <span className="inline justify-between flex">
          <QrCode2 className="scale-[1.5] cursor-pointer" onClick={async ()=>{
                    let res = await GetCode(tempData.id);
                    console.log(res.data)
                    if(res.status === 201){
                      localStorage["qr"] = res.data.qrCode;
                      window.location.href = "/qr_code/"
                    }
                  }}/>
          <h2 className="text-center text-2xl font-semibold mb-6">{isEditing ? "Edit Job" : "Job Details"}</h2>
          <Close className="cursor-pointer" onClick={onClose}/>
        </span>

        
        <form>
          {/* ID (uneditable) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Job ID:
            </label>
            <input
              type="text"
              readOnly
              disabled
              className="w-full p-3 border rounded-lg disabled:bg-gray-100"
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
              <div className="max-tablet620:grid max-tablet620:grid-cols-1 tablet620:flex tablet620:justify-end tablet620:space-x-4 max-tablet620:gap-2">
                <Button
                  onClick={onOpenFinish}
                  variant="solid"
                  color="success"
                  className="row-start-2 max-tablet620:w-full min-w-[100px] px-4 py-2"
                  >
                  Complete
                </Button>
                <Button
                  onClick={()=>SetNotificationModalOpen(true)}
                  variant="solid"
                  color="primary"
                  className="max-tablet620:w-full min-w-[100px] px-4 py-2"
                >
                  Send Notification
                </Button>
              </div>
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
      <NotificationModal isOpen={NotificationModalOpen} jobID={tempData.id} close={()=>SetNotificationModalOpen(false)}></NotificationModal>
    </div>

  );
}

export default CurrentJobDetail;
