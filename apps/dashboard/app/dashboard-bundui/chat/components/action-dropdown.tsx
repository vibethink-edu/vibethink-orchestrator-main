"use client";

import { PlusIcon } from "@radix-ui/react-icons";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@vibethink/ui";

import { useTranslation } from "@/lib/i18n";

export function ActionDropdown() {
  const { t } = useTranslation("chat");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <PlusIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>{t("sidebar.actions.newChat")}</DropdownMenuItem>
          <DropdownMenuItem>{t("sidebar.actions.createGroup")}</DropdownMenuItem>
          <DropdownMenuItem>{t("sidebar.actions.addContact")}</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
