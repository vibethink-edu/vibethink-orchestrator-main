"use client";

import React from "react";

import { Check, ChevronsDownIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@vibethink/ui";
import { Button } from "@vibethink/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vibethink/ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@vibethink/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@vibethink/ui";
import { useTranslation } from "@/lib/i18n";

const members = [
  {
    id: 1,
    name: "Vito Escallón",
    email: "contact@bundui.io",
    avatar: `/assets/images/avatars/01.png`,
    role_id: 1
  },
  {
    id: 2,
    name: "Jackson Lee",
    email: "pre@example.com",
    avatar: `/assets/images/avatars/02.png`,
    role_id: 2
  },
  {
    id: 3,
    name: "Hally Gray",
    email: "hally@site.com",
    avatar: `/assets/images/avatars/03.png`,
    role_id: 1
  }
];

export function TeamMembersCard() {
  const { t } = useTranslation('default');
  const [data, setData] = React.useState(members);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const roles = [
    {
      id: 1,
      name: t('roles.viewer'),
      description: t('roles.descriptions.viewer')
    },
    {
      id: 2,
      name: t('roles.developer'),
      description: t('roles.descriptions.developer')
    },
    {
      id: 3,
      name: t('roles.billing'),
      description: t('roles.descriptions.billing')
    },
    {
      id: 4,
      name: t('roles.owner'),
      description: t('roles.descriptions.owner')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('cards.teamMembers.title')}</CardTitle>
        <CardDescription>{t('cards.teamMembers.description')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {data.map((member, key) => (
          <div key={key} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm leading-none font-medium">{member.name}</p>
                <p className="text-muted-foreground text-sm">{member.email}</p>
              </div>
            </div>
            <Popover
              open={openIndex === key}
              onOpenChange={(isOpen) => setOpenIndex(isOpen ? key : null)}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  {roles.find((role) => role.id === member.role_id)?.name}{" "}
                  <ChevronsDownIcon className="text-muted-foreground ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <Command>
                  <CommandInput placeholder={t('roles.selectPlaceholder')} />
                  <CommandList>
                    <CommandEmpty>{t('roles.noRolesFound')}</CommandEmpty>
                    <CommandGroup>
                      {roles.map((role, key) => (
                        <CommandItem
                          key={key}
                          onSelect={(currentValue) => {
                            setData((prevData) =>
                              prevData.map((m) =>
                                m.id === member.id ? { ...m, role_id: role.id } : m
                              )
                            );
                            setOpenIndex(null);
                          }}
                          className="teamaspace-y-1 flex items-start px-4 py-2">
                          <div>
                            <p>{role.name}</p>
                            <p className="text-muted-foreground text-sm">{role.description}</p>
                          </div>
                          {member.role_id === role.id ? (
                            <Check className="text-primary ml-auto flex size-4" />
                          ) : null}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


