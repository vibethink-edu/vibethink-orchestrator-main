"use client";

import { useState } from "react";
import { Button } from "@vibethink/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@vibethink/ui/components/dialog";
import { Input } from "@vibethink/ui/components/input";
import { Label } from "@vibethink/ui/components/label";
import { Plus, Building2, Globe, CreditCard } from "@vibethink/ui/icons";

export function CreateTenantDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setOpen(false);
            // In a real app, we would refresh the data here
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:opacity-90 shadow-sm gap-2">
                    <Plus className="h-4 w-4" />
                    Provision New Tenant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Provision Enterprise Tenant</DialogTitle>
                    <DialogDescription>
                        Create a new isolated environment for a client. This will provision database schemas and auth realms.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                Organization Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="Acme Corp, Inc."
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="slug" className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                URL Slug
                            </Label>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md border">
                                    vibethink.co/
                                </span>
                                <Input
                                    id="slug"
                                    placeholder="acme-corp"
                                    className="flex-1"
                                    required
                                />
                            </div>
                            <p className="text-[0.8rem] text-muted-foreground">
                                Only lowercase letters, numbers, and hyphens.
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="plan" className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                Subscription Plan
                            </Label>
                            <select
                                id="plan"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="enterprise">Enterprise (Custom)</option>
                                <option value="business">Business Pro</option>
                                <option value="starter">Starter</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Provisioning..." : "Provision Tenant"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
