/**
 * Chart Component - Dashboard Wrapper
 * 
 * Temporary wrapper around @vibethink/ui ChartContainer
 * to maintain compatibility with existing dashboard code.
 * 
 * TODO: Migrate to direct use of ChartContainer + Recharts components
 */

import { ChartContainer, ChartConfig } from '@vibethink/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
    variant: 'line' | 'bar' | 'area';
    data: Array<{ name: string; value: number }>;
    title: string;
    subtitle?: string;
    height?: number;
    formatValue?: (value: number) => string;
}

export default function Chart({
    variant,
    data,
    title,
    subtitle,
    height = 300,
    formatValue = (v) => v.toString()
}: ChartProps) {
    const chartConfig: ChartConfig = {
        value: {
            label: title,
            color: 'hsl(var(--chart-1))',
        },
    };

    return (
        <div className="rounded-lg border p-4">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <ChartContainer config={chartConfig} className="h-[250px]">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatValue(Number(value))} />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-value)"
                        strokeWidth={2}
                    />
                </LineChart>
            </ChartContainer>
        </div>
    );
}
