"use client";

import { useTranslation } from "@/lib/i18n";
import { SummaryCards } from "../../dashboard-bundui/projects-v2/components/summary-cards";
import { TotalRevenueCard } from "../../dashboard-bundui/default/components/total-revenue";
import { Button } from "@vibethink/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@vibethink/ui/components/card";
import { Plus } from "@vibethink/ui/icons";

export default function TenantAdminPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                <h2 className="text-3xl font-bold tracking-tight">Tenant Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Project
                    </Button>
                </div>
            </div>

            <SummaryCards />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <TotalRevenueCard />
                </div>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            You made 265 sales this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Mock activity items */}
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            User Action {i}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            user{i}@example.com
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">+$1,999.00</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
