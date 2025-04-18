"use client"; //Makes the page client-side rendered rather than server-side rendered
//"‎" is the empty space character. DO NOT REMOVE

import { Button, Select, Input, Option } from "@mui/joy";
import { Search } from "@mui/icons-material";
import ChangeName from "@/components/Account/ChangeName"
import ChangeProfilePhoto from "@/components/Account/ChangeProfilePhoto"
import ChangePasswordModal from "@/components/Account/ChangePassword"
import DeleteBusinessModal from "@/components/Account/DeleteBusiness"
import { Menu } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import EmployeeCreationModal from "@/components/Account/EmployeeCreationModal";
import EmployeeDetailsModal from "@/components/Account/EmployeeDetailsModal";
import { Leaderboard, Numbers, NotificationsActive } from "@mui/icons-material"


import {
    ChangeBusinessPhoto,
    ChangePassword,
    CreateEmployee,
    DeleteBusiness,
    GetAccountDetails,
    GetCurrentJobCount,
    GetEmployees,
    GetPrivilegeLevel,
    GetTotalJobCount,
    RenameAccount,
} from "@/scripts/account";

import PageLoad from "@/components/PageLoad";
import { ClearCookies } from "@/scripts/login";
const PrivilegeLookup = {
    1: "Admin",
    2: "Manager",
    3: "Employee",
}
function Account() {


    // THIS WILL PREVENT UNAUTHORISED ACCESS WHEN DISABLED WITH THE BACKEND
    // SET TO TRUE TO USE WITHOUT BACKEND
    const DEBUGMODE = false; 


    // Used for scaling the UI
    const WindowBoundaries = [1080, 620];
    const [windowWidth, SetWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1920);
    const [windowHeight, SetWindowHeight] = useState(typeof window !== "undefined" ? window.innerHeight : 1080);
    const [hidePage, setHidePage] = useState(!DEBUGMODE); //SET TO TRUE WHEN NOT DEBUGGING
    const [PrivilegeLevel, SetPrivilegeLevel] = useState(0);
    const [FilteredEmployees, SetFilteredEmployees] = useState([]);

    // Holds the current menu
    const [SelectedMenu, SetSelectedMenu] = useState("Account");

    // Holds all menus. Add to array to make new ones
    const MenuItems = ["Account", "Manage Employees"];

    //Used on the "Manage Employees" menu for the table
    const [Employees, SetEmployees] = useState([""]);

    // Value held inside of the Search Bar on the "Employee Management" page
    const [SearchParameter, SetSearchParameter] = useState("");

    // Hold the error message
    const [errorMessageName, setErrorMessageName] = useState('');
    const [errorMessagePhoto, setErrorMessagePhoto] = useState('');
    const [errorMessagePassword, setErrorMessagePassword] = useState('');
    const [errorMessageDelete, setErrorMessageDelete] = useState('');

    const [activeJobs, setActiveJobs] = useState('');
    const [errorMessageActive, setErrorMessageActive] = useState('');

    const [totalJobs, setTotalJobs] = useState('');
    const [errorMessageTotal, setErrorMessageTotal] = useState('');

    if (typeof window !== "undefined") document.title = "Account | Tell Me When";

    const [isChangeNameOpen, setIsChangeNameOpen] = useState(false);
    const [businessName, setBusinessName] = useState("");
    const [username, setUsername] = useState("");

    const [isChangeProfilePhotoOpen, setIsChangeProfilePhotoOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);

    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [Password, setPassword] = useState("[Enter Password]");

    const [isDeleteBusinessOpen, setIsDeleteBusinessOpen] = useState(false);

    // UI Hooks
    const [SideMenuOpen, SetSideMenuOpen] = useState(false);
    const [APIError, SetAPIError] = useState("");

    if (typeof window !== "undefined") window.addEventListener("resize", () => {
        SetWindowWidth(window.innerWidth);
        SetWindowHeight(window.innerHeight);
    }
    );
    
    useEffect(() => {
        let arr=[]
        if(Employees == undefined || SearchParameter == undefined) return

        if(SearchParameter == "")
        {
            SetFilteredEmployees(Employees)
            return;
        }
        for(let i = 0; i < Employees.length; i++)
        {
            if(Employees[i][0].toLowerCase().includes(SearchParameter.toLowerCase()) || Employees[i][1].toString().includes(SearchParameter))
            {
                arr.push(Employees[i])
            }
        }
        SetFilteredEmployees(arr);
    }, [SearchParameter, Employees])

    useEffect(() => {
        if (windowWidth > WindowBoundaries[1]) {
            SetSideMenuOpen(true);
        }

    }, [windowWidth, windowHeight, SideMenuOpen])
    async function UpdateEmployees()
    {
        let employees = await GetEmployees() || [];
        if (employees.status === 200) {
            let employeesData = employees.data
            let array = [];
            for (let i = 0; i < employeesData.length; i++) {
                if(priv <= employeesData[i].Role) array.push([employeesData[i].Username, employeesData[i].User_ID, PrivilegeLookup[employeesData[i].Role] || "unknown"])
            }
            SetEmployees(array);
        }
        else {
            SetAPIError("Cannot connect to server")
        }
    }

    useEffect(() => {
        if (typeof window !== undefined && !DEBUGMODE && !(localStorage["loggedIn"] != true && localStorage["userID"] != null || localStorage["businessID"] != null)) window.location.href = "/auth";
        setUsername(localStorage["username"]);

        async function CallAPI() {
            let priv = 0; 
            // Gets all the API details in parallel
            let details, activeJobs, totalJobs, employees;
            try {
                details = await GetAccountDetails() || setErrorMessageActive("An error occurred while connecting to the server.");
                
                priv= await GetPrivilegeLevel(localStorage["userID"]);
                SetPrivilegeLevel(priv);
                const APIData = await Promise.allSettled([
                    GetCurrentJobCount(),
                    GetTotalJobCount(),
                    GetEmployees(),

                ])
                activeJobs = APIData[0].value || setErrorMessageActive("An error occurred while connecting to the server.");
                totalJobs = APIData[1].value || setErrorMessageTotal("An error occurred while connecting to the server.")
                employees = APIData[2].value || [];
                
                if(details == null || activeJobs==null || totalJobs == null || employees == null) throw new Error("API Error")
            } catch {
                SetAPIError("Cannot connect to server");
                return;
            }
            setHidePage(false);
            if (details.status === 200) {
                setBusinessName(details.data.name);
                setProfilePhoto(details.data.photo);
            }
            else {
                SetAPIError("Cannot connect to server")
            }
            // Fetches the number of
            console.log("Active Jobs", activeJobs)
            if (activeJobs.status === 200) { setActiveJobs(activeJobs.data.data); }
            else {
                SetAPIError("Cannot connect to server")
                setErrorMessageActive("An error occurred while connecting to the server.")
            }


            console.log("Total Jobs", totalJobs)
            if (totalJobs.status === 200) { setTotalJobs(totalJobs.data.data); }
            else {
                SetAPIError("Cannot connect to server")
                setErrorMessageTotal("An error occurred while connecting to the server.")
            }

            console.log("Employees", employees)
            if (employees.status === 200) {
                let employeesData = employees.data
                let array = [];
                for (let i = 0; i < employeesData.length; i++) {
                    if(priv <= employeesData[i].Role) array.push([employeesData[i].Username, employeesData[i].User_ID, PrivilegeLookup[employeesData[i].Role] || "unknown"])
                }
                SetEmployees(array);
            }
            else {
                SetAPIError("Cannot connect to server")
            }
        }
        CallAPI();
    }, [])

    const handleDeleteBusiness = async () => {
        try {
            const res = await DeleteBusiness();
            console.log(res);
            if(res.status === 204)
            {
                ClearCookies()
                localStorage.removeItem("loggedIn")
                localStorage.removeItem("userID")
                localStorage.removeItem("businessID")
                window.location.href="/auth"
            }
            else if(res.status === 500)
            {
                setErrorMessageDelete("Failed to delete business. Please try again later.");
                return;
            }

        }
        catch (error) {
            console.log(error)
            setErrorMessageDelete("Failed to delete business. Please try again later.");
        }
    };

    const handleSaveProfilePhoto = async (newImage) => {
        if (!newImage) {
            setErrorMessagePhoto("Please select an image before saving");
            return;
        }


            const res = await ChangeBusinessPhoto(newImage);
            console.log(res)
            if (res.status === 200) {
                setProfilePhoto(newImage);
                setErrorMessagePhoto("");
                setIsChangeProfilePhotoOpen(false);
            }

            else if (res.status === 401) {
                setErrorMessagePhoto("Unauthorized request. Please log in to make changes");
                window.location.href = '/auth';
            }
            else if(res.status === 413)
            {
                setErrorMessagePhoto("Image size too large");

            }
            else if (res.status === 500 || res.status === null || res === null || res === 404) {
                setErrorMessagePhoto("An error occurred while connecting to the server.");
            }
            else
            {
                setErrorMessagePhoto("An error occurred while connecting to the server.");
            }
    
    };

    const handleSavePassword = async (newPassword) => {
        let res = await ChangePassword(localStorage["username"], newPassword, localStorage["userID"])
        if (res.status === 200) {
            setIsChangePasswordOpen(false);
        }
    };

    //Modals Part here
    // =================== Creation Modal =================
    const [isEmployeeCreationModalOpen, setIsEmployeeCreationModalOpen] = useState(false);

    // When user confirms creation in the modal:
    const handleEmployeeConfirm = async (newEmployee) => {
        let res = await CreateEmployee(newEmployee[0], newEmployee[1], newEmployee[2]);
        if(res.status === 201)
        {
            window.location.reload();
            setIsEmployeeCreationModalOpen(false);
        }
    };

    // ================= Employee details =================
    const [isEmployeeDetailsModalOpen, setIsEmployeeDetailsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleEmployeeRowClick = (employee) => {
        setSelectedEmployee({
            name: employee[0],
            id: employee[1],
            role: employee[2],
        });
        setIsEmployeeDetailsModalOpen(true);
    };

    const handleUpdateEmployee = (updatedEmployee) => {
        UpdateEmployees()
        setIsEmployeeDetailsModalOpen(false);
    };

    if (hidePage) return <PageLoad message={APIError != "" ? APIError : "Loading..."}></PageLoad>
    return (
        <div className="w-[100vw] h-[100vh] overflow-y-scroll fixed bg-[#F5F5F5] ">
        <div className={`page-content max-tablet620:w-[90%] tablet620:w-[75%] m-auto mt-[25px]`}>
            {/* TITLEBAR */}
            <span className="mb-[25px] header-content flex mt-auto my-auto items-center ">
                {profilePhoto ? (

                    <img src={profilePhoto} alt="Profile" className="w-[70px] min-w-[70px] h-[70px] rounded-full object-cover" />
                ) : (<div className="my-auto w-[70px] min-w-[70px] h-[70px] bg-[#909090] rounded-full animate-pulse"></div>
                )}
                
                <div className="w-full grid grid-cols-1 space-y-0 ml-[20px]">
                    <h1 className="text-nowrap overflow-x-hidden align-top text-[30px] font-semibold text-black">{username}</h1> 
                    <h1 className="text-nowrap overflow-x-hidden align-top text-[20px] font-semibold text-[#A9A9A9]">{businessName}</h1> 
                    
                </div>
            </span>
            <span onClick={() => { SetSideMenuOpen(!SideMenuOpen) }} className="tablet620:absolute tablet620:opacity-0 tablet620:top-[-1000px] cursor-pointer w-[100%] inline flex justify-center space-x-[25px] outline outline-[#A9A9A9] outline-[1.5px] rounded-md items-center py-[15px] mb-[10px]">
                <Menu className="scale-[1.5]" />
                <h1 className="font-semibold">{SelectedMenu}</h1>
            </span>

            {/* PAGE MENU LIST ON THE LEFT */}
            <span className="content mt-[20px] flex justify-between">
                <motion.div className={`max-tablet620:!absolute max-tablet620:left-[0px] max-tablet620:w-[100%] max-tablet620:bg-[#F5F5F5] max-tablet620:h-full max-tablet620:overflow-y-hidden max-tablet620:pr-[10px] max-tablet620:z-[15] tablet620:w-[25%] left-list overflow-visible rounded-md px-[5px] pt-[2px]`}
                    initial={{ transform: SideMenuOpen ? "translateX(0px)" : "translateX(-700px)" }}
                    animate={{
                        transform: SideMenuOpen ? `translateX(0px)` : "translateX(-700px)",
                    }}
                    transition={{
                        duration: windowWidth < WindowBoundaries[1] ? 0.25 : 0,
                        ease: [0.5, 0.71, 0.2, 1.01],
                    }}>
                    {/* ITERATES THROUGH THE DIFFERENT MENU ITEMS IN THE "MenuItems" ARRAY */}
                    {MenuItems.map((item, index) => {
                        if(index === 1 && PrivilegeLevel > 2) return;
                        return (
                            <span key={index} className={`${index} flex items-center h-[40px] my-[5px]`}>
                                {/* SELECTED MENU INDICATOR*/}
                                <div className={`w-[6px] h-[90%] rounded-md ${SelectedMenu == item && "bg-[#0A5397]"} transition ease-in-out mr-[5px]`}>‎</div>

                                {/* BUTTON CONTAINING THE MENU NAME */}
                                <button onClick={() => {
                                    SetSelectedMenu(item);
                                    windowWidth < WindowBoundaries[1] && SetSideMenuOpen(false)
                                }}
                                    className={`${SelectedMenu == item && "bg-[#D6D5D4]"} hover:bg-[#D6D5D4] rounded-md transition ease-in-out w-[100%] h-full text-left text-nowrap overflow-hidden px-[10px]`}>{item}</button>
                            </span>
                        );
                    })}
                </motion.div>
                {/* MENU CONTENT SECTION */}
                <div className={`menu-content transition ease-in-out max-tablet620:w-[100%] tablet620:w-[73%] mb-[150px]`}>

                    {/* TITLEBAR FOR THE PAGE CONTENT*/}
                    <h1 className="text-[25px] font-semibold mt-auto text-black mb-[5px]">{SelectedMenu}</h1>
                    <div className="w-full h-[1px] mb-[20px] bg-[#A9A9A9]">‎</div>

                    {/* ACCOUNT MANAGEMENT PAGE */}
                    {SelectedMenu == MenuItems[0] &&
                        <>
                            {/* JOB STATISTICS */}
                            <h1 className="font-semibold mb-[15px] w-[100%] sticky text-[20px] mt-[20px]">Statistics</h1>
                            <span className="grid gap-3 grid-flow-cols tablet620:grid-cols-2">
                                <div className="align-middle rounded-xl outline outline-[#A9A9A9] outline-[1.5px] p-[30px] shadow-md">
                                    <div className="inline flex justify-left space-x-5 h-full">
                                        <NotificationsActive color="primary" className="my-auto text-[#0A5397] text-[45px]" fontSize="50px" />
                                        <div className="justify-center my-auto">
                                            <h1 className="grid font-bold text-xl">{activeJobs}</h1>
                                            <h1 className="grid font-semibold text-[#A0A0A0] text-lg">Active Jobs</h1>
                                            {errorMessageActive && (<div className="text-red-500 text-sm mt-2">{errorMessageActive}</div>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="align-middle rounded-xl outline outline-[#A9A9A9] outline-[1.5px] p-[30px] shadow-md">
                                    <div className="inline flex justify-left space-x-5 h-full">
                                        <Numbers color="primary" className="my-auto text-[#0A5397] text-[50px]" fontSize="50px" />
                                        <div className="justify-center my-auto">

                                            <h1 className="grid font-bold text-xl">{totalJobs}</h1>
                                            <h1 className="grid font-semibold text-[#A0A0A0] text-lg">Total Jobs</h1>
                                            {errorMessageTotal && (<div className="text-red-500 text-sm mt-2">{errorMessageTotal}</div>)}
                                        </div>
                                    </div>
                                </div>



                            </span>
                            {PrivilegeLevel == 1 && <>
                            <div className="w-full h-[1px] my-[20px] bg-[#A9A9A9]">‎</div>

                            {/* ACCOUNT CONTROLS */}
                            
                            <h1 className="font-semibold mb-[15px] w-[100%] sticky text-[20px] mt-[20px]">Manage</h1>
                            <div className="outline rounded-md outline-[#A9A9A9] outline-[1.5px]">
                                {/* RENAME ACCOUNT*/}
                                <span className="flex w-full items-center justify-between px-[12px] py-[7px] rounded-md">
                                    <div>
                                        <h1 className="font-semibold">Rename Account</h1>
                                        <h1 className="text-[#808080]">Changes the name of the business</h1>
                                    </div>
                                    <Button variant="solid" color="primary" className="w-[75px]" onClick={() => setIsChangeNameOpen(true)} >Change</Button>
                                </span>

                                {/* PROFILE PHOTO */}
                                <span className="flex w-full items-center justify-between px-[12px] py-[7px] rounded-md">
                                    <div>
                                        <h1 className="font-semibold">Change Account Profile Photo</h1>
                                        <h1 className="text-[#808080]">Changes the profile photo for business</h1>
                                    </div>
                                    <Button variant="solid" color="primary" className="w-[75px]" onClick={() => setIsChangeProfilePhotoOpen(true)}>Change</Button>

                                </span>
                                {/* ADMIN PASSWORD */}
                                <span className="flex w-full items-center justify-between px-[12px] py-[7px] rounded-md">
                                    <div>
                                        <h1 className="font-semibold">Change Admin Password</h1>
                                        <h1 className="text-[#808080]">Changes the password for business</h1>
                                    </div>
                                    <Button variant="solid" color="primary" className="w-[75px]" onClick={() => setIsChangePasswordOpen(true)}>Change</Button>
                                </span>
                                {/* DELETE ACCOUNT */}
                                <span className="flex w-full items-center justify-between px-[12px] py-[7px] rounded-md">
                                    <div>
                                        <h1 className="font-semibold text-[#C41C1C]">Delete Account</h1>
                                        <h1 className="text-[#C41C1C]">Warning! This action cannot be undone.</h1>
                                    </div>
                                    <Button variant="solid" className="w-[75px]" color="danger" onClick={() => setIsDeleteBusinessOpen(true)}>Delete</Button>
                                </span>
                            </div></>}

                            <ChangeName
                                isOpen={isChangeNameOpen}
                                businessName={businessName}
                                errorMessage={errorMessageName}
                                onClose={() => {
                                    setErrorMessageName('');
                                    setIsChangeNameOpen(false);
                                }}
                                onSave={async (name) => {
                                    const res = await RenameAccount(name);
                                    if (res.status === 201) {
                                        let check = await GetAccountDetails();
                                        if (name == check.data.name) {
                                            setBusinessName(name);
                                            setIsChangeNameOpen(false);
                                        }
                                        else {
                                            setErrorMessageName('Business Name already taken.');

                                        }
                                    }
                                    else {
                                        setErrorMessageName("An error occured. Please try again later.")
                                    }
                                }}
                            />

                            <ChangeProfilePhoto
                                isOpen={isChangeProfilePhotoOpen}
                                profilePhoto={profilePhoto}
                                errorMessage={errorMessagePhoto}
                                onClose={() => {
                                    setErrorMessagePhoto('');
                                    setIsChangeProfilePhotoOpen(false);
                                }}
                                onSave={handleSaveProfilePhoto}
                            />

                            <ChangePasswordModal
                                isOpen={isChangePasswordOpen}
                                Password={Password}
                                onClose={() => setIsChangePasswordOpen(false)}
                                onSave={handleSavePassword}
                            />

                            <DeleteBusinessModal
                                isOpen={isDeleteBusinessOpen}
                                errorMessageDelete={errorMessageDelete}
                                onClose={() => {
                                    setErrorMessageDelete('');
                                    setIsDeleteBusinessOpen(false);
                                }}
                                onDelete={handleDeleteBusiness}
                            />
                        </>
                    }

                    {/* EMPLOYEE MANAGEMENT PAGE*/}
                    {SelectedMenu == MenuItems[1] && PrivilegeLevel <= 2 &&
                        <div className="">
                            <h1 className="font-semibold mb-[2px] w-[100%] sticky text-[20px]">Employee Management</h1>
                            <span className={`max-tablet620:block tablet620:flex items-center mb-[10px]`}>
                                <h1 className="text-[#808080] flex text-[15px] w-[100%] mb-[15px]">Modify the details of each employee.</h1>
                                <span className={`max-tablet620:justify-between space-x-[5px] flex inline`}>
                                    {PrivilegeLevel == 1 && <Button className="mr-[50px] h-[10px]"
                                        onClick={() => setIsEmployeeCreationModalOpen(true)}
                                    >
                                        Create
                                    </Button>}
                                    <Input endDecorator={<Search></Search>}
                                        className={`max-h-[50px] max-tablet620:w-full max-tablet620:mx-[5px]`}
                                        placeholder="Search"
                                        onChange={(event) => {
                                            SetSearchParameter(event.target.value);
                                        }}></Input>
                                </span>
                            </span>
                            {/* EMPLOYEE DATA TABLE */}
                            <div className="overscroll-none max-h-[450px] overflow-y-scroll rounded-md outline outline-[#A9A9A9] outline-[1.5px]">
                                <table className="w-[100%] outline outline-[#A9A9A9] outline-[1.5px] ">
                                    <thead className="sticky bg-[#D6D5D4] text-[#0E0E0E] text-left">
                                        <tr className="sticky px-[10px] py-[5px]">
                                            <th className="sticky ml-[10px] px-[10px] py-[5px] w-[70%]">Name</th>
                                            <th className="sticky ml-[10px] px-[10px] py-[5px] w-[15%]">Employee ID</th>
                                            <th className="sticky ml-[10px] px-[10px] py-[5px] w-[15%]">Privilege</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {/* ITERATES THROUGH EACH EMPLOYEE */}
                                        {FilteredEmployees.map((employee, index1) => {
                                                return (
                                                <tr key={index1} className="cursor-pointer" onClick={() => handleEmployeeRowClick(employee)}>
                                                    {employee.length != 0 && employee.map((element, index2) => {
                                                        return (
                                                            <td key={index2} className={`${index1 % 2 == 1 ? "bg-[#DFDEDD]" : "bg-[#f0f0f0]"} overflow-hidden px-[10px] ${index2 == 0 && "py-[10px]"} ${index2 != 0 && "border-l-[2px] border-[rgba(0,0,0,0.2)]"}`}>
                                                                <span className={`${index2 == 0 && "max-w-[85%]"} flex inline items-center`}>
                                                                    <h1>{element}</h1>
                                                                </span>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );}
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    }
                </div>
            </span>


            {/* ============= EMPLOYEE CREATION MODAL ============= */}
            {isEmployeeCreationModalOpen && (
                <EmployeeCreationModal
                    isOpen={isEmployeeCreationModalOpen}
                    onClose={() => setIsEmployeeCreationModalOpen(false)}
                    onConfirm={handleEmployeeConfirm}
                    existingEmployees={Employees}
                />
            )}

            {/* ============= EMPLOYEE DETAILS MODAL ============= */}
            {isEmployeeDetailsModalOpen && (
                <EmployeeDetailsModal
                    isOpen={isEmployeeDetailsModalOpen}
                    employeeData={selectedEmployee}
                    onClose={() => setIsEmployeeDetailsModalOpen(false)}
                    onConfirm={handleUpdateEmployee}
                />
            )}

        </div>
        </div>
    )
}
export default Account;
