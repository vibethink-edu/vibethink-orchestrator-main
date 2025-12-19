'use client';

/**
 * WorkflowCanvas Component
 * 
 * Componente principal que renderiza el canvas de React Flow con los nodos y edges.
 * Sigue buenas prácticas:
 * - Separación de responsabilidades
 * - TypeScript estricto
 * - Accesibilidad
 * - Performance optimizado
 */

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { WorkflowNode, WorkflowEdge } from '../types';
import { CustomNode } from './custom-node';
import { WorkflowSidebar } from './workflow-sidebar';

interface WorkflowCanvasProps {
  initialNodes?: WorkflowNode[];
  initialEdges?: WorkflowEdge[];
  onNodesChange?: (nodes: WorkflowNode[]) => void;
  onEdgesChange?: (edges: WorkflowEdge[]) => void;
  onNodeClick?: (nodeId: string) => void;
  selectedNodeId?: string;
}

// Tipos de nodos personalizados
const nodeTypes: NodeTypes = {
  custom: CustomNode,
  start: CustomNode,
  process: CustomNode,
  decision: CustomNode,
  action: CustomNode,
  end: CustomNode,
};

export function WorkflowCanvas({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  selectedNodeId,
}: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  // Sincronizar cambios con callbacks externos
  React.useEffect(() => {
    if (onNodesChange) {
      onNodesChange(nodes);
    }
  }, [nodes, onNodesChange]);

  React.useEffect(() => {
    if (onEdgesChange) {
      onEdgesChange(edges);
    }
  }, [edges, onEdgesChange]);

  // Manejar conexiones entre nodos
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = addEdge(params, edges);
      setEdges(newEdge);
    },
    [edges, setEdges]
  );

  // Manejar clic en nodos
  const onNodeClickInternal = useCallback(
    (_event: React.MouseEvent, node: WorkflowNode) => {
      if (onNodeClick) {
        onNodeClick(node.id);
      }
    },
    [onNodeClick]
  );

  // Configuración del viewport
  const defaultViewport = useMemo(() => ({ x: 0, y: 0, zoom: 1 }), []);

  return (
    <div className="relative w-full h-full bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeInternal}
        onEdgesChange={onEdgesChangeInternal}
        onConnect={onConnect}
        onNodeClick={onNodeClickInternal}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        fitView
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-left"
        className="workflow-canvas"
      >
        {/* Fondo con grid */}
        <Background 
          color="#e2e8f0" 
          gap={16} 
          size={1}
          variant="dots"
        />

        {/* Controles de zoom y pan */}
        <Controls 
          showInteractive={true}
          position="top-right"
        />

        {/* Minimapa */}
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as { color?: string };
            return data.color || '#3b82f6';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          position="bottom-right"
          pannable
          zoomable
        />

        {/* Sidebar lateral (si hay nodo seleccionado) */}
        {selectedNodeId && (
          <Panel position="top-left" className="w-80">
            <WorkflowSidebar nodeId={selectedNodeId} nodes={nodes} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}

