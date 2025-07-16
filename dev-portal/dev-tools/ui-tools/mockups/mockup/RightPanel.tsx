import React from 'react';

interface RightPanelProps {
  open: boolean;
  onToggle: () => void;
}

/**
 * Panel derecho colapsable, elegante, para settings/contexto.
 * Inspirado en Google AI Studio.
 */
const RightPanel: React.FC<RightPanelProps> = ({ open, onToggle }) => {
  return (
    <aside className={`transition-all duration-300 bg-neutral-100 dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 h-full flex flex-col ${open ? 'w-80' : 'w-12'} shadow-lg z-20`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-800">
        <span className="font-bold text-base tracking-tight text-neutral-700 dark:text-neutral-200">{open ? 'Run settings' : ''}</span>
        <button onClick={onToggle} className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition" title="Colapsar panel">
          <i className={`fas fa-angle-${open ? 'right' : 'left'}`}></i>
        </button>
      </div>
      {open && (
        <div className="flex-1 p-4 flex flex-col gap-6">
          <div>
            <label className="block text-xs font-semibold mb-1">Modelo</label>
            <select className="w-full rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-2 py-1">
              <option>Gemini 2.5 Pro</option>
              <option>GPT-4o</option>
              <option>Claude 3 Opus</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Temperatura</label>
            <input type="range" min="0" max="2" step="0.01" defaultValue="1" className="w-full" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Token count</label>
            <div className="text-sm">904,526 / 1,048,576</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default RightPanel; 