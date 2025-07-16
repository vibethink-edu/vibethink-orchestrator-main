import React from "react";
import Header from "@/shared/components/layout/Header";
import { useAuth } from "@/shared/hooks/hooks/useAuth";

const Dashboard1 = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">VibeThink Dashboard</h1>
          <p className="text-gray-600 mb-4">Inicia sesión para acceder al dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
        user={{
          name: 'Patricia Escallon',
          email: 'patricia@vibethink.com',
          role: 'SUPER_ADMIN',
        }}
        onLogout={() => {/* lógica de logout */}}
        currentSection="dashboard"
      />
      <main className="font-sans p-8">
        {/* Aquí va el contenido original del dashboard, widgets, cards, etc. */}
        <h1 className="text-2xl font-bold mb-4">Bienvenido a VibeThink Dashboard</h1>
        <p className="mb-2">Este dashboard mantiene el layout y widgets originales, solo cambia el texto y los nombres de las personas.</p>
        {/* ...widgets, cards, tablas, etc... */}
      </main>
    </>
  );
};

export default Dashboard1; 