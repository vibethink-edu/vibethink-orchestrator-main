'use client';

/**
 * CustomNode Component
 * 
 * Nodo personalizado para React Flow siguiendo el diseño de Shadcn UI.
 * Soporta diferentes tipos de nodos con estilos consistentes.
 */

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { WorkflowNodeData } from '../types';
import { cn } from '@vibethink/utils';
import {
  PlayCircle,
  Settings,
  GitBranch,
  Zap,
  CheckCircle2,
} from 'lucide-react';

// Mapeo de iconos por tipo de nodo
const nodeIcons = {
  start: PlayCircle,
  process: Settings,
  decision: GitBranch,
  action: Zap,
  end: CheckCircle2,
};

// Colores por tipo de nodo
const nodeColors = {
  start: 'bg-green-500',
  process: 'bg-blue-500',
  decision: 'bg-yellow-500',
  action: 'bg-purple-500',
  end: 'bg-red-500',
};

// Colores de borde por estado
const statusColors = {
  idle: 'border-gray-300',
  running: 'border-blue-500 animate-pulse',
  completed: 'border-green-500',
  error: 'border-red-500',
  paused: 'border-yellow-500',
};

export function CustomNode({ data, selected }: NodeProps<WorkflowNodeData>) {
  const Icon = nodeIcons[data.type] || Settings;
  const colorClass = nodeColors[data.type] || 'bg-gray-500';
  const statusClass = statusColors[data.status] || 'border-gray-300';

  return (
    <div
      className={cn(
        'px-4 py-3 shadow-lg rounded-lg border-2 bg-card min-w-[180px]',
        statusClass,
        selected && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      {/* Handle de entrada (izquierda) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary"
      />

      {/* Contenido del nodo */}
      <div className="flex items-center gap-2">
        <div className={cn('p-2 rounded-md', colorClass, 'text-white')}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{data.label}</div>
          {data.description && (
            <div className="text-xs text-muted-foreground truncate">
              {data.description}
            </div>
          )}
        </div>
      </div>

      {/* Badge de estado */}
      <div className="mt-2 flex items-center justify-between">
        <span
          className={cn(
            'text-xs px-2 py-1 rounded-full',
            data.status === 'running' && 'bg-blue-100 text-blue-800',
            data.status === 'completed' && 'bg-green-100 text-green-800',
            data.status === 'error' && 'bg-red-100 text-red-800',
            data.status === 'idle' && 'bg-gray-100 text-gray-800',
            data.status === 'paused' && 'bg-yellow-100 text-yellow-800'
          )}
        >
          {data.status}
        </span>
      </div>

      {/* Handle de salida (derecha) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary"
      />
    </div>
  );
}

