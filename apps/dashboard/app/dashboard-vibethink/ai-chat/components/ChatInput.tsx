'use client'

// =============================================================================
// CHAT INPUT COMPONENT
// =============================================================================
// 
// Input principal para enviar mensajes al chat
// Incluye soporte para archivos, shortcuts de teclado y auto-resize
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security
// - ✅ Responsive design
// - ✅ DOI Principle (Bundui Visual + Shadcn Technical)
// - ✅ Accessibility ready
// =============================================================================

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@vibethink/ui'
import { Textarea } from '@vibethink/ui'
import { Badge } from '@vibethink/ui'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@vibethink/ui'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@vibethink/ui'
import { 
  Send, 
  Paperclip, 
  Mic, 
  Smile,
  MoreHorizontal,
  X,
  FileText,
  Image,
  Loader2,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatInputProps } from '../types'

/**
 * Input de chat con features avanzadas
 * Soporte para texto, archivos, shortcuts y auto-resize
 */
export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message... (Press Enter to send, Shift+Enter for new line)",
  maxLength = 4000,
  allowAttachments = true
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 60), 120)
      textarea.style.height = `${newHeight}px`
    }
  }, [])

  // Adjust height when message changes
  useEffect(() => {
    adjustTextareaHeight()
  }, [message, adjustTextareaHeight])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() && attachments.length === 0) return
    if (disabled) return

    try {
      setIsUploading(true)
      await onSendMessage(message.trim(), attachments)
      setMessage('')
      setAttachments([])
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsUploading(false)
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
    
    // Ctrl/Cmd + Enter also sends
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  // Handle file processing
  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      // Max 10MB per file
      if (file.size > 10 * 1024 * 1024) {
        console.warn(`File ${file.name} is too large (max 10MB)`)
        return false
      }
      return true
    })

    setAttachments(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 files
  }

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (allowAttachments) {
      const files = Array.from(e.dataTransfer.files)
      handleFiles(files)
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get file icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />
    }
    return <FileText className="w-4 h-4" />
  }

  const canSend = (message.trim() || attachments.length > 0) && !disabled && !isUploading
  const characterCount = message.length

  return (
    <div className="border-t bg-background">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="p-3 border-b bg-muted/20">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-background border rounded-lg px-3 py-2 text-sm"
              >
                {getFileIcon(file)}
                <span className="truncate max-w-32">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div 
        className={cn(
          "p-4 relative",
          dragActive && allowAttachments && "bg-primary/5 border-primary/20"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          {/* Message Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              className={cn(
                "min-h-[60px] max-h-[120px] resize-none pr-16",
                "focus:ring-2 focus:ring-primary/20 border-border",
                dragActive && allowAttachments && "border-primary/50"
              )}
              style={{ 
                height: '60px',
                scrollbarWidth: 'thin'
              }}
            />
            
            {/* Input Actions */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1">
              {/* File Upload */}
              {allowAttachments && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt,.md"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={disabled}
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Attach files</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}

              {/* More Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0"
                    disabled={disabled}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2">
                    <Mic className="w-4 h-4" />
                    Voice input
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Smile className="w-4 h-4" />
                    Add emoji
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <Zap className="w-4 h-4" />
                    Quick prompts
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Send Button */}
          <Button 
            type="submit"
            disabled={!canSend}
            className="h-[60px] px-6 gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>

        {/* Footer Info */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send, 
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs ml-1">Shift+Enter</kbd> for new line
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {attachments.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {attachments.length} file{attachments.length !== 1 ? 's' : ''}
              </Badge>
            )}
            
            <span className={cn(
              characterCount > maxLength * 0.9 && "text-warning",
              characterCount >= maxLength && "text-destructive"
            )}>
              {characterCount}/{maxLength}
            </span>
          </div>
        </div>

        {/* Drag Overlay */}
        {dragActive && allowAttachments && (
          <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Paperclip className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-primary">Drop files here to attach</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
