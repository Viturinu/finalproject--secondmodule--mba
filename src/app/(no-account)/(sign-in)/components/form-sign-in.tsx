"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Mail02Icon, AccessIcon, ViewIcon } from "@hugeicons/core-free-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/app/api/sign-in";

const signInFormSchema = z.object({
    email: z.string().email("Digite um email válido"),
    password: z.string(),
})

type signInFormType = z.infer<typeof signInFormSchema>;

export function FormSignIn() {

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        watch
    } = useForm<signInFormType>({
        resolver: zodResolver(signInFormSchema),
        values: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();

    const { mutateAsync: authenticate } = useMutation({
        mutationFn: signIn
    })

    const email = watch("email"); //para desativar botão de login precisamos estar em vigia desse campo
    const password = watch("password"); //para desativar botão de login precisamos estar em vigia desse campo

    async function handleLoginSubmit({ email, password }: signInFormType) {

        try {
            const response = await authenticate({ email, password });
            if (response?.status === 201) {
                router.push("/main");
            }
        } catch (err) {
            console.error(err);
        }
    }

    function togglePasswordVisibility(id: string) {
        const input = document.getElementById(id) as HTMLInputElement;

        if (input) {
            input.type = input.type === "password" ? "text" : "password";
        }
    }

    useEffect(() => {
        if (errors.email) {
            toast.error(errors.email.message || "Erro no e-mail");
        }
        if (errors.password) {
            toast.error(errors.password.message || "Erro na senha");
        }
    }, [errors.email, errors.password]);
    return (
        <form className="mt-12" onSubmit={handleSubmit(handleLoginSubmit)} >
            <div className="flex flex-col mt-12 gap-5">

                <div className="flex flex-col text-gray-500 focus-within:text-orange-base">
                    <label htmlFor="senemailha" className=" text-sm font-semibold font-(family-name:--font-dm-sans)">E-MAIL</label>

                    <div className="flex gap-2 items-center text-sm border-b-2 border-gray-400 focus-within:border-gray-600">
                        <HugeiconsIcon
                            icon={Mail02Icon}
                            size={32}
                            className="text-inherit transition-colors"
                        />
                        <input
                            type="text"
                            id="email"
                            placeholder="Seu e-mail cadastrado"
                            className="flex-1 h-12 text-lg outline-none placeholder:text-gray-400 text-inherit bg-transparent"
                            {...register("email")}
                        />
                    </div>
                </div>

                <div className="flex flex-col text-gray-500 focus-within:text-orange-base">
                    <label htmlFor="senha" className="text-inherit font-semibold font-(family-name:--font-dm-sans)">SENHA</label>
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
                                placeholder="Sua senha"
                                className="flex-1 h-12 text-lg outline-none placeholder:text-gray-400 text-inherit bg-transparent"
                                {...register("password")}
                            />
                        </div>

                        <HugeiconsIcon
                            icon={ViewIcon}
                            size={32}
                            className="text-gray-400 transition-colors cursor-pointer"
                            onClick={() => togglePasswordVisibility("senha")}
                        />
                    </div>
                </div>

                <button type="submit" className="font-(family-name:--font-poppins-sans) border-1 h-17 rounded-xl text-lg text-white bg-orange-base flex flex-row justify-between items-center px-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-85" disabled={isSubmitting || (!email || !password)}>
                    Acessar
                    <HugeiconsIcon icon={ArrowRight02Icon}
                    />
                </button>

                <div className="flex flex-col gap-5 mt-37">
                    <span className="font-(family-name:--font-poppins-sans) text-lg text-gray-500">Ainda não tem uma conta?</span>
                    <Link href="/sign-up" className="font-(family-name:--font-poppins-sans) border-orange-base border-2 h-17 rounded-xl text-lg bg-transparent flex flex-row justify-between items-center px-4 text-orange-base font-bold cursor-pointer">
                        Cadastrar
                        <HugeiconsIcon icon={ArrowRight02Icon} />
                    </Link>
                </div>
            </div>
        </form>
    )
}
