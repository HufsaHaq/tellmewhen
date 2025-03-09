import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";
import { Input } from "@mui/joy";
import imageCompression from "browser-image-compression";
function ChangeProfilePhoto({isOpen, profilePhoto, errorMessage, onClose, onSave}) {

	const [image, setImage] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);

	const imgOptions = {
		maxSizeMB: 1,
		maxWidthOrHeight: 256,
		useWebWorker: true,
	}
	
	const handleImageChange = async (event) => {
		const input = event.target.files[0];
	    if (input) {
			setPreviewImage(URL.createObjectURL(input)); 
			const file = await imageCompression(input, imgOptions);

		    const reader = new FileReader();
		    reader.onloadend = () => {
		    	const base64String = reader.result;
		    	setImage(base64String);
		    };
		    reader.readAsDataURL(file);
    	}
	};

	const handleSave = () => {
    	onSave(image);
    };

    const handleClose = () => {
    	setPreviewImage(null);
    	setImage(null);
    	onClose();
    }

	if (!isOpen) return null;

	return (
	    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
	      <div className="bg-white max-h-[95vh] overflow-y-scroll max-tablet620:w-full min-w-[33%] max-w-[90%] rounded-lg shadow-lg p-6">
	        <h2 className="text-center text-2xl font-semibold mb-6">Change Profile Photo</h2>

	        <div className="mb-4">
	          <label className="block text-gray-700 font-medium mb-2">Select New Photo:</label>
	          <Input
	            type="file"
	            accept="image/*"
	            onChange={handleImageChange}
	            className="w-full p-3 border rounded-lg"
	          />
	        </div>

	        {previewImage && (
	          <div className="mb-4">
	            <img src={previewImage} alt="Preview" className="w-full h-[200px] object-cover rounded-md" />
	          </div>
	        )}
	        {errorMessage && ( <div className="text-red-500 text-sm mt-2">{errorMessage}</div> )}
	        <div className="max-tablet620:grid max-tablet620:grid-cols-1 tablet620:flex tablet620:justify-end tablet620:space-x-4 max-tablet620:gap-2">
	          <Button onClick={handleClose} variant="soft" color="neutral" className="row-start-2 min-w-[100px] px-4 py-2">
	            Close
	          </Button>
	          <Button onClick={handleSave} variant="solid" color="primary" className="min-w-[100px] px-4 py-2">
	            Save
	          </Button>
	        </div>
	      </div>
	    </div>
	);
}

export default ChangeProfilePhoto;



