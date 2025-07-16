import React from 'react';
import ChatInputBar from './ChatInputBar';

/**
 * Área central de contenido, con caja de chat tipo Google AI Studio.
 * Padding generoso, títulos, acciones y ejemplo de instrucciones.
 */
const ContentPanel: React.FC = () => {
  return (
    <section className="flex-1 flex flex-col items-center justify-start p-8 overflow-y-auto relative">
      <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 mb-8 relative">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight">HTML Code For AI Design</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" title="Instrucciones del sistema">
              <i className="fas fa-clipboard-list text-lg" />
            </button>
            <button className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" title="Compartir">
              <i className="fas fa-share-alt text-lg" />
            </button>
            <button className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" title="Más opciones">
              <i className="fas fa-ellipsis-v text-lg" />
            </button>
          </div>
        </div>
        <ul className="list-disc pl-6 space-y-2 text-base">
          <li><b>Padding:</b> Los paneles principales usan padding generoso (aprox. 16px-24px). Los elementos internos como los turnos de chat tienen un padding menor (aprox. 8px-12px).</li>
          <li><b>Alineación:</b> La mayoría de los elementos están alineados a la izquierda, con acciones secundarias (iconos) a la derecha. El uso de <code>display: flex</code> con <code>justify-content: space-between</code> es recurrente para lograr esta alineación.</li>
          <li><b>Jerarquía Visual:</b> El flujo visual guía al usuario desde la navegación a la izquierda, hacia el área de chat central, y finalmente a los ajustes de la derecha. El campo de entrada de prompt y el botón "Run" son los elementos con mayor peso visual en el área de chat.</li>
        </ul>
      </div>
      <ChatInputBar />
    </section>
  );
};

export default ContentPanel; 