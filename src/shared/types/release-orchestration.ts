// 🚀 Tipos para Orquestación de Releases - VThink 1.0

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rollout_percentage: number;
  target_environment: 'development' | 'staging' | 'production';
  created_at: string;
  updated_at: string;
  created_by: string;
  last_modified_by: string;
  dependencies: string[];
  rollout_strategy: 'gradual' | 'instant' | 'scheduled';
  scheduled_date?: string;
  rollback_threshold: number;
  monitoring_enabled: boolean;
  alert_conditions: AlertCondition[];
}

export interface AlertCondition {
  id: string;
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  time_window: number; // en minutos
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SystemOverview {
  active_features: number;
  pending_releases: number;
  rollback_alerts: number;
  system_health: 'green' | 'yellow' | 'red';
  deployment_success_rate: number;
  average_deployment_time: number;
  last_deployment: string;
  next_scheduled_deployment?: string;
  environment_status: {
    development: 'healthy' | 'warning' | 'error';
    staging: 'healthy' | 'warning' | 'error';
    production: 'healthy' | 'warning' | 'error';
  };
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'deployment' | 'performance' | 'security' | 'feature_flag';
  created_at: string;
  resolved_at?: string;
  acknowledged_by?: string;
  feature_flag_id?: string;
  environment: 'development' | 'staging' | 'production';
  metrics?: {
    error_rate?: number;
    response_time?: number;
    throughput?: number;
  };
}

export interface DeploymentConfig {
  id: string;
  name: string;
  environment: 'development' | 'staging' | 'production';
  strategy: 'blue-green' | 'rolling' | 'canary' | 'recreate';
  auto_rollback: boolean;
  health_check_enabled: boolean;
  health_check_path: string;
  health_check_timeout: number;
  max_unavailable: number;
  max_surge: number;
  pre_deployment_hooks: string[];
  post_deployment_hooks: string[];
  rollback_strategy: 'automatic' | 'manual' | 'semi-automatic';
  rollback_threshold: number;
  monitoring_enabled: boolean;
  alert_channels: string[];
}

export interface ReleasePipeline {
  id: string;
  name: string;
  description: string;
  stages: PipelineStage[];
  triggers: PipelineTrigger[];
  approvals: ApprovalConfig[];
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'draft';
  created_by: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  type: 'build' | 'test' | 'deploy' | 'verify' | 'rollback';
  environment: 'development' | 'staging' | 'production';
  timeout: number; // en minutos
  required: boolean;
  parallel_execution: boolean;
  dependencies: string[]; // IDs de otros stages
  conditions: StageCondition[];
  actions: StageAction[];
}

export interface StageCondition {
  type: 'manual_approval' | 'automated_test' | 'performance_check' | 'security_scan';
  config: Record<string, any>;
  required: boolean;
}

export interface StageAction {
  type: 'script' | 'api_call' | 'docker_build' | 'k8s_deploy' | 'terraform_apply';
  name: string;
  config: Record<string, any>;
  timeout: number;
  retry_count: number;
  on_failure: 'fail' | 'continue' | 'rollback';
}

export interface PipelineTrigger {
  type: 'git_push' | 'git_tag' | 'manual' | 'schedule' | 'webhook';
  config: Record<string, any>;
  enabled: boolean;
}

export interface ApprovalConfig {
  id: string;
  stage_id: string;
  approvers: string[];
  required_approvals: number;
  timeout: number; // en horas
  auto_approve_after_timeout: boolean;
  notify_on_pending: boolean;
  notify_on_approved: boolean;
  notify_on_rejected: boolean;
}

export interface ReleaseMetrics {
  deployment_frequency: number; // deployments por día
  lead_time: number; // tiempo desde commit hasta producción (horas)
  mean_time_to_recovery: number; // tiempo promedio de recuperación (horas)
  change_failure_rate: number; // porcentaje de deployments que fallan
  deployment_success_rate: number; // porcentaje de deployments exitosos
  rollback_rate: number; // porcentaje de rollbacks
  feature_flag_adoption: number; // porcentaje de features usando feature flags
  environment_health: {
    development: number;
    staging: number;
    production: number;
  };
}

export interface RollbackConfig {
  id: string;
  feature_flag_id: string;
  trigger_conditions: RollbackCondition[];
  automatic_rollback: boolean;
  rollback_window: number; // en minutos
  notification_channels: string[];
  approval_required: boolean;
  approvers: string[];
  created_at: string;
  updated_at: string;
}

export interface RollbackCondition {
  type: 'error_rate' | 'response_time' | 'user_complaints' | 'business_metrics';
  metric: string;
  threshold: number;
  time_window: number; // en minutos
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// 🎯 Funciones de utilidad para releases
export const calculateDeploymentHealth = (metrics: ReleaseMetrics): 'green' | 'yellow' | 'red' => {
  const { deployment_success_rate, change_failure_rate, mean_time_to_recovery } = metrics;
  
  if (deployment_success_rate >= 95 && change_failure_rate <= 5 && mean_time_to_recovery <= 1) {
    return 'green';
  } else if (deployment_success_rate >= 85 && change_failure_rate <= 15 && mean_time_to_recovery <= 4) {
    return 'yellow';
  } else {
    return 'red';
  }
};

export const validateFeatureFlag = (flag: Partial<FeatureFlag>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!flag.name?.trim()) {
    errors.push('El nombre de la feature flag es requerido');
  }
  
  if (flag.rollout_percentage !== undefined && (flag.rollout_percentage < 0 || flag.rollout_percentage > 100)) {
    errors.push('El porcentaje de rollout debe estar entre 0 y 100');
  }
  
  if (flag.rollback_threshold !== undefined && flag.rollback_threshold < 0) {
    errors.push('El umbral de rollback debe ser mayor o igual a 0');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const getFeatureFlagStatus = (flag: FeatureFlag): 'active' | 'inactive' | 'scheduled' | 'rolling_back' => {
  if (!flag.enabled) return 'inactive';
  if (flag.scheduled_date && new Date(flag.scheduled_date) > new Date()) return 'scheduled';
  if (flag.rollout_percentage === 0) return 'rolling_back';
  return 'active';
}; 