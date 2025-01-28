"use client"; //Makes the page client-side rendered rather than server-side rendered
//"‎" is the empty space character. DO NOT REMOVE

import {Button, Divider, Select, IconButton, Option} from "@mui/joy";
import { Add, CloseRounded } from "@mui/icons-material";

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
            array.push(["EMP" + (i + 1), "Employee"]);
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
                <div className="left-list overflow-visible w-[25%] outline outline-1 rounded-md px-[5px] pt-[2px]">
                    {MenuItems.map((item, index) => {
                        return (
                            <span index={index} className={`${index} flex items-center h-[40px] ${MenuItems.length - 1 != index && "my-[2px]"}`}>
                                <div className={`w-[6px] h-[90%] rounded-md ${SelectedMenu == item && "bg-[#949495]"} transition ease-in-out mr-[5px]`}>‎</div>
                                <button onClick={()=>{SetSelectedMenu(item)}}className={`transition ease-in-out w-[100%] h-full text-left `}>{item}</button>
                            </span>
                        );
                    })}
                </div>
                <div className="menu-content transition ease-in-out w-[73%] h-[100px]">
                    <h1 className="text-[25px] font-semibold mt-auto text-black mb-[5px]">{SelectedMenu}</h1>
                    <div className="w-full h-[1px] mb-[20px] bg-[#949495]">‎</div>
                    {SelectedMenu == MenuItems[0] && 
                            <span className="flex w-full items-center justify-between outline px-[12px] py-[7px] rounded-md outline-[1px] outline-[#505050]">
                                <div>
                                    <h1 className="font-semibold">Delete Account</h1>
                                    <h1 className="text-[#FF0000]">Warning! This action cannot be undone.</h1>
                                </div>
                                <Button variant="solid" color="danger">Delete</Button>
                            </span>
                    }
                    {SelectedMenu == MenuItems[1] && 
                        <div className="">
                            <div className="">
                                <h1 className="font-semibold mb-[15px] w-[100%] sticky text-[20px] mt-[20px]">Employee Management</h1>
                                <div className="outline rounded-md outline-[1px] outline-[#505050]">
                                    <span className="flex w-full items-center justify-between px-[12px] py-[7px] rounded-md">
                                        <div>
                                            <h1 className="font-semibold">Add Employee</h1>
                                            <h1 className="text-[#121212]">Creates a new employee</h1>
                                        </div>
                                        <Button variant="solid" className="w-[65px]">Create</Button>
                                    </span>
                                    <span className="flex w-full items-center justify-between px-[12px] py-[7px] rounded-md">
                                        <div>
                                            <h1 className="font-semibold">Edit Employee Details</h1>
                                            <h1 className="text-[#121212]">Modifies an existing employee</h1>
                                        </div>
                                        <Button variant="solid" className="w-[65px]">Edit</Button>
                                    </span>
                                    <span className="flex w-full items-center justify-between px-[12px] py-[7px] rounded-md">
                                        <div>
                                            <h1 className="font-semibold">Delete Employee</h1>
                                            <h1 className="text-[#FF0000]">Warning! This action cannot be undone</h1>
                                        </div>
                                        <Button variant="solid" className="w-[65px]" color="danger">Select</Button>
                                    </span>
                                </div>
                            </div>

                            <div className="w-full h-[1px] mt-[20px] bg-[#949495]">‎</div>

                                <h1 className="font-semibold mb-[2px] w-[100%] sticky text-[20px] mt-[13px]">Privileges</h1>
                                <h1 className="text-[15px] w-[100%] mb-[15px]">Set each employees privilege level. This determines what level of access each employee has access to.</h1>
                                <div className="overscroll-none max-h-[350px] overflow-y-scroll rounded-md outline outline-[1px]">
                                    <table className="w-[100%] outline outline-[1px] ">
                                        <thead className="sticky bg-[#D6DBE3] text-[#0E0E0E] text-left">
                                            <tr className="sticky px-[10px] py-[5px]">
                                                <th className="sticky ml-[10px] px-[10px] py-[5px] w-[85%]">Name</th>
                                                <th className="sticky ml-[10px] px-[10px] py-[5px] w-[15%]">Privilege</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Employees.map((employee, index1) => {
                                                return(
                                                    <tr index={index1}>
                                                        {employee.map((element, index2) => {
                                                            return(
                                                                <td className={`pl-[10px] ${index2 == 0 && "py-[10px]"} ${index2 != 0 && "border-l-[2px] border-[rgba(0,0,0,0.2)]"}`}>
                                                                    <span className={`flex inline items-center`}>
                                                                        {index2!=1 && <h1>{element}</h1>}
                                                                        {index2==1 &&
                                                                            <Select
                                                                                className="outline outline-[1px]"
                                                                                placeholder={element}
                                                                                sx={{
                                                                                    width: "110px",
                                                                                    height: "10px",
                                                                                    fontSize: "13px",
                                                                                    fontWeight: "bold",
                                                                                    color: "black",
                                                                                }}
                                                                            >
                                                                            <Option value={1}>Admin</Option>
                                                                            <Option value={2}>Manager</Option>
                                                                            <Option value={3}>Employee</Option>
                                                                        </Select>}
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
                                <div className="bottom-spacer h-[150px] w-[100%]">‎</div>
                        </div>
                    }
                </div>
            </span>

        </div>
    )
}
export default Account;