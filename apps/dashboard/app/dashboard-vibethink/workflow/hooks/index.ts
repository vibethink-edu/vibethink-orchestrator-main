/**
 * Workflow Hooks - Barrel Exports
 * 
 * Centralized exports for all workflow-related hooks
 * Simplifies imports across components
 * 
 * Following the pattern from analytics/hooks/index.ts
 */

export { useWorkflow } from './use-workflow';

// Re-export types for convenience
export type {
  WorkflowNode,
  WorkflowEdge,
  WorkflowState,
  WorkflowConfig,
  WorkflowNodeData,
  NodeType,
  NodeStatus,
} from '../types';

