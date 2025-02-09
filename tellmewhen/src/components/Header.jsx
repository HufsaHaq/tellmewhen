"use client";
import { useState, useEffect } from "react";
import { Menu } from "@mui/icons-material";
import { motion, useScroll } from "framer-motion";
function Header() {
    // used to determine when the elements transition to the mobile/desktop versions
    const WindowBoundaries = [1080, 500];
    const [windowWidth, SetWindowWidth] = useState(window.innerWidth);
    const [windowHeight, SetWindowHeight] = useState(window.innerHeight);
    if (typeof window !== "undefined")
        window.addEventListener("resize", () => {
            SetWindowWidth(window.innerWidth);
            SetWindowHeight(window.innerHeight);
        });
    const [NavigationOpen, SetNavigationOpen] = useState(false);
    const [LoggedIn, SetLoggedIn] = useState(true);

    useEffect(() => {
        if (windowWidth > 1080 && NavigationOpen) SetNavigationOpen(false);
        SetWindowWidth(window.innerWidth);
        SetWindowHeight(window.innerHeight);
    }, [windowWidth]);

    return (
        <>
            <div className="relative !z-[20] w-full top-[0px] h-[85px] bg-[#0A5397] shadow-lg">
                {/* div used for centering text vertically and horizontally */}
                <div className={`w-[100%] align-text-top h-full items-center flex flex-auto ${windowWidth > WindowBoundaries[1] && "justify-center"}`}>
                    <h1
                        onClick={() => {
                            window.location.href = "/";
                        }}
                        className={`${windowWidth > WindowBoundaries[1] ? "text-[45px]" : "text-[35px] ml-[15%]"} text-white font-bebas-neue cursor-pointer`}
                    >
                        Tell Me When
                    </h1>
                    {windowWidth > WindowBoundaries[0] ?
                        LoggedIn ? 
                            // DESKTOP SCALED NAVIGATION, WITHOUT MENU BUTTON
                            <span className="space-x-[30px] font-semibold items-center text-white inline flex absolute text-[17px] right-[50px]">
                                <button
                                    onClick={() => {
                                        window.location.href = "/dashboard";
                                    }}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => {
                                        window.location.href = "/account";
                                    }}
                                >
                                    Account
                                </button>
                                <button
                                    className="bg-white px-[30px] py-[7px] text-[#0A5397] text-[17px] font-semibold rounded-md"
                                    onClick={() => {
                                        SetLoggedIn(false);
                                    }}
                                >
                                    Log Out
                                </button>
                            </span>
                         : 
                            // DESKTOP SCALED NAVIGATION FOR WHEN LOGGED OUT
                            <button
                                className="bg-white px-[30px] text-[17px] py-[7px] text-[#0A5397] font-semibold rounded-md absolute right-[50px]"
                                onClick={() => {
                                    window.location.href = "/auth";
                                }}
                            >
                                Log In
                            </button>
                        
                    : 
                        // MOBILE/TABLET SMALLER SCREEN SIZE
                        <button
                            key={NavigationOpen}
                            className="absolute items-center right-[50px] text-white scale-[1.75]"
                            onClick={() => {
                                SetNavigationOpen(NavigationOpen ? false : true);
                            }}
                        >
                            <Menu className="" />
                        </button>
                    }
                </div>
            </div>
            {
                // DROPDOWN NAVIGATION MENU
                <motion.div
                    initial={{ transform: `translateY(-300px)` }}
                    animate={{
                        transform: NavigationOpen ? `translateY(0px)` : "translateY(-300px)",
                    }}
                    transition={{
                        duration: 0.35,
                        ease: [0.5, 0.71, 0.2, 1.01],
                    }}
                    className="pt-[25px] absolute !z-[15] overflow-hidden w-full bg-[#063660]"
                >
                    <div className="w-[80%] m-auto mb-[25px] grid">
                        {LoggedIn ?
                            // CONTROLS FOR WHEN LOGGED IN
                            <>
                                <span className={`items-center w-full ${windowWidth > WindowBoundaries[1] && "flex justify-between inline"} bg-[rgba(0,0,0,0)]`}>
                                    <span className="flex justify-center inline space-x-[35px] text-[#F0F0F0] font-semibold ">
                                        <button
                                            className="text-[20px] justify-self-start"
                                            onClick={() => {
                                                window.location.href = "/dashboard";
                                            }}
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            className="text-white text-[20px] justify-self-start"
                                            onClick={() => {
                                                window.location.href = "/account";
                                            }}
                                        >
                                            Account
                                        </button>
                                    </span>
                                    <button
                                        className={`${windowWidth > WindowBoundaries[1] ? "right-[0px] absolute" : "w-[100%] mt-[15px] "} m-auto bg-white px-[30px] h-[40px] text-[17px] py-[7px] text-[#063660] font-semibold rounded-md mr-[50px]`}
                                        onClick={() => {
                                            SetLoggedIn(false);
                                        }}
                                    >
                                        Log Out
                                    </button>
                                </span>
                            </>
                        :
                            // CONTROLS FOR WHEN LOGGED OUT
                            <div className="h-[30px] items-center flex">
                                <button
                                    className={`${windowWidth > WindowBoundaries[1] ? "right-[0px] absolute mr-[50px]" : "w-[100%]"} m-auto bg-white px-[30px] mt-[-5px] h-[40px] text-[17px] py-[7px] text-[#063660] font-semibold rounded-md`}
                                    onClick={() => {
                                        window.location.href = "/auth";
                                    }}
                                >
                                    Log In
                                </button>
                            </div>
                        }
                    </div>
                </motion.div>
            }
        </>
    );
}

export default Header;
