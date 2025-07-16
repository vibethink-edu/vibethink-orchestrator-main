
import React, { useState } from 'react';
import { usePlatformConfigurations } from '@/shared/hooks/hooks/usePlatformConfigurations';
import { ConfigurationForm } from './ConfigurationForm';
import { ConfigurationTable } from './ConfigurationTable';
import { AuditLogTable } from './AuditLogTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const GlobalConfigurationPanel = () => {
  const { t } = useTranslation();
  const { 
    configurations, 
    auditLog, 
    updateConfiguration, 
    deleteConfiguration,
    isUpdating,
    isDeleting,
    loading 
  } = usePlatformConfigurations();

  const [editingConfig, setEditingConfig] = useState<any>(null);

  const handleUpdateConfiguration = (data: {
    category: string;
    config_key: string;
    config_value: any;
    description: string;
    reason?: string;
  }) => {
    updateConfiguration(data);
    setEditingConfig(null);
  };

  const handleEditConfiguration = (config: any) => {
    setEditingConfig(config);
  };

  const handleDeleteConfiguration = (configId: string) => {
    if (deleteConfiguration) {
      deleteConfiguration(configId);
    } else {
      toast.error(t('superAdmin.actions.deleteNotAvailable'));
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8 text-muted-foreground">{t('superAdmin.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="configurations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configurations">{t('superAdmin.configurations')}</TabsTrigger>
          <TabsTrigger value="new">{t('superAdmin.newConfiguration')}</TabsTrigger>
          <TabsTrigger value="audit">{t('superAdmin.auditLog')}</TabsTrigger>
        </TabsList>

        <TabsContent value="configurations" className="space-y-4">
          <ConfigurationTable
            configurations={configurations || []}
            onEdit={handleEditConfiguration}
            onDelete={handleDeleteConfiguration}
            isDeleting={isDeleting}
            title={t('superAdmin.titles.globalConfigurationsTable')}
            description={t('superAdmin.titles.globalConfigurationsDesc')}
          />
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <ConfigurationForm
            onSubmit={handleUpdateConfiguration}
            isLoading={isUpdating}
            initialData={editingConfig}
            title={editingConfig ? t('superAdmin.titles.editGlobalConfiguration') : t('superAdmin.titles.newGlobalConfiguration')}
            description={editingConfig ? t('superAdmin.titles.editGlobalConfigurationDesc') : t('superAdmin.titles.newGlobalConfigurationDesc')}
          />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AuditLogTable
            auditLog={auditLog || []}
            title={t('superAdmin.titles.globalAuditLog')}
            description={t('superAdmin.titles.globalAuditLogDesc')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
