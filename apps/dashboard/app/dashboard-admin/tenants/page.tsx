"use client";

import { useTranslation } from "react-i18next";
import { CreateTenantDialog } from "./components/create-tenant-dialog";
import { TenantsTable, Tenant } from "./components/tenants-table";

// Mock data for display
const mockTenants: Tenant[] = [
    {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Acme Corp",
        slug: "acme-corp",
        status: "ACTIVE",
        created_at: "2024-01-15T10:00:00Z"
    },
    {
        id: "750e8400-e29b-41d4-a716-446655441111",
        name: "Globex Corporation",
        slug: "globex",
        status: "SUSPENDED",
        created_at: "2024-02-01T14:30:00Z"
    },
    {
        id: "850e8400-e29b-41d4-a716-446655442222",
        name: "Soylent Corp",
        slug: "soylent",
        status: "ACTIVE",
        created_at: "2024-03-10T09:15:00Z"
    },
    {
        id: "950e8400-e29b-41d4-a716-446655443333",
        name: "Umbrella Corporation",
        slug: "umbrella",
        status: "ACTIVE",
        created_at: "2024-01-05T16:20:00Z"
    },
    {
        id: "a50e8400-e29b-41d4-a716-446655444444",
        name: "Cyberdyne Systems",
        slug: "cyberdyne",
        status: "PENDING",
        created_at: "2024-04-12T11:45:00Z"
    }
];

export default function SystemAdminTenantsPage() {
    // In a real scenario, useTranslation would be used here
    // const { t } = useTranslation('admin'); 

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tenant Management</h2>
                    <p className="text-muted-foreground">
                        Manage system tenants, subscriptions, and environments.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <CreateTenantDialog />
                </div>
            </div>

            <TenantsTable data={mockTenants} />
        </div>
    );
}
