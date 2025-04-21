"use client"

import { getProfile } from "@/app/api/get-profile";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react"

export enum NavSelector {
    Dashboard = "dashboard",
    Products = "products",
    NewProduct = "newProduct",
}

interface GetProfileResponse {
    seller: {
        id: string;
        name: string;
        phone: string;
        email: string;
        avatar: {
            id: string;
            url: string;
        };
    }
}

interface ContextProps {
    userData: GetProfileResponse;
    navSelectorPicked: NavSelector;
    navSelectorPicker: (navSelectorPicked: NavSelector) => void;
}

const ProfileContext = createContext<ContextProps>({} as ContextProps);

export function ContextProvider({ children }: { children: ReactNode }) {

    const [navSelector, setNavSelector] = useState<NavSelector>(NavSelector.Dashboard);

    function handleToggleNavSelector(value: NavSelector) {
        setNavSelector(value);
    }

    const { data: profile } = useQuery<GetProfileResponse>({ //diferente do useMutation, aqui ele já faz a requisição no inicio do component
        queryKey: ["profile"],
        queryFn: getProfile,
    });
    //não é instantaneo, pode levar algum tempo, portanto tratar esses erros/eventualidades nba pagina de recepção | por exemplo, ao carregar uma imagem, se vier undefined vai dar throw em Error, portanto precisamos tratar com condicionais

    return (
        <ProfileContext value={{
            userData: profile ?? {} as GetProfileResponse,
            navSelectorPicked: navSelector,
            navSelectorPicker: handleToggleNavSelector,
        }} >
            {children}
        </ProfileContext>
    )
}

export const useContextSignin = () => useContext(ProfileContext);