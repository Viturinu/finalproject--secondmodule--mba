import { api } from "../lib/api";

interface SearchFilterProps {
  searchTerm: string;
  statusFilter: string;
}

export interface GetMyFilteredProductsResponse {
  products: {
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
      };
    };
    category: {
      id: string;
      slug: string;
    };
    attachments: {
      id: string;
      url: string;
    }[];
  }[]; // <- Agora sim é um array genérico de produtos
}

export async function getMyFilteredProducts({ searchTerm, statusFilter }: SearchFilterProps): Promise<GetMyFilteredProductsResponse> {

  const response = await api.get<GetMyFilteredProductsResponse>("/products/me");

  const filteredProducts = response?.data.products.filter((product) => {
    const matchesTitle = searchTerm === "" ? true : product.title.toLowerCase().includes(searchTerm.toLowerCase()); //retorna true pra matchesTitle se conferir a condicional
    const matchesStatus = statusFilter === "" ? true : product.status.includes(statusFilter); //retorna true pra matchesTitle se conferir a condicional
    return matchesTitle && matchesStatus; //só retorna o item se os dois forem true
  });

  return {
    products: filteredProducts
  };
}