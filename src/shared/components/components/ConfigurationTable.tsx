
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/shared/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Configuration {
  id: string;
  category: string;
  config_key: string;
  config_value: any;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ConfigurationTableProps {
  configurations: Configuration[];
  onEdit?: (config: Configuration) => void;
  onDelete?: (id: string) => void;
  title: string;
  description: string;
  isDeleting?: boolean;
}

export const ConfigurationTable: React.FC<ConfigurationTableProps> = ({
  configurations,
  onEdit,
  onDelete,
  title,
  description,
  isDeleting = false
}) => {
  const { t } = useTranslation();
  const [deleteConfigId, setDeleteConfigId] = useState<string | null>(null);

  const formatValue = (value: any) => {
    if (value === null || value === undefined) {
      return 'null';
    }
    
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return value;
      }
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  };

  // Fixed colors for AI Pair (not dynamic)
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      ai_models: 'bg-blue-600 text-white',
      integrations: 'bg-green-600 text-white',
      limits: 'bg-orange-600 text-white',
      features: 'bg-purple-600 text-white',
      security: 'bg-red-600 text-white'
    };
    return colors[category] || 'bg-gray-600 text-white';
  };

  const getCategoryLabel = (category: string) => {
    return t(`superAdmin.categories.${category}`) || category;
  };

  const handleDelete = (configId: string) => {
    if (onDelete) {
      onDelete(configId);
      setDeleteConfigId(null);
    }
  };

  return (
    <Card className="w-full bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {configurations?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t('superAdmin.table.noConfigurations')}
          </div>
        ) : (
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-[120px] text-muted-foreground">{t('superAdmin.table.category')}</TableHead>
                  <TableHead className="w-[200px] text-muted-foreground">{t('superAdmin.table.key')}</TableHead>
                  <TableHead className="min-w-[250px] text-muted-foreground">{t('superAdmin.table.value')}</TableHead>
                  <TableHead className="w-[200px] text-muted-foreground">{t('superAdmin.table.description')}</TableHead>
                  <TableHead className="w-[80px] text-muted-foreground">{t('superAdmin.table.status')}</TableHead>
                  <TableHead className="w-[100px] text-muted-foreground">{t('superAdmin.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configurations?.map((config) => (
                  <TableRow key={config.id} className="border-border">
                    <TableCell>
                      <Badge className={getCategoryColor(config.category)}>
                        {getCategoryLabel(config.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground">
                        {config.config_key}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <pre className="text-xs bg-muted p-3 rounded-md overflow-auto whitespace-pre-wrap border border-border max-h-32 text-foreground font-mono">
                          {formatValue(config.config_value)}
                        </pre>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs text-sm text-muted-foreground">
                        {config.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.is_active ? 'default' : 'secondary'}>
                        {config.is_active ? t('superAdmin.table.active') : t('superAdmin.table.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(config)}
                            className="h-8 w-8 p-0 border-border hover:bg-muted"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 border-border hover:bg-destructive hover:text-destructive-foreground"
                                disabled={isDeleting}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">
                                  {t('superAdmin.actions.confirmDelete')}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  {t('superAdmin.actions.confirmDeleteMessage', { key: config.config_key })}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-border">
                                  {t('superAdmin.actions.cancel')}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(config.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? t('superAdmin.actions.deleting') : t('superAdmin.actions.delete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
