'use client'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { 
  Search, 
  Plus, 
  RefreshCw, 
  Settings, 
  Filter,
  Archive,
  Trash2,
  Star,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { EmailMetrics } from '../types'

/**
 * Mail Header Component
 * 
 * Header for the mail application with search, actions, and metrics.
 * Follows VThink 1.0 patterns and uses HSL color variables.
 */

interface MailHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCount: number
  metrics?: EmailMetrics
  onCompose: () => void
  onRefresh: () => void
  onArchive: () => void
  onDelete: () => void
  onStar: () => void
  loading?: boolean
}

export function MailHeader({
  searchQuery,
  onSearchChange,
  selectedCount,
  metrics,
  onCompose,
  onRefresh,
  onArchive,
  onDelete,
  onStar,
  loading = false
}: MailHeaderProps) {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4">
        {/* Left section - Title and metrics */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Mail</h1>
            {metrics && (
              <div className="flex items-center gap-4 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {metrics.unread_emails} unread
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {metrics.total_emails} total
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {((metrics.storage_used / metrics.storage_limit) * 100).toFixed(1)}% storage used
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Bulk actions (shown when emails are selected) */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-1 ml-2">
              <Badge variant="secondary" className="mr-2">
                {selectedCount} selected
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onStar}
                className="h-8 w-8 p-0"
              >
                <Star className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onArchive}
                className="h-8 w-8 p-0"
              >
                <Archive className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDelete}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Main actions */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <span>All mail</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Unread</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Starred</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Important</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Has attachments</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>From today</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>From this week</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Import/Export</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Keyboard shortcuts</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Help & Support</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Compose button */}
          <Button onClick={onCompose} className="ml-2">
            <Plus className="mr-2 h-4 w-4" />
            Compose
          </Button>
        </div>
      </div>
    </div>
  )
}