"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from "recharts";

interface MetricsChartProps {
    standardMetrics: { tokens: number; latency: number; steps: number };
    aragMetrics: { tokens: number; latency: number; steps: number };
}

export default function MetricsChart({ standardMetrics, aragMetrics }: MetricsChartProps) {
    const data = [
        {
            name: "Steps",
            Standard: standardMetrics.steps,
            Agentic: aragMetrics.steps,
        },
        // We can add tokens/latency here if we had them in the backend response
        // For now mocking/using what we have or placeholder
        {
            name: "Latency (s)",
            Standard: 1.2, // Mock for viz if real data missing
            Agentic: 3.5,
        }
    ];

    return (
        <div className="w-full h-[300px] mt-8 glass p-4 rounded-xl">
            <h4 className="text-white/70 mb-4 text-sm uppercase tracking-wider font-semibold">Performance Comparison</h4>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff60" tick={{ fill: '#ffffff80' }} />
                    <YAxis stroke="#ffffff60" tick={{ fill: '#ffffff80' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#ffffff20', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ fill: '#ffffff10' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Standard" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Agentic" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
