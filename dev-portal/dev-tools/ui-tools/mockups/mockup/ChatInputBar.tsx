import React from 'react';

/**
 * Barra de entrada de chat, fija en la parte inferior del área central.
 * Inspirada en Google AI Studio.
 */
const ChatInputBar: React.FC = () => {
  return (
    <form className="absolute left-0 right-0 bottom-0 px-8 pb-8 flex items-center gap-3 z-10">
      <input
        type="text"
        className="flex-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-5 py-3 text-base shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        placeholder="Escribe tu mensaje o prompt..."
        autoComplete="off"
      />
      <button
        type="submit"
        className="px-5 py-3 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition flex items-center gap-2"
        title="Enviar"
      >
        <i className="fas fa-paper-plane" />
        <span className="hidden sm:inline">Enviar</span>
      </button>
    </form>
  );
};

export default ChatInputBar; 