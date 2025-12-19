/**
 * useWorkflow Hook
 * 
 * Hook personalizado para gestionar el estado del workflow.
 * Centraliza la lógica de negocio del editor de workflows.
 */

import { useState, useCallback } from 'react';
import { WorkflowNode, WorkflowEdge, WorkflowState, WorkflowAction } from '../types';
import { generateMockWorkflow } from '../lib/mock-data';

const initialState: WorkflowState = {
  config: {
    name: 'Nuevo Workflow',
    description: 'Workflow sin guardar',
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  nodes: [],
  edges: [],
  isRunning: false,
};

export function useWorkflow(initialData?: Partial<WorkflowState>) {
  const [state, setState] = useState<WorkflowState>(() => {
    if (initialData) {
      return { ...initialState, ...initialData };
    }
    // Si no hay datos iniciales, usar datos mock
    const mockData = generateMockWorkflow();
    return {
      ...initialState,
      nodes: mockData.nodes,
      edges: mockData.edges,
    };
  });

  // Agregar nodo
  const addNode = useCallback((type: string, position?: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: type as any,
      position: position || { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: `Nodo ${type}`,
        type: type as any,
        status: 'idle',
      },
    };

    setState((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      updatedAt: new Date(),
    }));
  }, []);

  // Actualizar nodo
  const updateNode = useCallback((nodeId: string, data: Partial<WorkflowNode['data']>) => {
    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
      updatedAt: new Date(),
    }));
  }, []);

  // Eliminar nodo
  const deleteNode = useCallback((nodeId: string) => {
    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((node) => node.id !== nodeId),
      edges: prev.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      updatedAt: new Date(),
    }));
  }, []);

  // Ejecutar workflow
  const runWorkflow = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
      nodes: prev.nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: 'running' as const },
      })),
    }));

    // Simular ejecución (mock)
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isRunning: false,
        nodes: prev.nodes.map((node) => ({
          ...node,
          data: { ...node.data, status: 'completed' as const },
        })),
      }));
    }, 2000);
  }, []);

  // Detener workflow
  const stopWorkflow = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
      nodes: prev.nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: 'paused' as const },
      })),
    }));
  }, []);

  // Resetear workflow
  const resetWorkflow = useCallback(() => {
    const mockData = generateMockWorkflow();
    setState({
      ...initialState,
      nodes: mockData.nodes,
      edges: mockData.edges,
    });
  }, []);

  // Guardar workflow
  const saveWorkflow = useCallback(() => {
    // TODO: Implementar guardado real
    console.log('Saving workflow:', state);
    setState((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        updatedAt: new Date(),
      },
    }));
  }, [state]);

  return {
    state,
    addNode,
    updateNode,
    deleteNode,
    runWorkflow,
    stopWorkflow,
    resetWorkflow,
    saveWorkflow,
  };
}

