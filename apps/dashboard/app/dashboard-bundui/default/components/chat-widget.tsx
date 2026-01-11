"use client";

import * as React from "react";
import { Check, Plus, Send } from "@vibethink/ui/icons";

import { cn } from "@vibethink/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@vibethink/ui";
import { Button } from "@vibethink/ui";
import { Card, CardContent, CardFooter, CardHeader } from "@vibethink/ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@vibethink/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@vibethink/ui";
import { Input } from "@vibethink/ui";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@vibethink/ui";
import { useTranslation } from "@/lib/i18n";

const users = [
  {
    name: "Olivia Martin",
    email: "m@example.com",
    avatar: `/assets/images/avatars/01.png`
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: `/assets/images/avatars/07.png`
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: `/assets/images/avatars/02.png`
  },
  {
    name: "Jackson Lee",
    email: "lee@example.com",
    avatar: `/assets/images/avatars/09.png`
  },
  {
    name: "William Kim",
    email: "will@email.com",
    avatar: `/assets/images/avatars/06.png`
  }
] as const;

type User = (typeof users)[number];

export function ChatWidget() {
  const { t } = useTranslation('default');
  const [open, setOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([]);

  const [messages, setMessages] = React.useState([
    {
      role: "agent",
      content: "Hi, how can I help you today?"
    },
    {
      role: "user",
      content: "Hey, I'm having trouble with my account."
    },
    {
      role: "agent",
      content: "What seems to be the problem?"
    },
    {
      role: "user",
      content: "I can't log in."
    }
  ]);
  const [input, setInput] = React.useState("");
  const inputLength = input.trim().length;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={`/assets/images/avatars/04.png`} />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm leading-none font-medium">Sofia Davis</p>
              <p className="text-muted-foreground text-sm">m@example.com</p>
            </div>
          </div>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="ml-auto rounded-full"
                  onClick={() => setOpen(true)}>
                  <Plus />
                  <span className="sr-only">{t('chat.newMessage')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={10}>{t('chat.newMessage')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                )}>
                {message.content}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (inputLength === 0) return;
              setMessages([
                ...messages,
                {
                  role: "user",
                  content: input
                }
              ]);
              setInput("");
            }}
            className="flex w-full items-center space-x-2">
            <Input
              id="message"
              placeholder={t('chat.typePlaceholder')}
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <Button type="submit" size="icon" disabled={inputLength === 0}>
              <Send className="h-4 w-4" />
              <span className="sr-only">{t('chat.send')}</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 p-0 outline-hidden">
          <DialogHeader className="px-4 pt-5 pb-4">
            <DialogTitle>{t('chat.dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('chat.dialog.description')}
            </DialogDescription>
          </DialogHeader>
          <Command className="overflow-hidden rounded-t-none border-t">
            <CommandInput placeholder={t('chat.dialog.searchPlaceholder')} />
            <CommandList>
              <CommandEmpty>{t('chat.dialog.noUsersFound')}</CommandEmpty>
              <CommandGroup className="p-2">
                {users.map((user) => (
                  <CommandItem
                    key={user.email}
                    className="flex items-center p-2"
                    onSelect={() => {
                      if (selectedUsers.includes(user)) {
                        return setSelectedUsers(
                          selectedUsers.filter((selectedUser) => selectedUser !== user)
                        );
                      }

                      return setSelectedUsers(
                        [...users].filter((u) => [...selectedUsers, user].includes(u))
                      );
                    }}>
                    <Avatar>
                      <AvatarImage src={user.avatar} alt="Image" />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <p className="text-sm leading-none font-medium">{user.name}</p>
                      <p className="text-muted-foreground text-sm">{user.email}</p>
                    </div>
                    {selectedUsers.includes(user) ? (
                      <Check className="text-primary ml-auto flex h-5 w-5" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
            {selectedUsers.length > 0 ? (
              <div className="flex -space-x-2 overflow-hidden">
                {selectedUsers.map((user) => (
                  <Avatar key={user.email} className="border-background inline-block border-2">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{t('chat.dialog.selectUsers')}</p>
            )}
            <Button
              disabled={selectedUsers.length < 2}
              onClick={() => {
                setOpen(false);
              }}>
              {t('chat.dialog.continue')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


