/**
 * Copied from: apps/dashboard/app/dashboard-bundui/pages/profile/page.tsx
 * Last synced: 2026-01-10
 * Adaptations: Connected to Supabase, adapted tabs for Tenant operations
 */
import { adminDb } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldAlert } from "@vibethink/ui/icons";
import { AuditTimeline, AuditEvent } from "@/components/audit/AuditTimeline";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@vibethink/ui/components/table";
import { Badge } from "@vibethink/ui/components/badge";

import { Button } from "@vibethink/ui/components/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@vibethink/ui/components/tabs";
import { TenantInfoCard } from "@/components/tenants/TenantInfoCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vibethink/ui/components/card";

export const dynamic = 'force-dynamic';

export default async function TenantDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    // Fetch Tenant Data
    const { data: tenant, error } = await adminDb
        .from('tenants')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !tenant) {
        if (error?.code === 'PGRST116') { // Not found
            notFound();
        }
        console.error("Error fetching tenant:", error);
        return <div>Error loading tenant</div>;
    }

    // Mock Audit Data (Simulating Real System Events)
    const auditEvents: AuditEvent[] = [
        {
            id: "evt_1",
            type: "billing",
            level: "info",
            action: "Credit Top-Up",
            description: "Added 500 AI credits manually",
            actor: "marcelo@vibethink.ai",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            metadata: { amount: 500, reason: "Support Ticket #1234" }
        },
        {
            id: "evt_2",
            type: "config",
            level: "warning",
            action: "Feature Flag Update",
            description: "Disabled 'beta_features' flag",
            actor: "system_automator",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            metadata: { prev: true, new: false }
        },
        {
            id: "evt_3",
            type: "security",
            level: "critical",
            action: "API Key Revoked",
            description: "Revoked leaked production key",
            actor: "security_bot",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
            metadata: { key_prefix: "sk_live_..." }
        },
        {
            id: "evt_4",
            type: "system",
            level: "info",
            action: "Tenant Provisioned",
            description: "Initial tenant setup completed",
            actor: "onboarding_flow",
            timestamp: new Date(tenant.created_at),
            metadata: { region: "us-east-1", flavor: "enterprise" }
        }
    ];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/tenants">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
                            {tenant.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Tenant Details
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" asChild>
                        <Link href={`https://${tenant.slug}.app.vibethink.co`} target="_blank">
                            <ExternalLink className="mr-2 size-4" />
                            Open Dashboard
                        </Link>
                    </Button>
                    <Button variant="destructive">
                        <ShieldAlert className="mr-2 size-4" />
                        Impersonate
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="policies">Policies & Feature Flags</TabsTrigger>
                    <TabsTrigger value="billing">Billing & Credits</TabsTrigger>
                    <TabsTrigger value="audit">Audit Logs</TabsTrigger>
                </TabsList>

                <div className="grid gap-4 xl:grid-cols-3">
                    {/* Left Sidebar */}
                    <div className="space-y-4 xl:col-span-1">
                        <TenantInfoCard tenant={tenant} />
                    </div>

                    {/* Main Content Area */}
                    <div className="space-y-4 xl:col-span-2">

                        {/* OVERVIEW TAB */}
                        <TabsContent value="overview" className="m-0 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tenant Overview</CardTitle>
                                    <CardDescription>General information and quick stats</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground">
                                        Overview content coming soon...
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* POLICIES TAB */}
                        <TabsContent value="policies" className="m-0 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Policy Editor</CardTitle>
                                    <CardDescription>Configure feature flags and rate limits (JSON)</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-muted rounded-md font-mono text-sm overflow-auto max-h-[400px]">
                                        <pre>{JSON.stringify(tenant.tenant_policies || {}, null, 2)}</pre>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* BILLING & API KEYS TAB (MOCKED) */}
                        <TabsContent value="billing" className="m-0 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>API Keys & Usage</CardTitle>
                                    <CardDescription>Manage access keys and monitor consumption</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Key Prefix</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Usage (Last 30d)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-medium">Production Key</TableCell>
                                                <TableCell className="font-mono text-xs">pk_live_8a...</TableCell>
                                                <TableCell>Oct 24, 2025</TableCell>
                                                <TableCell><Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Active</Badge></TableCell>
                                                <TableCell className="text-right">45,231 reqs</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Dev Key (Laptop)</TableCell>
                                                <TableCell className="font-mono text-xs">pk_test_9b...</TableCell>
                                                <TableCell>Jan 02, 2026</TableCell>
                                                <TableCell><Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Active</Badge></TableCell>
                                                <TableCell className="text-right">120 reqs</TableCell>
                                            </TableRow>
                                            <TableRow className="opacity-50">
                                                <TableCell className="font-medium">Old Prod Key</TableCell>
                                                <TableCell className="font-mono text-xs">pk_live_xx...</TableCell>
                                                <TableCell>Sep 12, 2025</TableCell>
                                                <TableCell><Badge variant="destructive">Revoked</Badge></TableCell>
                                                <TableCell className="text-right">-</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* AUDIT TAB */}
                        <TabsContent value="audit" className="m-0 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Audit Logs</CardTitle>
                                    <CardDescription>Immutable record of all changes to this tenant</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AuditTimeline events={auditEvents} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </div>
                </div>
            </Tabs>
        </div>
    );
}
