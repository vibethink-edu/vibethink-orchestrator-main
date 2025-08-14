/**
 * Chat Data Hook
 * VibeThink Orchestrator
 */

import { useState, useEffect } from 'react'
import { ChatItemProps, ChatMessageProps, UserPropsTypes } from '../types'
import { useChatStore } from './useChatStore'

// Mock data for demonstration
const mockUsers: UserPropsTypes[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    online_status: 'online',
    about: 'Product Manager at VibeThink',
    role: 'MANAGER',
    department: 'Product'
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    online_status: 'away',
    about: 'Senior Developer',
    role: 'EMPLOYEE',
    department: 'Engineering'
  },
  {
    id: '3',
    name: 'Emily Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    online_status: 'busy',
    about: 'UX Designer',
    role: 'EMPLOYEE',
    department: 'Design'
  },
  {
    id: '4',
    name: 'Team Updates',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Team',
    online_status: 'online',
    about: 'Official team channel',
    role: 'ADMIN',
    department: 'All'
  }
]

const mockMessages: Record<string, ChatMessageProps[]> = {
  '1': [
    {
      id: '1',
      content: 'Hey! How\'s the new dashboard coming along?',
      type: 'text',
      own_message: false,
      read: true,
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '2',
      content: 'It\'s going great! Just finished implementing the chat module.',
      type: 'text',
      own_message: true,
      read: true,
      timestamp: new Date(Date.now() - 3000000).toISOString()
    },
    {
      id: '3',
      content: 'That\'s awesome! Can you share a screenshot?',
      type: 'text',
      own_message: false,
      read: true,
      timestamp: new Date(Date.now() - 2400000).toISOString()
    }
  ],
  '2': [
    {
      id: '4',
      content: 'The API endpoints are ready for testing',
      type: 'text',
      own_message: false,
      read: false,
      timestamp: new Date(Date.now() - 7200000).toISOString()
    }
  ],
  '3': [
    {
      id: '5',
      content: 'I\'ve updated the design mockups',
      type: 'text',
      own_message: false,
      read: true,
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '6',
      content: 'Thanks! I\'ll review them today.',
      type: 'text',
      own_message: true,
      read: true,
      timestamp: new Date(Date.now() - 82800000).toISOString()
    }
  ],
  '4': [
    {
      id: '7',
      content: 'Welcome to the team updates channel! 🎉',
      type: 'text',
      own_message: false,
      read: true,
      timestamp: new Date(Date.now() - 172800000).toISOString()
    }
  ]
}

const mockChats: ChatItemProps[] = mockUsers.map(user => ({
  id: user.id,
  name: user.name,
  image: user.avatar,
  user_id: user.id,
  user: user,
  messages: mockMessages[user.id] || [],
  last_message: mockMessages[user.id]?.[mockMessages[user.id].length - 1]?.content || 'No messages yet',
  date: mockMessages[user.id]?.[mockMessages[user.id].length - 1]?.timestamp || new Date().toISOString(),
  status: 'read' as const,
  unread_count: user.id === '2' ? 1 : 0,
  is_pinned: user.id === '1',
  is_muted: false,
  is_archive: false
}))

export function useChatData() {
  const [chats, setChats] = useState<ChatItemProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { selectedChat, setSelectedChat } = useChatStore()

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true)
      // In production, this would be an API call with company_id filtering
      await new Promise(resolve => setTimeout(resolve, 500))
      setChats(mockChats)
      setIsLoading(false)
    }

    loadData()
  }, [])

  return {
    chats,
    selectedChat,
    setSelectedChat,
    isLoading
  }
}