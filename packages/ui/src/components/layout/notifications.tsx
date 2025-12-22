"use client";

import { BellIcon, ClockIcon } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../dropdown-menu';
import { ScrollArea } from '../scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { Button } from '../button';

export type Notification = {
  id: number;
  title: string;
  role: string;
  desc: string;
  avatar: string;
  status: string;
  unread_message: boolean;
  type: string;
  date: string;
};

export const defaultNotifications: Notification[] = [
  {
    id: 1,
    title: "Your order is placed",
    role: "Frontend Developer",
    desc: "Amet minim mollit non deser unt ullamco est sit aliqua.",
    avatar: "01.png",
    status: "online",
    unread_message: false,
    type: "text",
    date: "2 days ago"
  },
  {
    id: 2,
    title: "Congratulations Darlene  🎉",
    role: "UI/UX Designer",
    desc: "Won the monthly best seller badge",
    avatar: "02.png",
    status: "online",
    unread_message: true,
    type: "text",
    date: "11 am"
  },
  {
    id: 3,
    title: "Joaquina Weisenborn",
    role: "Town planner",
    desc: "Requesting access permission",
    avatar: "03.png",
    status: "busy",
    unread_message: true,
    type: "confirm",
    date: "12 pm"
  },
  {
    id: 4,
    title: "Brooklyn Simmons",
    role: "Data scientist",
    desc: "Added you to Top Secret Project group...",
    avatar: "04.png",
    status: "online",
    unread_message: true,
    type: "text",
    date: "1 pm"
  },
  {
    id: 5,
    title: "Margot Henschke",
    role: "Dietitian",
    desc: "Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing",
    avatar: "05.png",
    status: "busy",
    unread_message: false,
    type: "text",
    date: "3 pm"
  },
  {
    id: 6,
    title: "Sal Piggee",
    role: "Marketing executive",
    desc: "Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.",
    avatar: "06.png",
    status: "online",
    unread_message: false,
    type: "text",
    date: "4 pm"
  },
  {
    id: 7,
    title: "Miguel Guelff",
    role: "Special educational needs teacher",
    desc: "Biscuit powder oat cake donut brownie ice cream I love soufflé. I love tootsie roll I love powder tootsie roll.",
    avatar: "07.png",
    status: "online",
    unread_message: true,
    type: "text",
    date: "7 pm"
  },
  {
    id: 8,
    title: "Mauro Elenbaas",
    role: "Advertising copywriter",
    desc: "Bear claw ice cream lollipop gingerbread carrot cake. Brownie gummi bears chocolate muffin croissant jelly I love marzipan wafer.",
    avatar: "08.png",
    status: "away",
    unread_message: true,
    type: "text",
    date: "10 pm"
  },
  {
    id: 9,
    title: "Bridgett Omohundro",
    role: "Designer, television/film set",
    desc: "Gummies gummi bears I love candy icing apple pie I love marzipan bear claw. I love tart biscuit I love candy canes pudding chupa chups liquorice croissant.",
    avatar: "09.png",
    status: "offline",
    unread_message: false,
    type: "text",
    date: "10 pm"
  },
  {
    id: 10,
    title: "Zenia Jacobs",
    role: "Building surveyor",
    desc: "Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing",
    avatar: "10.png",
    status: "away",
    has_notification: false,
    type: "text",
    date: "10 am"
  }
];

interface NotificationsProps {
  notifications?: Notification[];
  isMobile?: boolean;
}

export function Notifications({ notifications = defaultNotifications, isMobile = false }: NotificationsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <>
            <BellIcon className="animate-tada" />
            <span className="bg-destructive absolute end-0 top-0 block size-2 shrink-0 rounded-full"></span>
          </>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={isMobile ? "center" : "end"} className="ms-4 w-80 p-0">
        <DropdownMenuLabel className="bg-background dark:bg-muted sticky top-0 z-10 p-0">
          <div className="flex justify-between border-b px-6 py-4">
            <div className="font-medium">Notifications</div>
            <Button variant="link" className="h-auto p-0 text-xs" size="sm" asChild>
              <Link href="#">View all</Link>
            </Button>
          </div>
        </DropdownMenuLabel>

        <ScrollArea className="h-[350px]">
          {notifications.map((item: Notification, key) => (
            <DropdownMenuItem
              key={key}
              className="group flex cursor-pointer items-start gap-9 rounded-none border-b px-4 py-3">
              <div className="flex flex-1 items-start gap-2">
                <div className="flex-none">
                  <Avatar className="size-8">
                    <AvatarImage src={`/assets/images/avatars/${item.avatar}`} />
                    <AvatarFallback> {item.title.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="dark:group-hover:text-default-800 truncate text-sm font-medium">
                    {item.title}
                  </div>
                  <div className="dark:group-hover:text-default-700 text-muted-foreground line-clamp-1 text-xs">
                    {item.desc}
                  </div>
                  {item.type === "confirm" && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        Accept
                      </Button>
                      <Button size="sm" variant="destructive">
                        Decline
                      </Button>
                    </div>
                  )}
                  <div className="dark:group-hover:text-default-500 text-muted-foreground flex items-center gap-1 text-xs">
                    <ClockIcon className="size-3!" />
                    {item.date}
                  </div>
                </div>
              </div>
              {item.unread_message && (
                <div className="flex-0">
                  <span className="bg-destructive/80 block size-2 rounded-full border" />
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}








