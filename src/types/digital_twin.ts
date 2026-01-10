export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Celebrity {
    id: string; // UUID
    full_name: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    metadata: CelebrityMetadata;
}

export interface CelebrityMetadata {
    social_handles?: {
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        tiktok?: string;
    };
    website?: string;
    agent_contact?: string;
    [key: string]: unknown;
}

export interface DigitalTwin {
    id: string; // UUID
    celebrity_id: string; // FK to celebrities
    name: string;
    version: string;
    provider: 'tavus' | 'heygen' | 'custom' | string;
    provider_twin_id: string;
    is_active: boolean;
    capabilities: TwinCapability[];
    configuration: TwinConfiguration;
    created_at: string;
    updated_at: string;
}

export type TwinCapability = 'video' | 'voice' | 'interactive' | 'realtime' | string;

export interface TwinConfiguration {
    tavus?: {
        replica_id?: string;
        voice_id?: string;
        callback_url?: string;
    };
    heygen?: {
        avatar_id?: string;
    };
    [key: string]: unknown;
}

export type DeploymentType = 'PORTAL' | 'EMBEDDED' | 'CAMPAIGN' | 'WHITE_LABEL';
export type DeploymentStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED';

export interface Deployment {
    id: string; // UUID
    digital_twin_id: string; // FK to digital_twins
    client_name: string;
    deployment_type: DeploymentType;
    status: DeploymentStatus;
    start_date: string;
    end_date: string | null;
    monthly_fee: number | null;
    config_overrides: DeploymentConfig;
    api_usage_limit: number | null;
    current_usage: number;
    created_at: string;
    updated_at: string;
}

export interface DeploymentConfig {
    allowed_domains?: string[];
    theme?: {
        primary_color?: string;
        logo_url?: string;
    };
    script_injections?: string[];
    restricted_topics?: string[];
    [key: string]: unknown;
}

export interface KnowledgeBase {
    id: string; // UUID
    digital_twin_id: string | null; // FK
    name: string;
    source_type: 'TEXT' | 'URL' | 'PDF' | 'API_STREAM';
    content: string | null;
    refresh_interval_minutes: number | null;
    last_indexed_at: string | null;
    embedding_ids: string[] | null;
    created_at: string;
}

// Database Schema Helper
export interface Database {
    public: {
        Tables: {
            celebrities: {
                Row: Celebrity;
                Insert: Omit<Celebrity, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Celebrity, 'id' | 'created_at' | 'updated_at'>>;
            };
            digital_twins: {
                Row: DigitalTwin;
                Insert: Omit<DigitalTwin, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<DigitalTwin, 'id' | 'created_at' | 'updated_at'>>;
            };
            deployments: {
                Row: Deployment;
                Insert: Omit<Deployment, 'id' | 'created_at' | 'updated_at' | 'current_usage'>;
                Update: Partial<Omit<Deployment, 'id' | 'created_at' | 'updated_at'>>;
            };
            knowledge_bases: {
                Row: KnowledgeBase;
                Insert: Omit<KnowledgeBase, 'id' | 'created_at' | 'last_indexed_at'>;
                Update: Partial<Omit<KnowledgeBase, 'id' | 'created_at'>>;
            };
        };
    };
}
