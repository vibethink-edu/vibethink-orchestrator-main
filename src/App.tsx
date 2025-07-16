import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/shared/hooks/useAuth";
import Dashboard1 from "@/apps/dashboard/main";
import Dashboard2 from "@/apps/dashboard2/main";
import Dashboard3 from "@/apps/dashboard3/main";
import AdminRouter from "@/apps/admin/AdminRouter";
import LoginApp from "@/apps/login/App";

// Componentes temporales para aplicaciones faltantes
const AIChat = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">🤖 AI Assistant Chat</h1>
        <p className="text-gray-600 mb-6">Sistema de chat inteligente con IA integrada</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">✅ Componente AI Chat funcional</p>
          <p className="text-sm text-blue-600 mt-2">Próximamente: Integración completa con OpenAI y contexto empresarial</p>
        </div>
        <div className="mt-6 space-x-4">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ← Volver al Dashboard
          </button>
          <button 
            onClick={() => window.location.href = '/admin'}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Panel Admin
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CRM = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">📊 CRM System</h1>
        <p className="text-gray-600 mb-6">Sistema de gestión de relaciones con clientes</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">✅ Componente CRM funcional</p>
          <p className="text-sm text-green-600 mt-2">Próximamente: Gestión completa de leads, contactos y oportunidades</p>
        </div>
        <div className="mt-6 space-x-4">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ← Volver al Dashboard
          </button>
          <button 
            onClick={() => window.location.href = '/admin'}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Panel Admin
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Helpdesk = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">🎧 Helpdesk Support</h1>
        <p className="text-gray-600 mb-6">Sistema de soporte y tickets</p>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-800">✅ Componente Helpdesk funcional</p>
          <p className="text-sm text-purple-600 mt-2">Próximamente: Gestión completa de tickets, SLA y atención al cliente</p>
        </div>
        <div className="mt-6 space-x-4">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            ← Volver al Dashboard
          </button>
          <button 
            onClick={() => window.location.href = '/admin'}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Panel Admin
          </button>
        </div>
      </div>
    </div>
  </div>
);

const SuperAdmin = () => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 p-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">👑 Super Admin Panel</h1>
        <p className="text-gray-600 mb-6">Panel de súper administración multi-tenant</p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">✅ Componente Super Admin funcional</p>
          <p className="text-sm text-red-600 mt-2">Próximamente: Gestión completa de empresas, usuarios y configuración global</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">🏢 Multi-tenant Management</h3>
            <p className="text-sm text-gray-600">Gestión de empresas y aislamiento de datos</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">🔐 Global Security</h3>
            <p className="text-sm text-gray-600">Configuración de seguridad y roles globales</p>
          </div>
        </div>
        <div className="mt-6 space-x-4">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            ← Volver al Dashboard
          </button>
          <button 
            onClick={() => window.location.href = '/admin'}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Panel Admin
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas principales */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard1 />} />
          <Route path="/dashboard2" element={<Dashboard2 />} />
          <Route path="/dashboard3" element={<Dashboard3 />} />
          
          {/* Rutas de aplicaciones */}
          <Route path="/login" element={<LoginApp />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/helpdesk" element={<Helpdesk />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
          
          {/* Rutas del admin */}
          <Route path="/admin/*" element={<AdminRouter />} />
          
          {/* Ruta de fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
} 