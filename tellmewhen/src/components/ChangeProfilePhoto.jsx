import React, { useState, useEffect } from "react";
import { Button } from "@mui/joy";
import { Input } from "@mui/joy";

function ChangeProfilePhoto({isOpen, profilePhoto, onClose, onSave}) {

	const [image, setImage] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);

	const handleImageChange = (event) => {
		const file = event.target.files[0];
	    if (file) {
	      setImage(file);
	      setPreviewImage(URL.createObjectURL(file)); 
    	}
	};

	const handleSave = () => {
    	onSave(image);
    	onClose();
    };

    const handleCancel = () => {
	    setImage(null); 
	    setPreviewImage(null); 
	    onClose();
	};

	if (!isOpen) return null;

	return (
	    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
	      <div className="bg-white w-1/3 rounded-lg shadow-lg p-6">
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

	        <div className="flex justify-between">
	          <Button onClick={handleCancel} variant="soft" color="neutral" className="px-4 py-2">
	            Cancel
	          </Button>
	          <Button onClick={handleSave} variant="solid" color="primary" className="px-4 py-2">
	            Save
	          </Button>
	          <Button onClick={onClose} variant="soft" color="neutral" className="px-4 py-2">
	            Close
	          </Button>
	        </div>
	      </div>
	    </div>
	);
}

export default ChangeProfilePhoto;



