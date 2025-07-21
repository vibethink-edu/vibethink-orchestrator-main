
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { googleWorkspaceService } from '@/shared/services/integrations/GoogleWorkspaceConnector';
import { office365Service } from '@/shared/services/integrations/Office365Connector';
import type { 
  GoogleDocsDocument, 
  GoogleSheetsSpreadsheet, 
  WordDocument, 
  ExcelWorkbook,
  DocumentWorkflow 
} from '@/shared/types/integrations';

export const useDocumentIntegrations = () => {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isOfficeConnected, setIsOfficeConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============= CONNECTION STATUS =============
  useEffect(() => {
    checkConnections();
  }, []);

  const checkConnections = async () => {
    setIsGoogleConnected(googleWorkspaceService.isAuthenticated());
    setIsOfficeConnected(office365Service.isAuthenticated());
  };

  // ============= GOOGLE WORKSPACE OPERATIONS =============
  const connectGoogleWorkspace = async () => {
    setLoading(true);
    try {
      const scopes = [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ];

      const success = await googleWorkspaceService.authenticate(scopes);
      if (success) {
        setIsGoogleConnected(true);
        toast.success('Conectado a Google Workspace exitosamente');
      } else {
        toast.error('Error al conectar con Google Workspace');
      }
    } catch (error) {
      // TODO: log 'Google connection error:' error
      toast.error('Error al conectar con Google Workspace');
    } finally {
      setLoading(false);
    }
  };

  const createGoogleDoc = async (
    title: string, 
    templateId?: string, 
    variables?: Record<string, any>
  ): Promise<GoogleDocsDocument | null> => {
    if (!isGoogleConnected) {
      toast.error('Primero conecta con Google Workspace');
      return null;
    }

    setLoading(true);
    try {
      const response = await googleWorkspaceService.createDocument(title, templateId, variables);
      if (response.success && response.data) {
        toast.success(`Documento creado: ${response.data.title}`);
        return response.data;
      } else {
        toast.error(response.error?.message || 'Error al crear documento');
        return null;
      }
    } catch (error) {
      // TODO: log 'Error creating Google Doc:' error
      toast.error('Error al crear documento');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createGoogleSheet = async (
    title: string, 
    data?: any[][]
  ): Promise<GoogleSheetsSpreadsheet | null> => {
    if (!isGoogleConnected) {
      toast.error('Primero conecta con Google Workspace');
      return null;
    }

    setLoading(true);
    try {
      const response = await googleWorkspaceService.createSpreadsheet(title, data);
      if (response.success && response.data) {
        toast.success(`Hoja de cálculo creada: ${response.data.title}`);
        return response.data;
      } else {
        toast.error(response.error?.message || 'Error al crear hoja de cálculo');
        return null;
      }
    } catch (error) {
      // TODO: log 'Error creating Google Sheet:' error
      toast.error('Error al crear hoja de cálculo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ============= OFFICE 365 OPERATIONS =============
  const connectOffice365 = async () => {
    setLoading(true);
    try {
      const scopes = [
        'Files.ReadWrite',
        'Sites.ReadWrite.All',
        'User.Read'
      ];

      const success = await office365Service.authenticate(scopes);
      if (success) {
        setIsOfficeConnected(true);
        toast.success('Conectado a Office 365 exitosamente');
      } else {
        toast.error('Error al conectar con Office 365');
      }
    } catch (error) {
      // TODO: log 'Office 365 connection error:' error
      toast.error('Error al conectar con Office 365');
    } finally {
      setLoading(false);
    }
  };

  const createWordDoc = async (
    title: string, 
    templateId?: string, 
    variables?: Record<string, any>
  ): Promise<WordDocument | null> => {
    if (!isOfficeConnected) {
      toast.error('Primero conecta con Office 365');
      return null;
    }

    setLoading(true);
    try {
      const response = await office365Service.createDocument(title, templateId, variables);
      if (response.success && response.data) {
        toast.success(`Documento de Word creado: ${response.data.name}`);
        return response.data;
      } else {
        toast.error(response.error?.message || 'Error al crear documento');
        return null;
      }
    } catch (error) {
      // TODO: log 'Error creating Word doc:' error
      toast.error('Error al crear documento');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createExcelWorkbook = async (
    name: string, 
    data?: any[][]
  ): Promise<ExcelWorkbook | null> => {
    if (!isOfficeConnected) {
      toast.error('Primero conecta con Office 365');
      return null;
    }

    setLoading(true);
    try {
      const response = await office365Service.createWorkbook(name, data);
      if (response.success && response.data) {
        toast.success(`Libro de Excel creado: ${response.data.name}`);
        return response.data;
      } else {
        toast.error(response.error?.message || 'Error al crear libro de Excel');
        return null;
      }
    } catch (error) {
      // TODO: log 'Error creating Excel workbook:' error
      toast.error('Error al crear libro de Excel');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ============= WORKFLOW OPERATIONS =============
  const executeDocumentWorkflow = async (workflow: DocumentWorkflow, inputData: Record<string, any>) => {
    setLoading(true);
    try {
      // TODO: log 'Executing document workflow:' workflow.name inputData

      if (workflow.platform === 'google') {
        if (workflow.documentType === 'docs') {
          return await createGoogleDoc(
            inputData.title || workflow.name,
            workflow.template?.id,
            inputData
          );
        } else if (workflow.documentType === 'sheets') {
          return await createGoogleSheet(
            inputData.title || workflow.name,
            inputData.data
          );
        }
      } else if (workflow.platform === 'microsoft') {
        if (workflow.documentType === 'word') {
          return await createWordDoc(
            inputData.title || workflow.name,
            workflow.template?.id,
            inputData
          );
        } else if (workflow.documentType === 'excel') {
          return await createExcelWorkbook(
            inputData.title || workflow.name,
            inputData.data
          );
        }
      }

      toast.error('Tipo de workflow no soportado');
      return null;
    } catch (error) {
      // TODO: log 'Error executing workflow:' error
      toast.error('Error al ejecutar workflow');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Status
    isGoogleConnected,
    isOfficeConnected,
    loading,
    
    // Connections
    connectGoogleWorkspace,
    connectOffice365,
    checkConnections,
    
    // Google Operations
    createGoogleDoc,
    createGoogleSheet,
    
    // Office Operations
    createWordDoc,
    createExcelWorkbook,
    
    // Workflows
    executeDocumentWorkflow
  };
};
