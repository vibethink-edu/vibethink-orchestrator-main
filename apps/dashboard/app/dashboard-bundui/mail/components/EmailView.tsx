'use client'

import {
  Button,
  Badge,
  ScrollArea,
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@vibethink/ui'
import {
  Reply,
  ReplyAll,
  Forward,
  Star,
  Archive,
  Trash2,
  Download,
  MoreVertical,
  Paperclip,
  ArrowLeft
} from "@vibethink/ui/icons"
import { Email } from '../types'
import { cn } from '@/shared/lib/utils'
// Simple date formatting without external dependencies

/**
 * Email View Component
 * 
 * Displays the selected email with full content, attachments, and actions.
 * Implements VThink 1.0 patterns with HSL color variables.
 */

interface EmailViewProps {
  email: Email | null
  onReply: (email: Email) => void
  onReplyAll: (email: Email) => void
  onForward: (email: Email) => void
  onStar: (emailId: string) => void
  onArchive: (emailIds: string[]) => void
  onDelete: (emailIds: string[]) => void
  onBack: () => void
}

import { useTranslation } from '@/lib/i18n'

export function EmailView({
  email,
  onReply,
  onReplyAll,
  onForward,
  onStar,
  onArchive,
  onDelete,
  onBack
}: EmailViewProps) {
  const { t } = useTranslation('mail')
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-muted-foreground">{t('view.noEmailSelected')}</p>
          <p className="text-sm text-muted-foreground">
            {t('view.selectToView')}
          </p>
        </div>
      </div>
    )
  }

  const formatDate = (date: string) => {
    try {
      const dateObj = new Date(date)
      return dateObj.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return t('view.unknownDate')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatAttachmentSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {/* Back button (mobile) */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            {/* Priority indicator */}
            {email.priority !== 'normal' && (
              <div
                className="w-1 h-6 rounded-full"
                style={{ backgroundColor: getPriorityColor(email.priority) }}
              />
            )}

            <h2 className="text-lg font-semibold truncate max-w-md">
              {email.subject}
            </h2>

            {/* Labels */}
            {email.labels.map((label) => (
              <Badge
                key={label.id}
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: label.color,
                  color: label.color
                }}
              >
                {label.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStar(email.id)}
            className="h-8 w-8 p-0"
          >
            <Star
              className={cn(
                "h-4 w-4",
                email.starred && "fill-yellow-400 text-yellow-400"
              )}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(email)}
            className="h-8 w-8 p-0"
          >
            <Reply className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReplyAll(email)}
            className="h-8 w-8 p-0"
          >
            <ReplyAll className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onForward(email)}
            className="h-8 w-8 p-0"
          >
            <Forward className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onArchive([email.id])}>
                <Archive className="mr-2 h-4 w-4" />
                {t('common.archive')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete([email.id])}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('common.delete')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {t('list.markAsUnread')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('list.addLabel')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('list.move')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('view.print')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Email content */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Email header */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials(email.from_name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{email.from_name}</h3>
                    <p className="text-sm text-muted-foreground">{email.from}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(email.created_at)}
                  </p>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    <span className="font-medium">{t('view.to')}</span> {email.to.join(', ')}
                  </div>
                  {email.cc && email.cc.length > 0 && (
                    <div>
                      <span className="font-medium">{t('view.cc')}</span> {email.cc.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {email.attachments.length > 0 && (
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Paperclip className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {email.attachments.length} {email.attachments.length > 1 ? t('view.attachments') : t('view.attachment')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {email.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-2 border border-border rounded bg-muted/30"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {attachment.filename}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatAttachmentSize(attachment.size)}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email body */}
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {email.html_body ? (
                <div dangerouslySetInnerHTML={{ __html: email.html_body }} />
              ) : (
                email.body
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Button onClick={() => onReply(email)}>
              <Reply className="mr-2 h-4 w-4" />
              {t('common.reply')}
            </Button>
            <Button variant="outline" onClick={() => onReplyAll(email)}>
              <ReplyAll className="mr-2 h-4 w-4" />
              {t('common.replyAll')}
            </Button>
            <Button variant="outline" onClick={() => onForward(email)}>
              <Forward className="mr-2 h-4 w-4" />
              {t('common.forward')}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
