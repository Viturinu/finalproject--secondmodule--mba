import { api } from "../lib/api";

export interface GetCategories {
    categories: [
        {
            id: string;
            title: string;
            slug: string;
        }
    ]
}

export async function GetCategories(): Promise<GetCategories> {
    const response = await api.get<GetCategories>("/categories"); //response tem tudo, tanto headers quando data (body)

    return response.data; //mesmo retornando response.data, o compilador empacota isso em uma Promise.resolve(response.data), pois a função é Async
}