"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { ImageUpload01Icon } from "@hugeicons/core-free-icons";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatToBRL } from "@/utils/format-brl-price";
import { SelectCategory } from "../components/select-category";
import { createProduct } from "@/app/api/create-product";
import Image from "next/image";

export interface categoryItem {
    id: string;
    title: string;
    slug: string;
}

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"]; //array com os tipos que o zod vai aceitar no file

const ProductFormSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    priceInCents: z.string().min(1, "Preço é obrigatório"),
    category: z.string(),
    status: z.string(),
    files: z.custom<FileList>()
        .refine((files) => Array.from(files ?? []).length !== 0, "A imagem do profile é obrigatória")
        .refine((files) => Array.from(files ?? []).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)), "Tipo de arquivo precisa ser uma imagem PNG/JPEG/JPG/WEBP."),
});

export type CreateProductFormType = z.infer<typeof ProductFormSchema>;

export default function CreateProduct() {

    const [photoFileList, setPhotoFileList] = useState<FileList>();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const router = useRouter();

    const { mutateAsync: createProductFn } = useMutation({
        mutationKey: ["createProduct"],
        mutationFn: createProduct,
    })

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { isSubmitting, errors },
    } = useForm<CreateProductFormType>({
        resolver: zodResolver(ProductFormSchema),
        defaultValues: {
            status: "available",
        }
    });

    function handleNavigateBack() {
        router.back()
    }

    function handleCurrencyChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
        const numeric = Number(raw) / 100;              // Divide por 100 para obter valor com centavos
        const formatted = formatToBRL(numeric);         // Formata para BRL

        setValue("priceInCents", formatted);
    }

    function handlePreLoadImage(files: FileList) { //aqui ele vai carregar a imagem selecionada pelo usuário, apenas na screen, não está subindo ainda
        const url = URL.createObjectURL(files[0]); //aqui é o File do FileList que é necessario pra carregar o object url
        setPreviewUrl(url); //pra atualizar a imagem do produto    
    }

    function handleCreateProduct(data: CreateProductFormType) {
        try {
            createProductFn({
                title: data.title,
                description: data.description,
                priceInCents: formatToBRL(data.priceInCents),
                category: data.category,
                status: data.status,
                files: data.files,
            });

            toast.success("Produto criado com sucesso!");
            router.push("/my-products");
        } catch {
            toast.error("Erro na criação do produto.");
        }
    }

    useEffect(() => {
        if (errors.category) {
            toast.error("Erro na categoria");
        }
        if (errors.description) {
            toast.error("Erro na descrição");
        }
        if (errors.priceInCents) {
            toast.error("Erro no preço");
        }
        if (errors.status) {
            toast.error("Erro no status");
        }
        if (errors.title) {
            toast.error("Erro no titulo");
        }
        if (errors.files) {
            toast.error(errors.files.message);
        }
        // if (errors.) {
        //     toast.error("Erro no files" + errors.files.message);
        // }
    }, [errors.category, errors.description, errors.priceInCents, errors.status, errors.title, errors.files]);

    return (
        <div className="flex flex-col flex-1 mx-42 gap-10 mt-16">
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <h2 className="font-bold text-2xl font-(family-name:--font-dm-sans)">Editar produto</h2>
                    <span className=" text-gray-400 font-(family-name:--font-dm-sans)">Gerencie as informações do produto cadastrado</span>
                </div>
            </div>

            <div className="flex flex-row gap-5">
                <div className="flex relative w-[30vw] h-104 rounded-3xl bg-shape justify-center items-center cursor-pointer overflow-hidden">
                    {
                        previewUrl ?
                            <Image src={previewUrl ?? previewUrl} alt="Imagem do produto a ser editado" fill style={{ objectFit: 'cover' }}
                            />
                            : (
                                <div className="flex flex-col gap-4 items-center ">
                                    <HugeiconsIcon icon={ImageUpload01Icon} width={40} height={40} className="text-orange-base" />
                                    <span className="font-(family-name:--font-poppins-sans) text-gray-600">Selecione a imagem do produto</span>
                                </div>
                            )
                    }
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        {...register("files")}
                        onChange={(e) => {
                            if (e.target.files) handlePreLoadImage(e.target.files);
                        }}
                    />
                </div>
                <div className="flex flex-col flex-1 p-8 bg-white rounded-3xl">
                    <h2 className="font-(family-name:--font-poppins-sans) text-gray-600 font-semibold">Dados do produto</h2>

                    <div className="flex flex-col gap-5 mt-8">
                        <div className="flex gap-5">
                            <div className="flex flex-1 flex-col border-b-1 border-gray-300">
                                <label htmlFor="title" className="font-(family-name:--font-poppins-sans) text-gray-500 text-xs font-semibold">TÍTULO</label>
                                <input type="text" placeholder="Nome do produto" className="font-(family-name:--font-poppins-sans) outline-0 h-12" {...register("title")} />
                            </div>
                            <div className="flex flex-col border-b-1 border-gray-300">
                                <label htmlFor="title" className="font-(family-name:--font-poppins-sans) font-semibold text-gray-500 text-xs">VALOR</label>
                                <div className="flex gap-2 items-center">
                                    <span>R$</span>
                                    <input type="text" className="font-(family-name:--font-poppins-sans) outline-0 h-12" {...register("priceInCents")} onChange={handleCurrencyChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 mt-8">
                        <div className="flex flex-col border-b-1 border-gray-300">
                            <label htmlFor="title" className="font-(family-name:--font-poppins-sans) text-gray-500 text-xs font-semibold">DESCRIÇÃO</label>
                            <textarea placeholder="Descrição" className="flex font-(family-name:--font-poppins-sans) outline-0 h-30 pt-3 text-start" {...register("description")} />
                        </div>
                    </div>

                    <div className="flex mt-8">
                        <div className="flex flex-col flex-1 col-span-4 border-b-1 border-gray-300">
                            <label htmlFor="title" className="font-(family-name:--font-poppins-sans) text-gray-500 text-xs font-semibold">CATEGORIA</label>
                            <Controller
                                control={control}
                                name="category"
                                render={({ field }) => (
                                    <SelectCategory id={field.value} onChange={field.onChange} />
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-10">
                        <button className="flex flex-1 h-12 rounded-xl text-sm bg-transparent text-orange-base border-1 border-orange-base justify-center items-center px-4 cursor-pointer font-(family-name:--font-poppins-sans)" onClick={handleNavigateBack}>
                            Cancelar
                        </button>

                        <button className="flex flex-1 h-12 rounded-xl text-sm text-white bg-orange-base justify-center items-center px-4 cursor-pointer font-(family-name:--font-poppins-sans)" onClick={handleSubmit(handleCreateProduct)} disabled={isSubmitting}>
                            Salvar e atualizar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

