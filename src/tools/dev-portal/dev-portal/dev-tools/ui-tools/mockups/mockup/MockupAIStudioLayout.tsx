import React, { useState } from 'react';
import Sidebar from './Sidebar';
import HeaderMenu from './HeaderMenu';
import RightPanel from './RightPanel';
import ContentPanel from './ContentPanel';

/**
 * Layout principal inspirado en Google AI Studio.
 * Estructura: sidebar colapsable, header minimalista, panel derecho colapsable y área central.
 * Todo preparado para dark/light mode y máxima modularidad.
 */
const MockupAIStudioLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className={theme === 'dark' ? 'dark bg-neutral-900 text-neutral-100' : 'bg-neutral-50 text-neutral-900'} style={{ minHeight: '100vh' }}>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 flex flex-col relative">
          <HeaderMenu theme={theme} setTheme={setTheme} />
          <div className="flex flex-1 overflow-hidden">
            <ContentPanel />
            <RightPanel open={rightPanelOpen} onToggle={() => setRightPanelOpen((v) => !v)} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MockupAIStudioLayout; 