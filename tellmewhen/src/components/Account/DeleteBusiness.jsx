import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";

function DeleteBusinessModal({ isOpen, errorMessageDelete, onClose, onDelete }) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white max-h-[95vh] overflow-y-scroll max-tablet620:w-full min-w-[33%] max-w-[90%] rounded-lg shadow-lg p-6">
                <h1 className="font-semibold mb-[2px] w-[100%] sticky text-[20px]">Are you sure? All the data will be lost</h1>
                {errorMessageDelete && ( <div className="text-red-500 text-sm mt-2">{errorMessageDelete}</div> )}
                    <div className="max-tablet620:grid max-tablet620:grid-cols-1 tablet620:flex tablet620:justify-end tablet620:space-x-4 max-tablet620:gap-2">
                        <Button
                            onClick={onDelete}
                            variant="soft"
                            color="neutral"
                            className="row-start-2 min-w-[100px] max-tablet620:w-full px-4 py-2"
                        >
                            Yes
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="soft"
                            color="neutral"
                            className="row-start-2 min-w-[100px] max-tablet620:w-full px-4 py-2"
                        >
                            No
                        </Button>
                    </div>
            </div>
        </div>
    );
}

export default DeleteBusinessModal;
