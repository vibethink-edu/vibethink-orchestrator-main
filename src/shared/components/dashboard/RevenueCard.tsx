"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';
import { Line, LineChart } from 'recharts';
import { DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RevenueCardProps {
  total: string;
  change: string;
  isPositive: boolean;
  description: string;
  chartData: Array<{ name: string; value: number }>;
}

export function RevenueCard({ 
  total, 
  change, 
  isPositive, 
  description, 
  chartData 
}: RevenueCardProps) {
  return (
    <Card className="md:col-span-6 xl:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{total}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
          )}
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {change}
          </span>
          <span className="ml-1">{description}</span>
        </div>
        
        {/* Simple mini chart */}
        <div className="mt-4 h-[60px]">
          <div className="flex items-end space-x-1 h-full">
            {chartData.map((item, index) => {
              const maxValue = Math.max(...chartData.map(d => d.value));
              const percentage = (item.value / maxValue) * 100;
              
              return (
                <div
                  key={index}
                  className="flex-1 bg-primary/20 rounded-sm hover:bg-primary/30 transition-all"
                  style={{ 
                    height: `${percentage}%`,
                    minHeight: '4px'
                  }}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
