import DashboardLayout from '@/shared/components/bundui/DashboardLayout';

export default function DashboardPage() {
  return (
    <div className="vthink-container">
      <div className="vthink-card">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          VibeThink Orchestrator Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Plataforma SaaS multi-tenant con metodología VThink 1.0
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">Gestión Empresarial</h3>
            <p className="text-sm text-blue-600 dark:text-blue-300">Herramientas avanzadas para la gestión de empresas</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200">Multi-tenant</h3>
            <p className="text-sm text-green-600 dark:text-green-300">Arquitectura segura para múltiples empresas</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 dark:text-purple-200">VThink 1.0</h3>
            <p className="text-sm text-purple-600 dark:text-purple-300">Metodología CMMI-ML3 para desarrollo</p>
          </div>
        </div>
      </div>
    </div>
  );
} 