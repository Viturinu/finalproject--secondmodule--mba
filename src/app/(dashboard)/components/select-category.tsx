"use client"

import { GetCategories } from "@/app/api/get-categories";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query";

type SelectCategoryProps = {
    id: string; //id da categoria cadastrado no banco de dados
    onChange: (id: string) => void;
};

export function SelectCategory({ id, onChange }: SelectCategoryProps) {

    const { data: categoriesResponse } = useQuery<GetCategories>({
        queryKey: ["categories"],
        queryFn: GetCategories,
    })

    return (
        <Select defaultValue={id} onValueChange={onChange}>
            <SelectTrigger className="w-full mt-3 p-0 border-0 outline-0 ">
                <div className="flex h-12 m-0 pr-2 items-start mt-3 outline-0 justify-between border-b-0.5 border-gray-300 ">
                    <span className="font-(family-name:--font-poppins-sans) text-gray-900 text-[17px]">
                        <SelectValue placeholder="Selecione uma categoria" />
                    </span>
                </div>
            </SelectTrigger>
            <SelectContent className="font-(family-name:--font-poppins-sans) text-gray-400 text-[17px]">
                {
                    categoriesResponse?.categories.map(item => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>) //aqui ele está passando todas as categorias recuperadas ali acima, e o value é o id dela, que equivale ao dizer (no campo - que o usuário enxerga) "item.title"
                }
            </SelectContent>
        </Select>
    )
}

{/* <div className="flex h-10 pr-2 items-start mt-3 outline-0 justify-between border-b-0.5 border-gray-300 ">
    <span className="font-(family-name:--font-poppins-sans) text-gray-400">
        Selecione
    </span>
    <HugeiconsIcon icon={ArrowDown01Icon} width={24} height={24} className="text-gray-600" />
</div> */}