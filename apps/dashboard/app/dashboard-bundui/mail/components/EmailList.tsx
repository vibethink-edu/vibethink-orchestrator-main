'use client'

import { useState } from 'react'
import { 
  Checkbox,
  Button,
  Badge,
  ScrollArea,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@vibethink/ui'
import { 
  Star, 
  Paperclip, 
  Reply, 
  Forward, 
  Archive,
  Trash2,
  MoreVertical
} from 'lucide-react'
import { Email } from '../types'
import { cn } from '@/lib/utils'
// Simple date formatting without external dependencies

/**
 * Email List Component
 * 
 * Displays list of emails with selection, actions, and proper formatting.
 * Implements VThink 1.0 patterns with HSL color variables.
 */

interface EmailListProps {
  emails: Email[]
  selectedEmails: string[]
  onEmailSelect: (emailId: string) => void
  onEmailToggle: (emailId: string) => void
  onSelectAll: (selected: boolean) => void
  onStar: (emailId: string) => void
  onReply: (email: Email) => void
  onForward: (email: Email) => void
  onArchive: (emailIds: string[]) => void
  onDelete: (emailIds: string[]) => void
  loading?: boolean
}

export function EmailList({
  emails,
  selectedEmails,
  onEmailSelect,
  onEmailToggle,
  onSelectAll,
  onStar,
  onReply,
  onForward,
  onArchive,
  onDelete,
  loading = false
}: EmailListProps) {
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null)

  const allSelected = selectedEmails.length === emails.length && emails.length > 0
  const someSelected = selectedEmails.length > 0 && selectedEmails.length < emails.length

  const formatDate = (date: string) => {
    try {
      const emailDate = new Date(date)
      const now = new Date()
      const diffMs = now.getTime() - emailDate.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        return diffMinutes < 1 ? 'Just now' : `${diffMinutes}m ago`
      } else if (diffHours < 24) {
        return `${diffHours}h ago`
      } else if (diffDays < 7) {
        return `${diffDays}d ago`
      } else {
        return emailDate.toLocaleDateString()
      }
    } catch {
      return 'Unknown'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'hsl(0 84% 60%)'
      case 'high':
        return 'hsl(25 95% 53%)'
      case 'low':
        return 'hsl(220 13% 69%)'
      default:
        return 'hsl(215 16% 47%)'
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading emails...</p>
        </div>
      </div>
    )
  }

  if (emails.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">No emails found</p>
          <p className="text-sm text-muted-foreground">
            Your inbox is empty or no emails match your current filters.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 border-r border-border">
      {/* List header */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/50">
        <Checkbox
          checked={allSelected}
          onCheckedChange={onSelectAll}
          aria-label="Select all emails"
          className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
          {...(someSelected && { 'data-state': 'indeterminate' })}
        />
        <span className="text-sm text-muted-foreground">
          {selectedEmails.length > 0 ? (
            `${selectedEmails.length} of ${emails.length} selected`
          ) : (
            `${emails.length} emails`
          )}
        </span>
      </div>

      {/* Email list */}
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="divide-y divide-border">
          {emails.map((email) => {
            const isSelected = selectedEmails.includes(email.id)
            const isHovered = hoveredEmail === email.id
            
            return (
              <div
                key={email.id}
                className={cn(
                  "group relative flex items-center gap-3 p-3 cursor-pointer transition-colors",
                  !email.read && "bg-muted/30",
                  isSelected && "bg-secondary/80",
                  isHovered && !isSelected && "bg-muted/50"
                )}
                onMouseEnter={() => setHoveredEmail(email.id)}
                onMouseLeave={() => setHoveredEmail(null)}
                onClick={() => onEmailSelect(email.id)}
              >
                {/* Selection checkbox */}
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onEmailToggle(email.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select email from ${email.from_name}`}
                />

                {/* Star button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    onStar(email.id)
                  }}
                >
                  <Star 
                    className={cn(
                      "h-4 w-4",
                      email.starred && "fill-yellow-400 text-yellow-400"
                    )} 
                  />
                </Button>

                {/* Priority indicator */}
                {email.priority !== 'normal' && (
                  <div 
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: getPriorityColor(email.priority) }}
                  />
                )}

                {/* Email content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn(
                        "font-medium truncate",
                        !email.read && "text-foreground",
                        email.read && "text-muted-foreground"
                      )}>
                        {email.from_name}
                      </span>
                      
                      {/* Labels */}
                      {email.labels.map((label) => (
                        <Badge 
                          key={label.id}
                          variant="outline"
                          className="h-5 text-xs px-1.5"
                          style={{ 
                            borderColor: label.color,
                            color: label.color 
                          }}
                        >
                          {label.name}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {email.attachments.length > 0 && (
                        <Paperclip className="h-3 w-3" />
                      )}
                      <span>{formatDate(email.created_at)}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className={cn(
                      "text-sm truncate",
                      !email.read && "font-medium text-foreground",
                      email.read && "text-muted-foreground"
                    )}>
                      {email.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {email.body}
                    </p>
                  </div>
                </div>

                {/* Action buttons (visible on hover) */}
                <div className={cn(
                  "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                  isSelected && "opacity-100"
                )}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      onReply(email)
                    }}
                  >
                    <Reply className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      onForward(email)
                    }}
                  >
                    <Forward className="h-3 w-3" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onArchive([email.id])}>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete([email.id])}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        Mark as unread
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Add label
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Move to folder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
