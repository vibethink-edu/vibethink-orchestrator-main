/**
 * Mail Application Types
 * 
 * TypeScript definitions for the mail system with multi-tenant security
 * and comprehensive email management features.
 * 
 * VThink 1.0 Compliance:
 * - ✅ Multi-tenant security with company_id
 * - ✅ Strict TypeScript typing
 * - ✅ Professional email management
 */

export interface Email {
  id: string
  from: string
  from_name: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  body: string
  html_body?: string
  thread_id?: string
  in_reply_to?: string
  message_id: string
  folder: EmailFolder
  labels: EmailLabel[]
  priority: EmailPriority
  read: boolean
  starred: boolean
  attachments: EmailAttachment[]
  created_at: string
  sent_at?: string
  company_id: string // ✅ CRITICAL: Multi-tenant security
  user_id: string
}

export interface EmailThread {
  id: string
  subject: string
  participants: string[]
  message_count: number
  last_message_at: string
  emails: Email[]
  company_id: string // ✅ CRITICAL: Multi-tenant security
}

export interface EmailFolder {
  id: string
  name: string
  type: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | 'custom'
  unread_count: number
  total_count: number
  color?: string
  company_id: string // ✅ CRITICAL: Multi-tenant security
}

export interface EmailLabel {
  id: string
  name: string
  color: string
  company_id: string // ✅ CRITICAL: Multi-tenant security
}

export interface EmailAttachment {
  id: string
  filename: string
  content_type: string
  size: number
  url: string
  email_id: string
  company_id: string // ✅ CRITICAL: Multi-tenant security
}

export interface EmailSignature {
  id: string
  name: string
  content: string
  html_content?: string
  is_default: boolean
  user_id: string
  company_id: string // ✅ CRITICAL: Multi-tenant security
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  html_content?: string
  category: string
  user_id: string
  company_id: string // ✅ CRITICAL: Multi-tenant security
}

export interface EmailRule {
  id: string
  name: string
  conditions: EmailRuleCondition[]
  actions: EmailRuleAction[]
  enabled: boolean
  user_id: string
  company_id: string // ✅ CRITICAL: Multi-tenant security
}

export interface EmailRuleCondition {
  field: 'from' | 'subject' | 'body' | 'to' | 'cc'
  operator: 'contains' | 'equals' | 'starts_with' | 'ends_with'
  value: string
}

export interface EmailRuleAction {
  type: 'move_to_folder' | 'add_label' | 'mark_as_read' | 'star' | 'delete'
  value?: string
}

export interface EmailAccount {
  id: string
  email: string
  name: string
  provider: 'smtp' | 'gmail' | 'outlook' | 'imap'
  smtp_host?: string
  smtp_port?: number
  smtp_username?: string
  smtp_password?: string // Encrypted
  imap_host?: string
  imap_port?: number
  is_default: boolean
  enabled: boolean
  user_id: string
  company_id: string // ✅ CRITICAL: Multi-tenant security
}

export interface EmailContact {
  id: string
  email: string
  name?: string
  avatar?: string
  last_contacted: string
  frequency: number
  company_id: string // ✅ CRITICAL: Multi-tenant security
}

export type EmailPriority = 'low' | 'normal' | 'high' | 'urgent'

export type EmailStatus = 'draft' | 'sending' | 'sent' | 'failed' | 'scheduled'

export interface ComposeEmailData {
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  body: string
  html_body?: string
  priority: EmailPriority
  schedule_send?: string
  signature_id?: string
  template_id?: string
  attachments: File[]
}

export interface EmailFilters {
  folder?: string
  labels?: string[]
  unread?: boolean
  starred?: boolean
  has_attachments?: boolean
  from?: string
  to?: string
  subject?: string
  date_from?: string
  date_to?: string
  priority?: EmailPriority
  search?: string
}

export interface EmailMetrics {
  total_emails: number
  unread_emails: number
  sent_emails: number
  draft_emails: number
  storage_used: number
  storage_limit: number
  emails_today: number
  emails_this_week: number
  emails_this_month: number
  response_rate: number
  average_response_time: number // in hours
}

export interface MailState {
  emails: Email[]
  threads: EmailThread[]
  folders: EmailFolder[]
  labels: EmailLabel[]
  currentFolder: string
  selectedEmails: string[]
  searchQuery: string
  filters: EmailFilters
  loading: boolean
  error: string | null
}

// Email composition state
export interface ComposeState {
  isOpen: boolean
  mode: 'compose' | 'reply' | 'forward'
  replyToEmail?: Email
  forwardEmail?: Email
  draft: ComposeEmailData
  isSending: boolean
  isScheduled: boolean
}

// Email view state
export interface EmailViewState {
  currentEmail?: Email
  currentThread?: EmailThread
  showThread: boolean
  showDetails: boolean
}