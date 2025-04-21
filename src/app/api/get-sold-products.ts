import { api } from "../lib/api";

export interface GetSoldProductsResponse {
    amount: number;
}

export async function getSoldProducts(): Promise<GetSoldProductsResponse> {
    const response = await api.get<GetSoldProductsResponse>("/sellers/metrics/products/sold");

    return response.data; //mesmo retornando response.data, o compilador empacota isso em uma Promise.resolve(response.data), pois a função é Async
}