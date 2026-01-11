"use client";

import * as React from "react";
import { Globe, Check } from "@vibethink/ui/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@vibethink/ui/components/dropdown-menu";
import { Button } from "@vibethink/ui/components/button";
import { SidebarMenuButton } from "@vibethink/ui/components/sidebar";

const locales = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
];

export function LanguageSwitcher() {
    // Note: In Phase 3, this will interact with next-intl middleware/cookies
    // For now, it's a UI component to fulfill the visual requirement
    const [currentLocale, setCurrentLocale] = React.useState("es");

    const handleLocaleChange = (code: string) => {
        setCurrentLocale(code);
        // Logic to update cookie and reload would go here
        // document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax`;
        // window.location.reload();
    };

    const currentLocaleData = locales.find(l => l.code === currentLocale) || locales[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:bg-accent h-9">
                    <Globe className="size-4 shrink-0" />
                    <span className="flex-1 text-left text-sm group-data-[collapsible=icon]:hidden">
                        {currentLocaleData.name}
                    </span>
                    <span className="text-xs group-data-[collapsible=icon]:hidden">
                        {currentLocaleData.flag}
                    </span>
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-40">
                {locales.map((locale) => (
                    <DropdownMenuItem
                        key={locale.code}
                        onClick={() => handleLocaleChange(locale.code)}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <span>{locale.flag}</span>
                            <span>{locale.name}</span>
                        </div>
                        {currentLocale === locale.code && (
                            <Check className="size-4 text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
