"use client";
import {Button, ButtonGroup} from "@mui/joy"
import {ArrowBackIosRounded, ArrowForwardIosRounded} from "@mui/icons-material"
export default function Pagination({className, 
                                    buttonColour = "grey", 
                                    fontColourButtons = "white", 
                                    bgColour = "white", 
                                    fontColour = "black",
                                    PageNumber = 1,
                                    border=false,
                                    SetPageNumber = ()=>{
                                        throw new Error("Page number function is not assigned. Assign a function to the \"SetPageNumber\" property in the Pagination component.");
                                    }
                                })
{
    return(
        <div className = {className}>
            <ButtonGroup className={!border?"":"border-[1px] border-[#C0C0C0]"}>
                <Button disabled={PageNumber==1}
                        variant="none"
                        sx={(theme) => ({
                            bgcolor: PageNumber == 1 ? bgColour : buttonColour,
                            color: PageNumber == 1 ? fontColour : fontColourButtons,
                        })}
                        className=""
                        onClick={()=>{
                            PageNumber != 1 ? SetPageNumber(PageNumber-1) : {}
                        }}><ArrowBackIosRounded fontSize="5px"/></Button>
                <Button className=""
                        variant="none"
                        disabled
                        sx={{
                            bgcolor: bgColour,
                            color: fontColour,
                            cursor: "default"
                        }}>Page {PageNumber}</Button>
                <Button variant="none"
                        className=""
                        sx={(theme) => ({
                            bgcolor: PageNumber == -1 ? bgColour : buttonColour,
                            color: PageNumber == -1 ? fontColour : fontColourButtons,
                        })}
                        onClick={()=>SetPageNumber(PageNumber+1)}><ArrowForwardIosRounded fontSize="5px"/></Button>
            </ButtonGroup>
        </div>);
}
