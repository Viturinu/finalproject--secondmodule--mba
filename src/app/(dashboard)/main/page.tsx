"use client"

import { useQuery } from "@tanstack/react-query";
import { CardAmount } from "../components/card-amount";
import { Chart } from "../components/chart";
import { getSoldProducts, GetSoldProductsResponse } from "@/app/api/get-sold-products";
import { getAnnouncedProducts, GetAnnouncedProductsResponse } from "@/app/api/get-announced-products";
import { GetViewsReceivedResponse } from "@/app/api/get-views-received";
import { NavSelector, useContextSignin } from "../components/context";
import { ProductCard } from "../components/product-card";
import { HugeiconsIcon } from "@hugeicons/react";
import { SaleTag01Icon, Search01Icon } from "@hugeicons/core-free-icons";

export default function Main() {

    const { navSelectorPicked } = useContextSignin();

    const { data: soldProducts } = useQuery<GetSoldProductsResponse>({
        queryKey: ["sold-products"],
        queryFn: getSoldProducts,
    })

    const { data: announcedProducts } = useQuery<GetAnnouncedProductsResponse>({
        queryKey: ["announced-products"],
        queryFn: getAnnouncedProducts,
    })

    const { data: viewsReceived } = useQuery<GetViewsReceivedResponse>({
        queryKey: ["announced-products"],
        queryFn: getAnnouncedProducts,
    })

    return (
        <div className="flex flex-col flex-1 p-42 gap-10">
            <div>
                <h2 className="font-bold text-2xl font-(family-name:--font-poppins-sans)">Últimos 30 dias</h2>
                <p className="text-gray-500 font-(family-name:--font-poppins-sans) mt-2">
                    Confira as estatísticas da sua loja no último mês
                </p>
            </div>
            <div className="flex flex-row gap-5">
                <div className="flex flex-col gap-4">
                    <CardAmount title="Produtos vendidos" amount={soldProducts?.amount ?? 0} type="sell" />
                    <CardAmount title="Produtos anunciados" amount={announcedProducts?.amount ?? 0} type="announced" />
                    <CardAmount title="Pessoas visitantes" amount={viewsReceived?.amount ?? 0} type="visitors" />
                </div>
                <Chart />
            </div>
        </div>
    )
}