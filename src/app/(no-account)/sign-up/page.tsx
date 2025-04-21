import { Metadata } from "next";
import { FormSignUp } from "./components/form-sign-up";
// import colors from "tailwindcss/colors";

export const metadata: Metadata = {
    title: "Criar nova conta"
};

async function loadingTest() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
}

export default async function CreateAccountPage() {
    // const user = await loadingTest(); // simula carregamento no server
    return (

        <div className="flex flex-col flex-1 m-[1.5rem] px-[5rem] py-[4.5rem] rounded-3xl bg-white">
            <div>
                <h1 className=" font-(family-name:--font-dm-sans) font-bold text-4xl" > Crie sua conta </h1>
                <p className={" font-(family-name:--font-poppins-sans) text-xl mt-2 text-gray-500"}>Informe os seus dados pessoais e de acesso</p>
            </div>
            <FormSignUp />
        </div>
    )
}
