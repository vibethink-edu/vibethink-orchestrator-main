"use client";

import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import { ChartConfig, ChartContainer } from "@vibethink/ui/components/chart";
import { useTranslation } from "@/lib/i18n";

const chartData = [{ browser: "safari", visitors: 200, fill: "var(--color-safari)" }];

const chartConfig = {
  visitors: {
    label: "Visitors"
  },
  safari: {
    label: "Safari",
    color: "var(--primary)"
  }
} satisfies ChartConfig;

export function TargetCard() {
  const { t } = useTranslation('crm-v2');
  
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="font-display text-xl">{t('cards.target.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[60px]">
              <RadialBarChart
                data={chartData}
                startAngle={0}
                endAngle={250}
                innerRadius={25}
                outerRadius={20}>
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  polarRadius={[86, 74]}
                />
                <RadialBar dataKey="visitors" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle">
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground font-bold">
                              %48
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </div>
          <p className="text-muted-foreground text-sm">
            {t('cards.target.completed')} <span className="text-orange-500">48%</span> {t('cards.target.ofTarget')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
