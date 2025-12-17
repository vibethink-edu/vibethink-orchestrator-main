'use client';

import React, { useState } from "react";

/**
 * ChatWidget
 * Componente desacoplado para mostrar la sección de chat/mensajes en el dashboard.
 * Replica la experiencia visual del demo Bundui Premium, pero usando solo componentes propios.
 */

const initialMessages = [
  { sender: "support", text: "Hi, how can I help you today?" },
  { sender: "user", text: "Hey, I'm having trouble with my account." },
  { sender: "support", text: "What seems to be the problem?" },
  { sender: "user", text: "I can't log in." },
];

export const ChatWidget: React.FC = () => {
  // Inicializa vacío para evitar mismatch SSR/CSR
  const [messages, setMessages] = useState<typeof initialMessages>([]);
  const [input, setInput] = useState("");

  // Solo en cliente, carga los mensajes mock
  React.useEffect(() => {
    setMessages(initialMessages);
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", text: input }]);
      setInput("");
    }
  };

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6 flex flex-col h-80 max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-4">Support Chat</h3>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
              msg.sender === "user"
                ? "bg-blue-100 text-blue-900 ml-auto"
                : "bg-gray-100 text-gray-900 mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border px-4 py-2 text-sm"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-primary text-white rounded-lg px-4 py-2 font-semibold shadow"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

// Ejemplo de uso:
// <ChatWidget /> 
