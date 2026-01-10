"use client";

import { BadgeCheck, LogOut, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from '@vibethink/ui/components/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@vibethink/ui/components/dropdown-menu';

export function UserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                        AD
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end">
                <DropdownMenuLabel className="p-0">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar>
                            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                                AD
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">Admin User</span>
                            <span className="truncate text-xs text-muted-foreground">admin@vibethink.co</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <BadgeCheck />
                        Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Shield />
                        Security
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                    <LogOut />
                    Log out
                </DropdownMenuItem>

                {/* Role Badge */}
                <div className="mt-1.5 rounded-md border bg-muted">
                    <div className="space-y-2 p-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Role</h4>
                            <span className="text-xs font-mono text-yellow-500">SUPER_ADMIN</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Full access to all tenant operations
                        </div>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
