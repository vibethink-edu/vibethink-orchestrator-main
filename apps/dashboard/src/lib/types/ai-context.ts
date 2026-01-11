/**
 * Extended Context Types for ViTo AI Assistant
 * 
 * Comprehensive context structure including:
 * - Company information and plan
 * - User details, department, and permissions
 * - AI configuration and model selection
 */

import { AI_ASSISTANT_CONFIG, PlanType, DepartmentType } from '@/lib/constants/ai-config';

export interface CompanyContext {
    id: string;
    name: string;
    plan: PlanType;
}

export interface UserContext {
    id: string;
    name: string;
    email: string;
    department: DepartmentType;
    role: 'admin' | 'manager' | 'user';
    permissions: {
        aiEnabled: boolean;
        allowedModels: readonly string[];
        maxTokensPerMonth: number;
        voiceEnabled: boolean;
        imageGeneration: boolean;
    };
}

export interface ActiveEntityContext {
    id: string;
    type: string;
    name: string;
}

export interface AIConfigContext {
    selectedModel?: string;
    taskType?: 'quickTasks' | 'deepThinking' | 'coding';
    maxTokens?: number;
    temperature?: number;
}

export interface ExtendedPanelContext {
    company: CompanyContext;
    user: UserContext;
    module: string;
    activeEntity?: ActiveEntityContext;
    aiConfig?: AIConfigContext;
}

/**
 * Helper function to get user permissions based on company plan
 */
export function getUserPermissionsFromPlan(plan: PlanType): UserContext['permissions'] {
    const planFeatures = AI_ASSISTANT_CONFIG.planFeatures[plan];

    return {
        aiEnabled: planFeatures.aiEnabled,
        allowedModels: planFeatures.allowedModels,
        maxTokensPerMonth: planFeatures.maxTokensPerMonth,
        voiceEnabled: planFeatures.voiceEnabled,
        imageGeneration: planFeatures.imageGeneration
    };
}

/**
 * Helper function to select the best model for a task
 */
export function selectModelForTask(
    taskType: keyof typeof AI_ASSISTANT_CONFIG.modelStrategy,
    allowedModels: readonly string[],
    department?: DepartmentType
): string {
    // Try department-specific model first
    if (department && department in AI_ASSISTANT_CONFIG.departmentModels) {
        const deptModels = AI_ASSISTANT_CONFIG.departmentModels[department];
        const preferredModel = deptModels[taskType as keyof typeof deptModels] || deptModels.default;

        if (allowedModels.includes(preferredModel)) {
            return preferredModel;
        }
    }

    // Fallback to general strategy
    const preferredModel = AI_ASSISTANT_CONFIG.modelStrategy[taskType];

    if (allowedModels.includes(preferredModel)) {
        return preferredModel;
    }

    // Last resort: first allowed model
    return allowedModels[0] || AI_ASSISTANT_CONFIG.modelStrategy.default;
}

/**
 * Helper function to check if user can access AI features
 */
export function canUserAccessAI(context: ExtendedPanelContext): {
    allowed: boolean;
    message?: string;
    upgradeUrl?: string;
} {
    if (!context.user.permissions.aiEnabled) {
        const upgradeMessage = AI_ASSISTANT_CONFIG.planFeatures[context.company.plan].upgradeMessage;

        return {
            allowed: false,
            message: upgradeMessage || "AI features not available on your current plan.",
            upgradeUrl: "/pricing"
        };
    }

    return { allowed: true };
}
