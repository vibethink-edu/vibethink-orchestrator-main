"use client";

import { Calendar, MapPin, TrendingUp, PencilIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@vibethink/ui/components/avatar";
import { Button } from "@vibethink/ui/components/button";
import { useProfileStore } from "../store";

export function ProfileHeader() {
  const user = useProfileStore((state) => state.user);

  return (
    <div className="relative">
      <div className="relative aspect-video w-full rounded-t-md bg-gradient-to-br from-blue-500 to-purple-600 bg-cover bg-center md:max-h-[240px]">
        <div className="absolute end-4 top-4">
          <Button size="icon" className="bg-background/50 rounded-full" variant="ghost">
            <PencilIcon />
          </Button>
        </div>
      </div>

      <div className="-mt-10 px-4 pb-4 text-center lg:-mt-14">
        <Avatar className="border-background mx-auto size-20 border-4 lg:size-28">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex items-center justify-center gap-2">
          <h4 className="text-lg font-semibold lg:text-2xl">{user.name}</h4>
        </div>

        <div className="text-muted-foreground mt-3 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            <span>{user.role}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span className="text-blue-500">{user.location}</span>
          </div>
          <div className="hidden items-center gap-1.5 lg:flex">
            <Calendar className="h-4 w-4" />
            <span>Joined {user.joinedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}














