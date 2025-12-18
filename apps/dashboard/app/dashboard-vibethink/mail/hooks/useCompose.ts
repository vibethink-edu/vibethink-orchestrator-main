'use client'

import { useState, useCallback } from 'react'
import { ComposeEmailData, Email, EmailPriority } from '../types'

/**
 * Email Composition Hook
 * 
 * Handles email composition, reply, forward, and send operations
 * with multi-tenant security.
 * 
 * VThink 1.0 Compliance:
 * - ✅ Multi-tenant security
 * - ✅ TypeScript strict mode
 * - ✅ Error handling
 */

// Mock user for now - in real implementation, get from auth context
const mockUser = {
  id: 'user_1',
  company_id: 'company_1',
  email: 'user@company.com'
}

export function useCompose() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'compose' | 'reply' | 'forward'>('compose')
  const [replyToEmail, setReplyToEmail] = useState<Email | undefined>()
  const [forwardEmail, setForwardEmail] = useState<Email | undefined>()
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [draft, setDraft] = useState<ComposeEmailData>({
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    body: '',
    html_body: '',
    priority: 'normal',
    attachments: []
  })

  // Reset compose state
  const resetCompose = useCallback(() => {
    setDraft({
      to: [],
      cc: [],
      bcc: [],
      subject: '',
      body: '',
      html_body: '',
      priority: 'normal',
      attachments: []
    })
    setReplyToEmail(undefined)
    setForwardEmail(undefined)
    setError(null)
  }, [])

  // Open compose window
  const openCompose = useCallback(() => {
    resetCompose()
    setMode('compose')
    setIsOpen(true)
  }, [resetCompose])

  // Open reply window
  const openReply = useCallback((email: Email, replyAll: boolean = false) => {
    resetCompose()
    setMode('reply')
    setReplyToEmail(email)
    
    const replyTo = [email.from]
    const replyCc = replyAll ? email.cc || [] : []
    
    setDraft({
      to: replyTo,
      cc: replyCc,
      bcc: [],
      subject: email.subject.startsWith('Re: ') ? email.subject : `Re: ${email.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${email.from_name} <${email.from}>\nSent: ${new Date(email.created_at).toLocaleString()}\nSubject: ${email.subject}\n\n${email.body}`,
      html_body: '',
      priority: 'normal',
      attachments: []
    })
    setIsOpen(true)
  }, [resetCompose])

  // Open forward window
  const openForward = useCallback((email: Email) => {
    resetCompose()
    setMode('forward')
    setForwardEmail(email)
    
    setDraft({
      to: [],
      cc: [],
      bcc: [],
      subject: email.subject.startsWith('Fwd: ') ? email.subject : `Fwd: ${email.subject}`,
      body: `\n\n--- Forwarded Message ---\nFrom: ${email.from_name} <${email.from}>\nSent: ${new Date(email.created_at).toLocaleString()}\nTo: ${email.to.join(', ')}\nSubject: ${email.subject}\n\n${email.body}`,
      html_body: '',
      priority: email.priority,
      attachments: []
    })
    setIsOpen(true)
  }, [resetCompose])

  // Close compose window
  const closeCompose = useCallback(() => {
    setIsOpen(false)
    setTimeout(resetCompose, 300) // Allow animation to complete
  }, [resetCompose])

  // Update draft
  const updateDraft = useCallback((updates: Partial<ComposeEmailData>) => {
    setDraft(prev => ({ ...prev, ...updates }))
  }, [])

  // Add recipient
  const addRecipient = useCallback((email: string, field: 'to' | 'cc' | 'bcc') => {
    if (!email.trim()) return
    
    setDraft(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), email.trim()]
    }))
  }, [])

  // Remove recipient
  const removeRecipient = useCallback((email: string, field: 'to' | 'cc' | 'bcc') => {
    setDraft(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter(e => e !== email)
    }))
  }, [])

  // Add attachment
  const addAttachment = useCallback((file: File) => {
    setDraft(prev => ({
      ...prev,
      attachments: [...prev.attachments, file]
    }))
  }, [])

  // Remove attachment
  const removeAttachment = useCallback((index: number) => {
    setDraft(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }, [])

  // Send email
  const sendEmail = useCallback(async () => {
    try {
      setIsSending(true)
      setError(null)

      // Validate required fields
      if (draft.to.length === 0) {
        throw new Error('At least one recipient is required')
      }
      if (!draft.subject.trim()) {
        throw new Error('Subject is required')
      }
      if (!draft.body.trim()) {
        throw new Error('Message body is required')
      }

      // Prepare email data with multi-tenant security
      const emailData = {
        ...draft,
        from: mockUser.email,
        from_name: 'Current User', // Get from user profile
        message_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        company_id: mockUser.company_id, // ✅ CRITICAL: Multi-tenant security
        user_id: mockUser.id,
        created_at: new Date().toISOString(),
        sent_at: new Date().toISOString()
      }

      // Mock API call - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Sending email:', emailData)

      // Mark original email as replied/forwarded if applicable
      if (replyToEmail) {
        // Mark as replied
        console.log('Marking email as replied:', replyToEmail.id)
      }
      if (forwardEmail) {
        // Mark as forwarded
        console.log('Marking email as forwarded:', forwardEmail.id)
      }

      // Close compose window
      closeCompose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email')
    } finally {
      setIsSending(false)
    }
  }, [draft, replyToEmail, forwardEmail, closeCompose])

  // Save as draft
  const saveDraft = useCallback(async () => {
    try {
      const draftData = {
        ...draft,
        from: mockUser.email,
        folder: 'drafts',
        company_id: mockUser.company_id, // ✅ CRITICAL: Multi-tenant security
        user_id: mockUser.id,
        created_at: new Date().toISOString()
      }

      // Mock API call - replace with real implementation
      console.log('Saving draft:', draftData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft')
    }
  }, [draft])

  // Schedule email
  const scheduleEmail = useCallback(async (scheduleDate: Date) => {
    try {
      setIsSending(true)
      setError(null)

      const emailData = {
        ...draft,
        schedule_send: scheduleDate.toISOString(),
        company_id: mockUser.company_id, // ✅ CRITICAL: Multi-tenant security
        user_id: mockUser.id
      }

      // Mock API call - replace with real implementation
      console.log('Scheduling email:', emailData)
      
      closeCompose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule email')
    } finally {
      setIsSending(false)
    }
  }, [draft, closeCompose])

  return {
    // State
    isOpen,
    mode,
    replyToEmail,
    forwardEmail,
    draft,
    isSending,
    error,

    // Actions
    openCompose,
    openReply,
    openForward,
    closeCompose,
    updateDraft,
    addRecipient,
    removeRecipient,
    addAttachment,
    removeAttachment,
    sendEmail,
    saveDraft,
    scheduleEmail,
    resetCompose
  }
}