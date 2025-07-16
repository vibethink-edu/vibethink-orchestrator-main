/**
 * Hook para gestión de estándares de calidad por empresa
 * 
 * Permite configurar y gestionar los estándares de calidad específicos
 * de cada empresa, incluyendo CMMI, ISO, SOC, etc.
 * 
 * @author AI Pair Platform - Quality Standards Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  CompanyQualityStandards, 
  QualityStandard, 
  StandardConfiguration,
  ComplianceStatus,
  DEFAULT_QUALITY_STANDARDS,
  INDUSTRY_STANDARDS
} from '@/shared/types/companyStandards';

export interface QualityStandardsState {
  standards: CompanyQualityStandards | null;
  complianceStatus: ComplianceStatus | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface QualityStandardsActions {
  // Gestión de estándares
  setPrimaryStandard: (standard: QualityStandard) => Promise<boolean>;
  addSecondaryStandard: (standard: QualityStandard) => Promise<boolean>;
  removeSecondaryStandard: (standard: QualityStandard) => Promise<boolean>;
  
  // Configuración de estándares
  updateStandardConfiguration: (standard: QualityStandard, config: Partial<StandardConfiguration>) => Promise<boolean>;
  getStandardConfiguration: (standard: QualityStandard) => StandardConfiguration | null;
  
  // Plantillas de documentación
  addDocumentTemplate: (template: Omit<CompanyQualityStandards['documentTemplates'][0], 'id'>) => Promise<boolean>;
  updateDocumentTemplate: (id: string, updates: Partial<CompanyQualityStandards['documentTemplates'][0]>) => Promise<boolean>;
  removeDocumentTemplate: (id: string) => Promise<boolean>;
  
  // Validación y cumplimiento
  validateCompliance: () => Promise<ComplianceStatus>;
  generateComplianceReport: (format: 'pdf' | 'excel' | 'html') => Promise<string>;
  
  // Configuración por industria
  applyIndustryStandards: (industry: keyof typeof INDUSTRY_STANDARDS) => Promise<boolean>;
  
  // Utilidades
  refresh: () => Promise<void>;
  resetToDefaults: () => Promise<boolean>;
}

export const useCompanyQualityStandards = (): QualityStandardsState & QualityStandardsActions => {
  const { user } = useAuth();
  
  const [state, setState] = useState<QualityStandardsState>({
    standards: null,
    complianceStatus: null,
    loading: true,
    error: null,
    lastUpdated: null
  });

  // Memoized company ID
  const companyId = useMemo(() => user?.company?.id, [user?.company?.id]);

  // Cargar estándares de la empresa
  const loadQualityStandards = useCallback(async () => {
    if (!companyId) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Cargar configuración de estándares
      const { data: standardsData, error: standardsError } = await supabase
        .from('company_quality_standards')
        .select('*')
        .eq('company_id', companyId)
        .single();

      if (standardsError && standardsError.code !== 'PGRST116') {
        throw standardsError;
      }

      // Si no existe configuración, crear por defecto
      let standards: CompanyQualityStandards;
      if (!standardsData) {
        standards = {
          company_id: companyId,
          ...DEFAULT_QUALITY_STANDARDS,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as CompanyQualityStandards;
        
        await createDefaultStandards(companyId, standards);
      } else {
        standards = standardsData;
      }

      // Cargar estado de cumplimiento
      const { data: complianceData, error: complianceError } = await supabase
        .from('company_compliance_status')
        .select('*')
        .eq('company_id', companyId)
        .single();

      if (complianceError && complianceError.code !== 'PGRST116') {
        throw complianceError;
      }

      const complianceStatus = complianceData || await createDefaultComplianceStatus(companyId);

      setState({
        standards,
        complianceStatus,
        loading: false,
        error: null,
        lastUpdated: new Date()
      });

    } catch (error) {
      console.error('Error loading quality standards:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, [companyId]);

  // Crear configuración por defecto
  const createDefaultStandards = async (companyId: string, standards: CompanyQualityStandards) => {
    try {
      const { error } = await supabase
        .from('company_quality_standards')
        .insert(standards);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating default quality standards:', error);
      throw error;
    }
  };

  // Crear estado de cumplimiento por defecto
  const createDefaultComplianceStatus = async (companyId: string): Promise<ComplianceStatus> => {
    const defaultStatus: ComplianceStatus = {
      company_id: companyId,
      overallStatus: 'in_progress',
      standards: {},
      lastUpdated: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('company_compliance_status')
        .insert(defaultStatus);

      if (error) throw error;
      return defaultStatus;
    } catch (error) {
      console.error('Error creating default compliance status:', error);
      return defaultStatus;
    }
  };

  // Establecer estándar primario
  const setPrimaryStandard = useCallback(async (standard: QualityStandard): Promise<boolean> => {
    if (!companyId || !state.standards) return false;

    try {
      const updatedStandards = {
        ...state.standards,
        primaryStandard: standard,
        updatedAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('company_quality_standards')
        .update(updatedStandards)
        .eq('company_id', companyId);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        standards: updatedStandards,
        lastUpdated: new Date()
      }));

      return true;
    } catch (error) {
      console.error('Error setting primary standard:', error);
      return false;
    }
  }, [companyId, state.standards]);

  // Agregar estándar secundario
  const addSecondaryStandard = useCallback(async (standard: QualityStandard): Promise<boolean> => {
    if (!companyId || !state.standards) return false;

    try {
      const updatedStandards = {
        ...state.standards,
        secondaryStandards: [...state.standards.secondaryStandards, standard],
        updatedAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('company_quality_standards')
        .update(updatedStandards)
        .eq('company_id', companyId);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        standards: updatedStandards,
        lastUpdated: new Date()
      }));

      return true;
    } catch (error) {
      console.error('Error adding secondary standard:', error);
      return false;
    }
  }, [companyId, state.standards]);

  // Remover estándar secundario
  const removeSecondaryStandard = useCallback(async (standard: QualityStandard): Promise<boolean> => {
    if (!companyId || !state.standards) return false;

    try {
      const updatedStandards = {
        ...state.standards,
        secondaryStandards: state.standards.secondaryStandards.filter(s => s !== standard),
        updatedAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('company_quality_standards')
        .update(updatedStandards)
        .eq('company_id', companyId);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        standards: updatedStandards,
        lastUpdated: new Date()
      }));

      return true;
    } catch (error) {
      console.error('Error removing secondary standard:', error);
      return false;
    }
  }, [companyId, state.standards]);

  // Obtener configuración de un estándar
  const getStandardConfiguration = useCallback((standard: QualityStandard): StandardConfiguration | null => {
    if (!state.standards) return null;
    return state.standards.configurations.find(c => c.standard === standard) || null;
  }, [state.standards]);

  // Actualizar configuración de estándar
  const updateStandardConfiguration = useCallback(async (
    standard: QualityStandard, 
    config: Partial<StandardConfiguration>
  ): Promise<boolean> => {
    if (!companyId || !state.standards) return false;

    try {
      const existingConfig = getStandardConfiguration(standard);
      const updatedConfig = existingConfig 
        ? { ...existingConfig, ...config }
        : { standard, version: '1.0', status: 'active', scope: [], requirements: [], customizations: {}, ...config };

      const updatedConfigurations = existingConfig
        ? state.standards.configurations.map(c => c.standard === standard ? updatedConfig : c)
        : [...state.standards.configurations, updatedConfig];

      const updatedStandards = {
        ...state.standards,
        configurations: updatedConfigurations,
        updatedAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('company_quality_standards')
        .update(updatedStandards)
        .eq('company_id', companyId);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        standards: updatedStandards,
        lastUpdated: new Date()
      }));

      return true;
    } catch (error) {
      console.error('Error updating standard configuration:', error);
      return false;
    }
  }, [companyId, state.standards, getStandardConfiguration]);

  // Aplicar estándares por industria
  const applyIndustryStandards = useCallback(async (industry: keyof typeof INDUSTRY_STANDARDS): Promise<boolean> => {
    if (!companyId || !state.standards) return false;

    try {
      const industryStandards = INDUSTRY_STANDARDS[industry];
      if (!industryStandards || industryStandards.length === 0) return false;

      const updatedStandards = {
        ...state.standards,
        primaryStandard: industryStandards[0],
        secondaryStandards: industryStandards.slice(1),
        updatedAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('company_quality_standards')
        .update(updatedStandards)
        .eq('company_id', companyId);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        standards: updatedStandards,
        lastUpdated: new Date()
      }));

      return true;
    } catch (error) {
      console.error('Error applying industry standards:', error);
      return false;
    }
  }, [companyId, state.standards]);

  // Validar cumplimiento
  const validateCompliance = useCallback(async (): Promise<ComplianceStatus> => {
    if (!companyId) {
      throw new Error('Company ID is required');
    }

    try {
      // Aquí se implementaría la lógica de validación real
      // Por ahora, simulamos una validación básica
      const complianceStatus: ComplianceStatus = {
        company_id: companyId,
        overallStatus: 'compliant',
        standards: {},
        lastUpdated: new Date().toISOString()
      };

      // Actualizar en la base de datos
      const { error } = await supabase
        .from('company_compliance_status')
        .upsert(complianceStatus);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        complianceStatus,
        lastUpdated: new Date()
      }));

      return complianceStatus;
    } catch (error) {
      console.error('Error validating compliance:', error);
      throw error;
    }
  }, [companyId]);

  // Generar reporte de cumplimiento
  const generateComplianceReport = useCallback(async (format: 'pdf' | 'excel' | 'html'): Promise<string> => {
    if (!state.standards || !state.complianceStatus) {
      throw new Error('Standards and compliance status are required');
    }

    try {
      // Aquí se implementaría la generación real del reporte
      // Por ahora, simulamos la generación
      const reportData = {
        company_id: state.standards.company_id,
        standards: state.standards.primaryStandard,
        compliance: state.complianceStatus.overallStatus,
        format,
        generatedAt: new Date().toISOString()
      };

      // En una implementación real, aquí se generaría el archivo
      return `compliance_report_${Date.now()}.${format}`;
    } catch (error) {
      console.error('Error generating compliance report:', error);
      throw error;
    }
  }, [state.standards, state.complianceStatus]);

  // Placeholder implementations para las acciones restantes
  const addDocumentTemplate = useCallback(async (): Promise<boolean> => {
    // Implementación pendiente
    return true;
  }, []);

  const updateDocumentTemplate = useCallback(async (): Promise<boolean> => {
    // Implementación pendiente
    return true;
  }, []);

  const removeDocumentTemplate = useCallback(async (): Promise<boolean> => {
    // Implementación pendiente
    return true;
  }, []);

  const refresh = useCallback(async () => {
    await loadQualityStandards();
  }, [loadQualityStandards]);

  const resetToDefaults = useCallback(async (): Promise<boolean> => {
    if (!companyId) return false;

    try {
      const defaultStandards = {
        company_id: companyId,
        ...DEFAULT_QUALITY_STANDARDS,
        updatedAt: new Date().toISOString()
      } as CompanyQualityStandards;

      const { error } = await supabase
        .from('company_quality_standards')
        .update(defaultStandards)
        .eq('company_id', companyId);

      if (error) throw error;

      await refresh();
      return true;
    } catch (error) {
      console.error('Error resetting to defaults:', error);
      return false;
    }
  }, [companyId, refresh]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadQualityStandards();
  }, [loadQualityStandards]);

  return {
    ...state,
    setPrimaryStandard,
    addSecondaryStandard,
    removeSecondaryStandard,
    updateStandardConfiguration,
    getStandardConfiguration,
    addDocumentTemplate,
    updateDocumentTemplate,
    removeDocumentTemplate,
    validateCompliance,
    generateComplianceReport,
    applyIndustryStandards,
    refresh,
    resetToDefaults
  };
}; 