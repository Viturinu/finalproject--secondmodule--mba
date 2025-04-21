import { Metadata } from "next";
import { FormSignIn } from "./components/form-sign-in";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import colors from "tailwindcss/colors";

export const metadata: Metadata = {
    title: "Login"
};

export default async function LoginPage() {
    // const user = await loadingTest(); // simula carregamento no server

    const cookieStore = await cookies();
    const token = cookieStore.get("auth"); // <- substitua "auth" pelo nome do cookie que você usa

    if (token) {
        redirect("/main"); // redireciona se estiver logado
    }

    return (
        <div className="flex flex-col flex-1 m-[1.5rem] px-[5rem] py-[4.5rem] rounded-3xl bg-white">
            <div>
                <h1 className=" font-(family-name:--font-dm-sans) font-bold text-2xl" > Acesse sua conta </h1>
                <p className={" font-(family-name:--font-poppins-sans) text-md mt-2 text-gray-500"}>Informe seu e-mail e senha para entrar</p>
            </div>

            <FormSignIn />
            {/* <LoginClient /> */}

        </div>
    )
}
