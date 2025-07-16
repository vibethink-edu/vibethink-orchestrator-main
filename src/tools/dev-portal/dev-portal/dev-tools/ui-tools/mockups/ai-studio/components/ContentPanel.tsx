import React from "react";

const mockMessages = [
  { sender: "AI", content: "Hola, ¿en qué puedo ayudarte hoy?", time: "09:00" },
  { sender: "Usuario", content: "Genera un resumen de la reunión de ayer.", time: "09:01" },
  { sender: "AI", content: "Claro, aquí tienes el resumen...", time: "09:02" },
];

export const ContentPanel: React.FC = () => {
  return (
    <section className="flex-1 flex flex-col gap-4 px-8 py-8 overflow-y-auto bg-white/70 dark:bg-neutral-900/70 rounded-3xl m-6 shadow-lg transition-colors">
      {mockMessages.map((msg, idx) => (
        <div
          key={idx}
          className={`max-w-xl px-6 py-4 rounded-2xl shadow-md transition-all animate-fade-in ${msg.sender === "AI" ? "bg-primary-50 dark:bg-primary-900/40 self-start" : "bg-gray-100 dark:bg-neutral-800 self-end"}`}
        >
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{msg.sender} · {msg.time}</div>
          <div className="text-gray-800 dark:text-gray-100 text-base">{msg.content}</div>
        </div>
      ))}
    </section>
  );
}; 