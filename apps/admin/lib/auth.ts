import { NextRequest } from "next/server";
import { adminDb } from "./supabase";
import { AdminSession, AdminRole } from "./types";

/**
 * @description Resolves the current Admin Session from NextRequest.
 * Supports DEV override via ADMIN_DEV_ROLE env var and Bearer token authentication.
 * Queries admin_role_assignments table to resolve admin role for authenticated users.
 * 
 * @requires adminDb from ./supabase
 * @requires AdminSession, AdminRole types from ./types
 * 
 * @param {NextRequest} req - The Next.js request object
 * @returns {Promise<AdminSession | null>} Admin session with userId, email, and role, or null if authentication fails
 * 
 * @example
 * const session = await getAdminSession(request);
 * if (!session) {
 *   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 * }
 * 
 * @securityReview Required - handles authentication and role-based access control
 * @testingRequired Yes - test dev override, token verification, role resolution, and error cases
 */
export async function getAdminSession(req: NextRequest): Promise<AdminSession | null> {
    // 1. DEV OVERRIDE (Only in Development)
    if (process.env.NODE_ENV === 'development') {
        const devRole = process.env.ADMIN_DEV_ROLE;
        if (devRole && ['SUPPORT', 'OPS', 'SUPER'].includes(devRole)) {
            console.warn(`🔓 [ADMIN_AUTH] SECURITY WARNING: Using ADMIN_DEV_ROLE=${devRole} override.`);
            return {
                userId: "dev-admin-id",
                email: "dev-admin@vibethink.io",
                role: devRole as AdminRole
            };
        }
    }

    // 2. EXTRACT TOKEN
    // Try Authorization Header first
    const authHeader = req.headers.get("Authorization");
    let token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    // TODO: Try Cookies if header missing (requires cookie parser)

    if (!token) return null;

    // 3. VERIFY IDENTITY
    const { data: { user }, error } = await adminDb.auth.getUser(token);

    if (error || !user) {
        console.error("[ADMIN_AUTH] Invalid Token:", error?.message);
        return null;
    }

    // 4. RESOLVE ROLE (RBAC)
    // Query the admin_role_assignments table defined in our migrations
    const { data: roleAssignment, error: roleError } = await adminDb
        .from('admin_role_assignments')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (roleError || !roleAssignment) {
        console.warn(`[ADMIN_AUTH] User ${user.id} authenticated but HAS NO ADMIN ROLE.`);
        return null; // Valid user, but NOT an admin
    }

    return {
        userId: user.id,
        email: user.email || "unknown",
        role: roleAssignment.role as AdminRole
    };
}
