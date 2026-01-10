import { NextRequest, NextResponse } from "next/server";
import { AuditService } from "@/lib/audit-service";
import { getAdminSession } from "@/lib/auth"; // Real Auth 🛡️

// Helper for Secure Headers
function secureResponse(body: any, status: number = 200) {
    const res = NextResponse.json(body, { status });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    res.headers.set("Vary", "Authorization, Cookie");
    return res;
}

export async function GET(req: NextRequest) {
    // 1. AUTH GUARD
    const session = await getAdminSession(req);

    if (!session) {
        // 401: Authentication is required but valid credentials not provided
        return secureResponse({ error: "Unauthorized", message: "Missing or Invalid Session" }, 401);
    }

    // 2. RBAC CHECK
    if (!['SUPPORT', 'OPS', 'SUPER'].includes(session.role)) {
        // 403: Authenticated, but insufficient permissions
        console.warn(`[RBAC] Deny access to ${session.email} (Role: ${session.role})`);
        return secureResponse({ error: "Forbidden", message: "Insufficient Permissions" }, 403);
    }

    // 3. LOGIC
    // TODO: Fetch real tenants from adminDb used in getAdminSession logic (via RLS bypass client)
    return secureResponse({
        message: "Admin Tenants List",
        tenants: [],
        username: session.email,
        role: session.role
    });
}

export async function POST(req: NextRequest) {
    const session = await getAdminSession(req);

    if (!session) {
        return secureResponse({ error: "Unauthorized" }, 401);
    }

    // RBAC Guard
    if (session.role === 'SUPPORT') {
        return secureResponse({ error: "Forbidden", message: "Support role cannot perform mutations" }, 403);
    }

    try {
        const body = await req.json();
        const { reason_code, ticket_ref, ...tenantData } = body;

        // 1. SAFETY CHECK: Context Mandatory
        if (!reason_code || !ticket_ref) {
            return secureResponse(
                { error: "MISSING_AUDIT_CONTEXT", message: "Action requires reason_code and ticket_ref" },
                400
            );
        }

        // 2. EXECUTE MUTATION (Mock DB Call)
        const newTenantId = "tenant_" + Date.now();

        // 3. AUDIT LOG (Critical Path)
        await AuditService.log(
            session,
            'TENANT_UPDATE',
            { reason_code, ticket_ref },
            { tenantId: newTenantId },
            { before: null, after: tenantData }
        );

        return secureResponse({ success: true, id: newTenantId });

    } catch (error) {
        console.error(error);
        return secureResponse({ error: "Internal Error" }, 500);
    }
}
