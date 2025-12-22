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

export function EcommerceRevenueCard() {
  const { t } = useTranslation('ecommerce');
  
  const chartConfig = {
    desktop: {
      label: t('cards.totalRevenue.desktop'),
      color: "var(--chart-1)"
    },
    mobile: {
      label: t('cards.totalRevenue.mobile'),
      color: "var(--chart-2)"
    }
  } satisfies ChartConfig;

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 }
  ];

  return (
    <Card className="md:col-span-6 xl:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('cards.revenue.title')}</CardTitle>
        <CardDescription className="text-xs">
          <span className="text-green-500">+20.1%</span> {t('cards.revenue.fromLastMonth', { percentage: '20.1' })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl">$125,231</div>
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








