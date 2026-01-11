"use client";

import { useState } from "react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@vibethink/ui";
import { Button } from "@vibethink/ui";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@vibethink/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@vibethink/ui";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { CalendarIcon, Download } from "@vibethink/ui/icons";
import { useTranslation } from "@/lib/i18n";

const data: Record<
  string,
  {
    booked: number;
    visited: number;
    performanceChange: number;
    chartData: { date: string; visited: number; booked: number }[];
  }
> = {
  "this-week": {
    booked: 290,
    visited: 638,
    performanceChange: 12,
    chartData: [
      { date: "25-Nov", visited: 45, booked: 30 },
      { date: "26-Nov", visited: 20, booked: 10 },
      { date: "27-Nov", visited: 60, booked: 25 },
      { date: "28-Nov", visited: 95, booked: 60 },
      { date: "29-Nov", visited: 140, booked: 110 },
      { date: "30-Nov", visited: 10, booked: 45 },
      { date: "01-Dec", visited: 110, booked: 90 }
    ]
  },
  "last-week": {
    booked: 245,
    visited: 520,
    performanceChange: 8,
    chartData: [
      { date: "18-Nov", visited: 35, booked: 25 },
      { date: "19-Nov", visited: 50, booked: 35 },
      { date: "20-Nov", visited: 80, booked: 45 },
      { date: "21-Nov", visited: 70, booked: 50 },
      { date: "22-Nov", visited: 100, booked: 70 },
      { date: "23-Nov", visited: 85, booked: 55 },
      { date: "24-Nov", visited: 100, booked: 65 }
    ]
  },
  "this-month": {
    booked: 850,
    visited: 1920,
    performanceChange: 15,
    chartData: [
      { date: "1-Nov", visited: 180, booked: 120 },
      { date: "8-Nov", visited: 220, booked: 150 },
      { date: "15-Nov", visited: 280, booked: 190 },
      { date: "22-Nov", visited: 320, booked: 210 },
      { date: "29-Nov", visited: 290, booked: 180 }
    ]
  },
  "last-month": {
    booked: 780,
    visited: 1750,
    performanceChange: 10,
    chartData: [
      { date: "1-Oct", visited: 150, booked: 100 },
      { date: "8-Oct", visited: 200, booked: 130 },
      { date: "15-Oct", visited: 250, booked: 170 },
      { date: "22-Oct", visited: 300, booked: 200 },
      { date: "29-Oct", visited: 280, booked: 180 }
    ]
  },
  "last-3-months": {
    booked: 2100,
    visited: 4800,
    performanceChange: 22,
    chartData: [
      { date: "Sep", visited: 1400, booked: 600 },
      { date: "Oct", visited: 1600, booked: 700 },
      { date: "Nov", visited: 1800, booked: 800 }
    ]
  }
};

// chartConfig moved inside component to use i18n

export function CampaignOverview() {
  const { t } = useTranslation('hotel');
  const [dateRange, setDateRange] = useState("this-week");
  const campaignData = data[dateRange];

  const chartConfig = {
    visited: {
      label: t('components.campaignOverview.chart.visited'),
      color: "var(--chart-1)"
    },
    booked: {
      label: t('components.campaignOverview.chart.booked'),
      color: "var(--chart-4)"
    }
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('components.campaignOverview.title')}</CardTitle>
        <CardAction className="flex gap-2">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger>
              <CalendarIcon />
              <div className="hidden lg:flex">
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">{t('components.campaignOverview.dateRanges.thisWeek')}</SelectItem>
              <SelectItem value="last-week">{t('components.campaignOverview.dateRanges.lastWeek')}</SelectItem>
              <SelectItem value="this-month">{t('components.campaignOverview.dateRanges.thisMonth')}</SelectItem>
              <SelectItem value="last-month">{t('components.campaignOverview.dateRanges.lastMonth')}</SelectItem>
              <SelectItem value="last-3-months">{t('components.campaignOverview.dateRanges.last3Months')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid items-end gap-4 lg:grid-cols-2 lg:gap-6">
          <div className="order-2 grid grid-cols-2 divide-x rounded-lg border lg:order-1">
            <div className="space-y-1 p-4">
              <p className="text-muted-foreground text-sm">{t('components.campaignOverview.booked')}</p>
              <p className="text-xl font-semibold lg:text-2xl">{campaignData.booked}</p>
            </div>
            <div className="space-y-1 p-4">
              <p className="text-muted-foreground text-sm">{t('components.campaignOverview.visited')}</p>
              <p className="text-xl font-semibold lg:text-2xl">{campaignData.visited}</p>
            </div>
          </div>
          <div className="order-1 space-y-1 lg:order-2 lg:text-end">
            <p>{t('components.campaignOverview.performance')}</p>
            <p className="text-sm">
              <span className="text-green-500">{campaignData.performanceChange}+</span>
              <span className="text-muted-foreground ml-1">{t('components.campaignOverview.comparedToLastWeek')}</span>
            </p>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="aspect-video w-full md:h-[180px]">
          <LineChart
            data={campaignData.chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: -15 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dx={-10}
              domain={[0, 200]}
              ticks={[0, 50, 100, 150, 200]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="visited" stroke="var(--color-visited)" dot={false} />
            <Line type="monotone" dataKey="booked" stroke="var(--color-booked)" dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

