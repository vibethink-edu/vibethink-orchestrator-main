import React from 'react';
import MockupAIStudioLayout from './MockupAIStudioLayout';

/**
 * Punto de entrada para el mockup AI Studio.
 * Importa la fuente Inter y FontAwesome solo para este mockup.
 */
const MockupAIStudioApp: React.FC = () => {
  React.useEffect(() => {
    // Carga Inter desde Google Fonts solo para este mockup
    const inter = document.createElement('link');
    inter.rel = 'stylesheet';
    inter.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap';
    document.head.appendChild(inter);
    // Carga FontAwesome solo para este mockup
    const fa = document.createElement('link');
    fa.rel = 'stylesheet';
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(fa);
    // Cleanup
    return () => {
      document.head.removeChild(inter);
      document.head.removeChild(fa);
    };
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <MockupAIStudioLayout />
    </div>
  );
};

export default MockupAIStudioApp; 