/**
 * File Manager Dashboard Page
 * VibeThink Orchestrator
 * 
 * Complete file management system with multi-tenant security, file operations,
 * storage analytics, and document management features
 * Following VThink 1.0 methodology with DashboardLayout integration
 */

'use client'

import React, { useState } from 'react'
;
import { Card, CardContent } from '@vibethink/ui'
import { 
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Folder,
  File,
  Cloud,
  HardDrive,
  Download,
  Share,
  Trash2,
  Star,
  Clock,
  Settings
} from "@vibethink/ui/icons"

// Import file manager components
import { SummaryCards } from './components/SummaryCards'
import { FolderListCards } from './components/FolderListCards'
import { StorageStatusCard } from './components/StorageStatusCard'
import { ChartFileTransfer } from './components/ChartFileTransfer'
import { TableRecentFiles } from './components/TableRecentFiles'
import { FileUploadDialog } from './components/FileUploadDialog'

// Import hooks for data management
import { useFileManagerData } from './hooks/useFileManagerData'
import { useFileManagerFilters } from './hooks/useFileManagerFilters'
import { useFileOperations } from './hooks/useFileOperations'

// Import types
import type { FileItem, FolderItem } from './types'

export default function FileManagerPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  
  // Data hooks with multi-tenant security
  const { 
    files, 
    folders, 
    storageMetrics, 
    transferMetrics, 
    recentActivity, 
    loading, 
    error, 
    refreshData 
  } = useFileManagerData()
  
  const { 
    filters, 
    updateFilter, 
    resetFilters, 
    applyFilters, 
    hasActiveFilters 
  } = useFileManagerFilters()
  
  const {
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
    loading: operationLoading,
    error: operationError
  } = useFileOperations()

  // Filter files based on current filters
  const filteredFiles = applyFilters(files)

  const handleFolderClick = (folder: FolderItem) => {
    setSelectedFolder(folder.id)
    console.log('Navigate to folder:', folder.name)
    // TODO: Implement folder navigation
  }

  const handleFolderEdit = (folder: FolderItem) => {
    console.log('Edit folder:', folder.name)
    // TODO: Implement folder edit dialog
  }

  const handleFolderDelete = async (folderId: string) => {
    try {
      await deleteFolder(folderId)
      await refreshData()
    } catch (err) {
      console.error('Failed to delete folder:', err)
    }
  }

  const handleFileClick = (file: FileItem) => {
    console.log('Open file:', file.name)
    // TODO: Implement file preview/open
  }

  const handleFileDownload = async (fileId: string) => {
    try {
      await downloadFile(fileId)
    } catch (err) {
      console.error('Failed to download file:', err)
    }
  }

  const handleFileShare = (file: FileItem) => {
    console.log('Share file:', file.name)
    // TODO: Implement file sharing dialog
  }

  const handleFileDelete = async (fileId: string) => {
    try {
      await deleteFile(fileId)
      await refreshData()
    } catch (err) {
      console.error('Failed to delete file:', err)
    }
  }

  const handleFileUpload = async (file: File, options?: any) => {
    try {
      await uploadFile(file, options)
      await refreshData()
      setUploadDialogOpen(false)
    } catch (err) {
      console.error('Failed to upload file:', err)
    }
  }

  const handleSearchChange = (value: string) => {
    updateFilter('search', value)
  }

  const handleFilterChange = (key: string, value: any) => {
    updateFilter(key as any, value)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="text-red-500 text-2xl">⚠️</div>
                <h3 className="text-lg font-semibold">Error Loading File Manager</h3>
                <p className="text-muted-foreground">{error}</p>
                <button 
                  onClick={refreshData}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            </CardContent>
          </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">File Manager</h1>
            <p className="text-muted-foreground">
              Manage your files, folders, and storage across your organization
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search files and folders..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 pr-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center border border-input rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => console.log('Open filters')}
              className={`inline-flex items-center px-3 py-2 border border-input bg-background rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring ${hasActiveFilters ? 'border-primary' : ''}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                  Active
                </span>
              )}
            </button>
            
            {/* Upload Button */}
            <button
              onClick={() => setUploadDialogOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </button>
          </div>
        </div>

        {/* Storage Summary Cards */}
        <SummaryCards metrics={storageMetrics} loading={loading} />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Folders Section */}
          <div className="lg:col-span-2">
            <FolderListCards 
              folders={folders}
              onFolderClick={handleFolderClick}
              onFolderEdit={handleFolderEdit}
              onFolderDelete={handleFolderDelete}
              loading={loading}
            />
          </div>
          
          {/* Storage Status */}
          <div>
            <StorageStatusCard 
              metrics={storageMetrics} 
              loading={loading} 
            />
          </div>
        </div>

        {/* Analytics and Recent Files */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* File Transfer Chart */}
          <ChartFileTransfer 
            data={transferMetrics} 
            loading={loading} 
          />
          
          {/* Recent Files Table */}
          <TableRecentFiles 
            files={filteredFiles.slice(0, 10)}
            onFileClick={handleFileClick}
            onFileDownload={handleFileDownload}
            onFileShare={handleFileShare}
            onFileDelete={handleFileDelete}
            loading={loading}
          />
        </div>

        {/* Quick Actions Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <File className="h-4 w-4" />
                  <span>{files.length} files</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Folder className="h-4 w-4" />
                  <span>{folders.length} folders</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HardDrive className="h-4 w-4" />
                  <span>
                    {storageMetrics ? 
                      `${((storageMetrics.used_storage / storageMetrics.total_storage) * 100).toFixed(1)}% used` 
                      : 'Loading...'
                    }
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => console.log('Create new folder')}
                  className="inline-flex items-center px-3 py-1.5 border border-input bg-background rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <Folder className="h-4 w-4 mr-1" />
                  New Folder
                </button>
                <button
                  onClick={() => console.log('Bulk operations')}
                  className="inline-flex items-center px-3 py-1.5 border border-input bg-background rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Bulk Actions
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload Dialog */}
        <FileUploadDialog
          isOpen={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          onUpload={handleFileUpload}
          currentFolder={selectedFolder || undefined}
        />

        {/* Loading State */}
        {(loading || operationLoading) && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-lg font-medium">
                    {operationLoading ? 'Processing file operation...' : 'Loading file manager...'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Toast */}
        {operationError && (
          <div className="fixed bottom-4 right-4 z-50">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="text-red-500">⚠️</div>
                  <p className="text-sm font-medium text-red-800">{operationError}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
  )
}
