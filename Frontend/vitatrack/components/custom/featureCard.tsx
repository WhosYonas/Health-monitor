import Link from "next/link"

export function featureCard(label:string, description:string, image:string, icon:string, link:string = "") {
    let backDivStyle: string = "relative transform-transition flex w-[450px] h-[550px] bg-[url(@/../public/"
    backDivStyle += image
    backDivStyle += ")] bg-center rounded-lg overflow-hidden items-center justify-center bg-cover"

    return ( 
    <Link href={link}>
        <div className="flex group relative w-[450px] h-[550px] items-center justify-center rounded-lg overflow-hidden">
            <img src={image} className="absolute w-full h-full object-cover"></img>
            <div className="absolute inset-0 w-full h-full bg-teal-600 group-hover:bg-teal-600/80 mix-blend-multiply backdrop-blur-[8px] group-hover:backdrop-blur-[6px] duration-700 group-hover:cursor-pointer" />
            <div className="group flex flex-col items-center">
                <img src={icon} className="relative w-20 h-20 cursor-pointer select-none"></img>
                <h1 className="relative text-white text-3xl font-bold select-none cursor-pointer">{label}</h1>
                <h1 className="relative text-white text-xl w-[70%] p-4 text-center select-none cursor-pointer">{description}</h1>
            </div>
        </div>
    </Link>
    )
}