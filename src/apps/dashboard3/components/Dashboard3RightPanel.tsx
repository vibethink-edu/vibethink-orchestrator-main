import React from 'react';

interface Dashboard3RightPanelProps {
  onClose: () => void;
}

const Dashboard3RightPanel: React.FC<Dashboard3RightPanelProps> = ({ onClose }) => {
  return (
    <aside className="w-80 h-full bg-white border-l flex flex-col font-sans">
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <span className="font-bold text-lg tracking-tight">Panel Contextual</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">✕</button>
      </div>
      {/* Aquí va el contenido contextual: AI Assistant, Timeline, Quick Actions, etc. */}
      <div className="flex-1 p-4">
        <h2 className="text-md font-semibold mb-2">AI Assistant</h2>
        <div className="mb-4">¿En qué puedo ayudarte hoy?</div>
        <h2 className="text-md font-semibold mb-2">Timeline</h2>
        <ul className="text-sm space-y-1">
          <li>Patricia Escallon actualizó un reporte</li>
          <li>Cristina Manrique subió un documento</li>
          <li>Eduardo configuró una alerta</li>
        </ul>
        <h2 className="text-md font-semibold mt-4 mb-2">Quick Actions</h2>
        <button className="block w-full bg-blue-600 text-white rounded py-1 mb-2">Nueva tarea</button>
        <button className="block w-full border rounded py-1">Exportar datos</button>
      </div>
    </aside>
  );
};

export default Dashboard3RightPanel; 