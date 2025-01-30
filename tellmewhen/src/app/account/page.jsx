"use client"; //Makes the page client-side rendered rather than server-side rendered
//"‎" is the empty space character. DO NOT REMOVE

import {Button, Select, Input, Option} from "@mui/joy";
import { Search } from "@mui/icons-material";

import { useState, useEffect } from "react";

function Account()
{
    const [SelectedMenu, SetSelectedMenu] = useState("Account");
    const MenuItems = ["Account", "Manage Employees"]
    const [Employees, SetEmployees] = useState([""]);

    useEffect(() => {
        // Fetch employees from the server here
        let array = []
        for(let i = 0; i < 50; i++)
        {
            array.push(["Employee", (i+1), "Employee"]);
        }
        SetEmployees(array);
    }, []);

    if (typeof window !== "undefined") document.title = "Account | Tell Me When";

    return(
        <div className = "page-content w-[75%] m-auto mt-[25px]">
            <span className="header-content flex mt-auto items-center ">
                <div className="w-[40px] bg-[#909090] h-[40px] mx-[10px] rounded-full animate-pulse"></div>
                <h1 className="align-top inline-block text-[30px] font-semibold mt-auto text-black">[Business Name Here]</h1>
            </span>
            <span className="content mt-[20px] flex justify-between">
                <div className="left-list overflow-visible w-[25%] outline outline-0 rounded-md px-[5px] pt-[2px]">
                    {MenuItems.map((item, index) => {
                        return (
                            <span key={index} className={`${index} flex items-center h-[40px] my-[5px]`}>
                                <div className={`w-[6px] h-[90%] rounded-md ${SelectedMenu == item && "bg-[#0A5397]"} transition ease-in-out mr-[5px]`}>‎</div>
                                <button onClick={()=>{SetSelectedMenu(item)}}
                                        className={`${SelectedMenu == item && "bg-[#D6DBE3]"} hover:bg-[#D6DBE3] rounded-md transition ease-in-out w-[100%] h-full text-left pl-[10px]`}>{item}</button>
                            </span>
                        );
                    })}
                </div>
                <div className="menu-content transition ease-in-out w-[73%] h-[100px]">
                    <h1 className="text-[25px] font-semibold mt-auto text-black mb-[5px]">{SelectedMenu}</h1>
                    <div className="w-full h-[1px] mb-[20px] bg-[#949495]">‎</div>

                    {SelectedMenu == MenuItems[0] && //Account Management
                        <>
                            <h1 className="font-semibold mb-[15px] w-[100%] sticky text-[20px] mt-[20px]">Statistics</h1>
                            <span className="">
                                <h1 className="">Active Jobs: 0</h1>
                                <h1 className="">Jobs Completed: 0</h1>
                            </span>
                            <div className="w-full h-[1px] my-[20px] bg-[#949495]">‎</div>
                            <h1 className="font-semibold mb-[15px] w-[100%] sticky text-[20px] mt-[20px]">Manage</h1>
                            <div className="outline rounded-md outline-[1px] outline-[#505050]">
                                <span className="flex w-full items-center justify-between px-[12px] py-[7px] rounded-md">
                                    <div>
                                        <h1 className="font-semibold">Rename Account</h1>
                                        <h1 className="">Changes the name of the business</h1>
                                    </div>
                                    <Button variant="solid" color="primary" className="w-[75px]">Change</Button>
                                </span>
                                <span className="flex w-full items-center justify-between px-[12px] py-[7px] rounded-md">
                                    <div>
                                        <h1 className="font-semibold">Change Admin Password</h1>
                                        <h1 className="">Changes the password for business</h1>
                                    </div>
                                    <Button variant="solid" color="primary" className="w-[75px]">Change</Button>
                                </span>
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
                    {SelectedMenu == MenuItems[1] && //Employee Management
                        <div className="">
                                <h1 className="font-semibold mb-[2px] w-[100%] sticky text-[20px]">Employee Management</h1>
                                <span className="flex items-center mb-[10px]">
                                    <h1 className="text-[15px] w-[100%] mb-[15px]">Modify the details of each employee.</h1>
                                    <Button className="mr-[50px] h-[10px]">Create</Button>
                                    <Input endDecorator={<Search></Search>}
                                           className="max-h-[50px] mx-[5px]"
                                           placeholder="Search"></Input>
                                </span>
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
                                            {Employees.map((employee, index1) => {
                                                return(
                                                    <tr key={index1} className="cursor-pointer" onClick={()=>{console.log("Clicked: ", index1)}}>
                                                        {employee.map((element, index2) => {
                                                            return(
                                                                <td key={index2} className={`${index1 % 2 == 1 ? "bg-[rgb(210,214,218)]" : "bg-[rgb(230,234,243)]"} overflow-hidden pl-[10px] ${index2 == 0 && "py-[10px]"} ${index2 != 0 && "border-l-[2px] border-[rgba(0,0,0,0.2)]"}`}>
                                                                    <span className={`${index2 == 0 && "max-w-[85%]"} flex inline items-center`}>
                                                                        {index2!=2 && <h1>{element}</h1>}
                                                                        {index2==2 && <h1>{element}</h1>}
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
                                <span className="privilege-controls space-x-3 mr-[5px] flex flex-row justify-end mt-[10px]">
                                        <Button className="outline outline-[1px]" variant="soft" color="neutral">Cancel</Button>
                                        <Button>Save</Button>
                                </span>
                                <div className="bottom-spacer h-[150px] w-[100%]">‎</div>
                        </div>
                    }
                </div>
            </span>

        </div>
    )
}
export default Account;