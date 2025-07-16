import React, { useState } from "react";
import Header from "@/shared/components/layout/Header";
import Dashboard3Layout from "./components/Dashboard3Layout";
import { useAuth } from "@/shared/hooks/hooks/useAuth";

const Dashboard3 = () => {
  const { user, isAuthenticated } = useAuth();
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">VibeThink Dashboard 3</h1>
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
        currentSection="dashboard3"
      />
      <Dashboard3Layout leftOpen={leftOpen} setLeftOpen={setLeftOpen} rightOpen={rightOpen} setRightOpen={setRightOpen} />
    </>
  );
};

export default Dashboard3; 