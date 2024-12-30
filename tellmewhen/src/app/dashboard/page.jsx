/* 

    NOTE: JoyUI uses a different styling engine named Emotion, and so the "sx" property in the
    JoyUI components doesn't use tailwind. However, Tailwind styling still works sometimes for
    the components
    
*/
"use client"; //Makes the page client-side rendered rather than server-side rendered
import { useState, useEffect } from "react";
import {Button, Tab, Tabs, TabList, tabClasses} from "@mui/joy"
import {Add} from "@mui/icons-material"
import Pagination from "@/components/Pagination";

function Page()
{
    let colours = {
        "header": "#0A5397", //Original colour of the header
        "primary": "rgba(11,107,203,1)",
        "primary-text-colour": "rgba(255,255,255,1)",
        "secondary": "#e3e1e1",
        "secondary-text-colour": "rgba(103,107,111,1)",
        "tertiary": "#e9e9e9", //used when highlighting a secondary colour item (switcher)
        "tertiary-text-colour": "rgba(11,13,14,1)",
    };
    let coloursTailwind = {
        "primary": `bg-[rgba(11,107,203,1)]`,
        "primary-text-colour": `text-[rgba(255,255,255,1)]`,
        "secondary": "bg-[#e3e1e1]",
        "tertiary": "bg-[rgba(233,233,233,1)]", //used when highlighting a secondary colour item (switcher)
        "tertiary-semi-transparent": "bg-[rgba(233,233,233,0.9)]",
        //Table Colours
        "rows-colour1": `bg-[rgb(210,214,218)]`,
        "rows-colour2": `bg-[rgb(230,234,243)]`,
        "rows-text-colour": `text-[${colours["rows-text-colour"]}]`,

    }
    colours["primaryTailwind"] = "bg-["+colours["primary"]+"]"

    const [CurrentTableData, SetCurrentTableData] = useState(null);
    const [HistoryTableData, SetHistoryTableData] = useState(null);
    //Stores the currently displayed data
    const [DisplayedTableData, SetDisplayedTableData] = useState([[]]);

    const CurrentTableHeaders = ["Job ID", "User ID", "Description", "Due"];
    const CurrentTableWidths = ["w-[10%]", "w-[10%]", "w-[70%]", "w-[10%]"];
    const HistoryTableHeaders = ["Job ID", "User ID", "Description",];
    const HistoryTableWidths = ["w-[10%]", "w-[10%]", "w-[80%]"];
    //Used to determine which is the currently selected data (Current=0 or History=1)
    const [CurrentIndex, SetIndex] = useState(0);

    const [PageNumber, SetPageNumber] = useState(1);

    document.title = "Dashboard | Tell Me When";
    useEffect(() => {
        //This code will run when the value of "CurrentIndex" changes

        
        //    TO-DO: SWAP BETWEEN THE CURRENT DATA WHEN THE INDEX CHANES
        
        if(CurrentIndex == 0)
        {
            //DUMMY DATA
            SetDisplayedTableData([["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
                ["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],
            ])
        }
        else
        {
            SetDisplayedTableData([[]])
        }
    }, [CurrentIndex]);

    useEffect(() => {
        //Code below will run when the page is initially loaded

        //  TO-DO: ADD API CALLS
    }, []);

    return(
        
        <div className = {"page-content w-[80%] m-auto"}>
            { /* Span element is for the controls above the table (Switcher and Button) to keep them inline*/ }
            <span className = {`sticky top-[15px] ${coloursTailwind["tertiary"]} border-[1px] mb-[10px] border-[#A0A0A0] w-[98%] m-auto rounded-lg shadow-lg flex mt-[20px] justify-between items-center h-[60px]`}>
                <Tabs className = "w-[200px] outline ml-[6px] outline-[1px] outline-[#B8B8B8] rounded-[10px]"
                      onChange={(event, index) => {SetIndex(index);}}>
                    <TabList
                            disableUnderline
                            sx={{
                                p: 0.5,
                                gap: 0,
                                borderRadius: '10px',
                                bgcolor: colours["secondary"],
                                // Overwrites the styling for the currently selected tab
                                [`& .${tabClasses.root}[aria-selected="true"]`]: {
                                    boxShadow: 'sm',
                                    bgcolor: colours["primary"],// HEADER COLOUR:'rgba(10, 83, 151, 1)',
                                    color: colours["primary-text-colour"],
                                },
                                /* Overwrites the styling for all the children(Tabs) */
                                [`& .${tabClasses.root}`]: {
                                    px: 5,
                                    flex: 1,
                                    height: "40px",
                                    transition: '0.25s',
                                    fontWeight: '650',
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
                <span className="mr-[10px]">
                    <Button endDecorator={<Add/>}
                            sx={{
                                fontWeight: "650",
                                bgcolor: colours["primary"], 
                                color: colours["primary-text-colour"]}
                            }
                            className="h-[40px] font-bold" 
                            onClick={()=>{console.log("REDIRECT TO OTHER PAGE")}}>New Job</Button>
                </span>
            </span>
            <div className="w-full rounded-md overflow-hidden shadow-md border-[1px] border-[#AFAFAF]">
            <table key={CurrentIndex/* This is needed as the width of table doesn't update */}
                   className="text-left w-[100%] h-[80%]">
                <thead className={``}>
                    <tr className = {`${coloursTailwind["primary"]} ${coloursTailwind["primary-text-colour"]} h-[40px]`}>
                        {/* Ternary operator for an if statement to determine which table headers are to be displayed */}
                        {CurrentIndex == 0 ? CurrentTableHeaders.map((item, index) => {
                                return <th key={index} className={`px-[10px] ${index!=0?`border-l-[2px] border-[rgba(0,0,0,0.2)]`:{}} ${CurrentTableWidths[index]}`}>{item}</th>
                            }) : HistoryTableHeaders.map((item, index) => {
                                    return <th key={index} className={`px-[10px] ${index!=0?`border-l-[2px] border-[rgba(0,0,0,0.2)]`:{}} ${HistoryTableWidths[index]}`}>{item}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody className="">
                    {DisplayedTableData.map((item1, index1) => {
                        //Iterates through each item in the data and adds it to the table
                        return(<tr key={index1}
                                   className={index1%2==1?coloursTailwind["rows-colour1"] : coloursTailwind["rows-colour2"]}>
                            {item1.map((item2, index2) => {
                                return<td className={`${index2!=0?`border-l-[2px]`:{}} px-[10px] py-[5px] border-[rgba(0,0,0,0.2)]`} key={index2}>{item2}</td>;
                            })}
                            </tr>);
                        })}
                </tbody>
            </table>
            </div>
            <Pagination className = "sticky w-[100%] mt-[20px] bottom-[15px] justify-self-center flex justify-center"
                        buttonColour={colours["primary"]}
                        fontColourButtons={colours["primary-text-colour"]}
                        SetPageNumber={SetPageNumber}
                        PageNumber={PageNumber}
                        bgColour={colours["tertiary"]}
                        border="true"/>
            
            <div className="bottom-margin mb-[30px]" />
        </div>
    );
}
export default Page;