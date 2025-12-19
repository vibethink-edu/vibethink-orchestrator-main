/**
 * useFileManagerData Hook
 * File Manager Dashboard - VibeThink Orchestrator
 * 
 * Data fetching hook with multi-tenant security and company_id filtering
 * Following VThink 1.0 methodology with proper error handling and caching
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { 
  FileItem, 
  FolderItem, 
  StorageMetrics, 
  FileTransferMetrics, 
  RecentFileActivity,
  UseFileManagerData 
} from '../types'

// Mock auth hook - in real app this would come from your auth system
const useAuth = () => ({
  user: {
    id: 'user_1',
    company_id: 'comp1', // CRITICAL: Multi-tenant security
    email: 'user@company.com',
    role: 'manager'
  }
})

// Mock Supabase client - in real app this would be your actual Supabase client
const supabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: any) => ({
          // Mock query response
          then: (callback: (result: any) => void) => {
            // Simulate API call delay
            setTimeout(() => {
              callback({ data: getMockData(table), error: null })
            }, 500)
            return Promise.resolve({ data: getMockData(table), error: null })
          }
        })
      })
    })
  }),
  auth: {
    getUser: () => Promise.resolve({ 
      data: { user: { id: 'user_1', email: 'user@company.com' } }, 
      error: null 
    })
  },
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File, options?: any) => Promise.resolve({ 
        data: { path }, 
        error: null 
      }),
      download: (path: string) => Promise.resolve({ 
        data: new Blob(['mock file content']), 
        error: null 
      }),
      remove: (paths: string[]) => Promise.resolve({ error: null }),
      getPublicUrl: (path: string) => ({ 
        data: { publicUrl: `https://mock-storage.com/${path}` } 
      })
    })
  }
}

export function useFileManagerData(): UseFileManagerData {
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [storageMetrics, setStorageMetrics] = useState<StorageMetrics | null>(null)
  const [transferMetrics, setTransferMetrics] = useState<FileTransferMetrics | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentFileActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  // Fetch files with company_id filtering - CRITICAL SECURITY
  const fetchFiles = useCallback(async (company_id: string) => {
    // TODO: Activar cuando tengamos Supabase configurado
    /*
    const { data, error } = await supabase
      .from('files')
      .select(`
        id,
        name,
        type,
        size,
        modified_at,
        created_at,
        company_id,
        user_id,
        parent_id,
        path,
        mime_type,
        is_shared,
        is_favorite,
        is_archived,
        tags,
        version,
        download_count,
        thumbnail_url
      `)
      .match({ 
        company_id: company_id,  // CRITICAL: Always filter by company_id
        is_archived: false 
      })
      .order('modified_at', { ascending: false })
      .limit(100)

    if (error) {
      throw new Error(`Failed to fetch files: ${error.message}`)
    }
    */
    
    // MOCK DATA para desarrollo
    const data = null
    const error = null

    // Transform and add permissions data
    const filesWithPermissions = await Promise.all(
      (data || mockFiles).map(async (file) => {
        // TODO: Activar cuando tengamos Supabase configurado
        /*
        const { data: permissions } = await supabase
          .from('file_permissions')
          .select('*')
          .eq('file_id', file.id)
          .eq('company_id', company_id)  // CRITICAL: Filter permissions by company_id
        */

        return {
          ...file,
          permissions: [] // Mock: sin permisos por ahora
        }
      })
    )

    return filesWithPermissions
  }, [])

  // Fetch folders with company_id filtering - CRITICAL SECURITY
  const fetchFolders = useCallback(async (company_id: string) => {
    // TODO: Activar cuando tengamos Supabase configurado
    /*
    const { data, error } = await supabase
      .from('folders')
      .select(`
        id,
        name,
        description,
        color,
        icon,
        file_count,
        total_size,
        modified_at,
        created_at,
        company_id,
        user_id,
        parent_id,
        path,
        is_shared
      `)
      .eq('company_id', company_id)  // CRITICAL: Always filter by company_id
      .order('name', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch folders: ${error.message}`)
    }
    */
    
    // MOCK DATA para desarrollo
    const data = mockFolders
    const error = null

    // Add permissions data
    const foldersWithPermissions = await Promise.all(
      (data || []).map(async (folder) => {
        // TODO: Activar cuando tengamos Supabase configurado
        /*
        const { data: permissions } = await supabase
          .from('file_permissions')
          .select('*')
          .eq('file_id', folder.id)
          .eq('company_id', company_id)  // CRITICAL: Filter permissions by company_id
        */

        return {
          ...folder,
          permissions: [] // Mock: sin permisos por ahora
        }
      })
    )

    return foldersWithPermissions
  }, [])

  // Fetch storage metrics with company_id filtering - CRITICAL SECURITY
  const fetchStorageMetrics = useCallback(async (company_id: string) => {
    // TODO: Activar cuando tengamos Supabase configurado
    /*
    // Get basic storage stats
    const { data: storageData, error: storageError } = await supabase
      .from('storage_metrics')
      .select('*')
      .eq('company_id', company_id)  // CRITICAL: Always filter by company_id
      .single()

    if (storageError) {
      // If no metrics record exists, calculate from files
      const { data: fileStats } = await supabase
        .from('files')
        .select('size, mime_type')
        .match({
          company_id: company_id,  // CRITICAL: Always filter by company_id
          is_archived: false
        })

      const { data: folderStats } = await supabase
        .from('folders')
        .select('id')
        .eq('company_id', company_id)  // CRITICAL: Always filter by company_id

      const totalSize = fileStats?.reduce((sum, file) => sum + file.size, 0) || 0
      const fileCount = fileStats?.length || 0
      const folderCount = folderStats?.length || 0
    */
    
    // MOCK DATA para desarrollo
    const storageData = null
    const storageError = true
    const fileStats = mockFiles
    const folderStats = mockFolders
    
    const totalSize = fileStats?.reduce((sum, file) => sum + file.size, 0) || 0
    const fileCount = fileStats?.length || 0
    const folderCount = folderStats?.length || 0

      // Create storage breakdown by type
      const storageByType = fileStats?.reduce((acc: any[], file) => {
        const type = file.mime_type?.split('/')[0] || 'other'
        const existing = acc.find(item => item.type === type)
        
        if (existing) {
          existing.size += file.size
          existing.count += 1
        } else {
          acc.push({
            type,
            size: file.size,
            count: 1,
            percentage: 0,
            color: getTypeColor(type)
          })
        }
        return acc
      }, []) || []

      // Calculate percentages
      storageByType.forEach(item => {
        item.percentage = totalSize > 0 ? (item.size / totalSize) * 100 : 0
      })

      // Return mock storage data
      return {
        total_storage: 10 * 1024 * 1024 * 1024, // 10GB default
        used_storage: totalSize,
        available_storage: (10 * 1024 * 1024 * 1024) - totalSize,
        file_count: fileCount,
        folder_count: folderCount,
        recent_uploads: 0,
        shared_files: fileStats?.filter(f => f.mime_type?.includes('shared')).length || 0,
        storage_by_type: storageByType,
        growth_trend: [],
        company_id
      }
  }, [])

  // Fetch transfer metrics with company_id filtering - CRITICAL SECURITY
  const fetchTransferMetrics = useCallback(async (company_id: string) => {
    // TODO: Activar cuando tengamos Supabase configurado
    /*
    const { data, error } = await supabase
      .from('transfer_metrics')
      .select('*')
      .eq('company_id', company_id)  // CRITICAL: Always filter by company_id
      .single()

    if (error) {
      // Generate mock data if no metrics exist
      const mockData: FileTransferMetrics = {
        uploads_today: 12,
        downloads_today: 28,
        upload_trend: generateTrendData('upload'),
        download_trend: generateTrendData('download'),
        peak_hours: generatePeakHours(),
        transfer_speed: 2.5 * 1024 * 1024, // 2.5 MB/s
        success_rate: 98.5,
        company_id
      }
      return mockData
    }

    return data
    */
    
    // MOCK DATA para desarrollo
    const mockData: FileTransferMetrics = {
      uploads_today: 12,
      downloads_today: 28,
      upload_trend: generateTrendData('upload'),
      download_trend: generateTrendData('download'),
      peak_hours: generatePeakHours(),
      transfer_speed: 2.5 * 1024 * 1024, // 2.5 MB/s
      success_rate: 98.5,
      company_id
    }
    return mockData
  }, [])

  // Fetch recent activity with company_id filtering - CRITICAL SECURITY
  const fetchRecentActivity = useCallback(async (company_id: string) => {
    // TODO: Activar cuando tengamos Supabase configurado
    /*
    const { data, error } = await supabase
      .from('file_activity')
      .select(`
        id,
        file_id,
        file_name,
        action,
        user_id,
        user_name,
        timestamp,
        details,
        company_id
      `)
      .eq('company_id', company_id)  // CRITICAL: Always filter by company_id
      .order('timestamp', { ascending: false })
      .limit(50)

    if (error) {
      throw new Error(`Failed to fetch activity: ${error.message}`)
    }

    return data || []
    */
    
    // MOCK DATA para desarrollo
    return mockActivity || []
  }, [])

  // Main data refresh function
  const refreshData = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User not authenticated or missing company_id')
      }

      setLoading(true)
      setError(null)

      const company_id = user.company_id

      // Fetch all data in parallel with company_id filtering
      const [
        filesData,
        foldersData,
        storageData,
        transferData,
        activityData
      ] = await Promise.all([
        fetchFiles(company_id),
        fetchFolders(company_id),
        fetchStorageMetrics(company_id),
        fetchTransferMetrics(company_id),
        fetchRecentActivity(company_id)
      ])

      setFiles(filesData)
      setFolders(foldersData)
      setStorageMetrics(storageData)
      setTransferMetrics(transferData)
      setRecentActivity(activityData)
    } catch (err) {
      console.error('Failed to fetch file manager data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [user?.company_id]) // Only depend on company_id

  // Load data on mount when company_id is available
  useEffect(() => {
    if (user?.company_id) {
      refreshData()
    }
  }, [refreshData, user?.company_id])

  return {
    files,
    folders,
    storageMetrics,
    transferMetrics,
    recentActivity,
    loading,
    error,
    refreshData
  }
}

// Helper functions
function getTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'image': return 'hsl(142 76% 36%)'
    case 'video': return 'hsl(221 83% 53%)'
    case 'audio': return 'hsl(271 81% 56%)'
    case 'application': return 'hsl(25 95% 53%)'
    case 'text': return 'hsl(48 96% 53%)'
    default: return 'hsl(215 20% 65%)'
  }
}

