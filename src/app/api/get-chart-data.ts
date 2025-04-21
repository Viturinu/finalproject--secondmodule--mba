import { api } from "../lib/api";

interface GetChartDataResponse {
    viewsPerDay: [
        {
            date: string;
            amount: number;
        }
    ]
}

export async function getChartData(): Promise<GetChartDataResponse> {
    const response = await api.get<GetChartDataResponse>("/sellers/metrics/views/days");

    return response.data;
}