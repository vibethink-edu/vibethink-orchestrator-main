"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import { Line, LineChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@vibethink/ui/components/chart";
import { useTranslation } from "@/lib/i18n";

export function EcommerceSalesCard() {
  const { t } = useTranslation('ecommerce');
  
  const chartConfig = {
    desktop: {
      label: t('cards.totalRevenue.desktop'),
      color: "var(--chart-3)"
    },
    mobile: {
      label: t('cards.totalRevenue.mobile'),
      color: "var(--chart-4)"
    }
  } satisfies ChartConfig;

  const chartData = [
    { month: "January", desktop: 100, mobile: 80 },
    { month: "February", desktop: 150, mobile: 200 },
    { month: "March", desktop: 300, mobile: 120 },
    { month: "April", desktop: 120, mobile: 190 },
    { month: "May", desktop: 80, mobile: 130 },
    { month: "June", desktop: 150, mobile: 140 }
  ];

  return (
    <Card className="md:col-span-6 xl:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('cards.sales.title')}</CardTitle>
        <CardDescription className="text-xs">
          <span className="text-red-500">-1.7%</span> {t('cards.sales.fromLastMonth', { percentage: '-1.7' })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl">20K</div>
        <div className="pt-4">
          <ChartContainer className="h-[60px] w-full" config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 6
              }}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Line
                dataKey="desktop"
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-desktop)"
                }}
                activeDot={{
                  r: 6
                }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}








