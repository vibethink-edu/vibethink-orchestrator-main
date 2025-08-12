"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/bundui-premium/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/bundui-premium/components/ui/avatar"
import { Button } from "@/shared/components/bundui-premium/components/ui/button"
import { Badge } from "@/shared/components/bundui-premium/components/ui/badge"
import { 
  Home, 
  Layout, 
  BarChart3, 
  Brain, 
  GitBranch, 
  Target, 
  Users, 
  FileText, 
  Settings,
  HelpCircle
} from "lucide-react"
import Link from "next/link"

const navigation = [
  {
    title: "Default",
    href: "/default",
    icon: Layout,
    badge: "Bundui"
  },
  {
    title: "Overview",
    href: "/enhanced-dashboard",
    icon: Home,
  },
  {
    title: "AI Consensus",
    href: "/enhanced-dashboard/consensus",
    icon: Brain,
    badge: "New"
  },
  {
    title: "Analytics", 
    href: "/enhanced-dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Workflow",
    href: "/enhanced-dashboard/workflow", 
    icon: GitBranch,
  },
  {
    title: "Decisions",
    href: "/enhanced-dashboard/decisions",
    icon: Target,
    badge: "AI"
  },
  {
    title: "Team",
    href: "/enhanced-dashboard/team",
    icon: Users,
  },
  {
    title: "Reports",
    href: "/enhanced-dashboard/reports",
    icon: FileText,
  }
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">VibeThink</h1>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <Link href={item.href} className="flex items-center gap-2 px-3 py-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/help" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}