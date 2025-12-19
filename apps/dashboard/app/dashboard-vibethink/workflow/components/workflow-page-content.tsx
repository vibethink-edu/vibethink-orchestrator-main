'use client';

/**
 * WorkflowPageContent Component
 * 
 * Componente cliente que contiene toda la lógica interactiva del workflow.
 * Separado del page.tsx para permitir generateMetadata en el Server Component.
 */

import { WorkflowCanvas, WorkflowToolbar } from './';
import { useWorkflow } from '../hooks';
import { useState } from 'react';

export function WorkflowPageContent() {
  const {
    state,
    addNode,
    updateNode,
    deleteNode,
    updateNodes,
    updateEdges,
    runWorkflow,
    stopWorkflow,
    resetWorkflow,
    saveWorkflow,
  } = useWorkflow();

  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleAddNode = (type: string) => {
    addNode(type, {
      x: Math.random() * 600 + 200,
      y: Math.random() * 400 + 100,
    });
  };

  const handleExport = () => {
    try {
      const data = {
        config: state.config,
        nodes: state.nodes,
        edges: state.edges,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.config.name}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      // TODO: Implementar sistema de notificaciones (toast)
      console.error('Error exporting workflow:', error);
    }
  };

  const handleImport = () => {
    // TODO: Implementar importación desde archivo JSON
    // Esto abriría un input file y cargaría el workflow
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-var(--content-padding)*2)]">
      {/* Header del dashboard */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Workflow Editor</h1>
        <p className="text-muted-foreground">
          Crea y edita workflows visuales con React Flow
        </p>
      </div>

      {/* Canvas del workflow */}
      <div className="flex-1 border rounded-lg overflow-hidden bg-background relative">
        <WorkflowCanvas
          initialNodes={state.nodes}
          initialEdges={state.edges}
          onNodeClick={handleNodeClick}
          onUpdateNode={updateNode}
          selectedNodeId={selectedNodeId}
          onNodesChange={updateNodes}
          onEdgesChange={updateEdges}
        />
        
        {/* Toolbar flotante */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <WorkflowToolbar
            onAddNode={handleAddNode}
            onRun={runWorkflow}
            onStop={stopWorkflow}
            onSave={saveWorkflow}
            onReset={resetWorkflow}
            onExport={handleExport}
            onImport={handleImport}
            onDelete={() => {
              if (selectedNodeId) {
                deleteNode(selectedNodeId);
                setSelectedNodeId(undefined);
              }
            }}
            isRunning={state.isRunning}
          />
        </div>
      </div>
    </div>
  );
}

