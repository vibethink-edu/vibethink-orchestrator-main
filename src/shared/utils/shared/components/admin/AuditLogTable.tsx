
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AuditLogEntry {
  id: string;
  table_name: string;
  record_id: string;
  company_id: string | null;
  action: string;
  old_values: any;
  new_values: any;
  changed_at: string;
  reason: string | null;
  user_profiles?: {
    full_name: string;
    email: string;
  };
  companies?: {
    name: string;
    slug: string;
  } | null;
}

interface AuditLogTableProps {
  auditLog: AuditLogEntry[];
  title?: string;
  description?: string;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  auditLog,
  title = "Log de Auditoría",
  description = "Historial de cambios en configuraciones"
}) => {
  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800'
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatJsonValue = (value: any) => {
    if (!value) return '-';
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {auditLog?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay registros de auditoría disponibles
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Tabla</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Razón</TableHead>
                  <TableHead>Cambios</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLog?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">
                      {formatDate(entry.changed_at)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getActionColor(entry.action)}>
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {entry.table_name}
                    </TableCell>
                    <TableCell>
                      {entry.user_profiles?.full_name || 'Sistema'}
                      <div className="text-xs text-gray-500">
                        {entry.user_profiles?.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {entry.companies?.name || '-'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.reason || '-'}
                    </TableCell>
                    <TableCell>
                      <details className="cursor-pointer">
                        <summary className="text-sm text-blue-600 hover:text-blue-800">
                          Ver cambios
                        </summary>
                        <div className="mt-2 space-y-2">
                          {entry.old_values && (
                            <div>
                              <div className="text-xs font-semibold text-gray-600">Anterior:</div>
                              <pre className="text-xs bg-red-50 p-1 rounded max-w-xs overflow-auto">
                                {formatJsonValue(entry.old_values)}
                              </pre>
                            </div>
                          )}
                          {entry.new_values && (
                            <div>
                              <div className="text-xs font-semibold text-gray-600">Nuevo:</div>
                              <pre className="text-xs bg-green-50 p-1 rounded max-w-xs overflow-auto">
                                {formatJsonValue(entry.new_values)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </details>
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
