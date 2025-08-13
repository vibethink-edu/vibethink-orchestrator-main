/**
 * Users Page - User Management
 * VibeThink Orchestrator Dashboard
 * 
 * Following bundui-reference pattern with VibeThink adaptations
 */

'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/shared/components/bundui-premium/components/ui/button";
import UsersDataTable from "./data-table";

// Import users data - In production this would come from API/Database
import usersData from "./data.json";

export default function UsersPage() {
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState(usersData);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="h-96 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <Button asChild>
          <Link href="#">
            <PlusCircledIcon /> Add New User
          </Link>
        </Button>
      </div>
      <UsersDataTable data={users} />
    </div>
  );
}