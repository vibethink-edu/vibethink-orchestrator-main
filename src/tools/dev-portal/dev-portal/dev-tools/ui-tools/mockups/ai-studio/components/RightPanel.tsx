import React, { useState } from "react";

export const RightPanel: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside
      className={`h-full bg-white/80 dark:bg-neutral-900/80 border-l border-gray-200 dark:border-neutral-800 transition-all duration-300 ease-in-out flex flex-col ${collapsed ? "w-12" : "w-80"}`}
      aria-label="Panel derecho de configuración"
    >
      <div className="flex items-center justify-between p-4">
        <span className={`font-semibold text-lg text-gray-800 dark:text-gray-100 transition-opacity ${collapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}>Configuración</span>
        <button
          className="ml-auto p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label={collapsed ? "Expandir panel derecho" : "Colapsar panel derecho"}
          onClick={() => setCollapsed((c) => !c)}
        >
          <span className="block w-5 h-1 bg-gray-500 rounded-full rotate-90" />
        </button>
      </div>
      {!collapsed && (
        <form className="flex flex-col gap-6 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modelo</label>
            <select className="w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>gpt-4-turbo</option>
              <option>gpt-3.5-turbo</option>
              <option>gemini-pro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Temperatura</label>
            <input type="range" min="0" max="2" step="0.1" className="w-full accent-primary-600" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="context" className="accent-primary-600" />
            <label htmlFor="context" className="text-sm text-gray-700 dark:text-gray-300">Incluir contexto</label>
          </div>
        </form>
      )}
    </aside>
  );
}; 