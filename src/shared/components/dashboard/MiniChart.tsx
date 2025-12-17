"use client";

import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface MiniChartProps {
  data: Array<{ name: string; value: number }>;
  color?: string;
  height?: number;
}

export function MiniChart({ 
  data, 
  color = "hsl(var(--primary))", 
  height = 60 
}: MiniChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
        <Tooltip 
          contentStyle={{ 
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            fontSize: '12px'
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Bar chart version
export function MiniBarChart({ 
  data, 
  color = "hsl(var(--primary))", 
  height = 60 
}: MiniChartProps) {
  return (
    <div className="flex items-end space-x-1 h-full" style={{ height }}>
      {data.map((item, index) => {
        const maxValue = Math.max(...data.map(d => d.value));
        const percentage = (item.value / maxValue) * 100;
        
        return (
          <div
            key={index}
            className="flex-1 group relative"
          >
            <div
              className="bg-primary/20 rounded-sm transition-all hover:bg-primary/30"
              style={{ 
                height: `${percentage}%`,
                minHeight: '4px',
                backgroundColor: color + '20'
              }}
            />
            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-popover text-popover-foreground text-xs rounded px-2 py-1 whitespace-nowrap">
                {item.name}: {item.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
