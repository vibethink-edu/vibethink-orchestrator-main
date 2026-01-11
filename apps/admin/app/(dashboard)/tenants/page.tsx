import { TenantsTable, Tenant } from "@/components/tenants/TenantsTable";
import { adminDb } from "@/lib/supabase";
import { Button } from "@vibethink/ui/components/button";
import { CreateTenantDialog } from "@/components/tenants/CreateTenantDialog";

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
        <div className="flex flex-1 flex-col gap-8">
            {/* Page Header - Enterprise Onboarding Style */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Tenants
                    </h1>
                    <p className="text-muted-foreground">
                        Manage enterprise provisioning, status, and system configurations.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <CreateTenantDialog />
                </div>
            </div>

            {/* Quick Stats (Enterprise Vibe) */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 bg-card border rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Active</p>
                    <h3 className="text-3xl font-bold mt-2">{tenants.filter(t => t.status === 'ACTIVE').length}</h3>
                </div>
                <div className="p-6 bg-card border rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Setup</p>
                    <h3 className="text-3xl font-bold mt-2">0</h3>
                </div>
                <div className="p-6 bg-card border rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent (24h)</p>
                    <h3 className="text-3xl font-bold mt-2">1</h3>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-card rounded-xl border shadow-sm p-1">
                <TenantsTable data={tenants} />
            </div>
        </div>
    );
}
