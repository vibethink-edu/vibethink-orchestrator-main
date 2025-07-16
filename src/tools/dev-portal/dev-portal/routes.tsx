// Rutas del Dev Portal
// VThink 1.0 - Dev Portal Routes

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StackDashboard } from './components/StackDashboard';
import { TaskManagementPage } from './pages/TaskManagementPage';
import { AlertManagementPage } from './pages/AlertManagementPage';
import { IntegrationManagementPage } from './pages/IntegrationManagementPage';

export const DevPortalRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<StackDashboard />} />
      <Route path="/tasks" element={<TaskManagementPage />} />
      <Route path="/alerts" element={<AlertManagementPage />} />
      <Route path="/integrations" element={<IntegrationManagementPage />} />
    </Routes>
  );
}; 