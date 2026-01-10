"use client";

import { SidebarTrigger } from "@vibethink/ui/components/sidebar";
import { Separator } from "@vibethink/ui/components/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@vibethink/ui/components/breadcrumb";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "./ThemeSwitch";
import { UserMenu } from "./UserMenu";

const pageNames: Record<string, string> = {
    tenants: "Tenants",
    users: "Identity Search",
    audit: "Audit Log",
    status: "Platform Health",
};

export function AdminHeader() {
    const pathname = usePathname();

    // Simple breadcrumb logic
    const segments = pathname.split('/').filter(Boolean);
    const currentPage = segments[segments.length - 1] || 'tenants';
    const pageName = pageNames[currentPage] || currentPage;

    return (
        <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex w-full items-center gap-2 px-4">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/">
                                Admin
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                {pageName}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Right side controls - Bundui style */}
                <div className="ml-auto flex items-center gap-2">
                    <ThemeSwitch />
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
