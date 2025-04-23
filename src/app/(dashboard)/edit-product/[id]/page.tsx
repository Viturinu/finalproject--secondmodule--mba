"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, Tick02Icon, UnavailableIcon, ImageUpload01Icon } from "@hugeicons/core-free-icons";
import { SelectCategory } from "../../components/select-category";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProductById, GetProductByIdResponse } from "@/app/api/get-product-by-id";
import { use, useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { editProduct } from "@/app/api/edit-product";
import Image from "next/image";
import { formatToBRL } from "@/utils/format-brl-price";

interface DynamicRouteProps {
    params: Promise<{ id: string }>;
}

export interface categoryItem {
    id: string;
    title: string;
    slug: string;
}

const ProductFormSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    priceInCents: z.string().min(1, "Preço é obrigatório"),
    category: z.string(),
    status: z.string().nullable(),
    attachmentsId: z.string().optional(), // já existe imagem?
});

export type ProductFormType = z.infer<typeof ProductFormSchema>;

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"]; //array com os tipos que o zod vai aceitar no file

const imageUploadSchema = z.object({ //schema pro zod
    file: z.custom<FileList>()
        .refine((files) => Array.from(files ?? []).length !== 0, "A imagem do profile é obrigatória")
        .refine((files) => Array.from(files ?? []).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)), "Tipo de arquivo precisa ser uma imagem PNG/JPEG/JPG/WEBP.")
});

export type photoType = z.infer<typeof imageUploadSchema>;

