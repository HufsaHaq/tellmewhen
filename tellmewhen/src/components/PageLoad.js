export default function PageLoad({ message = "Loading..." }) {
    return (
        <div className="w-[100%] h-[100%] top-[0px] fixed bg-[#F5F5F5]">
            <div className="w-[100%] fixed top-[50%] h-[100%] bg-[#F5F5F5]">
                <div className="translate-y-[-50%] justify-center">
                    <h1 className="flex justify-center text-stone-400 text-center px-[20px] font-bebas-neue tablet620:text-[80px] max-tablet620:text-[50px]">Tell Me When</h1>
                    <h1 className="flex justify-center text-stone-500 text-center font-semibold text-[20px] mx-auto w-full">{message}</h1>
                </div>

            </div>
        </div>)
}