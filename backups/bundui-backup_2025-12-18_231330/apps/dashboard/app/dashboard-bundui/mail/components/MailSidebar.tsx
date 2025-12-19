'use client'

import { Button, Badge, ScrollArea } from '@vibethink/ui'
import { 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  Star,
  Archive,
  Tag,
  Plus,
  Settings
} from 'lucide-react'
import { EmailFolder, EmailLabel } from '../types'
import { cn } from '@/lib/utils'

/**
 * Mail Sidebar Component
 * 
 * Sidebar navigation for mail folders and labels.
 * Implements VThink 1.0 patterns with HSL color variables.
 */

interface MailSidebarProps {
  folders: EmailFolder[]
  labels: EmailLabel[]
  currentFolder: string
  onFolderSelect: (folderId: string) => void
  onLabelSelect: (labelId: string) => void
  onCompose: () => void
}

const folderIcons = {
  inbox: Inbox,
  sent: Send,
  drafts: FileText,
  trash: Trash2,
  spam: Archive,
  custom: Tag
}

export function MailSidebar({
  folders,
  labels,
  currentFolder,
  onFolderSelect,
  onLabelSelect,
  onCompose
}: MailSidebarProps) {
  return (
    <div className="w-64 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4">
        {/* Compose button */}
        <Button onClick={onCompose} className="w-full justify-start mb-6">
          <Plus className="mr-2 h-4 w-4" />
          Compose
        </Button>

        <ScrollArea className="h-[calc(100vh-140px)]">
          {/* Folders section */}
          <div className="space-y-1">
            <div className="px-2 py-1.5">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Folders
              </h2>
            </div>
            
            {folders.map((folder) => {
              const Icon = folderIcons[folder.type] || Tag
              const isActive = currentFolder === folder.id
              
              return (
                <Button
                  key={folder.id}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    "w-full justify-between h-9 px-2",
                    isActive && "bg-secondary"
                  )}
                  onClick={() => onFolderSelect(folder.id)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{folder.name}</span>
                  </div>
                  
                  {folder.unread_count > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="h-5 text-xs px-1.5 min-w-[20px] justify-center"
                    >
                      {folder.unread_count > 99 ? '99+' : folder.unread_count}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>

          {/* Labels section */}
          {labels.length > 0 && (
            <div className="mt-6 space-y-1">
              <div className="px-2 py-1.5">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Labels
                </h2>
              </div>
              
              {labels.map((label) => (
                <Button
                  key={label.id}
                  variant="ghost"
                  className="w-full justify-start h-9 px-2"
                  onClick={() => onLabelSelect(label.id)}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="text-sm">{label.name}</span>
                  </div>
                </Button>
              ))}
              
              <Button
                variant="ghost"
                className="w-full justify-start h-9 px-2 text-muted-foreground"
              >
                <Plus className="mr-2 h-3 w-3" />
                <span className="text-sm">Create label</span>
              </Button>
            </div>
          )}

          {/* Quick actions */}
          <div className="mt-6 space-y-1">
            <div className="px-2 py-1.5">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </h2>
            </div>
            
            <Button
              variant="ghost"
              className="w-full justify-start h-9 px-2"
            >
              <Star className="mr-2 h-4 w-4" />
              <span className="text-sm">Starred</span>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start h-9 px-2"
            >
              <Archive className="mr-2 h-4 w-4" />
              <span className="text-sm">Archive</span>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start h-9 px-2"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span className="text-sm">Settings</span>
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
