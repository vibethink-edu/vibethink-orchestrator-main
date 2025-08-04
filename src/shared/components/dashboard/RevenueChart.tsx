"use client";

import React from "react";
import { Chart } from "@/shared/components/ui/chart";

/**
 * RevenueChart
 * Componente desacoplado para mostrar un gráfico de ingresos en el dashboard.
 * Compatible con Next.js 15 + React 19
 */

const data = [
  { name: "Week 1", revenue: 3200 },
  { name: "Week 2", revenue: 4200 },
  { name: "Week 3", revenue: 3800 },
  { name: "Week 4", revenue: 5000 },
];

export const RevenueChart: React.FC = () => (
  <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium">Revenue (Last 4 Weeks)</h3>
      <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
        +15.8% ↗️
      </div>
    </div>
    
    {/* Chart Component */}
    <Chart
      type="bar"
      data={data.map(d => d.revenue)}
      labels={data.map(d => d.name)}
      className="h-48"
    />
    
    {/* Summary */}
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">Total Revenue</span>
        <span className="font-semibold text-gray-900 dark:text-white">
          ${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString('en-US')}
        </span>
      </div>
    </div>
  </div>
);

// Ejemplo de uso:
// <RevenueChart /> 