"use client"; //Makes the page client-side rendered rather than server-side rendered
import { useState, useEffect } from "react";
import {Button, Tab, Tabs, TabList, tabClasses, Typography} from "@mui/joy"

function Page()
{
    const [CurrentTableData, SetCurrentTableData] = useState(null);
    const [HistoryTableData, SetHistoryTableData] = useState(null);
    //Stores the currently displayed data
    const [DisplayedTableData, SetDisplayedTableData] = useState([[]]);

    const CurrentTableHeaders = ["Job ID", "User ID", "Description", "Due"];
    const HistoryTableHeaders = ["Job ID", "User ID", "Description",];
    //Used to determine which is the currently selected data (Current=0 or History=1)
    const [CurrentIndex, SetIndex] = useState(0);

    useEffect(() => {
        //This code will run when the value of "CurrentIndex" changes

        
        //    TO-DO: SWAP BETWEEN THE CURRENT DATA WHEN THE INDEX CHANES
        
    }, [CurrentIndex]);

    useEffect(() => {
        //Code below will run when the page is initially loaded

        //  TO-DO: ADD API CALLS
    }, []);
    return(
        <div className = "page-content w-[80%] m-auto">
            { /* Span element is for the controls above the table (Switcher and Button) to keep them inline*/ }
            <span className = "w-full flex justify-between items-center h-[70px] overflow-hidden">
                <Tabs className = "w-[200px] ml-[5px] outline outline-[0px] outline-[#B8B8B8] rounded-[10px]"
                      onChange={(event, index) => {SetIndex(index);}}>
                    <TabList
                            disableUnderline
                            sx={{
                            p: 0.5,
                            gap: 0.5,
                            borderRadius: '10px',
                            bgcolor: 'rgba(214,214,214,1)',
                            // Overwrites the styling for the currently selected tab
                            [`& .${tabClasses.root}[aria-selected="true"]`]: {
                                boxShadow: 'sm',
                                bgcolor: "rgba(11, 107, 203, 1)",// HEADER COLOUR:'rgba(10, 83, 151, 1)',
                                color: "rgba(255,255,255,1)"
                            },
                            /* Overwrites the styling for all the children(Tabs) */
                            [`& .${tabClasses.root}`]: {
                                px: 5,
                                flex: 1,
                                height: "40px",
                                transition: '0.25s',
                                fontWeight: 'md',
                                fontSize: 'md',
                                [`&:not(.${tabClasses.selected}):not(:hover)`]: {
                                  opacity: 0.7,
                                },
                              },
                        }}>
                            <Tab disableIndicator>Current</Tab>
                            <Tab disableIndicator>History</Tab>
                    </TabList>
                </Tabs>
                <Button className="h-[40px]" onClick={()=>{console.log("REDIRECT TO OTHER PAGE")}}>New Job</Button>
            </span>
        </div>
    );
}
export default Page;