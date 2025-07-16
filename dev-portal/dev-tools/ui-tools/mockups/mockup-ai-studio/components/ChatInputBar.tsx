import React, { useState } from "react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ChatInputBar: React.FC = () => {
  const [value, setValue] = useState("");
  return (
    <form className="absolute bottom-0 left-0 w-full flex items-center gap-2 px-8 py-4 bg-white/80 dark:bg-neutral-900/80 rounded-b-3xl shadow-lg" onSubmit={e => e.preventDefault()}>
      <input
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        placeholder="Escribe tu prompt..."
        value={value}
        onChange={e => setValue(e.target.value)}
        aria-label="Prompt de chat"
      />
      <button
        type="submit"
        className="p-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Enviar"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
}; 