"use client";

import React from "react";

/**
 * OverviewChart - Réplica exacta del chart de shadcnuikit.com/dashboard/default
 * Chart de área suave y minimalista que coincide con el design original
 */

const data = [
  { month: "Jan", revenue: 0 },
  { month: "Feb", revenue: 1000 },
  { month: "Mar", revenue: 800 },
  { month: "Apr", revenue: 1500 },
  { month: "May", revenue: 2000 },
  { month: "Jun", revenue: 1800 },
  { month: "Jul", revenue: 2500 },
  { month: "Aug", revenue: 2200 },
  { month: "Sep", revenue: 3000 },
  { month: "Oct", revenue: 2800 },
  { month: "Nov", revenue: 3500 },
  { month: "Dec", revenue: 4000 },
];

export const OverviewChart: React.FC = () => {
  const maxValue = Math.max(...data.map(d => d.revenue));
  const width = 600;
  const height = 200;
  const padding = 40;

  // Generate SVG path for the area chart
  const generatePath = () => {
    const points = data.map((item, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - (item.revenue / maxValue) * (height - 2 * padding);
      return `${x},${y}`;
    });
    
    const pathData = points.join(' L ');
    const areaPath = `M ${padding},${height - padding} L ${pathData} L ${width - padding},${height - padding} Z`;
    const linePath = `M ${points.join(' L ')}`;
    
    return { areaPath, linePath, points };
  };

  const { areaPath, linePath, points } = generatePath();

  return (
    <div className="w-full">
      {/* SVG Chart */}
      <div className="relative w-full" style={{ height: '200px' }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Lines (subtle) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = height - padding - ratio * (height - 2 * padding);
            return (
              <line
                key={index}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="hsl(var(--border))"
                strokeOpacity="0.2"
                strokeWidth="1"
              />
            );
          })}

          {/* Area Fill */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
            className="transition-all duration-300"
          />

          {/* Line */}
          <path
            d={linePath}
            stroke="hsl(var(--chart-1))"
            strokeWidth="2"
            fill="none"
            className="transition-all duration-300"
          />

          {/* Data Points */}
          {points.map((point, index) => {
            const [x, y] = point.split(',').map(Number);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="hsl(var(--chart-1))"
                className="transition-all duration-300 hover:r-4"
              >
                <title>{`${data[index].month}: $${data[index].revenue.toLocaleString()}`}</title>
              </circle>
            );
          })}
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 px-10">
        {data.filter((_, index) => index % 2 === 0).map((item, index) => (
          <div key={index} className="text-xs text-muted-foreground">
            {item.month}
          </div>
        ))}
      </div>
    </div>
  );
};
