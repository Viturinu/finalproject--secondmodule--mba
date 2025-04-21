"use client"

import { Package02Icon, ChartHistogramIcon, PlusSignFreeIcons, Profile02Icon, Logout01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { NavSelector, useContextSignin } from "./context"
import { useRouter } from "next/navigation";
import Image from "next/image"
import Logo from "@/../public/Logo-dashboard.svg"
import Profile from "@/../public/Profile.png"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { api } from "@/app/lib/api";


export function Header() {

    const { navSelectorPicked, navSelectorPicker } = useContextSignin();

    const router = useRouter();

    const ProfileContext = useContextSignin(); //hook criado por mim no mesmo arquivo do context - export const useCart = () => useContext(ProfileContext); - pra não porecisar ficar importando o artquivo de context e usando o useContext - duas linhas copntra uma, apenas;

    function handleToDashboard() {
        navSelectorPicker(NavSelector.Dashboard);
        router.push("/main");
    }

    function handleToProducts() {
        navSelectorPicker(NavSelector.Products);
        router.push("/my-products");
    }

    function handleToNewProduct() {
        navSelectorPicker(NavSelector.NewProduct);
        router.push("/create-product");
    }

    function handleSignOut() {
        api.post("/sign-out"); //aqui estou fazendo requisição direta pois não tem sentido chamar o useMutation, pois estamos fazendo logout, fim da aplicação por parte deste usuario
        router.push("/");
    }

    return (
        <div className="flex flex-row min-h-20 justify-between items-center border-b-1 border-b-gray-200 px-5">
            <Image src={Logo} alt="Logo do header no dashboard" width={56} height={40} className="cursor-pointer" />

            <div className="flex gap-2 items-center justify-between">
                <div className={`flex h-11 w-36 rounded-2xl items-center justify-center gap-2  cursor-pointer ${navSelectorPicked === NavSelector.Dashboard ? "text-orange-base bg-shape" : "text-gray-500 bg-transparent"}`} onClick={() => { if (navSelectorPicked !== NavSelector.Dashboard) handleToDashboard() }}>
                    <HugeiconsIcon icon={ChartHistogramIcon} width={20} height={20} />
                    <span className="font-(family-name:--font-poppins-sans) text-sm"> Dashboard</span>
                </div>

                <div className={`flex h-11 w-36 rounded-2xl items-center justify-center gap-2  cursor-pointer ${navSelectorPicked === NavSelector.Products ? "text-orange-base bg-shape" : "text-gray-500 bg-transparent"}`} onClick={() => { if (navSelectorPicked !== NavSelector.Products) handleToProducts() }}>
                    <HugeiconsIcon icon={Package02Icon} width={20} height={20} />
                    <span className="font-(family-name:--font-poppins-sans) text-sm"> Produtos</span>
                </div>
            </div>

            <div className="flex gap-3 h-full w-58 items-center ">
                <button className="flex border-2 h-12 rounded-xl text-sm text-white bg-orange-base justify-between items-center px-4 cursor-pointer gap-2 flex-1  font-(family-name:--font-poppins-sans)" onClick={() => { if (navSelectorPicked !== NavSelector.NewProduct) handleToNewProduct() }}>
                    <HugeiconsIcon icon={PlusSignFreeIcons} />
                    Novo produto
                </button>
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div onClick={() => console.log("Acionei profile")} className="cursor-pointer">
                                {
                                    ProfileContext?.userData.seller?.avatar?.url ?
                                        <Image src={ProfileContext?.userData.seller?.avatar?.url ?? Profile} alt="Imagem do profile no header" height={48} width={48} className="rounded-2xl" />
                                        : <HugeiconsIcon icon={Profile02Icon} height={48} width={48} className="text-orange-base" />
                                }
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="group text-gray-500 hover:text-orange-base h-12">
                                    <HugeiconsIcon icon={Profile02Icon} height={48} width={48} className="text-orange-base" />
                                    <span className="group-hover:text-orange-base">{ProfileContext.userData.seller?.name}</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="group cursor-pointer h-12 text-gray-500 hover:text-orange-base " onClick={handleSignOut}>
                                <span className="group-hover:text-orange-base">Sair</span>
                                <HugeiconsIcon icon={Logout01Icon} height={48} width={48} className="text-orange-base" />                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </div>
    )
}