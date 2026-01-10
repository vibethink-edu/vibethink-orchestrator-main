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
            <div className="p-10">
                <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
                    <h3 className="font-bold">Database Error</h3>
                    <p className="text-sm">{error.message}</p>
                    <p className="text-xs mt-2 text-red-400">Make sure SUPABASE_SERVICE_ROLE_KEY is valid.</p>
                </div>
            </div>
        );
    }

    // Cast to expected type (Supabase returns slightly different types sometimes)
    const tenants: Tenant[] = (rawTenants || []).map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        status: t.status,
        created_at: t.created_at
    }));

    return (
        <div className="flex flex-col gap-8 p-10 max-w-7xl mx-auto h-full">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-mono">
                    <span className="text-slate-400">/admin/</span>tenants
                </h1>
                <div className="text-slate-500 text-sm">
                    Manage tenant provisioning, status, and system access.
                </div>
            </div>

            <div className="mt-4">
                <TenantsTable data={tenants} />
            </div>
        </div>
    );
}
