/**
 * ViTo AI Assistant - Global Configuration
 * 
 * Single source of truth for AI assistant branding and behavior.
 * Update this file to change the assistant's name across the entire application.
 */

export const AI_ASSISTANT_CONFIG = {
    // Branding
    name: "ViTo",
    fullName: "ViTo AI Assistant",
    tagline: "Your Intelligent Business Companion",

    // Model Strategy by Task Type
    modelStrategy: {
        quickTasks: "gpt-3.5-turbo",      // Fast responses (emails, summaries)
        deepThinking: "gpt-4",             // Complex analysis (reports, strategy)
        coding: "gpt-4",                   // Code generation and review
        default: "gpt-3.5-turbo"
    },

    // Department-specific model preferences
    departmentModels: {
        sales: {
            emailDrafting: "gpt-3.5-turbo",
            pipelineAnalysis: "gpt-4",
            default: "gpt-3.5-turbo"
        },
        support: {
            faqResponse: "gpt-3.5-turbo",
            escalationAnalysis: "gpt-4",
            default: "gpt-3.5-turbo"
        },
        engineering: {
            codeReview: "gpt-4",
            documentation: "gpt-3.5-turbo",
            default: "gpt-4"
        },
        marketing: {
            contentCreation: "gpt-4",
            socialMedia: "gpt-3.5-turbo",
            default: "gpt-3.5-turbo"
        },
        default: {
            default: "gpt-3.5-turbo"
        }
    },

    // Plan-based feature matrix
    planFeatures: {
        free: {
            aiEnabled: false,
            allowedModels: [],
            maxTokensPerMonth: 0,
            voiceEnabled: false,
            imageGeneration: false,
            upgradeMessage: "¡Actualízate al Plan Profesional para desbloquear ViTo AI Assistant!"
        },
        professional: {
            aiEnabled: true,
            allowedModels: ["gpt-3.5-turbo"],
            maxTokensPerMonth: 100000,
            voiceEnabled: false,
            imageGeneration: false,
            upgradeMessage: "¡Actualízate al Plan Enterprise para acceso a modelos avanzados!"
        },
        enterprise: {
            aiEnabled: true,
            allowedModels: ["gpt-3.5-turbo", "gpt-4", "claude-3-opus"],
            maxTokensPerMonth: 1000000,
            voiceEnabled: true,
            imageGeneration: true,
            upgradeMessage: null
        }
    }
} as const;

// Type exports for TypeScript
export type PlanType = keyof typeof AI_ASSISTANT_CONFIG.planFeatures;
export type DepartmentType = keyof typeof AI_ASSISTANT_CONFIG.departmentModels;
export type TaskType = keyof typeof AI_ASSISTANT_CONFIG.modelStrategy;
