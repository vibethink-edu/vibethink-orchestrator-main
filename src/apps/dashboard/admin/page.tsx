"use client";

import React from "react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Panel
              </h1>
              <span className="ml-2 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                SUPER_ADMIN
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            🛡️ Panel de Administración VThink
          </h2>
          <p className="text-gray-600">
            Gestión multi-tenant con controles de seguridad avanzados
          </p>
        </div>
      </main>
    </div>
  );
} 