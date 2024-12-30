/* 

    NOTE: JoyUI uses a different styling engine named Emotion, and so the "sx" property in the
    JoyUI components doesn't use tailwind. However, Tailwind styling still works sometimes for
    the components
    
*/
"use client"; //Makes the page client-side rendered rather than server-side rendered
import { useState, useEffect } from "react";
import {Button, Tab, Tabs, TabList, tabClasses, Table, ButtonGroup, Typography} from "@mui/joy"
import {Add, ArrowBackIos, ArrowBackIosRounded, ArrowForwardIosOutlined, ArrowForwardIosRounded} from "@mui/icons-material"

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

    const [PageNumber, SetPageNumber] = useState(1);

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
                ["1", "1", "CURRENT JOB DATA", "10 hours"],["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
                ["1", "1", "CURRENT JOB DATA", "10 hours"],["2", "1", "CURRENT JOB DATA 2", " 5 Hours"],
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
        
        <div className = "page-content w-[80%] m-auto">
            { /* Span element is for the controls above the table (Switcher and Button) to keep them inline*/ }
            <span className = "w-full flex mt-[20px] justify-between items-center h-[60px] overflow-hidden">
                <Tabs className = "w-[200px] outline outline-[0px] outline-[#B8B8B8] rounded-[10px]"
                      onChange={(event, index) => {SetIndex(index);}}>
                    <TabList
                            disableUnderline
                            sx={{
                            p: 0.5,
                            gap: 0,
                            borderRadius: '10px',
                            bgcolor: 'rgb(227, 225, 225)',
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
                <span>
                    <Button endDecorator={<Add/>} sx={{fontWeight: "650"}}className="h-[40px] font-bold" onClick={()=>{console.log("REDIRECT TO OTHER PAGE")}}>New Job</Button>
                </span>
            </span>
            <div className="w-full rounded-md overflow-hidden shadow-md">
            <Table key={CurrentIndex/* This is needed as the width of table doesn't update */}
                   className="text-left w-[100%] h-[80%]"
                   borderAxis="both"
                   
                   sx={(theme)=>({
                        boxShadow: "md",
                        "& tr":{
                            bgcolor: "rgb(255, 255, 255)",
                            fontWeight: "lg",
                        },
                        
                        "& th": {
                            bgcolor: "rgba(11, 107, 203, 1)",
                            color: "rgb(251, 251, 251)",
                            fontWeight: "650",
                            fontSize: "md",
                    }})}>
                        
                <thead>
                    <tr className = "text-white h-[40px]">
                        {/* Ternary operator for an if statement to determine which table headers are to be displayed */}
                        {CurrentIndex == 0 ? CurrentTableHeaders.map((item, index) => {
                                return <th key={index} className="px-[10px]">{item}</th>
                            }) : HistoryTableHeaders.map((item, index) => {
                                    return <th key={index} className="px-[10px]">{item}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {DisplayedTableData.map((item1, index1) => {
                        //Iterates through each item in the data and adds it to the table
                        return(<tr key={index1}>
                            {item1.map((item2, index2) => {
                                return<td className="px-[10px]" key={index2}>{item2}</td>;
                            })}
                            </tr>);
                        })}
                </tbody>
            </Table>
            </div>
            <div className = "fixed bottom-[20px] w-[80%] justify-self-center flex justify-center">
                    <ButtonGroup className="bg-[#FFFFFF] border-[1px] border-[#C0C0C0]">
                        <Button disabled={PageNumber==1}variant="solid" color="primary" className="" onClick={()=>{PageNumber != 1 ? SetPageNumber(PageNumber-1) : {}}}><ArrowBackIosRounded fontSize="5px"/></Button>
                        <Button>Page {PageNumber}</Button>
                        <Button variant="solid" color="primary" className="" onClick={()=>SetPageNumber(PageNumber+1)}><ArrowForwardIosRounded fontSize="5px"/></Button>
                    </ButtonGroup>
            </div>
            
            <div className="bottom-margin mb-[80px]"></div>
        </div>
    );
}
export default Page;