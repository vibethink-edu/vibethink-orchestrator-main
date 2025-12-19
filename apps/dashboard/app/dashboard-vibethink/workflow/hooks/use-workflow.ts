/**
 * useWorkflow Hook
 * 
 * Hook personalizado para gestionar el estado del workflow.
 * Centraliza la lógica de negocio del editor de workflows.
 */

import { useState, useCallback } from 'react';
import { WorkflowNode, WorkflowEdge, WorkflowState, WorkflowAction, NodeType } from '../types';
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

  // Validar tipo de nodo
  const isValidNodeType = (type: string): type is NodeType => {
    return ['start', 'process', 'decision', 'action', 'end'].includes(type);
  };

  // Agregar nodo con validación
  const addNode = useCallback((type: string, position?: { x: number; y: number }) => {
    try {
      // Validar tipo de nodo
      if (!isValidNodeType(type)) {
        throw new Error(`Invalid node type: ${type}`);
      }

      // Validar posición
      const validPosition = position || { 
        x: Math.random() * 400, 
        y: Math.random() * 400 
      };
      
      if (typeof validPosition.x !== 'number' || typeof validPosition.y !== 'number') {
        throw new Error('Invalid position: x and y must be numbers');
      }

      const newNode: WorkflowNode = {
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        position: validPosition,
        data: {
          label: `Nodo ${type}`,
          type,
          status: 'idle',
        },
      };

      setState((prev) => ({
        ...prev,
        nodes: [...prev.nodes, newNode],
        updatedAt: new Date(),
      }));
    } catch (error) {
      // TODO: Implementar sistema de notificaciones (toast)
      console.error('Error adding node:', error);
      throw error;
    }
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

  // Actualizar todos los nodos (para sincronización con React Flow)
  const updateNodes = useCallback((nodes: WorkflowNode[]) => {
    setState((prev) => ({
      ...prev,
      nodes,
      updatedAt: new Date(),
    }));
  }, []);

  // Actualizar todos los edges (para sincronización con React Flow)
  const updateEdges = useCallback((edges: WorkflowEdge[]) => {
    setState((prev) => ({
      ...prev,
      edges,
      updatedAt: new Date(),
    }));
  }, []);

  // Agregar edge
  const addEdge = useCallback((edge: WorkflowEdge) => {
    setState((prev) => ({
      ...prev,
      edges: [...prev.edges, edge],
      updatedAt: new Date(),
    }));
  }, []);

  // Eliminar edge
  const deleteEdge = useCallback((edgeId: string) => {
    setState((prev) => ({
      ...prev,
      edges: prev.edges.filter((edge) => edge.id !== edgeId),
      updatedAt: new Date(),
    }));
  }, []);

  // Guardar workflow
  const saveWorkflow = useCallback(() => {
    try {
      // TODO: Implementar guardado real (API call)
      setState((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          updatedAt: new Date(),
        },
      }));
      // En producción, aquí se haría la llamada a la API
    } catch (error) {
      // TODO: Implementar sistema de notificaciones (toast)
      console.error('Error saving workflow:', error);
      throw error;
    }
  }, []);

  return {
    state,
    addNode,
    updateNode,
    deleteNode,
    updateNodes,
    addEdge,
    updateEdges,
    deleteEdge,
    runWorkflow,
    stopWorkflow,
    resetWorkflow,
    saveWorkflow,
  };
}

