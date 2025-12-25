"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vibethink/ui";
import { Bar, BarChart, LabelList } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@vibethink/ui";
import { useTranslation } from "@/lib/i18n";

const chartData = [
  {
    revenue: 10400,
    subscription: 240
  },
  {
    revenue: 14405,
    subscription: 300
  },
  {
    revenue: 9400,
    subscription: 200
  },
  {
    revenue: 8200,
    subscription: 278
  },
  {
    revenue: 7000,
    subscription: 189
  },
  {
    revenue: 9600,
    subscription: 239
  },
  {
    revenue: 11244,
    subscription: 278
  },
  {
    revenue: 26475,
    subscription: 189
  }
];

export function SubscriptionsCard() {
  const { t } = useTranslation('default');
  
  const chartConfig = {
    desktop: {
      label: t('cards.subscriptions.title'),
      color: "var(--primary)"
    }
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('cards.subscriptions.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl leading-6">+4850</div>
        <p className="text-muted-foreground mt-1.5 text-xs">
          <span className="text-green-500">+180.1%</span> {t('cards.subscriptions.fromLastMonth', { percentage: '180.1' })}
        </p>
        <ChartContainer className="mt-6 h-[100px] w-full" config={chartConfig}>
          <BarChart
            margin={{
              top: 22,
              right: 0,
              left: 0
            }}
            accessibilityLayer
            data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="subscription" fill="var(--color-desktop)" radius={5}>
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


