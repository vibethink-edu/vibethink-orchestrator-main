"use client";

import React from "react";
import { ArrowLeft, Ellipsis } from "lucide-react";
import { Button } from "@vibethink/ui";
import { generateAvatarFallback } from "@/shared/lib/utils";
import useChatStore from "../useChatStore";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@vibethink/ui";
import { CallDialog } from "./call-dialog";
import { ChatUserDropdown } from "./chat-list-item-dropdown";
import { VideoCallDialog } from "./video-call-dialog";
import { Avatar, AvatarFallback, AvatarImage, AvatarIndicator } from "@vibethink/ui";
import { UserPropsTypes } from "../types";

import { useTranslation } from "@/lib/i18n";

export function ChatHeader({ user }: { user: UserPropsTypes }) {
  const { setSelectedChat } = useChatStore();
  const { t } = useTranslation("chat");

  return (
    <div className="flex justify-between gap-4 lg:px-4">
      <div className="flex gap-4">
        <Button
          size="sm"
          variant="outline"
          className="flex size-10 p-0 lg:hidden"
          onClick={() => setSelectedChat(null)}>
          <ArrowLeft />
        </Button>
        <Avatar className="overflow-visible lg:size-10">
          <AvatarImage src={`${user?.avatar}`} alt="avatar image" />
          <AvatarIndicator variant={user?.online_status} />
          <AvatarFallback>{generateAvatarFallback(user?.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold">{user.name}</span>
          {user.online_status == "success" ? (
            <span className="text-xs text-green-500">{t("header.status.online")}</span>
          ) : (
            <span className="text-muted-foreground text-xs">{user.last_seen}</span>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="hidden lg:flex lg:gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <VideoCallDialog />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">{t("header.actions.videoCall")}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <CallDialog />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">{t("header.actions.voiceCall")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ChatUserDropdown>
          <Button size="icon" variant="ghost">
            <Ellipsis />
          </Button>
        </ChatUserDropdown>
      </div>
    </div>
  );
}