function generateTrendData(type: 'upload' | 'download') {
  const days = 7
  const data = []
  const baseValue = type === 'upload' ? 15 : 25
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    data.push({
      date: date.toISOString(),
      uploads: type === 'upload' ? baseValue + Math.floor(Math.random() * 10) : 0,
      downloads: type === 'download' ? baseValue + Math.floor(Math.random() * 15) : 0,
      size: (baseValue + Math.floor(Math.random() * 20)) * 1024 * 1024 // MB
    })
  }
  
  return data
}

function generatePeakHours() {
  const hours = []
  for (let i = 0; i < 24; i++) {
    hours.push({
      hour: i,
      transfers: Math.floor(Math.random() * 50) + 10,
      peak_type: (i >= 9 && i <= 17) ? 'upload' : 'download' as 'upload' | 'download'
    })
  }
  return hours
}

// Mock data generator
const getMockData = (table: string) => {
  switch (table) {
    case 'files':
      return mockFiles
    case 'folders':
      return mockFolders
    case 'storage_metrics':
      return mockStorageMetrics
    case 'transfer_metrics':
      return mockTransferMetrics
    case 'file_activity':
      return mockActivity
    default:
      return []
  }
}

// Mock file data
const mockFiles: FileItem[] = [
  {
    id: 'file1',
    name: 'Project Proposal.pdf',
    type: 'file',
    size: 2048576,
    modified_at: '2024-01-20T10:30:00Z',
    created_at: '2024-01-20T10:30:00Z',
    company_id: 'comp1',
    user_id: 'user_1',
    parent_id: null,
    path: '/documents/project-proposal.pdf',
    mime_type: 'application/pdf',
    is_shared: true,
    is_favorite: false,
    is_archived: false,
    tags: ['proposal', 'project'],
    permissions: [],
    version: 1,
    download_count: 15,
    thumbnail_url: null
  },
  {
    id: 'file2',
    name: 'Team Photo.jpg',
    type: 'file',
    size: 1536000,
    modified_at: '2024-01-19T15:45:00Z',
    created_at: '2024-01-19T15:45:00Z',
    company_id: 'comp1',
    user_id: 'user_1',
    parent_id: 'folder2',
    path: '/assets/images/team-photo.jpg',
    mime_type: 'image/jpeg',
    is_shared: false,
    is_favorite: true,
    is_archived: false,
    tags: ['team', 'photo'],
    permissions: [],
    version: 1,
    download_count: 8,
    thumbnail_url: '/thumbnails/team-photo.jpg'
  },
  {
    id: 'file3',
    name: 'Budget Report.xlsx',
    type: 'file',
    size: 512000,
    modified_at: '2024-01-18T09:15:00Z',
    created_at: '2024-01-18T09:15:00Z',
    company_id: 'comp1',
    user_id: 'user_1',
    parent_id: 'folder1',
    path: '/documents/budget-report.xlsx',
    mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    is_shared: true,
    is_favorite: false,
    is_archived: false,
    tags: ['budget', 'finance'],
    permissions: [],
    version: 2,
    download_count: 22,
    thumbnail_url: null
  }
]

