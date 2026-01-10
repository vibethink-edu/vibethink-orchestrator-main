// ADMIN NEXUS TYPES 🛡️

export type AdminRole = 'SUPPORT' | 'OPS' | 'SUPER';

export type AdminSession = {
    userId: string;
    email: string;
    role: AdminRole;
};

export type ActionType =
    | 'TENANT_UPDATE'
    | 'TENANT_SUSPEND'
    | 'LIMIT_OVERRIDE'
    | 'CREDIT_ADD'
    | 'USER_RESET'
    | 'IMPERSONATION_START'
    | 'IMPERSONATION_STOP';

export type AdminMutationContext = {
    reason_code: string;
    ticket_ref: string;
};

export type AdminAuditEvent = {
    id: string;
    created_at: string;
    actor_user_id: string;
    actor_email: string;
    actor_role: AdminRole;
    target_tenant_id?: string;
    target_user_id?: string;
    action_type: ActionType;
    reason_code: string;
    ticket_ref: string;
    payload: {
        before?: Record<string, unknown>;
        after?: Record<string, unknown>;
        diff?: Record<string, unknown>;
    };
};
