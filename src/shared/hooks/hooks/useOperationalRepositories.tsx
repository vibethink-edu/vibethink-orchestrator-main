
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { 
  PromptTemplate, 
  NamingConvention, 
  FolderStructureTemplate, 
  OperationalRepository,
  CompanyOrchestrator 
} from '@/shared/types/operationalRepositories';

export const useOperationalRepositories = () => {
  const { user } = useAuth();
  const [repositories, setRepositories] = useState<OperationalRepository[]>([]);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const [namingConventions, setNamingConventions] = useState<NamingConvention[]>([]);
  const [folderStructures, setFolderStructures] = useState<FolderStructureTemplate[]>([]);
  const [orchestrators, setOrchestrators] = useState<CompanyOrchestrator[]>([]);
  const [loading, setLoading] = useState(false);

  // Get company from user object
  const company = user?.company;

  const isOrchestrator = orchestrators.some(
    orch => orch.email === user?.email && orch.isActive
  );

  const isPrimaryOrchestrator = orchestrators.some(
    orch => orch.email === user?.email && orch.role === 'primary' && orch.isActive
  );

  // Fetch repositories for company
  const fetchRepositories = async () => {
    if (!company?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('operational_repositories')
        .select('*')
        .eq('company_id', company.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedRepositories: OperationalRepository[] = data.map(repo => ({
        id: repo.id,
        companyId: repo.company_id,
        name: repo.name,
        description: repo.description || '',
        type: repo.type as OperationalRepository['type'],
        orchestratorEmail: repo.orchestrator_email,
        settings: repo.settings as OperationalRepository['settings'],
        createdAt: new Date(repo.created_at),
        updatedAt: new Date(repo.updated_at),
        isActive: repo.is_active
      }));
      
      setRepositories(mappedRepositories);
    } catch (error) {
      // TODO: log error fetching repositories
      toast.error('Error al cargar repositorios');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrchestrators = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('company_orchestrators')
        .select('*')
        .eq('company_id', company.id)
        .eq('is_active', true);

      if (error) throw error;

      const mappedOrchestrators: CompanyOrchestrator[] = data.map(orch => ({
        id: orch.id,
        companyId: orch.company_id,
        email: orch.email,
        role: orch.role as 'primary' | 'secondary',
        permissions: orch.permissions as any,
        createdAt: new Date(orch.created_at),
        isActive: orch.is_active
      }));

      setOrchestrators(mappedOrchestrators);
    } catch (error) {
      // TODO: log error fetching orchestrators
    }
  };

  const fetchPromptTemplates = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .select('*')
        .eq('company_id', company.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedTemplates: PromptTemplate[] = data.map(template => ({
        id: template.id,
        title: template.title,
        description: template.description || '',
        content: template.content,
        variables: template.variables as any,
        category: template.category,
        industry: template.industry || undefined,
        department: template.department || undefined,
        createdBy: template.created_by,
        createdAt: new Date(template.created_at),
        updatedAt: new Date(template.updated_at),
        version: template.version,
        tags: template.tags || [],
        usageCount: template.usage_count,
        isActive: template.is_active
      }));

      setPromptTemplates(mappedTemplates);
    } catch (error) {
      // TODO: log error fetching prompt templates
    }
  };

  const fetchNamingConventions = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('naming_conventions')
        .select('*')
        .eq('company_id', company.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedConventions: NamingConvention[] = data.map(convention => ({
        id: convention.id,
        companyId: convention.company_id,
        name: convention.name,
        pattern: convention.pattern,
        description: convention.description || '',
        category: convention.category as NamingConvention['category'],
        examples: convention.examples || [],
        department: convention.department || undefined,
        createdBy: convention.created_by,
        createdAt: new Date(convention.created_at),
        isActive: convention.is_active
      }));

      setNamingConventions(mappedConventions);
    } catch (error) {
      // TODO: log error fetching naming conventions
    }
  };

  const fetchFolderStructures = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('folder_structure_templates')
        .select('*')
        .eq('company_id', company.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedStructures: FolderStructureTemplate[] = data.map(structure => ({
        id: structure.id,
        companyId: structure.company_id,
        name: structure.name,
        description: structure.description || '',
        structure: structure.structure as any,
        department: structure.department || undefined,
        industry: structure.industry || undefined,
        createdBy: structure.created_by,
        createdAt: new Date(structure.created_at),
        isActive: structure.is_active,
        googleDriveIntegration: structure.google_drive_integration as any
      }));

      setFolderStructures(mappedStructures);
    } catch (error) {
      // TODO: log error fetching folder structures
    }
  };

  // Función para cargar todos los datos
  const fetchAllData = async () => {
    if (!company?.id) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchRepositories(),
        fetchOrchestrators(),
        fetchPromptTemplates(),
        fetchNamingConventions(),
        fetchFolderStructures()
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Update the create functions to match the interface requirements:
  const createPromptTemplate = async (template: {
    title: string;
    description: string;
    content: string;
    variables: any[];
    category: string;
    industry?: string;
    department?: string;
    tags: string[];
    version: string;
    isActive: boolean;
  }) => {
    if (!user || !company) return;

    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .insert({
          company_id: company.id,
          title: template.title,
          description: template.description,
          content: template.content,
          variables: JSON.parse(JSON.stringify(template.variables)),
          category: template.category,
          industry: template.industry,
          department: template.department,
          created_by: user.id,
          version: template.version,
          tags: template.tags,
          is_active: template.isActive
        })
        .select()
        .single();

      if (error) throw error;

      await fetchPromptTemplates();
      toast.success('Template de prompt creado exitosamente');
      return data;
    } catch (error) {
      // TODO: log error creating prompt template
      toast.error('Error al crear template de prompt');
    }
  };

  const createNamingConvention = async (convention: {
    name: string;
    pattern: string;
    description: string;
    category: 'file' | 'folder' | 'document' | 'project';
    examples: string[];
    department?: string;
    isActive: boolean;
  }) => {
    if (!user || !company) return;

    try {
      const { data, error } = await supabase
        .from('naming_conventions')
        .insert({
          company_id: company.id,
          name: convention.name,
          pattern: convention.pattern,
          description: convention.description,
          category: convention.category,
          examples: convention.examples,
          department: convention.department,
          created_by: user.id,
          is_active: convention.isActive
        })
        .select()
        .single();

      if (error) throw error;

      await fetchNamingConventions();
      toast.success('Convención de nomenclatura creada exitosamente');
      return data;
    } catch (error) {
      console.error('Error creating naming convention:', error);
      toast.error('Error al crear convención de nomenclatura');
    }
  };

  const createFolderStructure = async (structure: {
    name: string;
    description: string;
    structure: any[];
    department?: string;
    industry?: string;
    isActive: boolean;
    googleDriveIntegration?: any;
  }) => {
    if (!user || !company) return;

    try {
      const { data, error } = await supabase
        .from('folder_structure_templates')
        .insert({
          company_id: company.id,
          name: structure.name,
          description: structure.description,
          structure: JSON.parse(JSON.stringify(structure.structure)),
          department: structure.department,
          industry: structure.industry,
          created_by: user.id,
          is_active: structure.isActive,
          google_drive_integration: structure.googleDriveIntegration ? JSON.parse(JSON.stringify(structure.googleDriveIntegration)) : null
        })
        .select()
        .single();

      if (error) throw error;

      await fetchFolderStructures();
      toast.success('Estructura de carpetas creada exitosamente');
      return data;
    } catch (error) {
      console.error('Error creating folder structure:', error);
      toast.error('Error al crear estructura de carpetas');
    }
  };

  // Validate naming convention
  const validateNamingConvention = (fileName: string, conventionId: string): boolean => {
    const convention = namingConventions.find(c => c.id === conventionId);
    if (!convention) return false;

    try {
      const regex = new RegExp(convention.pattern);
      return regex.test(fileName);
    } catch (error) {
      console.error('Invalid regex pattern:', convention.pattern);
      return false;
    }
  };

  const generateFolderStructure = async (templateId: string, googleDrivePath?: string) => {
    const template = folderStructures.find(f => f.id === templateId);
    if (!template) {
      toast.error('Template de estructura no encontrado');
      return;
    }

    try {
      // TODO: log 'Generating folder structure:'
      
      if (template.googleDriveIntegration?.enabled && googleDrivePath) {
        // TODO: log 'Creating in Google Drive:'
      }

      toast.success('Estructura de carpetas generada exitosamente');
    } catch (error) {
      console.error('Error generating folder structure:', error);
      toast.error('Error al generar estructura de carpetas');
    }
  };

  const updatePromptTemplate = async (id: string, updates: {
    title: string;
    description: string;
    content: string;
    category: string;
    industry?: string;
    department?: string;
    tags: string[];
    isActive: boolean;
  }) => {
    if (!user || !company) return;

    try {
      const { error } = await supabase
        .from('prompt_templates')
        .update({
          title: updates.title,
          description: updates.description,
          content: updates.content,
          category: updates.category,
          industry: updates.industry,
          department: updates.department,
          tags: updates.tags,
          is_active: updates.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('company_id', company.id);

      if (error) throw error;

      await fetchPromptTemplates();
      toast.success('Template actualizado exitosamente');
    } catch (error) {
      console.error('Error updating prompt template:', error);
      toast.error('Error al actualizar template');
    }
  };

  const updateNamingConvention = async (id: string, updates: {
    name: string;
    pattern: string;
    description: string;
    category: 'file' | 'folder' | 'document' | 'project';
    department?: string;
    examples: string[];
    isActive: boolean;
  }) => {
    if (!user || !company) return;

    try {
      const { error } = await supabase
        .from('naming_conventions')
        .update({
          name: updates.name,
          pattern: updates.pattern,
          description: updates.description,
          category: updates.category,
          department: updates.department,
          examples: updates.examples,
          is_active: updates.isActive
        })
        .eq('id', id)
        .eq('company_id', company.id);

      if (error) throw error;

      await fetchNamingConventions();
      toast.success('Convención actualizada exitosamente');
    } catch (error) {
      console.error('Error updating naming convention:', error);
      toast.error('Error al actualizar convención');
    }
  };

  const updateFolderStructure = async (id: string, updates: {
    name: string;
    description: string;
    structure: any[];
    department?: string;
    industry?: string;
    isActive: boolean;
    googleDriveIntegration?: any;
  }) => {
    if (!user || !company) return;

    try {
      const { error } = await supabase
        .from('folder_structure_templates')
        .update({
          name: updates.name,
          description: updates.description,
          structure: JSON.parse(JSON.stringify(updates.structure)),
          department: updates.department,
          industry: updates.industry,
          is_active: updates.isActive,
          google_drive_integration: updates.googleDriveIntegration ? JSON.parse(JSON.stringify(updates.googleDriveIntegration)) : null
        })
        .eq('id', id)
        .eq('company_id', company.id);

      if (error) throw error;

      await fetchFolderStructures();
      toast.success('Estructura actualizada exitosamente');
    } catch (error) {
      console.error('Error updating folder structure:', error);
      toast.error('Error al actualizar estructura');
    }
  };

  // Delete functions
  const deletePromptTemplate = async (id: string) => {
    if (!user || !company) return;

    try {
      const { error } = await supabase
        .from('prompt_templates')
        .update({ is_active: false })
        .eq('id', id)
        .eq('company_id', company.id);

      if (error) throw error;

      await fetchPromptTemplates();
      toast.success('Template eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting prompt template:', error);
      toast.error('Error al eliminar template');
    }
  };

  const deleteNamingConvention = async (id: string) => {
    if (!user || !company) return;

    try {
      const { error } = await supabase
        .from('naming_conventions')
        .update({ is_active: false })
        .eq('id', id)
        .eq('company_id', company.id);

      if (error) throw error;

      await fetchNamingConventions();
      toast.success('Convención eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting naming convention:', error);
      toast.error('Error al eliminar convención');
    }
  };

  const deleteFolderStructure = async (id: string) => {
    if (!user || !company) return;

    try {
      const { error } = await supabase
        .from('folder_structure_templates')
        .update({ is_active: false })
        .eq('id', id)
        .eq('company_id', company.id);

      if (error) throw error;

      await fetchFolderStructures();
      toast.success('Estructura eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting folder structure:', error);
      toast.error('Error al eliminar estructura');
    }
  };

  useEffect(() => {
    if (company?.id) {
      fetchAllData();
    }
  }, [company?.id]);

  return {
    repositories,
    promptTemplates,
    namingConventions,
    folderStructures,
    orchestrators,
    loading,
    isOrchestrator,
    isPrimaryOrchestrator,
    createPromptTemplate,
    createNamingConvention,
    createFolderStructure,
    updatePromptTemplate,
    updateNamingConvention,
    updateFolderStructure,
    deletePromptTemplate,
    deleteNamingConvention,
    deleteFolderStructure,
    validateNamingConvention,
    generateFolderStructure,
    refetch: fetchAllData
  };
};
