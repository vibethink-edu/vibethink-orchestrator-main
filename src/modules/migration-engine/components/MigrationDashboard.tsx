import React, { useState, useEffect } from 'react';
import { useMigrationEngine } from '../hooks/useMigrationEngine';
import { MigrationConfig, MigrationStatus } from '../types/migration';

interface MigrationDashboardProps {
  companyId: string;
}

export const MigrationDashboard: React.FC<MigrationDashboardProps> = ({ companyId }) => {
  const { 
    migrations, 
    currentMigration, 
    loading, 
    error,
    executeMigration,
    loadMigrations,
    rollbackMigration 
  } = useMigrationEngine();

  const [selectedMigration, setSelectedMigration] = useState<MigrationConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  useEffect(() => {
    loadMigrations();
  }, [loadMigrations]);

  const handleStartMigration = async (config: MigrationConfig) => {
    try {
      await executeMigration(config);
      // TODO: log 'Migration started successfully'
    } catch (error) {
      // TODO: log 'Migration failed:' error
    }
  };

  const handleRollbackMigration = async (migrationId: string) => {
    try {
      await rollbackMigration(migrationId);
      // TODO: log 'Migration rollback completed'
    } catch (error) {
      // TODO: log 'Rollback failed:' error
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Migration Dashboard</h1>
        <p className="text-gray-600">Manage content migrations between CMS platforms</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowConfigModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Starting...' : 'Start New Migration'}
        </button>
        
        <button
          onClick={loadMigrations}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Refresh
        </button>
      </div>

      {/* Current Migration Status */}
      {currentMigration && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Current Migration
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Status:</span>
              <span className={`text-sm font-medium ${
                currentMigration.status === 'completed' ? 'text-green-600' :
                currentMigration.status === 'failed' ? 'text-red-600' :
                'text-blue-600'
              }`}>
                {currentMigration.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Progress:</span>
              <span className="text-sm font-medium text-blue-700">
                {currentMigration.progress}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Current Step:</span>
              <span className="text-sm text-blue-700">
                {currentMigration.currentStep}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentMigration.progress}%` }}
              />
            </div>
            
            {/* Rollback Button */}
            {currentMigration.status === 'failed' && (
              <button
                onClick={() => handleRollbackMigration(currentMigration.id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Rollback
              </button>
            )}
          </div>
        </div>
      )}

      {/* Migration History */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Migration History
        </h3>
        
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
                      {migration.sourceType} → {migration.targetType}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {migration.migratedItems} items migrated
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(migration.createdAt).toLocaleDateString()}
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

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-red-800 font-medium mb-2">Error</h4>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && (
        <MigrationConfigModal
          onClose={() => setShowConfigModal(false)}
          onStartMigration={handleStartMigration}
          loading={loading}
        />
      )}
    </div>
  );
};

// Componente de configuración de migración
interface MigrationConfigModalProps {
  onClose: () => void;
  onStartMigration: (config: MigrationConfig) => void;
  loading: boolean;
}

const MigrationConfigModal: React.FC<MigrationConfigModalProps> = ({
  onClose,
  onStartMigration,
  loading
}) => {
  const [config, setConfig] = useState<MigrationConfig>({
    source: {
      type: 'kentico',
      config: {
        url: '',
        username: '',
        password: '',
        apiKey: ''
      }
    },
    target: {
      type: 'strapi',
      config: {
        url: '',
        token: ''
      }
    },
    options: {
      incremental: false,
      validateOnly: false,
      dryRun: false
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartMigration(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Migration Configuration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Source Configuration */}
          <div>
            <h3 className="font-medium mb-2">Source (Kentico)</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Kentico URL"
                value={config.source.config.url}
                onChange={(e) => setConfig({
                  ...config,
                  source: {
                    ...config.source,
                    config: {
                      ...config.source.config,
                      url: e.target.value
                    }
                  }
                })}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={config.source.config.username}
                onChange={(e) => setConfig({
                  ...config,
                  source: {
                    ...config.source,
                    config: {
                      ...config.source.config,
                      username: e.target.value
                    }
                  }
                })}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={config.source.config.password}
                onChange={(e) => setConfig({
                  ...config,
                  source: {
                    ...config.source,
                    config: {
                      ...config.source.config,
                      password: e.target.value
                    }
                  }
                })}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="API Key"
                value={config.source.config.apiKey}
                onChange={(e) => setConfig({
                  ...config,
                  source: {
                    ...config.source,
                    config: {
                      ...config.source.config,
                      apiKey: e.target.value
                    }
                  }
                })}
                className="border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          {/* Target Configuration */}
          <div>
            <h3 className="font-medium mb-2">Target</h3>
            <select
              value={config.target.type}
              onChange={(e) => setConfig({
                ...config,
                target: {
                  ...config.target,
                  type: e.target.value as 'strapi' | 'payload' | 'supabase'
                }
              })}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="strapi">Strapi CMS</option>
              <option value="payload">Payload CMS</option>
              <option value="supabase">Supabase</option>
            </select>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <input
                type="text"
                placeholder="Target URL"
                value={config.target.config.url}
                onChange={(e) => setConfig({
                  ...config,
                  target: {
                    ...config.target,
                    config: {
                      ...config.target.config,
                      url: e.target.value
                    }
                  }
                })}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Token/API Key"
                value={config.target.config.token}
                onChange={(e) => setConfig({
                  ...config,
                  target: {
                    ...config.target,
                    config: {
                      ...config.target.config,
                      token: e.target.value
                    }
                  }
                })}
                className="border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          {/* Options */}
          <div>
            <h3 className="font-medium mb-2">Options</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.options.incremental}
                  onChange={(e) => setConfig({
                    ...config,
                    options: {
                      ...config.options,
                      incremental: e.target.checked
                    }
                  })}
                  className="mr-2"
                />
                Incremental Migration
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.options.validateOnly}
                  onChange={(e) => setConfig({
                    ...config,
                    options: {
                      ...config.options,
                      validateOnly: e.target.checked
                    }
                  })}
                  className="mr-2"
                />
                Validate Only (No Migration)
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.options.dryRun}
                  onChange={(e) => setConfig({
                    ...config,
                    options: {
                      ...config.options,
                      dryRun: e.target.checked
                    }
                  })}
                  className="mr-2"
                />
                Dry Run (Test Mode)
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Migration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 