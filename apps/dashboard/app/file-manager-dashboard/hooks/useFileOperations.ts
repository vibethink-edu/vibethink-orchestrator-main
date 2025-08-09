/**
 * useFileOperations Hook
 * File Manager Dashboard - VibeThink Orchestrator
 * 
 * File operations hook with multi-tenant security and company_id filtering
 * Following VThink 1.0 methodology with proper error handling and optimistic updates
 */

'use client'

import { useState, useCallback } from 'react'
import type { 
  FileItem, 
  FolderItem, 
  FileUploadOptions, 
  FileShareOptions,
  UseFileOperations 
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
    select: (columns: string) => {
      const query = {
        eq: (_column: string, _value: any) => query,
        single: () => Promise.resolve({ data: getMockFile(), error: null })
      } as any
      return query
    },
    insert: (data: any) => ({
      error: null as any,
      select: () => ({
        single: () => Promise.resolve({ data: getMockFile(), error: null })
      })
    }),
    update: (data: any) => {
      const query = {
        eq: (_column: string, _value: any) => query,
        error: null as any,
        select: () => ({
          single: () => Promise.resolve({ data: getMockFile(), error: null })
        })
      } as any
      return query
    },
    delete: () => {
      const query = {
        eq: (_column: string, _value: any) => query,
        error: null as any,
        then: (onFulfilled: any) => Promise.resolve({ error: null }).then(onFulfilled)
      } as any
      return query
    }
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

// Mock file data helper
const getMockFile = (): FileItem => ({
  id: `file_${Date.now()}`,
  name: 'Mock File.pdf',
  type: 'file',
  size: 1024000,
  modified_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  company_id: 'comp1',
  user_id: 'user_1',
  parent_id: null,
  path: '/mock-file.pdf',
  mime_type: 'application/pdf',
  is_shared: false,
  is_favorite: false,
  is_archived: false,
  tags: [],
  permissions: [],
  version: 1,
  download_count: 0,
  thumbnail_url: null
})

export function useFileOperations(): UseFileOperations {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  // Get current user and company for multi-tenant security
  const getCurrentUser = useCallback(async () => {
    if (!user?.company_id) {
      throw new Error('User not authenticated or missing company_id')
    }
    
    return { user, company_id: user.company_id }
  }, [user])

  // Upload file with multi-tenant security
  const uploadFile = useCallback(async (file: File, options?: FileUploadOptions): Promise<FileItem> => {
    try {
      setLoading(true)
      setError(null)

      const { user, company_id } = await getCurrentUser()

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${company_id}/${options?.destination_folder || 'root'}/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: options?.overwrite_existing || false
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get file URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(filePath)

      // Create file record with company_id - CRITICAL SECURITY
      const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert({
          name: file.name,
          type: 'file',
          size: file.size,
          company_id, // CRITICAL: Always set company_id
          user_id: user.id,
          parent_id: options?.destination_folder || null,
          path: filePath,
          mime_type: file.type,
          is_shared: false,
          is_favorite: false,
          is_archived: false,
          tags: options?.tags || [],
          version: 1,
          download_count: 0,
          thumbnail_url: options?.create_thumbnails ? await generateThumbnail(file) : null
        })
        .select()
        .single()

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('files').remove([filePath])
        throw new Error(`Database error: ${dbError.message}`)
      }

      // Log activity
      await supabase.from('file_activity').insert({
        file_id: fileRecord.id,
        file_name: file.name,
        action: 'uploaded',
        user_id: user.id,
        user_name: user.email || 'Unknown',
        company_id, // CRITICAL: Always set company_id
        details: `File uploaded to ${options?.destination_folder || 'root'}`
      })

      return {
        ...fileRecord,
        permissions: []
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [supabase, getCurrentUser])

  // Download file with security checks
  const downloadFile = useCallback(async (fileId: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const { user, company_id } = await getCurrentUser()

      // Get file record with company_id filtering - CRITICAL SECURITY
      const { data: file, error: fileError } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .eq('company_id', company_id) // CRITICAL: Always filter by company_id
        .single()

      if (fileError || !file) {
        throw new Error('File not found or access denied')
      }

      // Download file from storage
      const { data, error: downloadError } = await supabase.storage
        .from('files')
        .download(file.path)

      if (downloadError) {
        throw new Error(`Download failed: ${downloadError.message}`)
      }

      // Create download link and trigger download
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Update download count and log activity
      await Promise.all([
        supabase
          .from('files')
          .update({ download_count: file.download_count + 1 })
          .eq('id', fileId)
          .eq('company_id', company_id), // CRITICAL: Always filter by company_id
        
        supabase.from('file_activity').insert({
          file_id: fileId,
          file_name: file.name,
          action: 'downloaded',
          user_id: user.id,
          user_name: user.email || 'Unknown',
          company_id, // CRITICAL: Always set company_id
          details: 'File downloaded successfully'
        })
      ])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [supabase, getCurrentUser])

  // Delete file with security checks
  const deleteFile = useCallback(async (fileId: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const { user, company_id } = await getCurrentUser()

      // Get file record with company_id filtering - CRITICAL SECURITY
      const { data: file, error: fileError } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .eq('company_id', company_id) // CRITICAL: Always filter by company_id
        .single()

      if (fileError || !file) {
        throw new Error('File not found or access denied')
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([file.path])

      if (storageError) {
        console.warn('Storage deletion failed:', storageError.message)
      }

      // Delete from database with company_id filtering - CRITICAL SECURITY
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)
        .eq('company_id', company_id) // CRITICAL: Always filter by company_id

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      // Log activity
      await supabase.from('file_activity').insert({
        file_id: fileId,
        file_name: file.name,
        action: 'deleted',
        user_id: user.id,
        user_name: user.email || 'Unknown',
        company_id, // CRITICAL: Always set company_id
        details: 'File deleted permanently'
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [supabase, getCurrentUser])

  // Rename file with security checks
  const renameFile = useCallback(async (fileId: string, newName: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const { user, company_id } = await getCurrentUser()

      // Update file name with company_id filtering - CRITICAL SECURITY
      const { data: file, error } = await supabase
        .from('files')
        .update({ name: newName })
        .eq('id', fileId)
        .eq('company_id', company_id) // CRITICAL: Always filter by company_id
        .select()
        .single()

      if (error) {
        throw new Error(`Rename failed: ${error.message}`)
      }

      // Log activity
      await supabase.from('file_activity').insert({
        file_id: fileId,
        file_name: newName,
        action: 'renamed',
        user_id: user.id,
        user_name: user.email || 'Unknown',
        company_id, // CRITICAL: Always set company_id
        details: `File renamed to ${newName}`
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Rename failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [supabase, getCurrentUser])

  // Move file with security checks
  const moveFile = useCallback(async (fileId: string, destinationFolderId: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const { user, company_id } = await getCurrentUser()

      // Update file parent with company_id filtering - CRITICAL SECURITY
      const { error } = await supabase
        .from('files')
        .update({ parent_id: destinationFolderId })
        .eq('id', fileId)
        .eq('company_id', company_id) // CRITICAL: Always filter by company_id

      if (error) {
        throw new Error(`Move failed: ${error.message}`)
      }

      // Log activity
      await supabase.from('file_activity').insert({
        file_id: fileId,
        file_name: 'File',
        action: 'moved',
        user_id: user.id,
        user_name: user.email || 'Unknown',
        company_id, // CRITICAL: Always set company_id
        details: `File moved to folder ${destinationFolderId}`
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Move failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [supabase, getCurrentUser])

  // Share file with permissions
  const shareFile = useCallback(async (fileId: string, options: FileShareOptions): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const { user, company_id } = await getCurrentUser()

      // Update file sharing status with company_id filtering - CRITICAL SECURITY
      const { error: fileError } = await supabase
        .from('files')
        .update({ is_shared: true })
        .eq('id', fileId)
        .eq('company_id', company_id) // CRITICAL: Always filter by company_id

      if (fileError) {
        throw new Error(`Share failed: ${fileError.message}`)
      }

      // Create permissions for each user with company_id - CRITICAL SECURITY
      const permissions = options.user_ids.map(userId => ({
        file_id: fileId,
        user_id: userId,
        permission_type: options.permission_type,
        granted_by: user.id,
        company_id // CRITICAL: Always set company_id
      }))

      const { error: permError } = await supabase
        .from('file_permissions')
        .insert(permissions)

      if (permError) {
        throw new Error(`Permission error: ${permError.message}`)
      }

      // Log activity
      await supabase.from('file_activity').insert({
        file_id: fileId,
        file_name: 'File',
        action: 'shared',
        user_id: user.id,
        user_name: user.email || 'Unknown',
        company_id, // CRITICAL: Always set company_id
        details: `File shared with ${options.user_ids.length} users`
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Share failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [supabase, getCurrentUser])

  // Create folder with multi-tenant security
  const createFolder = useCallback(async (name: string, parentId?: string): Promise<FolderItem> => {
    try {
      setLoading(true)
      setError(null)

      const { user, company_id } = await getCurrentUser()

      const { data: folder, error } = await supabase
        .from('folders')
        .insert({
          name,
          description: '',
          color: generateRandomColor(),
          icon: 'folder',
          file_count: 0,
          total_size: 0,
          company_id, // CRITICAL: Always set company_id
          user_id: user.id,
          parent_id: parentId || null,
          path: parentId ? `${parentId}/${name}` : name,
          is_shared: false
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Folder creation failed: ${error.message}`)
      }

      return {
        id: folder.id,
        name: folder.name,
        description: '',
        color: 'hsl(221 83% 53%)',
        icon: 'folder',
        file_count: 0,
        total_size: 0,
        modified_at: folder.modified_at,
        created_at: folder.created_at,
        company_id: folder.company_id,
        user_id: folder.user_id,
        parent_id: folder.parent_id,
        path: folder.path,
        is_shared: folder.is_shared ?? false,
        permissions: []
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Folder creation failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [supabase, getCurrentUser])

  // Delete folder with security checks
  const deleteFolder = useCallback(async (folderId: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const { user, company_id } = await getCurrentUser()

      // Delete folder with company_id filtering - CRITICAL SECURITY
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId)
        .eq('company_id', company_id) // CRITICAL: Always filter by company_id

      if (error) {
        throw new Error(`Folder deletion failed: ${error.message}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Folder deletion failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [supabase, getCurrentUser])

  // Toggle favorite status
  const toggleFavorite = useCallback(async (fileId: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const { company_id } = await getCurrentUser()

      // Get current status and toggle with company_id filtering - CRITICAL SECURITY
      const { data: file, error: getError } = await supabase
        .from('files')
        .select('is_favorite')
        .eq('id', fileId)
        .eq('company_id', company_id) // CRITICAL: Always filter by company_id
        .single()

      if (getError || !file) {
        throw new Error('File not found')
      }

      const { error: updateError } = await supabase
        .from('files')
        .update({ is_favorite: !file.is_favorite })
        .eq('id', fileId)
        .eq('company_id', company_id) // CRITICAL: Always filter by company_id

      if (updateError) {
        throw new Error(`Toggle favorite failed: ${updateError.message}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Toggle favorite failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [supabase, getCurrentUser])

  // Add tags to file
  const addTags = useCallback(async (fileId: string, tags: string[]): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const { company_id } = await getCurrentUser()

      // Update tags with company_id filtering - CRITICAL SECURITY
      const { error } = await supabase
        .from('files')
        .update({ tags })
        .eq('id', fileId)
        .eq('company_id', company_id) // CRITICAL: Always filter by company_id

      if (error) {
        throw new Error(`Add tags failed: ${error.message}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Add tags failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [supabase, getCurrentUser])

  return {
    uploadFile,
    downloadFile,
    deleteFile,
    renameFile,
    moveFile,
    shareFile,
    createFolder,
    deleteFolder,
    toggleFavorite,
    addTags,
    loading,
    error
  }
}

// Helper functions
async function generateThumbnail(file: File): Promise<string | null> {
  if (!file.type.startsWith('image/')) return null
  
  try {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = 150
        canvas.height = 150
        ctx?.drawImage(img, 0, 0, 150, 150)
        resolve(canvas.toDataURL())
      }
      
      img.onerror = () => resolve(null)
      img.src = URL.createObjectURL(file)
    })
  } catch {
    return null
  }
}

function generateRandomColor(): string {
  const colors = [
    'hsl(142 76% 36%)', // green
    'hsl(221 83% 53%)', // blue
    'hsl(271 81% 56%)', // purple
    'hsl(25 95% 53%)',  // orange
    'hsl(48 96% 53%)',  // yellow
    'hsl(348 83% 47%)'  // red
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}