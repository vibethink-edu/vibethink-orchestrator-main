import { NextRequest, NextResponse } from "next/server";
import { AuditService } from "@/lib/audit-service";
import { AdminSession } from "@/lib/types";

// MOCK SESSION - Replace with real Auth Logic
async function getAdminSession(req: NextRequest): Promise<AdminSession | null> {
    // TODO: Verify JWT/Cookie and return session
    // return null; // Default deny
    return { userId: "mock-admin", email: "admin@vibethink.io", role: "SUPER" }; // DEV ONLY
}

export async function GET(req: NextRequest) {
    // 1. AUTH GUARD
    const session = await getAdminSession(req);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    // 2. RBAC CHECK
    if (!['SUPPORT', 'OPS', 'SUPER'].includes(session.role)) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    // 3. LOGIC
    return NextResponse.json({
        message: "Admin Tenants List",
        tenants: [],
        warning: "Stub Implementation"
    });
}

export async function POST(req: NextRequest) {
    const session = await getAdminSession(req);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    // RBAC Guard
    if (session.role === 'SUPPORT') {
        return new NextResponse("Forbidden: Support cannot create tenants", { status: 403 });
    }

    try {
        const body = await req.json();
        const { reason_code, ticket_ref, ...tenantData } = body;

        // 1. SAFETY CHECK: Context Mandatory
        if (!reason_code || !ticket_ref) {
            return NextResponse.json(
                { error: "MISSING_AUDIT_CONTEXT", message: "Action requires reason_code and ticket_ref" },
                { status: 400 }
            );
        }

        // 2. EXECUTE MUTATION (Mock DB Call)
        // const newTenant = await db.insert(tenantData)...
        const newTenantId = "tenant_" + Date.now();

        // 3. AUDIT LOG (Critical Path)
        await AuditService.log(
            session,
            'TENANT_UPDATE', // Using Update as proxy for Create/Provision
            { reason_code, ticket_ref },
            { tenantId: newTenantId },
            { before: null, after: tenantData }
        );

        return NextResponse.json({ success: true, id: newTenantId });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
