"use client";

import Link from "next/link";
import { generateAvatarFallback } from "@/shared/lib/utils";
import { Dribbble, Facebook, FileText, Instagram, Linkedin, SheetIcon, X } from "@vibethink/ui/icons";
import useChatStore from "../useChatStore";
import { UserPropsTypes } from "../types";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  ScrollArea,
  ScrollBar,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@vibethink/ui";
import Image from "next/image";

import { useTranslation } from "@/lib/i18n";

export function UserDetailSheet({ user }: { user: UserPropsTypes }) {
  const { showProfileSheet, toggleProfileSheet } = useChatStore();
  const { t } = useTranslation("chat");

  return (
    <Sheet open={showProfileSheet} onOpenChange={toggleProfileSheet}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">{t("profile.title")}</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4">
          <div className="my-4 flex flex-col items-center justify-end">
            <Avatar className="mb-4 size-32">
              <AvatarImage src={user.avatar} alt="avatar image" />
              <AvatarFallback>{generateAvatarFallback(user.name)}</AvatarFallback>
            </Avatar>
            <h4 className="mb-2 text-xl font-semibold">{user.name}</h4>
            <div className="text-xs">
              {user.online_status == "success" ? (
                <span className="text-green-500">{t("header.status.online")}</span>
              ) : (
                <span className="text-muted-foreground">{t("header.status.lastSeen", { time: user.last_seen || "" })}</span>
              )}
            </div>
          </div>
          <div className="space-y-2 divide-y">
            {user.about ? (
              <div className="space-y-3 py-4">
                <h5 className="text-xs font-semibold uppercase">{t("profile.sections.about")}</h5>
                <div className="text-muted-foreground">{user.about}</div>
              </div>
            ) : null}
            {user.phone ? (
              <div className="space-y-3 py-4">
                <h5 className="text-xs font-semibold uppercase">{t("profile.sections.phone")}</h5>
                <div className="text-muted-foreground">{user.phone}</div>
              </div>
            ) : null}
            {user.country ? (
              <div className="space-y-3 py-4">
                <h5 className="text-xs font-semibold uppercase">{t("profile.sections.country")}</h5>
                <div className="text-muted-foreground">{user.country}</div>
              </div>
            ) : null}
            {user.medias?.length ? (
              <div className="space-y-3 py-4">
                <h5 className="text-xs font-semibold uppercase">{t("profile.sections.media")}</h5>
                <div>
                  <ScrollArea className="w-full">
                    <div className="flex gap-4 *:shrink-0">
                      {user.medias.map((item) => (
                        <>
                          {item.type === "image" ? (
                            <div>
                              <Image
                                width={40}
                                height={40}
                                className="size-20 rounded-lg"
                                src={`${item.path}`}
                                alt="shadcn/ui"
                                unoptimized
                              />
                            </div>
                          ) : null}
                          {item.type === "pdf" ? (
                            <div>
                              <Link
                                href={item.path ?? "#"}
                                className="flex aspect-square w-20 items-center justify-center rounded-lg bg-green-200">
                                <SheetIcon className="h-8 w-8 text-green-500" />
                              </Link>
                            </div>
                          ) : null}
                          {item.type === "file" ? (
                            <div>
                              <a
                                href="#"
                                className="flex aspect-square w-20 items-center justify-center rounded-lg bg-orange-200">
                                <FileText className="h-8 w-8 text-orange-500" />
                              </a>
                            </div>
                          ) : null}
                          {item.type === "excel" ? (
                            <div>
                              <a
                                href="#"
                                className="flex aspect-square w-20 items-center justify-center rounded-lg bg-orange-200">
                                <FileText className="h-8 w-8 text-orange-500" />
                              </a>
                            </div>
                          ) : null}
                        </>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </div>
            ) : null}
            {user.website ? (
              <div className="space-y-3 py-4">
                <h5 className="text-xs font-semibold uppercase">{t("profile.sections.website")}</h5>
                <div>
                  <a
                    href={user.website}
                    target="_blank"
                    className="text-muted-foreground hover:text-primary hover:underline">
                    {user.website}
                  </a>
                </div>
              </div>
            ) : null}
            {user.social_links?.length ? (
              <div className="space-y-3 py-4">
                <h5 className="text-xs font-semibold uppercase">{t("profile.sections.social")}</h5>
                <div className="flex flex-wrap items-center gap-2 *:shrink-0">
                  {user.social_links.map((item, key) => (
                    <Button
                      key={key}
                      variant="outline"
                      className="size-12 rounded-full"
                      size="icon"
                      asChild>
                      <Link
                        href="#"
                        target="_blank"
                        className="flex items-center justify-center rounded-full *:h-5 *:w-5">
                        {item.name === "Facebook" ? <Facebook /> : null}
                        {item.name === "X" ? <X /> : null}
                        {item.name === "Dribbble" ? <Dribbble /> : null}
                        {item.name === "Linkedin" ? <Linkedin /> : null}
                        {item.name === "Instagram" ? <Instagram /> : null}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
