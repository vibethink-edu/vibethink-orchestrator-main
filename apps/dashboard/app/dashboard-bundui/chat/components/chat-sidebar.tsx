"use client";

import React from "react";
import { Search } from "@vibethink/ui/icons";
import useChatStore from "../useChatStore";
import { ChatItemProps } from "../types";

import {
  Input,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@vibethink/ui";
import { ChatListItem } from "./chat-list-item";
import { ActionDropdown } from "./action-dropdown";

import { useTranslation } from "@/lib/i18n";

export function ChatSidebar({ chats }: { chats: ChatItemProps[] }) {
  const { t } = useTranslation("chat");
  const { selectedChat, setSelectedChat } = useChatStore();
  const [filteredChats, setFilteredChats] = React.useState(chats);

  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.trim();

    const filteredItems = chats.filter((chat) =>
      chat.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChats(filteredItems);
  };

  return (
    <Card className="flex w-full flex-col pb-0 lg:w-96 lg:h-full">
      <CardHeader>
        <CardTitle className="font-display text-xl lg:text-2xl">{t("sidebar.title")}</CardTitle>
        <CardAction>
          <ActionDropdown />
        </CardAction>
        <CardDescription className="relative col-span-2 mt-4 flex w-full items-center">
          <Search className="text-muted-foreground absolute start-4 size-4" />
          <Input
            type="text"
            className="ps-10"
            placeholder={t("sidebar.searchPlaceholder")}
            onChange={changeHandle}
          />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-0">
        <div className="block min-w-0 divide-y">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat, key) => (
              <ChatListItem
                chat={chat}
                key={key}
                active={selectedChat && selectedChat.id === chat.id}
              />
            ))
          ) : (
            <div className="text-muted-foreground mt-4 text-center text-sm">{t("sidebar.noResults")}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
