import "server-only"; // 🛡️ CRITICAL: Prevent usage in Client Components
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// SINGLETON for Server-Side Admin Operations
// This uses the SERVICE_ROLE_KEY to bypass RLS when needed.
// BE CAREFUL using this client. Only for authorized Admin Service operations.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    if (process.env.NODE_ENV !== 'test') {
        throw new Error(
            "FATAL: Supabase admin credentials are required. " +
            "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables."
        );
    }
}

// SECURITY: Only use this client after verifying admin access via getAdminSession() or similar check.
// This client bypasses RLS.
export const adminDb = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseServiceKey || "placeholder", {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
    },
    global: {
        headers: {
            'x-application-name': 'vibethink-admin-service',
        },
    },
});

/**
 * Execute admin query only if user is verified super admin (or specific role).
 * @throws {Error} if user is not authorized
 */
export async function withSuperAdminCheck<T>(
    userId: string,
    operation: (client: SupabaseClient) => Promise<T>
): Promise<T> {
    // 1. Verify Role directly against our Authoritative Table
    const { data: roleData } = await adminDb
        .from('admin_role_assignments')
        .select('role')
        .eq('user_id', userId)
        .single();

    if (!roleData || roleData.role !== 'SUPER') {
        // Log attempt
        console.warn(`[SECURITY] Unauthorized Admin Access Attempt by ${userId}`);
        throw new Error(`Unauthorized: User ${userId} is not a super admin`);
    }

    // 2. Execute Operation
    return operation(adminDb);
}