const mockFolders: FolderItem[] = [
  {
    id: 'folder1',
    name: 'Documents',
    description: 'Company documents and reports',
    color: 'hsl(142 76% 36%)',
    icon: 'folder',
    file_count: 12,
    total_size: 15728640,
    modified_at: '2024-01-20T10:30:00Z',
    created_at: '2024-01-15T10:00:00Z',
    company_id: 'comp1',
    user_id: 'user_1',
    parent_id: null,
    path: '/documents',
    is_shared: false,
    permissions: []
  },
  {
    id: 'folder2',
    name: 'Images',
    description: 'Photos and graphics',
    color: 'hsl(221 83% 53%)',
    icon: 'folder',
    file_count: 8,
    total_size: 10485760,
    modified_at: '2024-01-19T15:45:00Z',
    created_at: '2024-01-15T10:00:00Z',
    company_id: 'comp1',
    user_id: 'user_1',
    parent_id: null,
    path: '/assets/images',
    is_shared: true,
    permissions: []
  },
  {
    id: 'folder3',
    name: 'Archives',
    description: 'Archived files and backups',
    color: 'hsl(48 96% 53%)',
    icon: 'folder',
    file_count: 25,
    total_size: 104857600,
    modified_at: '2024-01-17T14:20:00Z',
    created_at: '2024-01-10T10:00:00Z',
    company_id: 'comp1',
    user_id: 'user_1',
    parent_id: null,
    path: '/archives',
    is_shared: false,
    permissions: []
  }
]

