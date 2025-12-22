'use client'

import {
  Button,
  Input,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@vibethink/ui'
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

import { useTranslation } from '@/lib/i18n'

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
  const { t } = useTranslation('mail')
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4">
        {/* Left section - Title and metrics */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t('common.mail')}</h1>
            {metrics && (
              <div className="flex items-center gap-4 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {metrics.unread_emails} {t('header.unread')}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {metrics.total_emails} {t('header.total')}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {((metrics.storage_used / metrics.storage_limit) * 100).toFixed(1)}% {t('header.storageUsed')}
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
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Bulk actions (shown when emails are selected) */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-1 ml-2">
              <Badge variant="secondary" className="mr-2">
                {selectedCount} {t('header.selected')}
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
                <span>{t('header.allMail')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>{t('common.unread')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>{t('common.starred')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>{t('header.important')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>{t('header.hasAttachments')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>{t('header.fromToday')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>{t('header.fromThisWeek')}</span>
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
                <span>{t('common.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>{t('header.importExport')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>{t('header.shortcuts')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>{t('header.help')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Compose button */}
          <Button onClick={onCompose} className="ml-2">
            <Plus className="mr-2 h-4 w-4" />
            {t('common.compose')}
          </Button>
        </div>
      </div>
    </div>
  )
}
