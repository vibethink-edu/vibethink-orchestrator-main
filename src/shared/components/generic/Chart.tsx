"use client";

import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, BarChart, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/shared/lib/utils';

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChartProps {
  variant?: 'line' | 'bar' | 'area' | 'pie' | 'doughnut';
  data: ChartDataPoint[];
  title?: string;
  subtitle?: string;
  className?: string;
  height?: number;
  width?: string | number;
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  colors?: string[];
  formatValue?: (value: number) => string;
  dataKeys?: string[];
  strokeWidth?: number;
}

/**
 * Generic Chart Component for VibeThink Orchestrator
 * 
 * ⚠️ IMPORTANTE: Este componente actualmente usa datos MOCK
 * Para integrar con base de datos real:
 * 
 * 1. Reemplazar data prop con datos de BD real
 * 2. Implementar hooks específicos para cada tipo de gráfica
 * 3. Agregar filtros por company_id para multi-tenancy
 * 4. Implementar cache y optimización de consultas
 * 
 * Ejemplo de integración con Supabase:
 * ```typescript
 * const { data: chartData } = useChartData({
 *   companyId: user.company_id,
 *   chartType: 'subscriptions',
 *   dateRange: 'last30days'
 * });
 * ```
 */
const Chart: React.FC<ChartProps> = ({
  variant = 'line',
  data,
  title,
  subtitle,
  className,
  height = 300,
  width = '100%',
  showLegend = true,
  showGrid = true,
  animate = true,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  formatValue = (value) => value.toString(),
  dataKeys = ['value'],
  strokeWidth = 2
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background rounded-lg border p-2 shadow-xs">
          <div className="grid grid-cols-2 gap-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex flex-col">
                <span className="text-muted-foreground text-[0.70rem] uppercase">
                  {entry.dataKey}
                </span>
                <span className="font-bold">
                  {formatValue(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5
        }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={strokeWidth}
            dot={{
              r: 4,
              fill: colors[index % colors.length],
              strokeWidth: 2,
              stroke: '#fff'
            }}
            activeDot={{
              r: 6,
              fill: colors[index % colors.length],
              strokeWidth: 2,
              stroke: '#fff'
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5
        }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (variant) {
      case 'line':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'area':
        return renderLineChart(); // Simplified for now
      case 'pie':
      case 'doughnut':
        return renderPieChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <div className={cn("p-4 border rounded-lg bg-card", className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      
      <div className="relative" style={{ height }}>
        {renderChart()}
      </div>
      
      {showLegend && data.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {dataKeys.map((key, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span>{key}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chart; 
