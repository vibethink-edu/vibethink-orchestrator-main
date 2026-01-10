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

const pageNames: Record<string, string> = {
    tenants: "Inquilinos",
    users: "Búsqueda de Identidad",
    audit: "Registro de Auditoría",
    status: "Salud de la Plataforma",
};

export function AdminHeader() {
    const pathname = usePathname();

    // Simple breadcrumb logic
    const segments = pathname.split('/').filter(Boolean);
    const currentPage = segments[segments.length - 1] || 'tenants';
    const pageName = pageNames[currentPage] || currentPage;

    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
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
                        <BreadcrumbPage className="capitalize">
                            {pageName}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </header>
    );
}
