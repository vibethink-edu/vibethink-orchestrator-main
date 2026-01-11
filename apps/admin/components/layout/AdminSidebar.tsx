"use client";

import * as React from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    ShieldAlert,
    Activity,
    LogOut
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar
} from "@vibethink/ui/components/sidebar";
import { ScrollArea } from "@vibethink/ui/components/scroll-area";
import { Logo } from "@vibethink/ui/components/logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@vibethink/ui/components/dropdown-menu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Link from "next/link";

// Admin Navigation Items
const navItems = [
    {
        title: "Inquilinos",
        url: "/tenants",
        icon: LayoutDashboard,
    },
    {
        title: "Búsqueda de Identidad",
        url: "/users",
        icon: Users,
    },
    {
        title: "Registro de Auditoría",
        url: "/audit",
        icon: ShieldAlert,
    },
    {
        title: "Salud de la Plataforma",
        url: "/status",
        icon: Activity,
    },
];

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const { setOpen, setOpenMobile, isMobile } = useSidebar();

    useEffect(() => {
        if (isMobile) setOpenMobile(false);
    }, [pathname, isMobile, setOpenMobile]);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="hover:text-foreground h-10 hover:bg-[var(--primary)]/5">
                            <Logo />
                            <span className="font-semibold">ViTo Admin</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <LanguageSwitcher />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <ScrollArea className="h-full">
                    <SidebarMenu className="gap-1 p-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.url;

                            return (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        className="hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <Link href={item.url} className="flex items-center gap-3">
                                            <Icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </ScrollArea>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="hover:bg-accent">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="size-8 rounded-full bg-accent flex items-center justify-center text-xs font-medium">
                                            AD
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-sm font-medium">Usuario Admin</span>
                                            <span className="text-xs text-yellow-500 font-mono">
                                                SUPER_ADMIN
                                            </span>
                                        </div>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56"
                                side="top"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel>Usuario Admin</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                    <LogOut className="mr-2 size-4" />
                                    Cerrar Sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
