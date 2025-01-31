import React from "react";
import { Button } from "@mui/joy";

const DashboardButton = () => {
	const handleDashboardButton = () =>{
		window.location.href = '/dashboard';
	};

	return (
		<button
		  onClick={handleDashboardButton}
		  className = "px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-700"
		>
		  Back to Dashboard
		</button>
	);
};

export default DashboardButton;