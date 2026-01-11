"use client"

import { SidebarTrigger } from '@vibethink/ui'
import { Button } from '@vibethink/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@vibethink/ui'
import { Bell, Search } from "@vibethink/ui/icons"

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      
      <div className="flex flex-1 items-center gap-2 px-4">
        <div className="flex-1">
          {/* Breadcrumb or title can go here */}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/user.png" />
            <AvatarFallback>VT</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
