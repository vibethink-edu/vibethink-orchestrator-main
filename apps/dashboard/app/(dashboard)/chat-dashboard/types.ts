/**
 * Chat Dashboard Types
 * VibeThink Orchestrator
 */

export type ChatItemProps = {
  id: string
  name?: string
  image?: string
  date?: string
  status?: 'sent' | 'delivered' | 'read'
  is_archive?: boolean
  is_pinned?: boolean
  is_muted?: boolean
  last_message?: string
  unread_count?: number
  messages?: ChatMessageProps[]
  user_id: string
  user?: UserPropsTypes
  company_id?: string // Multi-tenant support
}

export type ChatMessageProps = {
  id: string
  content?: string
  type?: 'text' | 'image' | 'file' | 'audio' | 'video'
  own_message?: boolean
  read?: boolean
  timestamp?: string
  edited?: boolean
  deleted?: boolean
  data?: ChatMessageDataProps
  reactions?: ReactionProps[]
  reply_to?: string
}

export type ChatMessageDataProps = {
  file_name?: string
  cover?: string
  path?: string
  duration?: string
  size?: string
  images?: string[]
  mime_type?: string
}

export type UserPropsTypes = {
  id: string
  name: string
  avatar?: string
  about?: string
  phone?: string
  country?: string
  email?: string
  gender?: string
  website?: string
  online_status?: 'online' | 'away' | 'busy' | 'offline'
  last_seen?: string
  role?: string
  department?: string
  company_id?: string // Multi-tenant support
  social_links?: {
    name?: string
    url?: string
  }[]
  medias?: {
    type?: string
    path?: string
  }[]
}

export type ReactionProps = {
  emoji: string
  users: string[]
}

export type MediaListItemType = {
  type: string
  path?: string
  name?: string
}

export type MessageStatusIconType = {
  status?: 'sent' | 'delivered' | 'read'
}

export type ChatFilters = {
  search?: string
  status?: 'all' | 'unread' | 'archived' | 'pinned'
  type?: 'all' | 'personal' | 'group' | 'broadcast'
  dateRange?: {
    from: Date
    to: Date
  }
}