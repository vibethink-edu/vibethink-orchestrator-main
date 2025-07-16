import React, { useState } from "react";
import Header from "@/shared/components/layout/Header";
// import Dashboard2Sidebar from "./components/Dashboard2Sidebar";
import { useAuth } from "@/shared/hooks/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet';
import { Menu } from 'lucide-react';

const Dashboard2 = () => {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">VibeThink Dashboard 2</h1>
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
        showSearch={true}
        showNotifications={true}
        showSettings={true}
        currentSection="dashboard2"
      />
      <div className="flex h-[calc(100vh-64px)] font-sans">
        {/* Sidebar izquierdo responsivo */}
        <div className="hidden md:block">
          {/* <Dashboard2Sidebar /> */}
        </div>
        {/* Botón para abrir sidebar en móvil */}
        <div className="md:hidden fixed top-16 left-2 z-20">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <button className="bg-white border rounded p-2 shadow" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              {/* <Dashboard2Sidebar onClose={() => setSidebarOpen(false)} /> */}
            </SheetContent>
          </Sheet>
        </div>
        {/* Panel central */}
        <main className="flex-1 overflow-auto p-4 md:p-8 max-w-full w-full min-h-[calc(100vh-64px)] bg-background">
          <h1 className="text-2xl font-bold mb-4">Bienvenido a Dashboard2</h1>
          <p className="mb-2">Este dashboard replica el header y la responsividad del Dashboard1 original.</p>
          {/* ...widgets, cards, tablas, etc... */}
        </main>
      </div>
    </>
  );
};

export default Dashboard2; 