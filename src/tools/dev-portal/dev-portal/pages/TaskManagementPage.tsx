// Página de Gestión de Tareas Pendientes - Dev Portal
// VibeThink 1.0 - Task Management Page

import React from 'react';
import { TaskManagement } from '../components/TaskManagement';

export const TaskManagementPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Tareas Pendientes
          </h1>
          <p className="text-gray-600 mt-2">
            Sistema centralizado de seguimiento de tareas del proyecto VibeThink
          </p>
        </div>
        
        <TaskManagement />
      </div>
    </div>
  );
}; 