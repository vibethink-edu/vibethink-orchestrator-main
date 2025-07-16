/**
 * BunduiExplorerFixed - Versión corregida paso a paso
 */

import React, { useState } from 'react';

// Probamos primero los componentes más básicos
const BunduiExplorerFixed: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');
  
  // Mock user
  const user = {
    id: 'test-user',
    email: 'admin@test.com',
    role: 'ADMIN'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Bundui Explorer Fixed
          </h1>
          <p className="text-gray-600">
            Versión corregida paso a paso - probando Tailwind CSS
          </p>
          {user && (
            <p className="text-sm text-gray-500 mt-2">
              Conectado como: {user.email}
            </p>
          )}
        </div>

        {/* Tabs usando solo clases de Tailwind */}
        <div className="mb-6">
          <div className="bg-gray-200 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'basic' 
                  ? 'bg-white text-gray-900 shadow' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Basic Test
            </button>
            <button
              onClick={() => setActiveTab('bundui')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'bundui' 
                  ? 'bg-white text-gray-900 shadow' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Bundui Components
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Tailwind CSS Test</h2>
              
              {/* Grid de prueba */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-blue-800 font-medium mb-2">Revenue</h3>
                  <p className="text-2xl font-bold text-gray-900">$45,231.89</p>
                  <p className="text-sm text-green-600">+20.1% from last month</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-800 font-medium mb-2">Users</h3>
                  <p className="text-2xl font-bold text-gray-900">+2,350</p>
                  <p className="text-sm text-green-600">+180.1% from last month</p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-yellow-800 font-medium mb-2">Sales</h3>
                  <p className="text-2xl font-bold text-gray-900">+12,234</p>
                  <p className="text-sm text-green-600">+19% from last month</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="text-purple-800 font-medium mb-2">Active</h3>
                  <p className="text-2xl font-bold text-gray-900">+573</p>
                  <p className="text-sm text-green-600">+201 since last hour</p>
                </div>
              </div>

              {/* Botones de prueba */}
              <div className="flex gap-4 mb-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                  Primary Button
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md font-medium transition-colors">
                  Secondary Button
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors">
                  Outline Button
                </button>
              </div>

              {/* Estado */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-medium mb-2">✅ Status</h3>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Tailwind CSS funcionando correctamente</li>
                  <li>• Grid responsivo operativo</li>
                  <li>• Colores y espaciado aplicados</li>
                  <li>• Transiciones funcionando</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bundui' && (
          <BunduiComponentsTest />
        )}
      </div>
    </div>
  );
};

// Componente separado para probar Bundui
const BunduiComponentsTest: React.FC = () => {
  const [testStage, setTestStage] = useState(1);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Bundui Components Test - Stage {testStage}
        </h2>
        
        <div className="mb-4">
          <button 
            onClick={() => setTestStage(testStage < 4 ? testStage + 1 : 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Next Test ({testStage}/4)
          </button>
        </div>

        {testStage === 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-blue-800 font-medium mb-2">Stage 1: Basic HTML</h3>
            <p className="text-blue-700">
              Testing basic HTML components without Bundui imports.
            </p>
            <div className="mt-4 space-y-2">
              <div className="bg-white border rounded p-3">Basic Card Structure</div>
              <div className="bg-white border rounded p-3">Another Card</div>
            </div>
          </div>
        )}

        {testStage === 2 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-yellow-800 font-medium mb-2">Stage 2: Simple Bundui Import</h3>
            <p className="text-yellow-700">
              Next: Will test importing Button component only.
            </p>
            <div className="mt-4">
              <div className="bg-white border rounded p-3">
                Ready to test simple Bundui Button import
              </div>
            </div>
          </div>
        )}

        {testStage === 3 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-green-800 font-medium mb-2">Stage 3: Card Components</h3>
            <p className="text-green-700">
              Next: Will test Card, CardHeader, CardContent imports.
            </p>
            <div className="mt-4">
              <div className="bg-white border rounded p-3">
                Ready to test Card components
              </div>
            </div>
          </div>
        )}

        {testStage === 4 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-purple-800 font-medium mb-2">Stage 4: Full Dashboard</h3>
            <p className="text-purple-700">
              Next: Will test full dashboard with all components.
            </p>
            <div className="mt-4">
              <div className="bg-white border rounded p-3">
                Ready to test complete dashboard
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BunduiExplorerFixed;
