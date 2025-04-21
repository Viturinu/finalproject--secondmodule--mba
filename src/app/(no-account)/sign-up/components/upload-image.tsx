"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { ImageUploadIcon } from "@hugeicons/core-free-icons";
import { z } from "zod";
import { toast } from "sonner";
import { useRef, useState } from "react";
import Image from "next/image";
import { api } from "@/app/lib/api";

type UploadImageProps = { //pra passar a URL pro estado do component pai (que chamou aqui)
    onUploaded: (avatarId: string) => void; //essa função lá será a setImageUrl("valorRecuperadoAqui")
};

interface UploadResponse { //tipando a resposta da API para o upload da imagem
    data: {
        attachments: [
            {
                id: string; //id da imagem
                url: string; //url da imagem
            }
        ];
    };
}

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"]; //array com os tipos que o zod vai aceitar no file

const imageUploadSchema = z.object({ //schema pro zod
    file: z.custom<FileList>()
        .refine((files) => Array.from(files ?? []).length !== 0, "A imagem do profile é obrigatória")
        .refine((files) => Array.from(files ?? []).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)), "Tipo de arquivo precisa ser uma imagem PNG/JPEG/JPG/WEBP.")
});

export function UploadImage({ onUploaded }: UploadImageProps) {
    const [imageUrl, setImageUrl] = useState<string>(); //estado para salvar a Url da imagem
    const [isSubmitting, setIsSubmitting] = useState(false); //estado usado para verificar o upload da imagem
    const inputRef = useRef<HTMLInputElement>(null); //pra zerar o file, pois o navegador bloqueia se tentar subir a mesma imagem; isso aqui é refinido lá no componente html, logo abaixo

    async function handleUploadImage(files: FileList) {//FileList é o tipo do seletor do input, ele retorna umn FileList (endereço relativo da imagem - podemos dizer assim)
        setIsSubmitting(true); //variavel para controle do upload
        // await new Promise(resolve => setTimeout(resolve, 4000));
        const result = imageUploadSchema.safeParse({ file: files });
        if (!result.success) { //verificando se o zod validou, caso não ele entra na função
            toast.error(result.error.errors[0].message);
            return;
        }

        const formData = new FormData(); //criando o Form aqui
        formData.append("files", result.data.file[0]);// files[0] pode ser usado também; aqui está criando o input do form aqui também, e definindo a imagem selecionada pelo usuario

        try {
            const response: UploadResponse = await api.post("/attachments", formData);
            const { id, url } = response.data.attachments[0];
            setImageUrl(url);
            onUploaded(id);
            toast.success("Upload da imagem feito com sucesso.");
        } catch {
            toast.error("Erro no upload da imagem.");
        } finally {
            setIsSubmitting(false);
            if (inputRef.current) inputRef.current.value = ""; // Limpa o input pra poder selecionar a mesma imagem depois
        }
    }

    return (
        <div className="mt-10">
            <div className="flex flex-col">
                <label htmlFor="attach" className="font-bold text-xl">Perfil</label>
                <div className="flex relative bg-shape rounded-3xl h-30 w-30 items-center justify-center mt-5">
                    {isSubmitting ? (
                        <div className="animate-pulse w-full h-full rounded-3xl bg-gray-200" />
                    ) : !imageUrl ? (
                        <HugeiconsIcon
                            icon={ImageUploadIcon}
                            width={32}
                            height={32}
                            className="text-orange-base"
                        />
                    ) : (
                        <Image src={imageUrl} className="rounded-3xl object-cover" alt="Profile image" fill />
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        className="absolute inset-0 w-full h-full rounded-3xl cursor-pointer opacity-0"
                        onChange={(e) => {
                            if (e.target.files) handleUploadImage(e.target.files);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
