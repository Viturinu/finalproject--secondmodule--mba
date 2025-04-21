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
    category: z.string().min(1, "Categoria é obrigatória"),
    status: z.boolean(),
    attachmentsId: z.string().optional(), // já existe imagem?
    files: z
        .any()
        .optional(), // a validação de obrigatoriedade vai vir depois com refine
}).refine((data) => {
    // Se não tem imagem antiga, então `files` precisa ter pelo menos um arquivo
    if (!data.attachmentsId && (!data.files || data.files.length === 0)) {
        return false;
    }
    return true;
}, {
    message: "A imagem do produto é obrigatória",
    path: ["files"], // Aponta o erro pro campo certo
});

export type ProductFormType = z.infer<typeof ProductFormSchema>;

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"]; //array com os tipos que o zod vai aceitar no file

const imageUploadSchema = z.object({ //schema pro zod no preview da imagem
    files: z.custom<File>()
        .refine((file => ACCEPTED_IMAGE_TYPES.includes(file.type)), "Tipo de arquivo precisa ser uma imagem PNG/JPEG/JPG/WEBP.")
});

export default function EditProduct({ params }: DynamicRouteProps) {

    const resolvedParams = use(params); // <--- aqui está a mágica, aceita mesmo em um client component aguardar a que a promise seja resolvida - params na rota é uma promise (isso é um ajeito do next) - poderiamos também criar um client component com o cerne da pagina, deixar este page.tsx como server async, e aí chamavamos o client component criado passando o params, que poderá ser recebido da forma tradicional, sem este Promise como está ali na tipagem; vou deixar assim para aprender e ter como base mais uma situçaõ no next;

    const router = useRouter()

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data: productRecovered } = useQuery<GetProductByIdResponse>({
        queryKey: ["product-recovered"],
        queryFn: () => getProductById(resolvedParams.id),
    })

    const { mutateAsync: editProductFn } = useMutation({
        mutationKey: ["productRecovered?.product.id"],
        mutationFn: editProduct,
    })

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        trigger,
        formState: { isSubmitting, errors },
    } = useForm<ProductFormType>({
        resolver: zodResolver(ProductFormSchema),
        defaultValues: {
            id: productRecovered?.product.id,
            attachmentsId: productRecovered?.product.attachments?.[0]?.id ?? undefined, // isso que permite a validação funcionar!
            category: productRecovered?.product.category.id,
            description: productRecovered?.product.description,
            priceInCents: String(productRecovered?.product.priceInCents),
            status: Boolean(productRecovered?.product.status),
            title: productRecovered?.product.title
        }
    });

    function handleNavigateBack() {
        router.back()
    }

    function handlePreLoadImage(event: React.ChangeEvent<HTMLInputElement>) { //aqui ele vai carregar a imagem selecionada pelo usuário, apenas na screen, não está subindo ainda
        const file = event.target.files?.[0];
        const result = imageUploadSchema.safeParse({ files: file });

        if (!result.success) { //verificando se o zod validou, caso não ele entra na função
            toast.error(result.error.errors[0].message);
            return;
        }
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setValue("files", event.target.files!, { shouldValidate: true }); // <- Aqui é o ouro
            trigger("files"); // <- Garante que o campo seja validado
        }
    }

    function handleEditProduct(data: ProductFormType) {
        try {
            const newImage = data.files?.[0];
            const attachamentsId = productRecovered?.product.attachments[0]?.id;

            editProductFn({
                id: data.id,
                title: data.title,
                description: data.description,
                priceInCents: data.priceInCents,
                category: data.category,
                status: data.status,
                attachmentsId: newImage ? undefined : attachamentsId,
                files: newImage ? data.files : undefined,
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
        if (errors.files) {
            toast.error("Erro no files" + errors.files.message);
        }
    }, [errors.attachmentsId, errors.category, errors.description, errors.priceInCents, errors.status, errors.title, errors.id, errors.files]);

    useEffect(() => {
        if (productRecovered?.product) { //é preciso pois useQuery é assincrono e o defaultValues do useForm é carregado no momento da renderização; como o useQuery é assincrono podemos não ter o valor naquele dado momento
            reset({
                id: productRecovered.product.id,
                attachmentsId: productRecovered.product.attachments[0].id,
                category: productRecovered.product.category.id,
                description: productRecovered.product.description,
                priceInCents: String(productRecovered.product.priceInCents),
                status: Boolean(productRecovered.product.status),
                title: productRecovered.product.title,
                files: {} as FileList, // <- se necessário
            });
        }

        // 🔥 Força nova validação
        trigger();
    }, [productRecovered, reset, trigger]);

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
                            <div className={`flex gap-2 text-orange-base font-(family-name:--font-dm-sans) cursor-pointer ${field.value ? "opacity-100" : "opacity-70"}`} onClick={() => field.onChange(!field.value)}>
                                <HugeiconsIcon icon={Tick02Icon} width={20} height={20} className="text-orange-base" />
                                {!field.value ? "Marcar como disponível" : "Marcar como vendido"}
                            </div>
                            <div className={`flex gap-2 text-orange-base font-(family-name:--font-dm-sans) cursor-pointer ${field.value ? "opacity-70" : "opacity-100"}`} onClick={() => field.onChange(!field.value)}>
                                <HugeiconsIcon icon={UnavailableIcon} width={20} height={20} className="text-orange-base" />
                                {field.value ? 'Desativar anúncio' : 'Ativar anuncio'}
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
                        {...register("files")}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                            if (e.target.files) handlePreLoadImage(e);
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
                                    <input type="number" className="font-(family-name:--font-poppins-sans) outline-0 h-12" {...register("priceInCents")} />
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

                        <button className="flex flex-1 h-12 rounded-xl text-sm text-white bg-orange-base justify-center items-center px-4 cursor-pointer font-(family-name:--font-poppins-sans)" onClick={handleSubmit(handleEditProduct)} disabled={isSubmitting}>
                            Salvar e atualizar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

