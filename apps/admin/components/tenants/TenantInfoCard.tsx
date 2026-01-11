/**
 * Copied from: apps/dashboard/app/dashboard-bundui/pages/profile/profile-card.tsx
 * Last synced: 2026-01-10
 * Adaptations: Adapted for Tenant display (Flavor, Status, Slug)
 */
import { Calendar, Globe, Hash, Shield } from "@vibethink/ui/icons";
import { Card, CardContent } from "@vibethink/ui/components/card";
import { Badge } from "@vibethink/ui/components/badge";
import { Avatar, AvatarFallback } from "@vibethink/ui/components/avatar";

interface TenantInfoCardProps {
    tenant: {
        id: string;
        name: string;
        slug: string;
        status: string;
        created_at: string;
    };
}

export function TenantInfoCard({ tenant }: TenantInfoCardProps) {
    return (
        <Card className="relative">
            <CardContent className="pt-6">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex flex-col items-center space-y-4">
                        <Avatar className="size-20">
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                {tenant.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h5 className="flex items-center gap-2 text-xl font-semibold justify-center">
                                {tenant.name}
                                <Badge variant={tenant.status === 'active' ? 'default' : 'destructive'}>
                                    {tenant.status}
                                </Badge>
                            </h5>
                            <div className="text-muted-foreground text-sm font-mono mt-1">
                                {tenant.slug}
                            </div>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="bg-muted/50 grid grid-cols-3 divide-x rounded-md border text-center *:py-3">
                        <div>
                            <h5 className="text-lg font-semibold">0</h5>
                            <div className="text-muted-foreground text-xs uppercase tracking-wider">Users</div>
                        </div>
                        <div>
                            <h5 className="text-lg font-semibold">0</h5>
                            <div className="text-muted-foreground text-xs uppercase tracking-wider">Sessions</div>
                        </div>
                        <div>
                            <h5 className="text-lg font-semibold">0</h5>
                            <div className="text-muted-foreground text-xs uppercase tracking-wider">Credits</div>
                        </div>
                    </div>

                    {/* Details List */}
                    <div className="flex flex-col gap-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Hash className="text-muted-foreground size-4" />
                            <span className="font-mono text-xs">{tenant.id}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Globe className="text-muted-foreground size-4" />
                            <span className="text-muted-foreground">Region:</span> US-East-1
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Shield className="text-muted-foreground size-4" />
                            <span className="text-muted-foreground">Flavor:</span>
                            <span className="font-medium">Enterprise</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="text-muted-foreground size-4" />
                            <span className="text-muted-foreground">Created:</span>
                            {new Date(tenant.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
