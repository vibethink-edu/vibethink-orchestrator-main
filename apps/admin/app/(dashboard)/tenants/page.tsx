import { TenantList } from "@/components/tenants/tenant-list";

export default function TenantsPage() {
    return (
        <div className="flex flex-col gap-8 p-10 max-w-7xl mx-auto h-full">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white font-mono">
                    <span className="text-zinc-600">/admin/</span>tenants
                </h1>
                <div className="text-zinc-500 text-sm">
                    Review status, configure capabilities, and manage billing limits.
                </div>
            </div>

            <div className="mt-4">
                <TenantList />
            </div>
        </div>
    );
}
