/**
 * Chat Store Hook
 * VibeThink Orchestrator
 */

import { create } from 'zustand'
import { ChatItemProps } from '../types'

interface ChatStore {
  selectedChat: ChatItemProps | null
  setSelectedChat: (chat: ChatItemProps | null) => void
  unreadCount: number
  setUnreadCount: (count: number) => void
  isTyping: boolean
  setIsTyping: (typing: boolean) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  isTyping: false,
  setIsTyping: (typing) => set({ isTyping: typing })
}))