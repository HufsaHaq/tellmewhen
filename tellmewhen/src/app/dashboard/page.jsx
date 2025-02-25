/* 

    NOTE: JoyUI uses a different styling engine named Emotion, and so the "sx" property in the
    JoyUI components doesn't use tailwind. However, Tailwind styling still works sometimes for
    the components
    
*/
"use client"; //Makes the page client-side rendered rather than server-side rendered
import { useState, useEffect } from "react";
import { Button, Tab, Tabs, TabList, tabClasses, Select, Option, IconButton } from "@mui/joy";
import { Add, CloseRounded } from "@mui/icons-material";
import Pagination from "@/components/Pagination";
import React from "react";
import JobCreation from "@/components/JobCreation";
import CurrentJobDetail from "@/components/CurrentJobDetail";
import FinishJobModal from "@/components/FinishJob";
import HistoryJobDetailModal from "@/components/HistoryJobDetail";

function Page() {
    let colours = {
        header: "#0A5397", //Original colour of the header
        primary: "rgba(11,107,203,1)",
        "primary-text-colour": "rgba(255,255,255,1)",
        secondary: "#e3e1e1",
        "secondary-text-colour": "rgba(103,107,111,1)",
        tertiary: "#e9e9e9", //used when highlighting a secondary colour item (switcher)
        "tertiary-text-colour": "rgba(11,13,14,1)",
    };
    // Needed as Tailwind isn't dynamic, and so cant concatenate the above colours in className prop
    let coloursTailwind = {
        primary: `bg-[rgba(11,107,203,1)]`,
        "primary-text-colour": `text-[rgba(255,255,255,1)]`,
        secondary: "bg-[#e3e1e1]",
        tertiary: "bg-[rgba(233,233,233,1)]", //used when highlighting a secondary colour item (switcher)
        "tertiary-semi-transparent": "bg-[rgba(233,233,233,0.9)]",
        //Table Colours
        "rows-colour1": `bg-[#DFDEDD]`,
        "rows-colour2": `bg-[#f0f0f0]`,
        "rows-text-colour": `text-[${colours["rows-text-colour"]}]`,
    };
    colours["primaryTailwind"] = "bg-[" + colours["primary"] + "]";

    //Job Creation Modal State
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [formData, setFormData] = useState({ description: "", deadline: "" });

    //Job Detail Modal State
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // For Current Jobs
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); // For History Jobs
    
    //Stores the data for the tables
    const [CurrentTableData, SetCurrentTableData] = useState([]);
    const [HistoryTableData, SetHistoryTableData] = useState([]);
    const [selectedJob, setSelectedJob] = useState({ id: "", description: "", deadline: "", status: "" });
    
    //Finish Job Modal State
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
    const [jobToFinish, setJobToFinish] = useState(null);

    //Stores the currently displayed data
    const [DisplayedTableData, SetDisplayedTableData] = useState([]);

    // Stores the necessary table headers and their widths given by percentage of the table    
    const CurrentTableHeaders = ["Job ID", "Description", "Due", "Status"];
    const CurrentTableWidths = ["w-[10%]", "w-[70%]", "w-[10%]", "w-[10%]"];
    const CurrentTableMaxWidths = ["max-w-[10%]", "max-w-[70%]", "max-w-[10%]", "max-w-[10%]"];
    const HistoryTableHeaders = ["Job ID", "User ID", "Remarks", "Completion Date"];
    const HistoryTableWidths = ["w-[10%]", "w-[10%]", "w-[67%]", "w-[13%]"];
    const HistoryTableMaxWidths = ["max-w-[10%]", "max-w-[10%]", "max-w-[67%]", "max-w-[13%]"];


    //Used to determine which is the currently selected data (Current=0 or History=1)
    const [CurrentIndex, SetIndex] = useState(0);

    // Stores the number of rows per page
    const [RowsCount, SetRowsCount] = useState(null);

    //Stores the current page number
    const [PageNumber, SetPageNumber] = useState(1);

    //Stores the end page number
    const [MaxPageNumber, SetMaxPageNumber] = useState(0);

    // Stores a reference to the action for when the dropdown for the rows changes
    const RowsAction = React.useRef(null);

    //Changes the title of the web page
    if (typeof window !== "undefined") document.title = "Dashboard | Tell Me When";

    useEffect(() => {
        let startIndex = (PageNumber - 1) * (RowsCount == null ? 0 : RowsCount);
        let endIndex = PageNumber * (RowsCount == null ? 0 : RowsCount);
        SetDisplayedTableData([]);
        // Set initially incase the data is null
        SetMaxPageNumber(1);
        let tempArray = [];
        if (CurrentIndex == 0) {
            // On the "Current" Page
            if (CurrentTableData == null) {
                return;
            }
            if (RowsCount == null) {
                //When there isn't a limit on the number of rows
                SetDisplayedTableData(CurrentTableData);
                return;
            }
            SetMaxPageNumber(Math.ceil(CurrentTableData.length / RowsCount));
            for (let i = startIndex; i < (endIndex > CurrentTableData.length ? CurrentTableData.length : endIndex); i++) {
                tempArray.push(CurrentTableData[i]);
            }
            SetDisplayedTableData(tempArray);
        } else if (CurrentIndex == 1) {
            // On the "History" Page
            if (HistoryTableData == null) {
                return;
            }
            if (RowsCount == null) {
                // When there isn't a limit on the number of rows
                SetDisplayedTableData(HistoryTableData);
                return;
            }
            SetMaxPageNumber(Math.ceil(HistoryTableData.length / RowsCount));
            for (let i = startIndex; i < (endIndex > HistoryTableData.length ? HistoryTableData.length : endIndex); i++) {
                tempArray.push(HistoryTableData[i]);
            }
            SetDisplayedTableData(tempArray);
        } else {
            throw new Error("Error parsing table data for table " + CurrentIndex);
        }
    }, [RowsCount, PageNumber, CurrentIndex, HistoryTableData, CurrentTableData]);

    useEffect(() => {
        //Code below will run when the page is initially loaded

        //  TO-DO: ADD API CALLS

        // TEMPORARY DATA BELOW FOR TESTING PURPOSES
        SetHistoryTableData([]);
        SetCurrentTableData([]);
        let tempArr = [];
        let tempArr2 = [];
        for (let i = 0; i < 50; i++) {
            tempArr.push(["ID" + (i + 1), "Job Description " + (i + 1), "" + (i + 1) + " hours", ""]);
        }
        SetCurrentTableData(tempArr);
        for (let i = 0; i < 50; i++) {
            tempArr2.push(["ID" + (i + 51), "User" + (i + 1), "Completed this job, This is the job " + (i + 1), i + 1 + " hours ago"]);
        }

        SetHistoryTableData(tempArr2);
    }, []);

    //Function to open the modal
    const handleOpenCreationModal = () => setIsCreationModalOpen(true);

    //Function to close the modal
    const handleCloseModal = () => {
        setIsCreationModalOpen(false);
        setFormData({ description: "", deadline: "" });
    };

    //Function to handle the confirm button in the modal
    const handleConfirmModal = () => {
        const newJob = ["ID" + (CurrentTableData.length + 1), formData.description, formData.deadline, formData.status];
        SetCurrentTableData([...CurrentTableData, newJob]);
        setIsCreationModalOpen(false);
        setFormData({ description: "", deadline: "", status: "" });
    };

    //Function to handle the input change in the modal
    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    //Function to handle the row click in the table
    const handleRowClick = (job) => {
        if (CurrentIndex === 0) {
            // Current Jobs
            setSelectedJob({
                id: job[0],
                description: job[1],
                deadline: job[2],
                status: job[3],
            });
            setIsDetailModalOpen(true);
        } else if (CurrentIndex === 1) {
            // History Jobs
            setSelectedJob({
                id: job[0],
                userId: job[1],
                remarks: job[2],
                completionDate: job[3],
            });
            setIsHistoryModalOpen(true);
        }
    };

    //Function to handle the close button in the modal
    const handleUpdateJob = (updatedData) => {
        const updatedJobs = CurrentTableData.map((job) => (
            job[0] === updatedData.id 
                ? [updatedData.id, updatedData.description, updatedData.deadline, updatedData.status] 
                : job
        ));
        SetCurrentTableData(updatedJobs);
        setIsDetailModalOpen(false);
    };

    //Function to handle the finish job button
    const handleOpenFinish = () => {
        // We'll finish whichever job is currently selected
        setJobToFinish(selectedJob);
        setIsFinishModalOpen(true);
    };

    //Function to handle the finish job button
    const handleFinishJob = (remarks) => {
        if (!jobToFinish) return;

        // 1) Remove from Current
        const newCurrent = CurrentTableData.filter(
            (job) => job[0] !== jobToFinish.id
        );

        // 2) Add to History
        // e.g. [id, userId, remarks, completionDate]
        const newHistoryRow = [
            jobToFinish.id,
            "UserXYZ", // or some real user from your system
            remarks,
            new Date().toISOString().slice(0, 10), // e.g. "2025-01-27"
        ];

        SetCurrentTableData(newCurrent);
        SetHistoryTableData((prev) => [...prev, newHistoryRow]);

        // Close both modals
        setIsFinishModalOpen(false);
        setIsDetailModalOpen(false);
    };

    return (
        <div className={"page-content w-[80%] m-auto"}>
            {/* Span element is for the controls above the table (Switcher and Button) to keep them inline*/}
            <span className={`z-10 transition ease-in-out hover:scale-[100.75%] sticky top-[15px] ${coloursTailwind["tertiary"]} border-[1px] mb-[10px] border-[#A0A0A0] w-[98%] m-auto rounded-lg shadow-lg flex mt-[20px] justify-between items-center h-[60px]`}>
                <Tabs
                    className="w-[200px] outline ml-[6px] outline-[1px] outline-[#B8B8B8] rounded-[10px]"
                    onChange={(event, index) => {
                        SetIndex(index);
                        SetPageNumber(1);
                    }}
                >
                    <TabList
                        disableUnderline
                        sx={{
                            p: 0.5,
                            gap: 0,
                            borderRadius: "10px",
                            bgcolor: colours["secondary"],
                            // Overwrites the styling for the currently selected tab
                            [`& .${tabClasses.root}[aria-selected="true"]`]: {
                                boxShadow: "sm",
                                bgcolor: colours["primary"], // HEADER COLOUR:'rgba(10, 83, 151, 1)',
                                color: colours["primary-text-colour"],
                            },
                            /* Overwrites the styling for all the children(Tabs) */
                            [`& .${tabClasses.root}`]: {
                                px: 5,
                                flex: 1,
                                height: "40px",
                                transition: "0.25s",
                                fontWeight: "650",
                                fontSize: "md",
                                [`&:not(.${tabClasses.selected}):not(:hover)`]: {
                                    opacity: 0.7,
                                },
                            },
                        }}
                    >
                        <Tab disableIndicator>Current</Tab>
                        <Tab disableIndicator>History</Tab>
                    </TabList>
                </Tabs>
                <span className="mr-[10px] inline flex my-auto">
                    {/* Dropdown for the number of rows per page */}
                    <Select
                        className="outline outline-[1px] mr-[15px] my-auto"
                        action={RowsAction}
                        value={RowsCount}
                        placeholder="Rows"
                        sx={{
                            width: "90px",
                            height: "10px",
                            fontSize: "15px",
                        }}
                        onChange={(event, newValue) => {
                            SetRowsCount(newValue);
                            SetPageNumber(1);
                        }}
                        {...(RowsCount != null && {
                            endDecorator: (
                                <IconButton
                                    onMouseDown={(event) => {
                                        event.stopPropagation();
                                    }}
                                    onClick={() => {
                                        SetRowsCount(null);
                                        RowsAction.current?.focusVisible();
                                    }}
                                >
                                    <CloseRounded />
                                </IconButton>
                            ),
                            indicator: null,
                        })}
                    >
                        <Option value={10}>10</Option>
                        <Option value={20}>20</Option>
                        <Option value={50}>50</Option>
                    </Select>
                    <Button
                        endDecorator={<Add />}
                        sx={{
                            fontWeight: "650",
                            bgcolor: colours["primary"],
                            color: colours["primary-text-colour"],
                        }}
                        className="h-[40px] font-bold"
                        onClick={handleOpenCreationModal}
                    >
                        New Job
                    </Button>
                </span>
            </span>
            <div className="w-full overflow-hidden text-wrap rounded-md shadow-md border-[1px] border-[#AFAFAF]">
                <table key={CurrentIndex /* This is needed as the width of table doesn't update */} className="text-left w-[100%] h-[80%] overflow-visible rounded-md">
                    <thead className={``}>
                        <tr className={`${coloursTailwind["primary"]} text-wrap ${coloursTailwind["primary-text-colour"]} h-[40px]`}>
                            {/* Ternary operator for an if statement to determine which table headers are to be displayed */}
                            {CurrentIndex == 0
                                ? CurrentTableHeaders.map((item, index) => {
                                      return (
                                          <th key={index} className={`px-[10px] text-wrap ${CurrentTableMaxWidths[index]} ${index != 0 ? `border-l-[2px] border-[rgba(0,0,0,0.2)]` : {}} ${CurrentTableMaxWidths[index]} ${CurrentTableWidths[index]}`}>
                                              {item}
                                          </th>
                                      );
                                  })
                                : HistoryTableHeaders.map((item, index) => {
                                      return (
                                          <th key={index} className={`px-[10px] text-wrap ${index != 0 ? `border-l-[2px] border-[rgba(0,0,0,0.2)]` : {}} ${HistoryTableMaxWidths[index]} ${HistoryTableWidths[index]}`}>
                                              {item}
                                          </th>
                                      );
                                  })}
                        </tr>
                    </thead>
                    <tbody className="overflow-visible">
                        {DisplayedTableData.map((item1, index1) => {
                            return (
                                <tr
                                    key={index1}
                                    className={`cursor-pointer hover:rounded text-wrap hover:outline hover:outline-[2px] hover:outline-offset-[-1.5px] hover:outline-[rgba(70,70,70,0.6)] ${index1 % 2 === 1 ? coloursTailwind["rows-colour1"] : coloursTailwind["rows-colour2"]}`}
                                    onClick={() => handleRowClick(item1)} // Pass the job data to handleRowClick
                                >
                                    {item1.map((item2, index2) => (
                                        <td className={`${index2 !== 0 ? "border-l-[2px]" : ""} overflow-hidden max-w-[0px] text-pretty px-[10px] py-[5px] border-[rgba(0,0,0,0.2)]`} key={index2}>
                                            {item2}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {RowsCount != null && (
                <Pagination
                    className="fixed w-[80%] bottom-[20px] justify-self-center flex justify-center"
                    buttonColour={colours["primary"]}
                    fontColourButtons={colours["primary-text-colour"]}
                    SetPageNumber={SetPageNumber}
                    PageNumber={PageNumber}
                    bgColour={colours["tertiary"]}
                    MaxPageNumber={MaxPageNumber}
                    border="true"
                />
            )}

            <div className="bottom-margin mb-[70px]" />

            {/* Job Creation Modal */}
            <JobCreation isOpen={isCreationModalOpen} onClose={handleCloseModal} onConfirm={handleConfirmModal} formData={formData} onInputChange={handleInputChange} />
            {/* Job Detail Modal */}
            <CurrentJobDetail isOpen={isDetailModalOpen} jobData={selectedJob} onClose={() => setIsDetailModalOpen(false)} onConfirm={handleUpdateJob} onOpenFinish={handleOpenFinish}/>
            <HistoryJobDetailModal isOpen={isHistoryModalOpen} jobData={selectedJob} onClose={() => setIsHistoryModalOpen(false)} />
            {/* Finish Job Modal */}
            <FinishJobModal isOpen={isFinishModalOpen} job={jobToFinish} onClose={() => setIsFinishModalOpen(false)} onFinish={handleFinishJob}
            />
        </div>
    );
}
export default Page;
