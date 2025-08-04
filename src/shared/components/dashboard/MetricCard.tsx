import React from "react";

/**
 * MetricCard
 * Componente desacoplado para mostrar métricas en el dashboard.
 * Replica la experiencia visual del demo Bundui Premium, pero usando solo componentes propios.
 *
 * @param title - Título de la métrica
 * @param value - Valor principal
 * @param subtitle - Subtítulo o variación
 * @param subtitleColor - Clase de color para el subtítulo
 */
export interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  subtitleColor?: string;
  children?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  subtitleColor = "text-muted-foreground",
  children,
}) => (
  <div className="rounded-xl shadow-sm p-6 bg-white dark:bg-neutral-900 flex flex-col gap-2 border border-gray-200 dark:border-gray-800">
    <div className="text-sm font-medium text-muted-foreground">{title}</div>
    <div className="text-2xl font-bold">{value}</div>
    {subtitle && (
      <div className={`text-xs font-medium ${subtitleColor}`}>{subtitle}</div>
    )}
    {children}
  </div>
);

// Ejemplo de uso:
// <MetricCard title="Total Revenue" value="$15,231.89" subtitle="+20.1% from last month" subtitleColor="text-green-600" /> 