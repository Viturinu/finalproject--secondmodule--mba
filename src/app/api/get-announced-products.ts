import { api } from "../lib/api";

export interface GetAnnouncedProductsResponse {
    amount: number;
}

export async function getAnnouncedProducts(): Promise<GetAnnouncedProductsResponse> {
    const response = await api.get<GetAnnouncedProductsResponse>("/sellers/metrics/products/available");

    return response.data; //mesmo retornando response.data, o compilador empacota isso em uma Promise.resolve(response.data), pois a função é Async
}