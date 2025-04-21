import { api } from "../lib/api";

interface GetProfileResponse {
    seller: {
        id: string;
        name: string;
        phone: string;
        email: string;
        avatar: {
            id: string;
            url: string;
        }
    }
}

export async function getProfile(): Promise<GetProfileResponse> {
    const response = await api.get<GetProfileResponse>("/sellers/me");

    return response.data;
}