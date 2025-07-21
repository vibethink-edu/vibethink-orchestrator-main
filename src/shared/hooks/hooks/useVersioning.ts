/**
 * @fileoverview Hook React para Sistema de Versionamiento AI-Pair
 * @version 1.0.0
 * @author Marcelo Labs + AI Assistant
 * @date 2024-01-15
 * @team AI-Pair Collaboration
 * 
 * @changelog
 * v1.0.0 (2024-01-15) - Marcelo + AI Assistant
 *   - Implementación inicial del hook de versionamiento
 *   - Integración con VersioningEngine
 *   - Funcionalidades para tracking automático
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  VersioningEngine, 
  VersionInfo, 
  ChangeLog, 
  ThirdPartyInfo,
  VERSIONING_CONFIG,
  RISK_LEVELS 
} from '@/shared/config/versioning';

export interface UseVersioningOptions {
  initialVersion?: string;
  autoTrack?: boolean;
  complianceTracking?: boolean;
  riskAssessment?: boolean;
}

export interface VersioningState {
  currentVersion: string;
  versionHistory: VersionInfo[];
  pendingChanges: ChangeLog[];
  complianceStatus: Record<string, boolean>;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  testingStatus: 'PENDING' | 'PASSED' | 'FAILED';
}

export const useVersioning = (options: UseVersioningOptions = {}) => {
  const {
    initialVersion = VERSIONING_CONFIG.currentVersion,
    autoTrack = true,
    complianceTracking = true,
    riskAssessment = true
  } = options;

  const [state, setState] = useState<VersioningState>({
    currentVersion: initialVersion,
    versionHistory: [],
    pendingChanges: [],
    complianceStatus: {},
    riskLevel: 'LOW',
    testingStatus: 'PENDING'
  });

  const engine = VersioningEngine.getInstance();

  /**
   * Agrega un cambio al historial de versionamiento
   */
  const addChange = useCallback((
    type: ChangeLog['type'],
    description: string,
    options: {
      ticket?: string;
      breaking?: boolean;
      compliance?: string[];
      riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    } = {}
  ) => {
    const change: ChangeLog = {
      type,
      description,
      ticket: options.ticket,
      breaking: options.breaking || false,
      compliance: options.compliance || [],
      riskLevel: options.riskLevel || 'LOW'
    };

    setState(prev => ({
      ...prev,
      pendingChanges: [...prev.pendingChanges, change]
    }));

    // Auto-track si está habilitado
    if (autoTrack) {
      // TODO: log change added
    }
  }, [autoTrack]);

  /**
   * Actualiza la versión según el tipo de cambio
   */
  const updateVersion = useCallback((
    changeType: 'major' | 'minor' | 'patch',
    author: string = 'AI-Pair Team'
  ) => {
    const newVersion = engine.updateVersion(state.currentVersion, changeType);
    
    const versionInfo = engine.generateVersionInfo(
      newVersion,
      author,
      state.pendingChanges
    );

    setState(prev => ({
      ...prev,
      currentVersion: newVersion,
      versionHistory: [...prev.versionHistory, versionInfo],
      pendingChanges: [],
      riskLevel: versionInfo.riskLevel || 'LOW',
      testingStatus: 'PENDING'
    }));

    return versionInfo;
  }, [state.currentVersion, state.pendingChanges, engine]);

  /**
   * Registra integración con componente de tercero
   */
  const registerThirdParty = useCallback((
    thirdPartyInfo: ThirdPartyInfo,
    modifications: string[],
    author: string = 'AI-Pair Team'
  ) => {
    const thirdPartyVersion = engine.generateThirdPartyVersion(
      state.currentVersion,
      thirdPartyInfo.originalVersion
    );

    const changes: ChangeLog[] = [
      {
        type: 'added',
        description: `Integrated third-party component: ${thirdPartyInfo.originalAuthor} v${thirdPartyInfo.originalVersion}`,
        compliance: thirdPartyInfo.complianceAdaptations,
        riskLevel: 'MEDIUM'
      },
      ...modifications.map(mod => ({
        type: 'changed' as const,
        description: mod,
        riskLevel: 'LOW' as const
      }))
    ];

    const versionInfo = engine.generateVersionInfo(
      thirdPartyVersion,
      author,
      changes,
      thirdPartyInfo
    );

    setState(prev => ({
      ...prev,
      currentVersion: thirdPartyVersion,
      versionHistory: [...prev.versionHistory, versionInfo],
      pendingChanges: [],
      riskLevel: versionInfo.riskLevel || 'MEDIUM',
      testingStatus: 'PENDING'
    }));

    return versionInfo;
  }, [state.currentVersion, engine]);

  /**
   * Valida compliance para países específicos
   */
  const validateCompliance = useCallback((
    countries: string[]
  ): boolean => {
    if (!complianceTracking) return true;
    
    const isValid = engine.validateCompliance(state.pendingChanges, countries);
    
    setState(prev => ({
      ...prev,
      complianceStatus: {
        ...prev.complianceStatus,
        [countries.join(',')]: isValid
      }
    }));

    return isValid;
  }, [state.pendingChanges, complianceTracking, engine]);

  /**
   * Actualiza estado de testing
   */
  const updateTestingStatus = useCallback((
    status: 'PENDING' | 'PASSED' | 'FAILED',
    details?: string
  ) => {
    setState(prev => ({
      ...prev,
      testingStatus: status
    }));

    if (details) {
      // TODO: log testing status
    }
  }, []);

  /**
   * Genera reporte de versionamiento
   */
  const generateReport = useCallback((): string => {
    const latestVersion = state.versionHistory[state.versionHistory.length - 1];
    if (!latestVersion) return 'No version history available';
    
    return engine.generateVersionReport(latestVersion);
  }, [state.versionHistory, engine]);

  /**
   * Obtiene información de riesgo actual
   */
  const getRiskInfo = useCallback(() => {
    return RISK_LEVELS[state.riskLevel];
  }, [state.riskLevel]);

  /**
   * Limpia cambios pendientes
   */
  const clearPendingChanges = useCallback(() => {
    setState(prev => ({
      ...prev,
      pendingChanges: []
    }));
  }, []);

  /**
   * Auto-tracking de cambios de compliance
   */
  useEffect(() => {
    if (complianceTracking && state.pendingChanges.length > 0) {
      const complianceChanges = state.pendingChanges.filter(
        change => change.type === 'compliance' || change.compliance?.length
      );
      
      if (complianceChanges.length > 0) {
        // TODO: log compliance changes detected
      }
    }
  }, [state.pendingChanges, complianceTracking]);

  /**
   * Auto-assessment de riesgo
   */
  useEffect(() => {
    if (riskAssessment && state.pendingChanges.length > 0) {
      const newRiskLevel = engine['assessRiskLevel'](state.pendingChanges);
      
      if (newRiskLevel !== state.riskLevel) {
        setState(prev => ({
          ...prev,
          riskLevel: newRiskLevel
        }));
        
        // TODO: log risk level updated
      }
    }
  }, [state.pendingChanges, state.riskLevel, riskAssessment, engine]);

  return {
    // Estado
    currentVersion: state.currentVersion,
    versionHistory: state.versionHistory,
    pendingChanges: state.pendingChanges,
    complianceStatus: state.complianceStatus,
    riskLevel: state.riskLevel,
    testingStatus: state.testingStatus,
    riskInfo: getRiskInfo(),
    
    // Acciones
    addChange,
    updateVersion,
    registerThirdParty,
    validateCompliance,
    updateTestingStatus,
    generateReport,
    clearPendingChanges,
    
    // Utilidades
    hasPendingChanges: state.pendingChanges.length > 0,
    isCompliant: Object.values(state.complianceStatus).every(Boolean),
    requiresApproval: getRiskInfo().approvalRequired,
    testingRequired: getRiskInfo().testingRequired
  };
};

export default useVersioning; 