const mockStorageMetrics: StorageMetrics = {
  total_storage: 10737418240, // 10GB
  used_storage: 2147483648,   // 2GB
  available_storage: 8589934592, // 8GB
  file_count: 45,
  folder_count: 8,
  recent_uploads: 12,
  shared_files: 18,
  storage_by_type: [
    { type: 'documents', size: 838860800, count: 15, percentage: 39.1, color: 'hsl(25 95% 53%)' },
    { type: 'images', size: 629145600, count: 12, percentage: 29.3, color: 'hsl(142 76% 36%)' },
    { type: 'videos', size: 419430400, count: 8, percentage: 19.5, color: 'hsl(221 83% 53%)' },
    { type: 'audio', size: 209715200, count: 6, percentage: 9.8, color: 'hsl(271 81% 56%)' },
    { type: 'archives', size: 52428800, count: 4, percentage: 2.4, color: 'hsl(48 96% 53%)' }
  ],
  growth_trend: [
    { date: '2024-01-14', size: 1073741824, files: 38 },
    { date: '2024-01-15', size: 1258291200, files: 40 },
    { date: '2024-01-16', size: 1442840576, files: 42 },
    { date: '2024-01-17', size: 1627389952, files: 43 },
    { date: '2024-01-18', size: 1811939328, files: 44 },
    { date: '2024-01-19', size: 1996488704, files: 45 },
    { date: '2024-01-20', size: 2147483648, files: 45 }
  ],
  company_id: 'comp1'
}

