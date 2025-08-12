"use client";

import React from "react";
import { Check, ChevronsDownIcon, Download } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const roles = [
  {
    id: 1,
    name: "Viewer",
    description: "Can view and comment."
  },
  {
    id: 2,
    name: "Developer",
    description: "Can view, comment and edit."
  },
  {
    id: 3,
    name: "Billing",
    description: "Can view, comment and manage billing."
  },
  {
    id: 4,
    name: "Owner",
    description: "Admin-level access to all resources."
  }
];

const members = [
  {
    id: 1,
    name: "Toby Belhome",
    email: "contact@vibethink.io",
    avatar: `https://bundui-images.netlify.app/avatars/01.png`,
    role_id: 1
  },
  {
    id: 2,
    name: "Jackson Lee",
    email: "jackson@vibethink.io",
    avatar: `https://bundui-images.netlify.app/avatars/02.png`,
    role_id: 2
  },
  {
    id: 3,
    name: "Hally Gray",
    email: "hally@vibethink.io",
    avatar: `https://bundui-images.netlify.app/avatars/03.png`,
    role_id: 1
  }
];

function TeamMembersCard() {
  const [data, setData] = React.useState(members);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Invite your team members to collaborate.</CardDescription>
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
                  <CommandInput placeholder="Select new role..." />
                  <CommandList>
                    <CommandEmpty>No roles found.</CommandEmpty>
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

export default function BunduiTestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Bundui Test Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button onClick={() => toast.success("Bundui components working!")}>
              <Download />
              <span className="hidden lg:inline">Test Toast</span>
            </Button>
          </div>
        </div>
        
        <div className="gap-4 space-y-4 lg:grid lg:grid-cols-3 lg:space-y-0">
          <TeamMembersCard />
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Component migration status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Button, Card, Avatar - ✅ Working</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Popover, Command - ✅ Working</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Icons, Typography - ✅ Working</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}