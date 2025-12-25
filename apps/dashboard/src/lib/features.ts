export type PlanId = 'free' | 'pro' | 'enterprise';

export type FeatureId =
    | 'ai_chat'
    | 'voice_interaction'
    | 'realtime_translation'
    | 'session_summary'
    | 'advanced_models';

type PlanConfig = {
    max_messages: number;
    allowed_features: FeatureId[] | '*';
};

export const PLAN_FEATURES: Record<PlanId, PlanConfig> = {
    free: {
        max_messages: 10,
        allowed_features: ['ai_chat']
    },
    pro: {
        max_messages: Infinity,
        allowed_features: ['ai_chat', 'voice_interaction', 'realtime_translation']
    },
    enterprise: {
        max_messages: Infinity,
        allowed_features: '*' // All features
    }
};

export const checkAccess = (plan: PlanId, feature: FeatureId): boolean => {
    const config = PLAN_FEATURES[plan];
    if (!config) return false;

    if (config.allowed_features === '*') return true;
    return config.allowed_features.includes(feature);
};
