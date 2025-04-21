"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, AccessIcon, ViewIcon, User02Icon, Call02Icon } from "@hugeicons/core-free-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/app/api/sign-up";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { formatPhone } from "@/utils/format-phone";
import Link from "next/link";
import { UploadImage } from "./upload-image";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/api/sign-in";


const signUpFormSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    phone: z.string().min(1, "O telefone é obrigatório"),
    email: z.string().email("É preciso colocar um e-mail válido."),
    password: z.string().min(6, "A senha deve conter pelo menos 6 caracteres"),
    passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
});

type SignUpFormType = z.infer<typeof signUpFormSchema>;

export function FormSignUp() {

    const router = useRouter();

    const [avatarId, setAvatarId] = useState("");

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset
    } = useForm<SignUpFormType>({
        resolver: zodResolver(signUpFormSchema),
    });

    const { mutateAsync: signUpFn } = useMutation({
        mutationFn: signUp
    })

    const { mutateAsync: authenticate } = useMutation({
        mutationFn: signIn
    })

    async function handleSignUp({ name, email, phone, password, passwordConfirmation }: SignUpFormType) {
        try {
            const response = await signUpFn({ name, email, phone, avatarId, password, passwordConfirmation }); //avatarId está sendo recuperado no component  de upload da imagem com a função setAvatarId que foi passada por parametro,e está sendo executada lá dentro do outro componente
            if (response?.status === 201) {
                const authenticationResponse = await authenticate({ email, password });
                if (authenticationResponse?.status === 201) {
                    router.push("/main");
                }
            } else {
                toast.error("Ocorreu um problema na criação do usuário");
            }
        } catch (err) {
            toast.error("Erro ao tentar criar um novo usuário na plataforma.");
        }
    }

    function togglePasswordVisibility(id: string) {
        const input = document.getElementById(id) as HTMLInputElement;

        if (input) {
            input.type = input.type === "password" ? "text" : "password";
        }
    }

    useEffect(() => {
        if (errors.name) toast.error(errors.name.message);
        if (errors.email) toast.error(errors.email.message);
        if (errors.phone) toast.error(errors.phone.message);
        if (errors.password) toast.error(errors.password.message);
        if (errors.passwordConfirmation) toast.error(errors.passwordConfirmation.message);

    }, [errors.name, errors.email, errors.phone, errors.password])

    return (
        <>
            <div className="flex flex-col">

                <UploadImage onUploaded={setAvatarId} />

                <form className="mt-10" onSubmit={handleSubmit(handleSignUp)}>

                    <div className="flex flex-col text-gray-500 focus-within:text-orange-base mt-5">

                        <label htmlFor="nome" className="text-inherit font-semibold font-(family-name:--font-dm-sans)">NOME</label>

                        <div className="flex gap-2 items-center text-inherit border-b-2 border-gray-400 focus-within:border-gray-600">
                            <HugeiconsIcon
                                icon={User02Icon}
                                size={32}
                                className="text-inherit transition-colors"
                            />
                            <input
                                type="text"
                                id="nome"
                                placeholder="Seu nome completo"
                                className="flex-1 h-12 text-2xl outline-none placeholder:text-gray-400 text-inherit bg-transparent"
                                {...register("name")}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col text-gray-500 focus-within:text-orange-base gap-5">
                        <label htmlFor="telefone" className="text-inherit font-semibold font-(family-name:--font-dm-sans)">TELEFONE</label>
                        <div className="flex gap-2 items-center text-inherit border-b-2 border-gray-400 focus-within:border-gray-600">
                            <HugeiconsIcon
                                icon={Call02Icon}
                                size={32}
                                className="text-inherit transition-colors"
                            />
                            <input
                                type="text"
                                id="telefone"
                                placeholder="(00) 00000-0000"
                                className="flex-1 h-12 text-2xl outline-none placeholder:text-gray-400 text-inherit bg-transparent"
                                {...register("phone", {
                                    onChange: (e) => {
                                        e.target.value = formatPhone(e.target.value);
                                    }
                                })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col mt-12 gap-5">
                        <span className=" font-bold text-xl">Acesso</span>

                        <div className="flex flex-col text-gray-500 focus-within:text-orange-base mt-5">
                            <label htmlFor="email" className="text-inherit font-semibold font-(family-name:--font-dm-sans)">EMAIL</label>

                            <div className="flex gap-2 items-center text-inherit border-b-2 border-gray-400 focus-within:border-gray-600">
                                <HugeiconsIcon
                                    icon={User02Icon}
                                    size={32}
                                    className="text-inherit transition-colors"
                                />
                                <input
                                    type="text"
                                    id="email"
                                    placeholder="Seu email de acesso"
                                    className="flex-1 h-12 text-2xl outline-none placeholder:text-gray-400 text-inherit bg-transparent"
                                    {...register("email")}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col text-gray-500 focus-within:text-orange-base">
                            <label htmlFor="confirmar-senha" className="text-inherit font-semibold font-(family-name:--font-dm-sans)">SENHA</label>
                            <div className="flex border-b-2 border-gray-400 pr-2">
                                <div className="flex flex-1 gap-2 items-center justify-start text-inherit  focus-within:border-gray-600">
                                    <HugeiconsIcon
                                        icon={AccessIcon}
                                        size={32}
                                        className="text-inherit transition-colors"
                                    />
                                    <input
                                        type="password"
                                        id="senha"
                                        placeholder="Senha de acesso"
                                        className="flex-1 h-12 text-2xl outline-none placeholder:text-gray-400 text-inherit bg-transparent"
                                        {...register("password")}
                                    />
                                </div>
                                <button type="button" onClick={() => togglePasswordVisibility("senha")}>
                                    <HugeiconsIcon
                                        icon={ViewIcon}
                                        size={32}
                                        className="text-gray-400 transition-colors cursor-pointer" />

                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col text-gray-500 focus-within:text-orange-base">
                            <label htmlFor="senha" className="text-inherit font-semibold font-(family-name:--font-dm-sans)">CONFIRMAR SENHA</label>
                            <div className="flex border-b-2 border-gray-400 pr-2">
                                <div className="flex flex-1 gap-2 items-center justify-start text-inherit  focus-within:border-gray-600">
                                    <HugeiconsIcon
                                        icon={AccessIcon}
                                        size={32}
                                        className="text-inherit transition-colors"
                                    />
                                    <input
                                        type="password"
                                        id="confirmar-senha"
                                        placeholder="Confirme a senha"
                                        className="flex-1 h-12 text-2xl outline-none placeholder:text-gray-400 text-inherit bg-transparent"
                                        {...register("passwordConfirmation")}
                                    />
                                </div>
                                <button type="button" onClick={() => togglePasswordVisibility("confirmar-senha")}>
                                    <HugeiconsIcon
                                        icon={ViewIcon}
                                        size={32}
                                        className="text-gray-400 transition-colors cursor-pointer" />
                                </button>
                            </div>
                        </div>

                    </div>

                    <button type="submit" disabled={isSubmitting} className="flex flex-row w-full font-(family-name:--font-poppins-sans) border-2 h-17 rounded-xl text-xl text-white bg-orange-base  justify-between items-center px-4 cursor-pointer mt-12 disabled:opacity-70 disabled:cursor-not-allowed">
                        Cadastrar
                        <HugeiconsIcon icon={ArrowRight02Icon} />
                    </button>
                </form>

                <div className="flex flex-col gap-5 mt-20 mb-18">
                    <span className="font-(family-name:--font-poppins-sans) text-xl text-gray-500">Já tem uma conta?</span>
                    <Link className="font-(family-name:--font-poppins-sans) border-orange-base border-1 h-17 rounded-xl text-xl bg-transparent flex flex-row justify-between items-center px-4 text-orange-base font-bold cursor-pointer" href="/">
                        Acessar
                        <HugeiconsIcon icon={ArrowRight02Icon} />
                    </Link>
                </div>
            </div>
        </>
    )
}