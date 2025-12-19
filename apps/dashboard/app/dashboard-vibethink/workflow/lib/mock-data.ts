/**
 * Mock Data Generator
 * 
 * Genera datos de ejemplo para el workflow.
 * Útil para desarrollo y demostración.
 */

import { WorkflowNode, WorkflowEdge } from '../types';

/**
 * Genera un workflow de ejemplo con nodos y edges mock
 */
export function generateMockWorkflow(): {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
} {
  const nodes: WorkflowNode[] = [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 100, y: 100 },
      data: {
        label: 'Inicio',
        description: 'Punto de inicio del workflow',
        type: 'start',
        status: 'idle',
        color: '#10b981',
      },
    },
    {
      id: 'process-1',
      type: 'process',
      position: { x: 300, y: 100 },
      data: {
        label: 'Procesar Datos',
        description: 'Procesa los datos de entrada',
        type: 'process',
        status: 'idle',
        color: '#3b82f6',
      },
    },
    {
      id: 'decision-1',
      type: 'decision',
      position: { x: 500, y: 100 },
      data: {
        label: 'Validar',
        description: 'Valida si los datos son correctos',
        type: 'decision',
        status: 'idle',
        color: '#f59e0b',
      },
    },
    {
      id: 'action-1',
      type: 'action',
      position: { x: 700, y: 50 },
      data: {
        label: 'Acción Exitosa',
        description: 'Ejecuta acción si la validación es exitosa',
        type: 'action',
        status: 'idle',
        color: '#8b5cf6',
      },
    },
    {
      id: 'action-2',
      type: 'action',
      position: { x: 700, y: 150 },
      data: {
        label: 'Manejar Error',
        description: 'Maneja el error si la validación falla',
        type: 'action',
        status: 'idle',
        color: '#8b5cf6',
      },
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 900, y: 100 },
      data: {
        label: 'Fin',
        description: 'Finaliza el workflow',
        type: 'end',
        status: 'idle',
        color: '#ef4444',
      },
    },
  ];

  const edges: WorkflowEdge[] = [
    {
      id: 'e1',
      source: 'start-1',
      target: 'process-1',
      type: 'smoothstep',
      animated: false,
    },
    {
      id: 'e2',
      source: 'process-1',
      target: 'decision-1',
      type: 'smoothstep',
      animated: false,
    },
    {
      id: 'e3',
      source: 'decision-1',
      target: 'action-1',
      type: 'smoothstep',
      animated: false,
      label: 'Sí',
    },
    {
      id: 'e4',
      source: 'decision-1',
      target: 'action-2',
      type: 'smoothstep',
      animated: false,
      label: 'No',
    },
    {
      id: 'e5',
      source: 'action-1',
      target: 'end-1',
      type: 'smoothstep',
      animated: false,
    },
    {
      id: 'e6',
      source: 'action-2',
      target: 'end-1',
      type: 'smoothstep',
      animated: false,
    },
  ];

  return { nodes, edges };
}