const mockTransferMetrics: FileTransferMetrics = {
  uploads_today: 12,
  downloads_today: 28,
  upload_trend: [
    { date: '2024-01-14', uploads: 8, downloads: 0, size: 104857600 },
    { date: '2024-01-15', uploads: 12, downloads: 0, size: 157286400 },
    { date: '2024-01-16', uploads: 6, downloads: 0, size: 62914560 },
    { date: '2024-01-17', uploads: 15, downloads: 0, size: 209715200 },
    { date: '2024-01-18', uploads: 9, downloads: 0, size: 125829120 },
    { date: '2024-01-19', uploads: 11, downloads: 0, size: 146800640 },
    { date: '2024-01-20', uploads: 12, downloads: 0, size: 167772160 }
  ],
  download_trend: [
    { date: '2024-01-14', uploads: 0, downloads: 22, size: 314572800 },
    { date: '2024-01-15', uploads: 0, downloads: 18, size: 251658240 },
    { date: '2024-01-16', uploads: 0, downloads: 35, size: 503316480 },
    { date: '2024-01-17', uploads: 0, downloads: 24, size: 335544320 },
    { date: '2024-01-18', uploads: 0, downloads: 31, size: 419430400 },
    { date: '2024-01-19', uploads: 0, downloads: 26, size: 356515840 },
    { date: '2024-01-20', uploads: 0, downloads: 28, size: 377487360 }
  ],
  peak_hours: [
    { hour: 9, transfers: 45, peak_type: 'upload' },
    { hour: 10, transfers: 52, peak_type: 'upload' },
    { hour: 11, transfers: 38, peak_type: 'upload' },
    { hour: 14, transfers: 41, peak_type: 'download' },
    { hour: 15, transfers: 48, peak_type: 'download' },
    { hour: 16, transfers: 35, peak_type: 'download' }
  ],
  transfer_speed: 2621440, // 2.5 MB/s
  success_rate: 98.5,
  company_id: 'comp1'
}

const mockActivity: RecentFileActivity[] = [
  {
    id: 'activity1',
    file_id: 'file1',
    file_name: 'Project Proposal.pdf',
    action: 'uploaded',
    user_id: 'user_1',
    user_name: 'John Smith',
    timestamp: '2024-01-20T10:30:00Z',
    details: 'File uploaded to Documents folder',
    company_id: 'comp1'
  },
  {
    id: 'activity2',
    file_id: 'file2',
    file_name: 'Team Photo.jpg',
    action: 'shared',
    user_id: 'user_1',
    user_name: 'John Smith',
    timestamp: '2024-01-19T15:45:00Z',
    details: 'File shared with marketing team',
    company_id: 'comp1'
  },
  {
    id: 'activity3',
    file_id: 'file3',
    file_name: 'Budget Report.xlsx',
    action: 'downloaded',
    user_id: 'user_2',
    user_name: 'Sarah Johnson',
    timestamp: '2024-01-18T09:15:00Z',
    details: 'File downloaded for review',
    company_id: 'comp1'
  }
]