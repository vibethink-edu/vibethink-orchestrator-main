'use client';

/**
 * WorkflowSidebar Component
 * 
 * Panel lateral que muestra detalles del nodo seleccionado.
 * Permite editar propiedades del nodo.
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@vibethink/ui';
import { Input } from '@vibethink/ui';
import { Label } from '@vibethink/ui';
import { Textarea } from '@vibethink/ui';
import { WorkflowNode } from '../types';

interface WorkflowSidebarProps {
  nodeId: string;
  nodes: WorkflowNode[];
  onUpdateNode?: (nodeId: string, data: Partial<WorkflowNode['data']>) => void;
}

export function WorkflowSidebar({ nodeId, nodes, onUpdateNode }: WorkflowSidebarProps) {
  const node = nodes.find((n) => n.id === nodeId);

  if (!node) {
    return null;
  }

  const data = node.data;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Propiedades del Nodo</CardTitle>
        <CardDescription>
          Edita las propiedades del nodo seleccionado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tipo de nodo */}
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Input value={data.type} disabled className="bg-muted" />
        </div>

        {/* Etiqueta */}
        <div className="space-y-2">
          <Label htmlFor="label">Etiqueta</Label>
          <Input
            id="label"
            value={data.label}
            onChange={(e) => {
              if (onUpdateNode) {
                onUpdateNode(nodeId, { label: e.target.value });
              }
            }}
            placeholder="Nombre del nodo"
          />
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={(e) => {
              if (onUpdateNode) {
                onUpdateNode(nodeId, { description: e.target.value });
              }
            }}
            placeholder="Descripción del nodo"
            rows={3}
          />
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label>Estado</Label>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                data.status === 'running'
                  ? 'bg-blue-100 text-blue-800'
                  : data.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : data.status === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {data.status}
            </span>
          </div>
        </div>

        {/* Posición */}
        <div className="space-y-2">
          <Label>Posición</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">X</Label>
              <Input
                value={Math.round(node.position.x)}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Y</Label>
              <Input
                value={Math.round(node.position.y)}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

