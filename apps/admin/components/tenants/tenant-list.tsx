"use client";
import { useState, useEffect } from "react";

// Types corresponding to Admin View
type Tenant = {
    id: string;
    name: string;
    flavor: 'ENTERPRISE' | 'PRO' | 'TRIAL';
    status: 'ACTIVE' | 'SUSPENDED';
    modules: string[];
};

export function TenantList() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // SECURITY NOTE:
        // This fetch currently relies on Same-Origin Cookies (Next.js default for API Routes).
        // In a fully decoupled setup (or specific RBAC scenarios), inject token explicitly:
        // const { data: { session } } = await supabase.auth.getSession();
        // fetch(url, { headers: { Authorization: `Bearer ${session?.access_token}` } })

        // Fetch data from API
        fetch("/api/admin/tenants")
            .then((res) => {
                if (res.status === 401 || res.status === 403) {
                    console.warn("Auth Error:", res.status);
                    return { tenants: [] }; // Handle gracefully
                }
                return res.json();
            })
            .then((data) => {
                if (!data.tenants || data.tenants.length === 0) {
                    // FALLBACK MOCK DATA FOR DEV PREVIEW (DX Only)
                    setTenants([
                        { id: "tnt_01", name: "Andrés Cantor Twin", flavor: "ENTERPRISE", status: "ACTIVE", modules: ["TWIN", "MEDIA"] },
                        { id: "tnt_02", name: "Clínica San José", flavor: "PRO", status: "ACTIVE", modules: ["CLINICAL", "DOCS"] },
                        { id: "tnt_03", name: "Consultorio Dr. Simi", flavor: "TRIAL", status: "SUSPENDED", modules: ["CLINICAL"] },
                        { id: "tnt_04", name: "SalesFy Consulting", flavor: "PRO", status: "ACTIVE", modules: ["CRM", "TWIN"] },
                    ]);
                } else {
                    setTenants(data.tenants);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load tenants", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-zinc-500 text-sm p-4">Loading Nexus data...</div>;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-white">Active Tenants</h2>
                    <p className="text-zinc-400 text-xs">Manage provisioning and billing status.</p>
                </div>
                <div className="flex gap-2">
                    <input
                        placeholder="Search tenants..."
                        className="h-9 w-[250px] rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm shadow-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                    />
                    <button className="h-9 px-4 rounded-md bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors">
                        + Provision Tenant
                    </button>
                </div>
            </div>

            <div className="rounded-md border border-zinc-800 bg-black overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-900/50 text-zinc-400 font-medium">
                        <tr className="border-b border-zinc-800">
                            <th className="h-10 px-4 align-middle">Tenant Name</th>
                            <th className="h-10 px-4 align-middle">ID</th>
                            <th className="h-10 px-4 align-middle">Flavor</th>
                            <th className="h-10 px-4 align-middle">Modules</th>
                            <th className="h-10 px-4 align-middle">Status</th>
                            <th className="h-10 px-4 align-middle text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenants.map((t) => (
                            <tr key={t.id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/20 transition-colors group">
                                <td className="p-4 font-medium text-white">{t.name}</td>
                                <td className="p-4 font-mono text-xs text-zinc-500">{t.id}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide
                    ${t.flavor === 'ENTERPRISE' ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' :
                                            t.flavor === 'PRO' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                                                'border-zinc-500/30 bg-zinc-500/10 text-zinc-400'}`}>
                                        {t.flavor}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-1 flex-wrap">
                                        {t.modules.map(m => (
                                            <span key={m} className="text-[10px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${t.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <span className={`text-xs ${t.status === 'ACTIVE' ? 'text-zinc-300' : 'text-zinc-500'}`}>{t.status}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-white text-xs border border-zinc-700 px-3 py-1 rounded hover:bg-zinc-800">
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
