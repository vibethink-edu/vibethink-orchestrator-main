/**
 * Types for Workflow Dashboard
 * 
 * Definiciones de tipos para el dashboard de workflows con React Flow.
 * Siguiendo buenas prácticas de TypeScript y estructura escalable.
 */

import { Node, Edge } from '@xyflow/react';

/**
 * Tipos de nodos disponibles en el workflow
 */
export type NodeType = 
  | 'start'
  | 'process'
  | 'decision'
  | 'action'
  | 'end';

/**
 * Estado de un nodo en el workflow
 */
export type NodeStatus = 
  | 'idle'
  | 'running'
  | 'completed'
  | 'error'
  | 'paused';

/**
 * Datos personalizados para cada nodo
 */
export interface WorkflowNodeData {
  label: string;
  description?: string;
  status: NodeStatus;
  type: NodeType;
  icon?: string;
  color?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Nodo de workflow con datos personalizados
 */
export type WorkflowNode = Node<WorkflowNodeData>;

/**
 * Edge de workflow con datos personalizados
 */
export type WorkflowEdge = Edge;

/**
 * Configuración del workflow
 */
export interface WorkflowConfig {
  name: string;
  description?: string;
  version: string;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Estado completo del workflow
 */
export interface WorkflowState {
  config: WorkflowConfig;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId?: string;
  isRunning: boolean;
}

/**
 * Acciones disponibles en el workflow
 */
export type WorkflowAction = 
  | { type: 'ADD_NODE'; payload: { node: WorkflowNode } }
  | { type: 'UPDATE_NODE'; payload: { nodeId: string; data: Partial<WorkflowNodeData> } }
  | { type: 'DELETE_NODE'; payload: { nodeId: string } }
  | { type: 'ADD_EDGE'; payload: { edge: WorkflowEdge } }
  | { type: 'DELETE_EDGE'; payload: { edgeId: string } }
  | { type: 'SELECT_NODE'; payload: { nodeId: string | undefined } }
  | { type: 'RUN_WORKFLOW' }
  | { type: 'STOP_WORKFLOW' }
  | { type: 'RESET_WORKFLOW' };

