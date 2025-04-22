import Image from "next/image";
import { categoryItem } from "../edit-product/[id]/page";

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    description: string;
    imageSrc: string;
    price: number;
    category: string;
    status: string;
}

export function ProductCard({ name, imageSrc, price, description, category, status,...rest }: ProductCardProps) {

    return (
        <div className="flex flex-col flex-1 gap-1 bg-white rounded-3xl hover:outline-2 outline-blue-500 cursor-pointer"  {...rest}>
            <div className="relative h-60 p-2 rounded-3xl overflow-hidden object-cover">
                <Image src={imageSrc} alt={`Imagem do produto ${name}`} fill className="p-1 rounded-3xl" />
                <div className="flex absolute right-6 top-6 z-1 gap-2">
                    <span className={`flex rounded-3xl font-semibold font-(family-name:--font-dm-sans) text-white ${status === "sold" ? "bg-green-600" : status === "cancelled" ? "bg-gray-600" : "bg-blue-dark"}  items-center justify-center h-8  w-24 text-sm`}>{status.toUpperCase()}</span>
                    <span className="flex rounded-3xl font-semibold font-(family-name:--font-dm-sans) text-white bg-gray-600 items-center justify-center h-8  w-24 text-sm">MÓVEL</span>
                </div>
            </div>
            <div className="flex flex-col gap-2 p-3">
                <div className="flex justify-between">
                    <span className="font-semibold text-gray-600 font-(family-name:--font-dm-sans) text-2xl">{name}</span>
                    <span className="font-semibold text-gray-600 font-(family-name:--font-dm-sans) text-2xl">{price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}</span>
                </div>
                <p className=" text-gray-400 font-(family-name:--font-dm-sans) text-xl mb-4">
                    {description}
                </p>
            </div>

        </div>
    )
}