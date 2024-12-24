function Header()
{
    return(
        // containter div
        <div className = "w-full absolute top-[0px] h-[100px] bg-[#0A5397]">
            {/* div used for centering text vertically and horizontally */}
            <div className = "w-full h-full flex items-center justify-center">
                <h1 className = "text-[50px] text-white font-bebas-neue">Tell Me When</h1>
            </div>
        </div>

    );
}

export default Header;