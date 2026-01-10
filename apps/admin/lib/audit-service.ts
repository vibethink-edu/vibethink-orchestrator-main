import { createClient } from "@supabase/supabase-js"; // Assuming installed or will be
import { AdminAuditEvent, AdminSession, ActionType } from "./types";

// TODO: Replace with centralized Supabase Client factory
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const adminDb = createClient(supabaseUrl, supabaseServiceKey);

export class AuditService {
    /**
     * Logs an immutable admin action.
     * MUST be called by every mutation endpoint.
     */
    static async log(
        session: AdminSession,
        action: ActionType,
        context: { reason_code: string; ticket_ref: string },
        targets: { tenantId?: string; userId?: string },
        changes: { before?: any; after?: any }
    ) {
        const { error } = await adminDb
            .from("admin_audit_events")
            .insert({
                actor_user_id: session.userId,
                actor_email: session.email,
                actor_role: session.role,
                target_tenant_id: targets.tenantId,
                target_user_id: targets.userId,
                action_type: action,
                reason_code: context.reason_code,
                ticket_ref: context.ticket_ref,
                payload: {
                    before: changes.before,
                    after: changes.after,
                    diff: this.calculateDiff(changes.before, changes.after),
                },
            });

        if (error) {
            console.error("CRITICAL: Failed to log audit event", error);
            // In strict mode, we might want to throw here to rollback the transaction
            throw new Error("Audit Log Failed");
        }
    }

    private static calculateDiff(before: any, after: any) {
        if (!before || !after) return null;
        // Simple shallow diff for MVP
        const diff: Record<string, any> = {};
        for (const key in after) {
            if (before[key] !== after[key]) {
                diff[key] = { from: before[key], to: after[key] };
            }
        }
        return diff;
    }
}
