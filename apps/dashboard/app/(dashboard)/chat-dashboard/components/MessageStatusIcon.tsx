/**
 * Message Status Icon Component
 * VibeThink Orchestrator
 */

import React from 'react'
import { Check, CheckCheck } from 'lucide-react'
import { cn } from '@/shared/utils'

interface MessageStatusIconProps {
  status?: 'sent' | 'delivered' | 'read'
  className?: string
}

export function MessageStatusIcon({ status, className }: MessageStatusIconProps) {
  if (!status) return null

  switch (status) {
    case 'sent':
      return <Check className={cn('h-3.5 w-3.5 text-muted-foreground', className)} />
    case 'delivered':
      return <CheckCheck className={cn('h-3.5 w-3.5 text-muted-foreground', className)} />
    case 'read':
      return <CheckCheck className={cn('h-3.5 w-3.5 text-blue-500', className)} />
    default:
      return null
  }
}
