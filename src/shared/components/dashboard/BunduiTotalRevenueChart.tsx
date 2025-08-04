"use client";

import { Dot, Line, LineChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/bundui-premium/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/shared/components/bundui-premium/components/ui/chart";

/**
 * BunduiTotalRevenueChart - Réplica EXACTA del componente original
 * Copiado directamente de external/bundui-premium para tener el look idéntico
 */

const chartData = [
  { browser: "chrome", visitors: 100, fill: "hsl(var(--chart-1))" },
  { browser: "safari", visitors: 200, fill: "hsl(var(--chart-1))" },
  { browser: "firefox", visitors: 150, fill: "hsl(var(--chart-1))" },
  { browser: "edge", visitors: 250, fill: "hsl(var(--chart-1))" },
  { browser: "other", visitors: 110, fill: "hsl(var(--chart-1))" }
];

const chartConfig = {
  visitors: {
    label: "Revenue",
    color: "hsl(var(--chart-1))"
  }
} satisfies ChartConfig;

export function BunduiTotalRevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$15,231.89</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-600">+20.1%</span> from last month
        </p>
        <ChartContainer className="mt-4 h-[100px] w-full" config={chartConfig}>
          <LineChart
            data={chartData}
            accessibilityLayer
            margin={{
              top: 8,
              right: 8,
              left: 8
            }}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" nameKey="visitors" hideLabel />}
            />
            <Line
              dataKey="visitors"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={({ payload, ...props }) => {
                return (
                  <Dot
                    key={payload.browser}
                    r={5}
                    cx={props.cx}
                    cy={props.cy}
                    fill="hsl(var(--background))"
                    stroke="hsl(var(--chart-1))"
                  />
                );
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}