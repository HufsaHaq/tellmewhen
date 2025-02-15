import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";

function FinishJobModal({ isOpen, job, onClose, onFinish }) {
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    // Whenever job changes, reset remarks if needed
    setRemarks("");
  }, [job]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-1/3 rounded-lg shadow-lg p-6">
        <h2 className="text-center text-2xl font-semibold mb-6">Finish Job</h2>
        <div className="mb-4">
          <p className="text-gray-700 font-medium">Job ID:</p>
          <p className="p-3 border rounded-lg bg-gray-100">{job?.id}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 font-medium">Remarks:</p>
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                       resize-y overflow-auto max-h-40"
            rows={4}
            placeholder="What was done?"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} variant="soft" color="neutral">
            Cancel
          </Button>
          <Button
            onClick={() => onFinish(remarks)}
            variant="solid"
            color="primary"
          >
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FinishJobModal;
