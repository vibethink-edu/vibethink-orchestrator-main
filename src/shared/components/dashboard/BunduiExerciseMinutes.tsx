"use client";

import { Line, LineChart, Tooltip } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/bundui-premium/components/ui/card";
import { ChartConfig, ChartContainer } from "@/shared/components/bundui-premium/components/ui/chart";
import { Button } from "@/shared/components/bundui-premium/components/ui/button";
import { FolderUp } from "lucide-react";

/**
 * BunduiExerciseMinutes - Réplica EXACTA del componente original
 * Copiado directamente de external/bundui-premium para tener el look idéntico
 */

const chartData = [
  {
    average: 400,
    today: 240
  },
  {
    average: 300,
    today: 139
  },
  {
    average: 200,
    today: 400
  },
  {
    average: 278,
    today: 390
  },
  {
    average: 189,
    today: 480
  },
  {
    average: 239,
    today: 380
  },
  {
    average: 349,
    today: 400
  }
];

const chartConfig = {
  average: {
    label: "Average",
    color: "hsl(var(--chart-1))"
  },
  today: {
    label: "Today",
    color: "hsl(var(--chart-2))"
  }
} satisfies ChartConfig;

export function BunduiExerciseMinutes() {
  return (
    <Card className="h-full">
      <CardHeader className="flex items-start justify-between">
        <div className="space-y-1.5">
          <CardTitle>Exercise Minutes</CardTitle>
          <CardDescription>
            Your exercise minutes are ahead of where you normally are.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <FolderUp className="h-4 w-4" />
          <span className="hidden lg:inline ml-2">Export</span>
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-32 w-full lg:h-[250px]" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10
            }}>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background rounded-lg border p-2 shadow-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-[0.70rem] uppercase">
                            Average
                          </span>
                          <span className="text-muted-foreground font-bold">
                            {payload[0].value}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-[0.70rem] uppercase">
                            Today
                          </span>
                          <span className="font-bold">{payload[1].value}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              strokeWidth={2}
              dataKey="average"
              stroke="hsl(var(--chart-1))"
              activeDot={{
                r: 6,
                fill: "hsl(var(--chart-1))",
                opacity: 0.25
              }}
              opacity={0.35}
            />
            <Line
              type="monotone"
              dataKey="today"
              strokeWidth={2}
              stroke="hsl(var(--chart-2))"
              activeDot={{
                r: 8,
                fill: "hsl(var(--chart-2))"
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
