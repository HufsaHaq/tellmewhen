"use client"; //Makes the page client-side rendered rather than server-side rendered
//"‎" is the empty space character. DO NOT REMOVE

import {Button, Select, Input, Option} from "@mui/joy";
import { Search } from "@mui/icons-material";
import { Menu } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";

function Account()
{
    // Used for scaling the UI
    const WindowBoundaries = [1080, 620];
    const [windowWidth, SetWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1920);
    const [windowHeight, SetWindowHeight] = useState(typeof window !== "undefined" ? window.innerHeight : 1080);
    if (typeof window !== "undefined") window.addEventListener("resize", () => {
            SetWindowWidth(window.innerWidth);
            SetWindowHeight(window.innerHeight);
        }
    );
    // UI Hooks
    const [SideMenuOpen, SetSideMenuOpen] = useState(false);

    useEffect(() => {
        if(windowWidth > WindowBoundaries[1])
        {
            SetSideMenuOpen(true);
        }
    }, [windowWidth, windowHeight, SideMenuOpen])

    
    // Holds the current menu
    const [SelectedMenu, SetSelectedMenu] = useState("Account");

    // Holds all menus. Add to array to make new ones
    const MenuItems = ["Account", "Manage Employees"];

    //Used on the "Manage Employees" menu for the table
    const [Employees, SetEmployees] = useState([""]);

    // Value held inside of the Search Bar on the "Employee Management" page
    const [SearchParameter, SetSearchParameter] = useState("");

    useEffect(() => {

        // TO-DO: Fetch employee data from the database here
        let array = []
        for(let i = 0; i < 50; i++)
        {
            array.push(["Employee", (i+1), "Employee"]);
        }
        SetEmployees(array);
    }, []);

    if (typeof window !== "undefined") document.title = "Account | Tell Me When";

    return(
        <div className = {`page-content ${windowWidth < WindowBoundaries[1] ? "w-[90%]" :"w-[75%]"} m-auto mt-[25px]`}>

            {/* TITLEBAR */}
            {windowWidth < WindowBoundaries[1] && 
            <span onClick={()=>{SetSideMenuOpen(!SideMenuOpen)}} className="cursor-pointer w-[100%] inline flex justify-center space-x-[25px] outline outline-[1px] rounded-md items-center py-[15px] mb-[10px]">
                <Menu className="scale-[1.5]"/>
                <h1 className="font-semibold">{SelectedMenu}</h1>
            </span>}
            <span className="header-content flex mt-auto items-center ">
                
                <div className="w-[40px] bg-[#909090] min-w-[40px] h-[40px] mx-[10px] rounded-full animate-pulse"></div>
                <h1 className="align-top inline-block text-[30px] font-semibold mt-auto text-black text-nowrap overflow-hidden">[Business Name Here]</h1>
            </span>

            {/* PAGE MENU LIST ON THE LEFT */}
            <span className="content mt-[20px] flex justify-between">
                <motion.div className={`${windowWidth < WindowBoundaries[1] ? "!absolute left-[0px] w-[100%] bg-[#E6EBF3] h-full overflow-y-hidden pr-[10px] z-[15]" : "w-[25%]"} left-list overflow-visible outline outline-0 rounded-md px-[5px] pt-[2px]`}
                    initial={{transform: SideMenuOpen ? "translateX(0px)" : "translateX(-700px)"}}
                    animate={{
                        transform: SideMenuOpen ? `translateX(0px)` : "translateX(-700px)",
                    }}
                    transition={{
                        duration: windowWidth < WindowBoundaries[1] ? 0.25 : 0,
                        ease: [0.5, 0.71, 0.2, 1.01],
                    }}>
                    {/* ITERATES THROUGH THE DIFFERENT MENU ITEMS IN THE "MenuItems" ARRAY */}
                    {MenuItems.map((item, index) => {
                        return (
                            <span key={index} className={`${index} flex items-center h-[40px] my-[5px]`}>
                                {/* SELECTED MENU INDICATOR*/}
                                <div className={`w-[6px] h-[90%] rounded-md ${SelectedMenu == item && "bg-[#0A5397]"} transition ease-in-out mr-[5px]`}>‎</div>
                                
                                {/* BUTTON CONTAINING THE MENU NAME */}
                                <button onClick={()=>{
                                    SetSelectedMenu(item);
                                    windowWidth < WindowBoundaries[1] && SetSideMenuOpen(false)
                                }}
                                        className={`${SelectedMenu == item && "bg-[#D6DBE3]"} hover:bg-[#D6DBE3] rounded-md transition ease-in-out w-[100%] h-full text-left pl-[10px]`}>{item}</button>
                            </span>
                        );
                    })}
                </motion.div>
                {/* MENU CONTENT SECTION */}
                <div className={`menu-content transition ease-in-out ${windowWidth < WindowBoundaries[1] ? "w-[100%]" : "w-[73%]"} mb-[150px]`}>

                    {/* TITLEBAR FOR THE PAGE CONTENT*/}
                    <h1 className="text-[25px] font-semibold mt-auto text-black mb-[5px]">{SelectedMenu}</h1>
                    <div className="w-full h-[1px] mb-[20px] bg-[#949495]">‎</div>

                    {/* ACCOUNT MANAGEMENT PAGE */}
                    {SelectedMenu == MenuItems[0] &&
                        <>
                            {/* JOB STATISTICS */}
                            <h1 className="font-semibold mb-[15px] w-[100%] sticky text-[20px] mt-[20px]">Statistics</h1>
                            <span className="">
                                <h1 className="">Active Jobs: 0</h1>
                                <h1 className="">Jobs Completed: 0</h1>
                            </span>
                            <div className="w-full h-[1px] my-[20px] bg-[#949495]">‎</div>

                            {/* ACCOUNT CONTROLS */}
                            <h1 className="font-semibold mb-[15px] w-[100%] sticky text-[20px] mt-[20px]">Manage</h1>
                            <div className="outline rounded-md outline-[1px] outline-[#505050]">
                                {/* RENAME ACCOUNT*/}
                                <span className="flex w-full items-center justify-between px-[12px] py-[7px] rounded-md">
                                    <div>
                                        <h1 className="font-semibold">Rename Account</h1>
                                        <h1 className="">Changes the name of the business</h1>
                                    </div>
                                    <Button variant="solid" color="primary" className="w-[75px]">Change</Button>
                                </span>

                                {/* PROFILE PHOTO */}
                                <span className="flex w-full items-center justify-between px-[12px] py-[7px] rounded-md">
                                    <div>
                                        <h1 className="font-semibold">Change Account Profile Photo</h1>
                                        <h1 className="">Changes the profile photo for business</h1>
                                    </div>
                                    <Button variant="solid" color="primary" className="w-[75px]">Change</Button>
                                </span>
                                {/* ADMIN PASSWORD */}
                                <span className="flex w-full items-center justify-between px-[12px] py-[7px] rounded-md">
                                    <div>
                                        <h1 className="font-semibold">Change Admin Password</h1>
                                        <h1 className="">Changes the password for business</h1>
                                    </div>
                                    <Button variant="solid" color="primary" className="w-[75px]">Change</Button>
                                </span>
                                {/* DELETE ACCOUNT */}
                                <span className="flex w-full items-center justify-between px-[12px] py-[7px] rounded-md">
                                    <div>
                                        <h1 className="font-semibold text-[#C41C1C]">Delete Account</h1>
                                        <h1 className="">Warning! This action cannot be undone.</h1>
                                    </div>
                                    <Button variant="solid" className="w-[75px]" color="danger">Delete</Button>
                                </span>
                            </div>
                        </>
                    }

                    {/* EMPLOYEE MANAGEMENT PAGE*/}
                    {SelectedMenu == MenuItems[1] &&
                        <div className="">
                                <h1 className="font-semibold mb-[2px] w-[100%] sticky text-[20px]">Employee Management</h1>
                                <span className={`${windowWidth < WindowBoundaries[1] ? "block" : "flex"} items-center mb-[10px]`}>
                                    <h1 className="text-[15px] w-[100%] mb-[15px]">Modify the details of each employee.</h1>
                                    <span className={`${windowWidth < WindowBoundaries[1] && "justify-between space-x-[5px] "} flex inline`}>
                                    <Button className="mr-[50px] h-[10px]">Create</Button>
                                    <Input endDecorator={<Search></Search>}
                                           className={`max-h-[50px] ${windowWidth < WindowBoundaries[1] ? "w-full" : "mx-[5px]"}`}
                                           placeholder="Search"
                                           onChange={(event) => {
                                                SetSearchParameter(event.target.value);
                                                console.log("SEARCH PARAM CHANGED");
                                            }}></Input>
                                    </span>
                                </span>
                                {/* EMPLOYEE DATA TABLE */}
                                <div className="overscroll-none max-h-[450px] overflow-y-scroll rounded-md outline outline-[1px]">
                                    <table className="w-[100%] outline outline-[1px] ">
                                        <thead className="sticky bg-[rgb(210,214,218)] text-[#0E0E0E] text-left">
                                            <tr className="sticky px-[10px] py-[5px]">
                                                <th className="sticky ml-[10px] px-[10px] py-[5px] w-[70%]">Name</th>
                                                <th className="sticky ml-[10px] px-[10px] py-[5px] w-[15%]">Employee ID</th>
                                                <th className="sticky ml-[10px] px-[10px] py-[5px] w-[15%]">Privilege</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                            {/* ITERATES THROUGH EACH EMPLOYEE */}
                                            {Employees.map((employee, index1) => {
                                                return(
                                                    <tr key={index1} className="cursor-pointer" onClick={()=>{console.log("Clicked: ", index1)}}>
                                                        {employee.map((element, index2) => {
                                                            return(
                                                                <td key={index2} className={`${index1 % 2 == 1 ? "bg-[rgb(210,214,218)]" : "bg-[rgb(230,234,243)]"} overflow-hidden pl-[10px] ${index2 == 0 && "py-[10px]"} ${index2 != 0 && "border-l-[2px] border-[rgba(0,0,0,0.2)]"}`}>
                                                                    <span className={`${index2 == 0 && "max-w-[85%]"} flex inline items-center`}>
                                                                        <h1>{element}</h1>
                                                                    </span>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                        </div>
                    }
                </div>
            </span>

        </div>
    )
}
export default Account;