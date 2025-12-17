'use client'

import { useState, useRef } from 'react'
import { Button } from '@vibethink/ui'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Badge } from '@/shared/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/shared/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { 
  Send, 
  Paperclip, 
  X, 
  Plus,
  Minimize2,
  Maximize2,
  Calendar,
  Smile,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  List
} from 'lucide-react'
import { ComposeEmailData, EmailPriority } from '../types'
import { cn } from '@/shared/lib/utils'

/**
 * Compose Email Component
 * 
 * Rich email composition dialog with formatting, attachments, and scheduling.
 * Implements VThink 1.0 patterns with HSL color variables.
 */

interface ComposeEmailProps {
  isOpen: boolean
  mode: 'compose' | 'reply' | 'forward'
  draft: ComposeEmailData
  onClose: () => void
  onSend: () => void
  onSaveDraft: () => void
  onSchedule: (date: Date) => void
  onUpdate: (updates: Partial<ComposeEmailData>) => void
  onAddRecipient: (email: string, field: 'to' | 'cc' | 'bcc') => void
  onRemoveRecipient: (email: string, field: 'to' | 'cc' | 'bcc') => void
  onAddAttachment: (file: File) => void
  onRemoveAttachment: (index: number) => void
  isSending?: boolean
}

export function ComposeEmail({
  isOpen,
  mode,
  draft,
  onClose,
  onSend,
  onSaveDraft,
  onSchedule,
  onUpdate,
  onAddRecipient,
  onRemoveRecipient,
  onAddAttachment,
  onRemoveAttachment,
  isSending = false
}: ComposeEmailProps) {
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [newRecipient, setNewRecipient] = useState({ to: '', cc: '', bcc: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddRecipient = (field: 'to' | 'cc' | 'bcc') => {
    const email = newRecipient[field].trim()
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onAddRecipient(email, field)
      setNewRecipient(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, field: 'to' | 'cc' | 'bcc') => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddRecipient(field)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => onAddAttachment(file))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getDialogTitle = () => {
    switch (mode) {
      case 'reply':
        return 'Reply'
      case 'forward':
        return 'Forward'
      default:
        return 'Compose Email'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-4xl h-[80vh] flex flex-col p-0",
          isMinimized && "h-16"
        )}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold">
            {getDialogTitle()}
          </DialogTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {!isMinimized && (
          <>
            {/* Recipients */}
            <div className="space-y-3 p-4 border-b border-border">
              {/* To field */}
              <div className="flex items-center gap-2">
                <Label className="w-12 text-sm font-medium">To:</Label>
                <div className="flex-1 flex flex-wrap items-center gap-1 min-h-[32px]">
                  {draft.to.map((email, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {email}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveRecipient(email, 'to')}
                        className="h-3 w-3 p-0"
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  ))}
                  <Input
                    placeholder="Add recipients..."
                    value={newRecipient.to}
                    onChange={(e) => setNewRecipient(prev => ({ ...prev, to: e.target.value }))}
                    onKeyDown={(e) => handleKeyPress(e, 'to')}
                    onBlur={() => handleAddRecipient('to')}
                    className="flex-1 border-none shadow-none focus-visible:ring-0 min-w-[200px]"
                  />
                </div>
                <div className="flex gap-1">
                  {!showCc && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCc(true)}
                      className="text-xs h-6 px-2"
                    >
                      Cc
                    </Button>
                  )}
                  {!showBcc && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBcc(true)}
                      className="text-xs h-6 px-2"
                    >
                      Bcc
                    </Button>
                  )}
                </div>
              </div>

              {/* CC field */}
              {showCc && (
                <div className="flex items-center gap-2">
                  <Label className="w-12 text-sm font-medium">Cc:</Label>
                  <div className="flex-1 flex flex-wrap items-center gap-1 min-h-[32px]">
                    {draft.cc?.map((email, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {email}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveRecipient(email, 'cc')}
                          className="h-3 w-3 p-0"
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                    <Input
                      placeholder="Add CC recipients..."
                      value={newRecipient.cc}
                      onChange={(e) => setNewRecipient(prev => ({ ...prev, cc: e.target.value }))}
                      onKeyDown={(e) => handleKeyPress(e, 'cc')}
                      onBlur={() => handleAddRecipient('cc')}
                      className="flex-1 border-none shadow-none focus-visible:ring-0 min-w-[200px]"
                    />
                  </div>
                </div>
              )}

              {/* BCC field */}
              {showBcc && (
                <div className="flex items-center gap-2">
                  <Label className="w-12 text-sm font-medium">Bcc:</Label>
                  <div className="flex-1 flex flex-wrap items-center gap-1 min-h-[32px]">
                    {draft.bcc?.map((email, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {email}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveRecipient(email, 'bcc')}
                          className="h-3 w-3 p-0"
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                    <Input
                      placeholder="Add BCC recipients..."
                      value={newRecipient.bcc}
                      onChange={(e) => setNewRecipient(prev => ({ ...prev, bcc: e.target.value }))}
                      onKeyDown={(e) => handleKeyPress(e, 'bcc')}
                      onBlur={() => handleAddRecipient('bcc')}
                      className="flex-1 border-none shadow-none focus-visible:ring-0 min-w-[200px]"
                    />
                  </div>
                </div>
              )}

              {/* Subject */}
              <div className="flex items-center gap-2">
                <Label className="w-12 text-sm font-medium">Subject:</Label>
                <Input
                  value={draft.subject}
                  onChange={(e) => onUpdate({ subject: e.target.value })}
                  placeholder="Email subject..."
                  className="flex-1"
                />
                <Select
                  value={draft.priority}
                  onValueChange={(value: EmailPriority) => onUpdate({ priority: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <List className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 p-0"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Attachments */}
            {draft.attachments.length > 0 && (
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {draft.attachments.length} attachment{draft.attachments.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {draft.attachments.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 border border-border rounded bg-muted/30"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveAttachment(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message body */}
            <div className="flex-1 p-4">
              <Textarea
                value={draft.body}
                onChange={(e) => onUpdate({ body: e.target.value })}
                placeholder="Write your message..."
                className="w-full h-full resize-none border-none shadow-none focus-visible:ring-0"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button
                  onClick={onSend}
                  disabled={isSending || !draft.to.length || !draft.subject.trim()}
                  className="min-w-[100px]"
                >
                  {isSending ? 'Sending...' : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={onSaveDraft}>
                  Save Draft
                </Button>
                
                <Button variant="ghost" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Auto-saved 2 minutes ago
              </div>
            </div>
          </>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  )
}
