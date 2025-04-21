import { ReactNode } from "react";
import { Header } from "./components/header";
import { ContextProvider } from "./components/context";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }: { children: ReactNode }) {

    const cookieStore = await cookies();
    const token = cookieStore.get("auth"); // <- substitua "auth" pelo nome do cookie que você usa

    if (!token) redirect("/");

    return (
        <ContextProvider>
            <div className="flex flex-col flex-1">
                <Header />
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </ContextProvider>
    )
}