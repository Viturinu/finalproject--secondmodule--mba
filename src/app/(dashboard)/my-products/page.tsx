"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, SaleTag01Icon } from "@hugeicons/core-free-icons";
import { ProductCard } from "../components/product-card";
import { useQuery } from "@tanstack/react-query";
import { getMyFilteredProducts, GetMyFilteredProductsResponse } from "@/app/api/get-filtered-my-products";
import { useRouter } from "next/navigation";

export default function MyProduct() {

    const router = useRouter();

    const { data: getMyFilteredProductsResponse } = useQuery<GetMyFilteredProductsResponse>({
        queryKey: ["my-filtered-products"],
        queryFn: getMyFilteredProducts,
    });

    function handleGetIntoAProduct(id: string) {
        router.push(`/edit-product/${id}`) //como eu não consigo mandar parametros via page.tsx, vamos ter que fazer outra chamada à api de lá... comportamento para ficar atento e memorizar, este é o fluxo aqui;
    }

    return (
        <div className="flex flex-col flex-1 mx-42 gap-10 mt-16">
            <div className="flex flex-col">
                <h2 className="font-bold text-2xl font-(family-name:--font-dm-sans)">Seus produtos</h2>
                <span className=" text-gray-400 font-(family-name:--font-dm-sans)">Acesse gerencie a sua lista de produtos à venda</span>
            </div>

            <div className="flex flex-row gap-6">

                <div className="flex-col rounded-2xl bg-white w-[26vw] p-6 self-start">
                    <span className="font-semibold text-gray-500 font-(family-name:--font-dm-sans)">Filtrar</span>
                    <div className="flex flex-col mt-6 gap-4">
                        <div className="flex gap-2 w-full items-center h-12 text-gray-300 border-b-1">
                            <HugeiconsIcon icon={Search01Icon} />
                            <input type="text" placeholder="Pesquisar" className="text-gray-400 outline-0" />
                        </div>

                        <div className="flex gap-2 w-full items-center h-12 text-gray-300 border-b-1">
                            <HugeiconsIcon icon={SaleTag01Icon} />
                            <input type="text" placeholder="Status" className="text-gray-400 outline-0" />
                        </div>

                        <button className="flex h-12 rounded-xl text-sm text-white bg-orange-base justify-center items-center px-4 cursor-pointer font-(family-name:--font-poppins-sans) mt-10">
                            Aplicar filtro
                        </button>
                    </div>
                </div>

                <div className="flex flex-1">
                    <div className="grid grid-cols-2 gap-5">
                        {
                            getMyFilteredProductsResponse?.products.map(item => (
                                <ProductCard key={item.id} name={item.title} price={item.priceInCents} imageSrc={item.attachments[0].url} description={item.description}
                                    onClick={() => handleGetIntoAProduct(item.id)} />)
                            )
                        }
                    </div>

                </div>

            </div>
        </div>
    )
}