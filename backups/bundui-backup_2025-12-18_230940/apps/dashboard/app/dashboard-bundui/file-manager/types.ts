/**
 * File Manager Types
 * VibeThink Orchestrator
 * 
 * TypeScript definitions for the file manager dashboard
 * Following VThink 1.0 methodology with multi-tenant security
 */

export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size: number
  modified_at: string
  created_at: string
  company_id: string
  user_id: string
  parent_id: string | null
  path: string
  mime_type: string | null
  is_shared: boolean
  is_favorite: boolean
  is_archived: boolean
  tags: string[]
  permissions: FilePermission[]
  version: number
  download_count: number
  thumbnail_url?: string
}

export interface FilePermission {
  id: string
  file_id: string
  user_id: string
  permission_type: 'read' | 'write' | 'delete' | 'share'
  granted_by: string
  granted_at: string
  company_id: string
}

export interface FolderItem {
  id: string
  name: string
  description?: string
  color: string
  icon: string
  file_count: number
  total_size: number
  modified_at: string
  created_at: string
  company_id: string
  user_id: string
  parent_id: string | null
  path: string
  is_shared: boolean
  permissions: FilePermission[]
}

export interface StorageMetrics {
  total_storage: number
  used_storage: number
  available_storage: number
  file_count: number
  folder_count: number
  recent_uploads: number
  shared_files: number
  storage_by_type: StorageByType[]
  growth_trend: StorageGrowth[]
  company_id: string
}

export interface StorageByType {
  type: string
  size: number
  count: number
  percentage: number
  color: string
}

export interface StorageGrowth {
  date: string
  size: number
  files: number
}

export interface FileTransferMetrics {
  uploads_today: number
  downloads_today: number
  upload_trend: TransferTrend[]
  download_trend: TransferTrend[]
  peak_hours: PeakHour[]
  transfer_speed: number
  success_rate: number
  company_id: string
}

export interface TransferTrend {
  date: string
  uploads: number
  downloads: number
  size: number
}

export interface PeakHour {
  hour: number
  transfers: number
  peak_type: 'upload' | 'download'
}

export interface RecentFileActivity {
  id: string
  file_id: string
  file_name: string
  action: 'uploaded' | 'downloaded' | 'shared' | 'deleted' | 'renamed' | 'moved'
  user_id: string
  user_name: string
  timestamp: string
  details?: string
  company_id: string
}

export interface FileManagerFilters {
  search: string
  type: 'all' | 'files' | 'folders'
  date_range: {
    from: Date | null
    to: Date | null
  }
  size_range: {
    min: number | null
    max: number | null
  }
  tags: string[]
  shared_only: boolean
  favorites_only: boolean
  sort_by: 'name' | 'size' | 'modified' | 'created'
  sort_order: 'asc' | 'desc'
}

export interface FileUploadOptions {
  destination_folder?: string
  overwrite_existing: boolean
  create_thumbnails: boolean
  scan_for_viruses: boolean
  notify_users: boolean
  tags: string[]
}

export interface FileShareOptions {
  user_ids: string[]
  permission_type: 'read' | 'write' | 'delete'
  expiry_date?: string
  password_protected: boolean
  password?: string
  notify_users: boolean
  message?: string
}

// Hook return types
export interface UseFileManagerData {
  files: FileItem[]
  folders: FolderItem[]
  storageMetrics: StorageMetrics | null
  transferMetrics: FileTransferMetrics | null
  recentActivity: RecentFileActivity[]
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

export interface UseFileManagerFilters {
  filters: FileManagerFilters
  updateFilter: (key: keyof FileManagerFilters, value: any) => void
  resetFilters: () => void
  applyFilters: (items: FileItem[]) => FileItem[]
  hasActiveFilters: boolean
}

export interface UseFileOperations {
  uploadFile: (file: File, options?: FileUploadOptions) => Promise<FileItem>
  downloadFile: (fileId: string) => Promise<void>
  deleteFile: (fileId: string) => Promise<void>
  renameFile: (fileId: string, newName: string) => Promise<void>
  moveFile: (fileId: string, destinationFolderId: string) => Promise<void>
  shareFile: (fileId: string, options: FileShareOptions) => Promise<void>
  createFolder: (name: string, parentId?: string) => Promise<FolderItem>
  deleteFolder: (folderId: string) => Promise<void>
  toggleFavorite: (fileId: string) => Promise<void>
  addTags: (fileId: string, tags: string[]) => Promise<void>
  loading: boolean
  error: string | null
}

// Component props
export interface SummaryCardsProps {
  metrics: StorageMetrics | null
  loading: boolean
}

export interface FolderListCardsProps {
  folders: FolderItem[]
  onFolderClick: (folder: FolderItem) => void
  onFolderEdit: (folder: FolderItem) => void
  onFolderDelete: (folderId: string) => void
  loading: boolean
}

export interface StorageStatusCardProps {
  metrics: StorageMetrics | null
  loading: boolean
}

export interface ChartFileTransferProps {
  data: FileTransferMetrics | null
  loading: boolean
}

export interface TableRecentFilesProps {
  files: FileItem[]
  onFileClick: (file: FileItem) => void
  onFileDownload: (fileId: string) => void
  onFileShare: (file: FileItem) => void
  onFileDelete: (fileId: string) => void
  loading: boolean
}

export interface FileUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File, options?: FileUploadOptions) => Promise<void>
  currentFolder?: string
}