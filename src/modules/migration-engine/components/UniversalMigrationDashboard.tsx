import React, { useState, useEffect } from 'react';
import { useUniversalMigration } from '../hooks/useUniversalMigration';
import { 
  UniversalMigrationConfig, 
  MigrationResult,
  MigrationTemplate 
} from '../types/universal-migration';

interface UniversalMigrationDashboardProps {
  companyId: string;
}

export const UniversalMigrationDashboard: React.FC<UniversalMigrationDashboardProps> = ({ companyId }) => {
  const {
    migrations,
    templates,
    analytics,
    currentMigration,
    loading,
    error,
    executeMigration,
    executeIncrementalMigration,
    executeScheduledMigration,
    rollbackMigration,
    loadTemplates,
    createMigrationFromTemplate,
    loadAnalytics,
    getSupportedSystems,
    getSupportedContentTypes,
    getMigrationOptions,
    clearError,
    clearCurrentMigration
  } = useUniversalMigration();

  const [selectedTemplate, setSelectedTemplate] = useState<MigrationTemplate | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'migrations' | 'templates' | 'analytics'>('overview');

  useEffect(() => {
    loadTemplates();
    loadAnalytics(companyId);
  }, [loadTemplates, loadAnalytics, companyId]);

  const handleStartMigration = async (config: UniversalMigrationConfig) => {
    try {
      const result = await executeMigration(config);
      console.log('Migration started successfully:', result);
    } catch (error) {
      console.error('Migration failed:', error);
    }
  };

  const handleRollbackMigration = async (migrationId: string) => {
    try {
      const result = await rollbackMigration(migrationId);
      console.log('Migration rollback completed:', result);
    } catch (error) {
      console.error('Rollback failed:', error);
    }
  };

  const supportedSystems = getSupportedSystems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Universal Migration Platform</h1>
              <p className="text-gray-600">Migrate content between any supported system</p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Use Template
              </button>
              
              <button
                onClick={() => setShowConfigModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'New Migration'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'migrations', label: 'Migrations' },
              { id: 'templates', label: 'Templates' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Total Migrations</h3>
                <p className="text-3xl font-bold text-blue-600">{analytics?.totalMigrations || 0}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Success Rate</h3>
                <p className="text-3xl font-bold text-green-600">
                  {analytics?.successRate ? `${analytics.successRate.toFixed(1)}%` : '0%'}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Avg Duration</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {analytics?.averageDuration ? `${Math.round(analytics.averageDuration / 1000)}s` : '0s'}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Templates</h3>
                <p className="text-3xl font-bold text-orange-600">{templates.length}</p>
              </div>
            </div>

            {/* Current Migration */}
            {currentMigration && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Current Migration</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        currentMigration.status === 'completed' ? 'bg-green-100 text-green-800' :
                        currentMigration.status === 'failed' ? 'bg-red-100 text-red-800' :
                        currentMigration.status === 'running' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {currentMigration.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Progress:</span>
                      <span className="text-sm text-gray-900">{currentMigration.progress}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${currentMigration.progress}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Current Step:</span>
                      <span className="text-sm text-gray-900">{currentMigration.currentStep}</span>
                    </div>
                    
                    {currentMigration.status === 'failed' && (
                      <button
                        onClick={() => handleRollbackMigration(currentMigration.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Rollback
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Supported Systems */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Supported Systems</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Source Systems</h4>
                    <div className="space-y-2">
                      {supportedSystems.sources.map((system) => (
                        <div key={system.type} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{system.name}</span>
                          <span className="text-xs text-gray-500">{system.versions.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Target Systems</h4>
                    <div className="space-y-2">
                      {supportedSystems.targets.map((system) => (
                        <div key={system.type} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{system.name}</span>
                          <span className="text-xs text-gray-500">{system.versions.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Migrations Tab */}
        {activeTab === 'migrations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Migration History</h3>
              </div>
              <div className="p-6">
                {migrations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No migrations found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {migrations.map((migration) => (
                      <div 
                        key={migration.id}
                        className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {migration.metadata.sourceSystem} → {migration.metadata.targetSystem}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {migration.migratedItems} items migrated
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(migration.startTime).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              migration.status === 'completed' ? 'bg-green-100 text-green-800' :
                              migration.status === 'failed' ? 'bg-red-100 text-red-800' :
                              migration.status === 'running' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {migration.status}
                            </span>
                            
                            {migration.status === 'failed' && (
                              <button
                                onClick={() => handleRollbackMigration(migration.id)}
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                              >
                                Rollback
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Migration Templates</h3>
              </div>
              <div className="p-6">
                {templates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No templates available
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                      <div 
                        key={template.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowTemplateModal(true);
                        }}
                      >
                        <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{template.sourceType} → {template.targetType}</span>
                          <span>⭐ {template.rating}</span>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {template.downloads} downloads
                          </span>
                          <span className="text-xs text-gray-500">
                            by {template.author}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {analytics && (
              <>
                {/* Performance Trends */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Performance Trends</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {analytics.performanceTrends.slice(0, 7).map((trend, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">
                            {new Date(trend.date).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                              {Math.round(trend.averageDuration / 1000)}s avg
                            </span>
                            <span className="text-sm text-gray-600">
                              {trend.successRate.toFixed(1)}% success
                            </span>
                            <span className="text-sm text-gray-600">
                              {trend.totalMigrations} migrations
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Popular Systems */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Popular Source Systems</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-2">
                        {analytics.popularSourceSystems.map((system, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">{system.system}</span>
                            <span className="text-sm text-gray-900">{system.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Popular Target Systems</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-2">
                        {analytics.popularTargetSystems.map((system, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">{system.system}</span>
                            <span className="text-sm text-gray-900">{system.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Common Errors */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Common Errors</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-2">
                      {analytics.commonErrors.map((error, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">{error.error}</span>
                          <span className="text-sm text-gray-900">{error.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-red-800 font-medium mb-2">Error</h4>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && (
        <MigrationConfigModal
          onClose={() => setShowConfigModal(false)}
          onStartMigration={handleStartMigration}
          loading={loading}
          supportedSystems={supportedSystems}
          getSupportedContentTypes={getSupportedContentTypes}
          getMigrationOptions={getMigrationOptions}
        />
      )}

      {/* Template Modal */}
      {showTemplateModal && selectedTemplate && (
        <TemplateModal
          template={selectedTemplate}
          onClose={() => {
            setShowTemplateModal(false);
            setSelectedTemplate(null);
          }}
          onUseTemplate={async (config) => {
            try {
              await handleStartMigration(config);
              setShowTemplateModal(false);
              setSelectedTemplate(null);
            } catch (error) {
              console.error('Failed to use template:', error);
            }
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

// Componentes auxiliares (simplificados)
interface MigrationConfigModalProps {
  onClose: () => void;
  onStartMigration: (config: UniversalMigrationConfig) => void;
  loading: boolean;
  supportedSystems: any;
  getSupportedContentTypes: (systemType: string) => string[];
  getMigrationOptions: () => any;
}

const MigrationConfigModal: React.FC<MigrationConfigModalProps> = ({
  onClose,
  onStartMigration,
  loading,
  supportedSystems,
  getSupportedContentTypes,
  getMigrationOptions
}) => {
  // Implementación simplificada del modal de configuración
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Migration Configuration</h2>
        <p className="text-gray-600 mb-6">Configure your migration settings</p>
        
        {/* Implementación completa del formulario */}
        <div className="space-y-6">
          {/* Source Configuration */}
          <div>
            <h3 className="font-medium mb-3">Source System</h3>
            <select className="w-full border rounded px-3 py-2">
              {supportedSystems.sources.map((system: any) => (
                <option key={system.type} value={system.type}>
                  {system.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Target Configuration */}
          <div>
            <h3 className="font-medium mb-3">Target System</h3>
            <select className="w-full border rounded px-3 py-2">
              {supportedSystems.targets.map((system: any) => (
                <option key={system.type} value={system.type}>
                  {system.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Implementar lógica de migración
                onClose();
              }}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Migration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TemplateModalProps {
  template: MigrationTemplate;
  onClose: () => void;
  onUseTemplate: (config: UniversalMigrationConfig) => void;
  loading: boolean;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  template,
  onClose,
  onUseTemplate,
  loading
}) => {
  // Implementación simplificada del modal de plantilla
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">{template.name}</h2>
        <p className="text-gray-600 mb-6">{template.description}</p>
        
        <div className="space-y-4 mb-6">
          <div>
            <span className="font-medium">Category:</span> {template.category}
          </div>
          <div>
            <span className="font-medium">Source:</span> {template.sourceType}
          </div>
          <div>
            <span className="font-medium">Target:</span> {template.targetType}
          </div>
          <div>
            <span className="font-medium">Rating:</span> ⭐ {template.rating}
          </div>
          <div>
            <span className="font-medium">Downloads:</span> {template.downloads}
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onUseTemplate(template.config)}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Use Template'}
          </button>
        </div>
      </div>
    </div>
  );
}; 