"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SaleTag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type SelectCategoryProps = {
    status: string; //id da categoria cadastrado no banco de dados
    onChange: (status: string) => void;
}

export enum Status {
    Available = "available",
    Sold = "sold",
    Cancelled = "cancelled",
}

export function SelectStatus({ status, onChange }: SelectCategoryProps) {

    return (
        <div className="border-0 outline-0 flex-1">
            <Select onValueChange={onChange} value={status}>
                <SelectTrigger className="w-full mt-3 p-0 border-0 outline-0 ">
                    <div className="flex h-12 m-0 pr-2 items-start mt-3 outline-0 justify-between border-b-0.5 border-gray-300 ">
                        <span className="font-(family-name:--font-poppins-sans) text-gray-900 text-[16px]">
                            <SelectValue placeholder="Status" className="placeholder:text-gray-400 text-gray-800" />
                        </span>
                    </div>
                </SelectTrigger>
                <SelectContent className="font-(family-name:--font-poppins-sans) text-gray-400 outline-0 focus:outline-0">
                    <SelectItem key={Status.Available} value={Status.Available}>
                        Disponível
                    </SelectItem>

                    <SelectItem key={Status.Sold} value={Status.Sold}>
                        Vendido
                    </SelectItem>

                    <SelectItem key={Status.Cancelled} value={Status.Cancelled}>
                        Cancelado
                    </SelectItem>

                </SelectContent>
            </Select>
        </div>
    )
}
