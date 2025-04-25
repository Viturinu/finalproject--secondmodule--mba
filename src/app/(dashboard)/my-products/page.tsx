"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, SaleTag01Icon } from "@hugeicons/core-free-icons";
import { ProductCard } from "../components/product-card";
import { useQuery } from "@tanstack/react-query";
import { getMyFilteredProducts, GetMyFilteredProductsResponse } from "@/app/api/get-filtered-my-products";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SelectStatus } from "../components/select-status";

// interface ParamsProps {
//     params: Promise<any>;
// }

export default function MyProduct() {

    const router = useRouter();

    const searchParams = useSearchParams(); //pra recuperar os parametros da url

    const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") ?? ""); //controla os valores dos inputs, pois o value lá está com esse estado (Atenção! lembrar que esse estado é para controlar o input, porém neste caso o fato de definir o value como este estado não faz com que sempre que o usuario digite algo, ele faça a mudança automaticamente aqui no estado; precisamos definir o onChange no input para que atualize sempre que o campo for mudando)
    const [statusFilter, setStatusFilter] = useState(searchParams.get("statusFilter") ?? ""); //controla os valores dos inputs, pois o value lá está com esse estado
    const [filterFlag, setFilterFlag] = useState(false);

    //tem que ser variavel normal aqui, pois se for um estado sendo definido entra em loop infinito, por isso como precisamos tambṕem da atualização do estado pra preencher os inputs na pagina, preenchemos os estados no useEffect e aqui recuperamos os params para passar ao useQuery, assim ele faz a chamada a API e recupera todos os dados.

    function handleApplyFilters() {
        setFilterFlag(prev => !prev); //esse estado é apenas para fazr o useQuery refazer a busca, pois se não tivermos ela e deixarmos a dependencia para o statusFilter e searchTerm, ela vai ficar atualizando a busca antges mesmo de jogar pra url, salvando o estado da query.
        router.push(`/my-products?searchTerm=${searchTerm}&statusFilter=${statusFilter}`);//redirecionando pro links com os params
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleApplyFilters();
        }
    }

    const { data: getMyFilteredProductsResponse } = useQuery<GetMyFilteredProductsResponse>({
        queryKey: ["my-filtered-products", filterFlag],
        queryFn: () => getMyFilteredProducts({ searchTerm, statusFilter }),
        // enabled: searchTerm !== "" || statusFilter !== "", // só executa se tiver algum valor , uma opção mas aqui não funciona pois os valores em momentos de zero parametros serão strings vazias, resultando em erro porque a função pra API não será chamada

    });

    function handleGetIntoAProduct(id: string) {
        router.push(`/edit-product/${id}`) //como eu não consigo mandar parametros via page.tsx, vamos ter que fazer outra chamada à api de lá... comportamento para ficar atento e memorizar, este é o fluxo aqui;
    }

    function onChangeStatus(value: string) { //altera o valor no ato da mudança do select, que tem um onChange lá dentro do componente recebendo um parametro (neste parametro estamos passando essa função)
        setStatusFilter(value);
    }

    // useEffect(()=>{ //A melhor pratica é fazer isso na função ts que recupera esses dados

    // }, [getMyFilteredProductsResponse])

    useEffect(() => {

    }, [searchTerm]) //apenas o searchTerm pois o status já tem um onChange que fica responsavel por re-renderizar, entãop não precisa passar aqui; isso aqui foi necessário pois o searchTerm não estava recuperando o valor

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
                            <input defaultValue={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" id="searchTerm" placeholder="Pesquisar" className="text-gray-800 placeholder:text-gray-400 outline-0" onKeyDown={handleKeyDown} />
                        </div>

                        <div className="flex gap-2 w-full items-center h-12 text-gray-300 border-b-1">
                            <HugeiconsIcon icon={SaleTag01Icon} />
                            <SelectStatus status={statusFilter} onChange={onChangeStatus} />
                        </div>

                        <button className="flex h-12 rounded-xl text-sm text-white bg-orange-base justify-center items-center px-4 cursor-pointer font-(family-name:--font-poppins-sans) mt-10" onClick={handleApplyFilters}>
                            Aplicar filtro
                        </button>
                    </div>
                </div>

                <div className="flex flex-1">
                    <div className="grid grid-cols-2 gap-5">
                        {
                            getMyFilteredProductsResponse?.products.map(item => (
                                <ProductCard key={item.id} name={item.title} price={item.priceInCents} imageSrc={item.attachments[0].url} description={item.description} category={item.category.slug} status={item.status}
                                    onClick={() => handleGetIntoAProduct(item.id)} />)
                            )
                        }
                    </div>

                </div>

            </div>
        </div>
    )
}