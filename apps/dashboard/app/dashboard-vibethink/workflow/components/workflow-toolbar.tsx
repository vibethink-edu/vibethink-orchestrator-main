'use client';

/**
 * WorkflowToolbar Component
 * 
 * Barra de herramientas para el editor de workflows.
 * Incluye acciones principales: agregar nodos, ejecutar, guardar, etc.
 */

import React from 'react';
import { Button } from '@vibethink/ui';
import {
  Play,
  Square,
  Save,
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react';

interface WorkflowToolbarProps {
  onAddNode?: (type: string) => void;
  onRun?: () => void;
  onStop?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onDelete?: () => void;
  isRunning?: boolean;
}

export function WorkflowToolbar({
  onAddNode,
  onRun,
  onStop,
  onSave,
  onReset,
  onExport,
  onImport,
  onDelete,
  isRunning = false,
}: WorkflowToolbarProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-card border rounded-lg shadow-sm">
      {/* Acciones principales */}
      <div className="flex items-center gap-1">
        {isRunning ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={onStop}
            className="gap-2"
          >
            <Square className="w-4 h-4" />
            Detener
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onRun}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            Ejecutar
          </Button>
        )}
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Agregar nodos */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddNode?.('start')}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Inicio
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddNode?.('process')}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Proceso
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddNode?.('decision')}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Decisión
        </Button>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Acciones de archivo */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onImport}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          Importar
        </Button>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Acciones de edición */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Resetear
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="gap-2 text-destructive"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </Button>
      </div>
    </div>
  );
}

