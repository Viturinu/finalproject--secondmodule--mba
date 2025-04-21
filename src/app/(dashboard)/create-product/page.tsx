import { HugeiconsIcon } from "@hugeicons/react";
import { Upload01Icon } from "@hugeicons/core-free-icons";
import { SelectCategory } from "../components/select-category";

export default async function CreateProduct() {
    return (
        <div className="flex flex-col flex-1 mx-42 gap-10 mt-16">
            <div className="flex flex-col">
                <h2 className="font-bold text-2xl font-(family-name:--font-dm-sans)">Novo produto</h2>
                <span className=" text-gray-400 font-(family-name:--font-dm-sans)">Cadastre um produto para venda no marketplace</span>
            </div>

            <div className="flex flex-row gap-5">
                <div className="flex w-[30vw] h-104 rounded-3xl overflow-hidden bg-shape justify-center items-center cursor-pointer">
                    <div className="flex flex-col gap-2 items-center text-center">
                        <HugeiconsIcon icon={Upload01Icon} width={40} height={40} className="text-orange-base" />
                        <div className="block w-38">
                            <span className=" font-(family-name:--font-poppins-sans) text-gray-500 text-sm">Selecione a imagem do produto</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 p-8 bg-white rounded-3xl">
                    <h2 className="font-(family-name:--font-poppins-sans) text-gray-600 font-semibold">Dados do produto</h2>

                    <div className="flex flex-col gap-5 mt-8">
                        <div className="flex gap-5">
                            <div className="flex flex-1 flex-col border-b-1 border-gray-300">
                                <label htmlFor="title" className="font-(family-name:--font-poppins-sans) text-gray-500 text-xs font-semibold">TÍTULO</label>
                                <input type="text" placeholder="Nome do produto" className="font-(family-name:--font-poppins-sans) outline-0 h-12 " />
                            </div>
                            <div className="flex flex-col border-b-1 border-gray-300">
                                <label htmlFor="title" className="font-(family-name:--font-poppins-sans) font-semibold text-gray-500 text-xs">VALOR</label>
                                <div className="flex gap-2 items-center">
                                    <span>R$</span>
                                    <input type="text" placeholder="0,00" className="font-(family-name:--font-poppins-sans) outline-0 h-12 " />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 mt-8">
                        <div className="flex flex-col border-b-1 border-gray-300">
                            <label htmlFor="title" className="font-(family-name:--font-poppins-sans) text-gray-500 text-xs font-semibold">DESCRIÇÃO</label>
                            <textarea placeholder="Descrição" className="flex font-(family-name:--font-poppins-sans) outline-0 h-30 pt-3 text-start" />
                        </div>
                    </div>

                    <div className="flex mt-8">
                        <div className="flex flex-col flex-1 col-span-4 border-b-1 border-gray-300">
                            <label htmlFor="title" className="font-(family-name:--font-poppins-sans) text-gray-500 text-xs font-semibold">CATEGORIA</label>
                            <SelectCategory currentValue="Móvel" />

                        </div>
                    </div>

                    <div className="flex gap-4 mt-10">
                        <button className="flex flex-1 h-12 rounded-xl text-sm bg-transparent text-orange-base border-1 border-orange-base justify-center items-center px-4 cursor-pointer font-(family-name:--font-poppins-sans) ">
                            Cancelar
                        </button>

                        <button className="flex flex-1 h-12 rounded-xl text-sm text-white bg-orange-base justify-center items-center px-4 cursor-pointer font-(family-name:--font-poppins-sans) ">
                            Salvar e atualizar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}