export default function EditProduct({ params }: DynamicRouteProps) {

    const resolvedParams = use(params); // <--- aqui está a mágica, aceita mesmo em um client component aguardar a que a promise seja resolvida - params na rota é uma promise (isso é um ajeito do next) - poderiamos também criar um client component com o cerne da pagina, deixar este page.tsx como server async, e aí chamavamos o client component criado passando o params, que poderá ser recebido da forma tradicional, sem este Promise como está ali na tipagem; vou deixar assim para aprender e ter como base mais uma situçaõ no next;

    const [photoFileList, setPhotoFileList] = useState<FileList>();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const router = useRouter();

    const { data: productRecovered } = useQuery<GetProductByIdResponse>({
        queryKey: ["product-recovered"],
        queryFn: () => getProductById(resolvedParams.id),
    })

    const { mutateAsync: editProductFn } = useMutation({
        mutationKey: ["editProduct"],
        mutationFn: editProduct,
    })

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { isSubmitting, errors },
    } = useForm<ProductFormType>({
        resolver: zodResolver(ProductFormSchema),
        defaultValues: {
            id: productRecovered?.product.id,
            attachmentsId: productRecovered?.product.attachments?.[0]?.id ?? undefined, // isso que permite a validação funcionar!
            category: productRecovered?.product.category.id,
            description: productRecovered?.product.description,
            priceInCents: productRecovered?.product.priceInCents ? formatToBRL(productRecovered?.product.priceInCents) : String(productRecovered?.product.priceInCents),
            status: productRecovered?.product.status,
            title: productRecovered?.product.title
        }
    });

    function handleNavigateBack() {
        router.back()
    }

    function handlePreLoadImage(files: FileList) { //aqui ele vai carregar a imagem selecionada pelo usuário, apenas na screen, não está subindo ainda
        const result = imageUploadSchema.safeParse({ file: files });

        if (!result.success) {
            toast.error(result.error.errors[0].message);
            return;
        }
        setPhotoFileList(result.data.file); //aqui é o FileList
        const url = URL.createObjectURL(result.data.file[0]); //aqui é o File do FileList que é necessario pra carregar o object url
        setPreviewUrl(url); //pra atualizar a imagem do produto    
    }

    function handleEditProduct(data: ProductFormType) {
        try {
            const newImage = photoFileList; //FileList do input que veio do estado criado pra armazenar esse estado
            const attachamentsId = productRecovered?.product.attachments[0]?.id; //id que ja existia da imagem

            editProductFn({
                id: data.id,
                title: data.title,
                description: data.description,
                priceInCents: formatToBRL(data.priceInCents),
                category: data.category,
                status: data.status,
                attachmentsId: newImage ? undefined : attachamentsId, //se tiver imagem nova, ele fica undefined pois o attachment id será outro; caso contrario, ele mantem e sobe este novamente pro backend
                files: photoFileList
            });

            toast.success("Produto editado com sucesso!");
            router.push("/my-products");
        } catch {
            toast.error("Erro na edição do produto.");
        }
    }

    useEffect(() => {
        if (errors.attachmentsId) {
            toast.error("Erro no anexo do formulário");
        }
        if (errors.category) {
            toast.error("Erro na categoria");
        }
        if (errors.description) {
            toast.error("Erro na descrição");
        }
        if (errors.priceInCents) {
            toast.error("Erro no preço" + errors.priceInCents.message);
        }
        if (errors.status) {
            toast.error("Erro no status" + errors.status.message);
        }
        if (errors.title) {
            toast.error("Erro no titulo");
        }
        if (errors.id) {
            toast.error("Erro no id" + errors.id.message);
        }
        // if (errors.) {
        //     toast.error("Erro no files" + errors.files.message);
        // }
    }, [errors.attachmentsId, errors.category, errors.description, errors.priceInCents, errors.status, errors.title, errors.id]);

    useEffect(() => {
        if (productRecovered?.product) { //é preciso pois useQuery é assincrono e o defaultValues do useForm é carregado no momento da renderização; como o useQuery é assincrono podemos não ter o valor naquele dado momento
            reset({
                id: productRecovered.product.id,
                attachmentsId: productRecovered.product.attachments[0].id,
                category: productRecovered.product.category.id,
                description: productRecovered.product.description,
                priceInCents: formatToBRL(productRecovered.product.priceInCents),
                status: productRecovered.product.status,
                title: productRecovered.product.title,
                // files: {} as FileList, // <- se necessário
            });
        }

    }, [productRecovered, reset]);

    return (
        <div className="flex flex-col flex-1 mx-42 gap-10 mt-16">
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <div className="flex gap-2 mb-2 items-center cursor-pointer" onClick={handleNavigateBack}>
                        <HugeiconsIcon icon={ArrowLeft02Icon} width={20} height={20} className="text-orange-base" />
                        <span className=" text-orange-base font-(family-name:--font-dm-sans)">Voltar</span>
                    </div>
                    <h2 className="font-bold text-2xl font-(family-name:--font-dm-sans)">Editar produto</h2>
                    <span className=" text-gray-400 font-(family-name:--font-dm-sans)">Gerencie as informações do produto cadastrado</span>
                </div>

                <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <div className="flex gap-3 mr-4 items-end">
                            <div className={`flex gap-2 text-orange-base font-(family-name:--font-dm-sans) ${field.value === "cancelled" ? "opacity-70 cursor-not-allowed" : "opacity-100 cursor-pointer"}`} onClick={() => field.onChange(field.value === "available" ? field.value = "sold" : field.value === "sold" ? field.value = "available" : field.value = "cancelled")}>
                                <HugeiconsIcon icon={Tick02Icon} width={20} height={20} className="text-orange-base" />
                                {field.value === "sold" ? "Marcar como disponível" : "Marcar como vendido"}
                            </div>
                            <div className={`flex gap-2 text-orange-base font-(family-name:--font-dm-sans) ${field.value === "sold" ? "opacity-70 cursor-not-allowed" : "opacity-100 cursor-pointer"}`} onClick={() => field.onChange(field.value === "available" ? field.value = "cancelled" : field.value === "cancelled" ? field.value = "available" : field.value)}>
                                <HugeiconsIcon icon={UnavailableIcon} width={20} height={20} className="text-orange-base" />
                                {field.value === "cancelled" ? 'Ativar anuncio' : 'Desativar anúncio'}
                            </div>
                        </div>

                    )}
                />
            </div>

            <div className="flex flex-row gap-5">
                <div className="flex relative w-[30vw] h-104 rounded-3xl bg-shape justify-center items-center cursor-pointer overflow-hidden">
                    {
                        productRecovered?.product?.attachments[0]?.url ?
                            <Image src={previewUrl ?? productRecovered?.product?.attachments[0].url} alt="Imagem do produto a ser editado" fill style={{ objectFit: 'cover' }}
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
                                    <input type="text" className="font-(family-name:--font-poppins-sans) outline-0 h-12" {...register("priceInCents")} />
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
                                    <SelectCategory id={field.value} onChange={field.onChange} className="outline-0" />
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-10">
                        <button className="flex flex-1 h-12 rounded-xl text-sm bg-transparent text-orange-base border-1 border-orange-base justify-center items-center px-4 cursor-pointer font-(family-name:--font-poppins-sans)" onClick={handleNavigateBack}>
                            Cancelar
                        </button>

                        <button className="flex flex-1 h-12 rounded-xl text-sm text-white bg-orange-base justify-center items-center px-4 cursor-pointer font-(family-name:--font-poppins-sans)" onClick={handleSubmit(handleEditProduct)} disabled={isSubmitting}>
                            Salvar e atualizar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

