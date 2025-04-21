import { api } from "../lib/api";

export interface GetViewsReceivedResponse {
    amount: number;
}

export async function getAnnouncedProducts(): Promise<GetViewsReceivedResponse> {
    const response = await api.get<GetViewsReceivedResponse>("/sellers/metrics/views");

    return response.data; //mesmo retornando response.data, o compilador empacota isso em uma Promise.resolve(response.data), pois a função é Async
}