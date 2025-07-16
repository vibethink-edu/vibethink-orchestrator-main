import React from "react";
import { Sidebar } from "./components/Sidebar";
import { HeaderMenu } from "./components/HeaderMenu";
import { ContentPanel } from "./components/ContentPanel";
import { RightPanel } from "./components/RightPanel";
import { ChatInputBar } from "./components/ChatInputBar";

/**
 * Mockup principal de AI Studio, inspirado en Google AI Studio.
 * Ensambla el layout de 3 columnas, header flotante y barra de entrada.
 */
const MockupAIStudioApp: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-900 dark:to-neutral-800 font-inter">
      {/* Header flotante */}
      <HeaderMenu />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ContentPanel />
        <RightPanel />
      </div>
      <ChatInputBar />
    </div>
  );
};

export default MockupAIStudioApp; 