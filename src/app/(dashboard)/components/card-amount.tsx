import { SaleTag01Icon, Store04FreeIcons, UserMultipleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface CardProps {
    title: string;
    amount: number;
    type: "sell" | "announced" | "visitors";
}

export function CardAmount({ title, amount = 0, type, ...rest }: CardProps) {
    return (
        <div className=" flex bg-white w-62 h-30 rounded-2xl gap-4 pl-3 items-center" >
            <div className="flex bg-blue-light rounded-2xl h-22 w-20 items-center justify-center">
                <HugeiconsIcon icon={type === "sell" ? SaleTag01Icon : type === "announced" ? Store04FreeIcons : UserMultipleIcon} width={40} height={40} className={type === "visitors" ? "text-gray-500" : "text-blue-dark"} />
            </div>
            <div className="flex flex-col gap-1 h-full justify-center">
                <span className="font-(family-name:--font-dm-sans) text-2xl font-bold">{amount.toLocaleString("pt-BR")}</span>
                <div className="flex w-26 overflow-hidden">
                    <span className="text-gray-500 font-(family-name:--font-poppins-sans) text-xs" >{title}</span>
                </div>
            </div>
        </div>
    )
}