"use client";

import { Dot, Line, LineChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@vibethink/ui";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@vibethink/ui";
import { useTranslation } from "@/lib/i18n";

const chartData = [
  { browser: "chrome", visitors: 100, fill: "var(--color-visitors)" },
  { browser: "safari", visitors: 200, fill: "var(--color-visitors)" },
  { browser: "firefox", visitors: 150, fill: "var(--color-visitors)" },
  { browser: "edge", visitors: 250, fill: "var(--color-visitors)" },
  { browser: "other", visitors: 110, fill: "var(--color-visitors)" }
];

export function TotalRevenueCard() {
  const { t } = useTranslation('default');
  
  const chartConfig = {
    visitors: {
      label: t('cards.totalRevenue.label'),
      color: "var(--chart-1)"
    }
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('cards.totalRevenue.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl leading-6">$15,231.89</div>
        <p className="text-muted-foreground mt-1.5 text-xs">
          <span className="text-green-600">+20.1%</span> {t('cards.totalRevenue.fromLastMonth', { percentage: '20.1' })}
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
              stroke="var(--color-visitors)"
              strokeWidth={2}
              dot={({ payload, ...props }) => {
                return (
                  <Dot
                    key={payload.browser}
                    r={5}
                    cx={props.cx}
                    cy={props.cy}
                    fill="var(--background)"
                    stroke={payload.fill}
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


