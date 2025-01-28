"use client"; //Makes the page client-side rendered rather than server-side rendered
//"‎" is the empty space character. DO NOT REMOVE

import {Button, Divider} from "@mui/joy"
import { useState, useEffect } from "react";

function Account()
{
    const [SelectedMenu, SetSelectedMenu] = useState("Account");
    const MenuItems = ["Account", "Manage Workers"]
    const [Employees, SetEmployees] = useState({});

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
                            <span index={index} className={`${index} flex items-center h-[40px] my-[2px]`}>
                                <div className={`w-[6px] h-[90%] rounded-md ${SelectedMenu == item && "bg-[#949495]"} transition ease-in-out mr-[5px]`}>‎</div>
                                <button onClick={()=>{SetSelectedMenu(item)}}className={`transition ease-in-out w-[100%] h-full text-left `}>{item}</button>
                            </span>
                        );
                    })}
                </div>
                <div className="menu-content transition ease-in-out w-[73%] h-[100px]">
                    <h1 className="text-[25px] font-semibold mt-auto text-black mb-[10px]">{SelectedMenu}</h1>
                    {SelectedMenu == MenuItems[1] && 
                            <span className="flex w-full items-center justify-between outline px-[12px] py-[7px] rounded-md outline-[1px] outline-[#505050]">
                                <div>
                                    <h1 className="font-semibold">Delete Account</h1>
                                    <h1 className="text-[#ff0000]">Warning! This action cannot be undone.</h1>
                                </div>
                                <Button variant="solid" color="danger">Delete</Button>
                            </span>
                    }
                    {SelectedMenu == MenuItems[1] && 
                        <div>

                        </div>
                    }
                </div>
            </span>

        </div>
    )
}
export default Account;