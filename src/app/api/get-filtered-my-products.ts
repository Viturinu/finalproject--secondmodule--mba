import { api } from "../lib/api";

export interface GetMyFilteredProductsResponse {
  products: [
    {
      id: string;
      title: string;
      description: string;
      priceInCents: number;
      status: boolean;
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
  ]
}

export async function getMyFilteredProducts(): Promise<GetMyFilteredProductsResponse> {
  const response = await api.get<GetMyFilteredProductsResponse>("/products/me");

  return response.data;
}