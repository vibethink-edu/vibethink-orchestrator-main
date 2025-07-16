
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { 
  EmailGovernanceRules, 
  EmailTemplate, 
  EmailDraft, 
  EmailAuditEntry,
  DriveGovernanceRules,
  DriveOrganizationTask
} from '@/shared/types/emailGovernance';

export const useEmailGovernance = () => {
  const [governanceRules, setGovernanceRules] = useState<EmailGovernanceRules | null>(null);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [emailDrafts, setEmailDrafts] = useState<EmailDraft[]>([]);
  const [driveRules, setDriveRules] = useState<DriveGovernanceRules | null>(null);
  const [driveTasks, setDriveTasks] = useState<DriveOrganizationTask[]>([]);
  const [loading, setLoading] = useState(false);

  // ============= GOVERNANCE RULES =============
  const updateGovernanceRules = async (rules: Partial<EmailGovernanceRules>) => {
    setLoading(true);
    try {
      console.log('Updating governance rules:', rules);
      
      // Simular actualización
      const updatedRules: EmailGovernanceRules = {
        id: governanceRules?.id || 'rules_1',
        companyId: 'company_1',
        alwaysCcManager: true,
        managerEmail: rules.managerEmail || 'manager@company.com',
        requireApprovalForExternal: true,
        requireApprovalForInternal: false,
        draftMode: 'user_review',
        templateEnforcement: true,
        auditTrail: true,
        allowedDomains: ['company.com', 'partner.com'],
        blockedDomains: ['spam.com'],
        signatureTemplate: '-- {{userName}}\n{{title}}\n{{company}}',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...rules
      };

      setGovernanceRules(updatedRules);
      toast.success('Reglas de governance actualizadas');
      return updatedRules;
    } catch (error) {
      console.error('Error updating governance rules:', error);
      toast.error('Error al actualizar reglas');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ============= EMAIL TEMPLATES =============
  const createEmailTemplate = async (template: Omit<EmailTemplate, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const newTemplate: EmailTemplate = {
        id: `template_${Date.now()}`,
        createdAt: new Date(),
        ...template
      };

      setEmailTemplates(prev => [...prev, newTemplate]);
      toast.success('Template de email creado');
      return newTemplate;
    } catch (error) {
      console.error('Error creating email template:', error);
      toast.error('Error al crear template');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ============= EMAIL DRAFTS =============
  const createEmailDraft = async (
    templateId: string,
    recipients: string[],
    variables: Record<string, any>
  ) => {
    setLoading(true);
    try {
      const template = emailTemplates.find(t => t.id === templateId);
      if (!template) {
        throw new Error('Template no encontrado');
      }

      // Procesar template con variables
      let processedBody = template.body;
      let processedSubject = template.subject;

      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processedBody = processedBody.replace(regex, String(value));
        processedSubject = processedSubject.replace(regex, String(value));
      });

      // Automáticamente incluir manager en CC si está configurado
      const ccList = [...recipients];
      if (governanceRules?.alwaysCcManager && governanceRules.managerEmail) {
        ccList.push(governanceRules.managerEmail);
      }

      const newDraft: EmailDraft = {
        id: `draft_${Date.now()}`,
        companyId: 'company_1',
        userId: 'user_1',
        templateId,
        to: recipients,
        cc: ccList,
        bcc: [],
        subject: processedSubject,
        body: processedBody,
        status: template.requiresApproval ? 'pending_approval' : 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setEmailDrafts(prev => [...prev, newDraft]);
      toast.success('Borrador creado para revisión');
      return newDraft;
    } catch (error) {
      console.error('Error creating email draft:', error);
      toast.error('Error al crear borrador');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const approveDraft = async (draftId: string, notes?: string) => {
    setLoading(true);
    try {
      setEmailDrafts(prev => prev.map(draft => 
        draft.id === draftId 
          ? { 
              ...draft, 
              status: 'approved',
              approvedBy: 'manager_1',
              approvalNotes: notes,
              updatedAt: new Date()
            }
          : draft
      ));

      toast.success('Borrador aprobado');
      return true;
    } catch (error) {
      console.error('Error approving draft:', error);
      toast.error('Error al aprobar borrador');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ============= DRIVE ORGANIZATION =============
  const updateDriveRules = async (rules: Partial<DriveGovernanceRules>) => {
    setLoading(true);
    try {
      const updatedRules: DriveGovernanceRules = {
        id: driveRules?.id || 'drive_rules_1',
        companyId: 'company_1',
        autoOrganize: true,
        namingConventionId: 'naming_1',
        folderStructureId: 'structure_1',
        autoPermissions: true,
        defaultPermissions: [
          {
            department: 'management',
            role: 'owner',
            autoApply: true,
            folderPatterns: ['*']
          },
          {
            department: 'team',
            role: 'editor',
            autoApply: true,
            folderPatterns: ['Projects/*', 'Shared/*']
          }
        ],
        retentionPolicies: [
          {
            name: 'Temporary Files',
            folderPattern: 'Temp/*',
            retentionDays: 30,
            autoArchive: true,
            autoDelete: false
          }
        ],
        auditEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...rules
      };

      setDriveRules(updatedRules);
      toast.success('Reglas de Drive actualizadas');
      return updatedRules;
    } catch (error) {
      console.error('Error updating drive rules:', error);
      toast.error('Error al actualizar reglas de Drive');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const organizeDriveFile = async (fileId: string, targetPath: string) => {
    setLoading(true);
    try {
      const newTask: DriveOrganizationTask = {
        id: `task_${Date.now()}`,
        companyId: 'company_1',
        userId: 'user_1',
        type: 'move_file',
        sourceFileId: fileId,
        targetPath,
        status: 'pending',
        createdAt: new Date()
      };

      setDriveTasks(prev => [...prev, newTask]);
      
      // Simular procesamiento
      setTimeout(() => {
        setDriveTasks(prev => prev.map(task => 
          task.id === newTask.id 
            ? { ...task, status: 'completed', completedAt: new Date() }
            : task
        ));
        toast.success('Archivo organizado correctamente');
      }, 2000);

      return newTask;
    } catch (error) {
      console.error('Error organizing file:', error);
      toast.error('Error al organizar archivo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ============= INITIALIZATION =============
  useEffect(() => {
    const initializeGovernance = async () => {
      // Simular carga inicial
      setEmailTemplates([
        {
          id: 'template_client_welcome',
          companyId: 'company_1',
          name: 'Bienvenida Cliente',
          subject: 'Bienvenido a {{companyName}} - {{clientName}}',
          body: `Estimado/a {{clientName}},

Nos complace darle la bienvenida a {{companyName}}. Su manager asignado es {{managerName}} quien estará en copia de todas las comunicaciones para brindarle el mejor servicio.

Su proyecto {{projectName}} comenzará el {{startDate}}.

Saludos cordiales,
{{userName}}`,
          variables: [
            { name: 'clientName', type: 'text', required: true, description: 'Nombre del cliente' },
            { name: 'companyName', type: 'text', required: true, description: 'Nombre de la empresa' },
            { name: 'managerName', type: 'text', required: true, description: 'Nombre del manager' },
            { name: 'projectName', type: 'text', required: true, description: 'Nombre del proyecto' },
            { name: 'startDate', type: 'date', required: true, description: 'Fecha de inicio' }
          ],
          category: 'client',
          requiresApproval: true,
          isActive: true,
          createdBy: 'admin',
          createdAt: new Date()
        }
      ]);
    };

    initializeGovernance();
  }, []);

  return {
    // State
    governanceRules,
    emailTemplates,
    emailDrafts,
    driveRules,
    driveTasks,
    loading,

    // Email Governance
    updateGovernanceRules,
    createEmailTemplate,
    createEmailDraft,
    approveDraft,

    // Drive Organization
    updateDriveRules,
    organizeDriveFile
  };
};
