import { TenantsTable, Tenant } from "@/components/tenants/TenantsTable";
import { adminDb } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default async function TenantsPage() {
    // Fetch Data directly from DB (Server Component)
    const { data: rawTenants, error } = await adminDb
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("DB Error:", JSON.stringify(error, null, 2), "Status:", error.code, error.details);
        return (
            <div className="p-6">
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">
                    <h3 className="font-bold">Database Error</h3>
                    <p className="text-sm">{error.message}</p>
                    <p className="text-xs mt-2 opacity-70">Make sure SUPABASE_SERVICE_ROLE_KEY is valid.</p>
                </div>
            </div>
        );
    }

    // Cast to expected type
    const tenants: Tenant[] = (rawTenants || []).map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        status: t.status,
        created_at: t.created_at
    }));

    return (
        <div className="flex flex-1 flex-col gap-4">
            {/* Page Header - Bundui Style */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Tenant Management
                </h1>
                <p className="text-sm text-muted-foreground">
                    Manage tenant provisioning, status, and system access.
                </p>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <TenantsTable data={tenants} />
            </div>
        </div>
    );
}
