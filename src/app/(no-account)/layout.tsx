import Image from "next/image";
import { ReactNode } from "react";
import BackgroundLogin from "../../../public/BackgroundLogin.svg";
import Logo from "../../../public/Logo.svg";

export default function LoginLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <div className="hidden lg:flex flex-col min-w-[55vw] gap-[3.19rem] ">
                <Image src={Logo} height={68} width={267} alt="Logo" className="mt-[2.5rem] ml-[2.5rem]" />
                <Image src={BackgroundLogin} width={755} height={496} alt="Background login" className="mx-auto" />
            </div>
            <div className="flex flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    )
}
