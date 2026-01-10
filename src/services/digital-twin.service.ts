import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/digital_twin'; // Los tipos que generamos
import {
    Celebrity,
    DigitalTwin,
    Deployment,
    DeploymentType
} from '../types/digital_twin';

// Error Classes
export class CelebrityNotFoundError extends Error {
    constructor(slugOrId: string) {
        super(`Celebrity with identifier '${slugOrId}' not found.`);
        this.name = 'CelebrityNotFoundError';
    }
}

export class DigitalTwinNotFoundError extends Error {
    constructor(id: string) {
        super(`Digital Twin with ID '${id}' not found.`);
        this.name = 'DigitalTwinNotFoundError';
    }
}

export class DigitalTwinService {
    constructor(private supabase: SupabaseClient<Database>) { }

    // ------------------------------------------------------------------
    // CELEBRITY MANAGEMENT
    // ------------------------------------------------------------------

    async getCelebrityBySlug(slug: string): Promise<Celebrity> {
        const { data, error } = await this.supabase
            .from('celebrities')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) {
            throw new CelebrityNotFoundError(slug);
        }
        return data;
    }

    async createCelebrity(input: {
        full_name: string;
        slug: string;
        description?: string;
        metadata?: any;
    }): Promise<Celebrity> {
        const { data, error } = await this.supabase
            .from('celebrities')
            .insert({
                full_name: input.full_name,
                slug: input.slug,
                description: input.description,
                metadata: input.metadata || {},
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // ------------------------------------------------------------------
    // DIGITAL TWIN MANAGEMENT
    // ------------------------------------------------------------------

    async getActiveTwinForCelebrity(celebrityId: string, version?: string): Promise<DigitalTwin | null> {
        let query = this.supabase
            .from('digital_twins')
            .select('*')
            .eq('celebrity_id', celebrityId)
            .eq('is_active', true);

        if (version) {
            query = query.eq('version', version);
        }

        // Return the most recent created one if multiple exist (unless specific version requested)
        const { data, error } = await query
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found" which is fine here
            throw error;
        }

        return data;
    }

    async createDigitalTwin(input: {
        celebrity_id: string;
        name: string;
        version: string;
        provider: string;
        provider_twin_id: string;
        capabilities?: string[];
    }): Promise<DigitalTwin> {
        const { data, error } = await this.supabase
            .from('digital_twins')
            .insert({
                celebrity_id: input.celebrity_id,
                name: input.name,
                version: input.version,
                provider: input.provider,
                provider_twin_id: input.provider_twin_id,
                capabilities: input.capabilities || [],
                is_active: true
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // ------------------------------------------------------------------
    // DEPLOYMENT MANAGEMENT
    // ------------------------------------------------------------------

    async createDeployment(input: {
        digital_twin_id: string;
        client_name: string;
        deployment_type: DeploymentType;
        monthly_fee?: number;
    }): Promise<Deployment> {
        const { data, error } = await this.supabase
            .from('deployments')
            .insert({
                digital_twin_id: input.digital_twin_id,
                client_name: input.client_name,
                deployment_type: input.deployment_type,
                monthly_fee: input.monthly_fee,
                status: 'ACTIVE',
                start_date: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}
