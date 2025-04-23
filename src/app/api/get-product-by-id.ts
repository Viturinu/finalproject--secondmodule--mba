import { api } from "../lib/api";

export interface GetProductByIdResponse {
    product: {
        id: string;
        title: string;
        description: string;
        priceInCents: number;
        status: string;
        owner: {
            id: string;
            name: string;
            phone: string;
            email: string;
            avatar: {
                id: string;
                url: string;
            }
        },
        category: {
            id: string;
            slug: string;
        },
        attachments: [
            {
                id: string;
                url: string;
            }
        ]
    }

}

export async function getProductById(id: string): Promise<GetProductByIdResponse> {
    const response = await api.get<GetProductByIdResponse>(`/products/${id}`);

    return response.data;
}