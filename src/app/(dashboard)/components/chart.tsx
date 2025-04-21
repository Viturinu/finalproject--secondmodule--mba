"use client"

import { Calendar01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getChartData } from "@/app/api/get-chart-data";
import { format, subDays } from "date-fns";
import { CustomTooltip } from "./customtooltip";
import { ptBR } from "date-fns/locale";
import colors from "tailwindcss/colors";

export function Chart() {

    const { data: chartData } = useQuery({
        queryKey: ["chart-data"],
        queryFn: getChartData
    })

    const formatedChartData = chartData?.viewsPerDay.map((item) => ({
        name: format(new Date(item.date), "d"),
        uv: item.amount,
        pv: format(new Date(item.date), "d 'de' MMMM", { locale: ptBR })
    }));

    return (

        <div className="flex flex-1 flex-col rounded-2xl p-6 bg-white">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-2xl font-(family-name:--font-dm-sans)">Visitantes</h2>
                <div className="flex gap-2">
                    <HugeiconsIcon icon={Calendar01Icon} className="text-blue-dark" />
                    <span className="font-(family-name:--font-dm-sans) text-gray-600 ">
                        {String(format(subDays(new Date(), 31), "d 'de' MMMM", { locale: ptBR })).toUpperCase()} - {String(format(new Date(), "d 'de' MMMM", { locale: ptBR })).toUpperCase()}
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%" className="mt-7">
                <LineChart data={formatedChartData} style={{
                    fontSize: 12,
                }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} dy={12} />
                    <YAxis
                        stroke="#888"
                        axisLine={false}
                        tickLine={false}
                        width={80}
                    // tickFormatter={(value: number) =>
                    //     value.toLocaleString('pt-BR', {
                    //         style: 'currency',
                    //         currency: 'BRL',
                    //     })
                    // }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <CartesianGrid vertical={false} horizontal={false} />
                    <Line
                        stroke={colors.blue[300]}
                        type="linear"
                        strokeWidth={2}
                        dataKey="uv"
                    />
                </LineChart>
            </ResponsiveContainer>

        </div>
    )
}