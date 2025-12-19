/**
 * Folder List Cards Component
 * File Manager Dashboard - VibeThink Orchestrator
 * 
 * Displays folders in card grid format with actions
 * Following VThink 1.0 methodology with HSL colors and multi-tenant security
 */

'use client'

import React, { useState } from 'react'
import { 
  Card, 
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button
} from '@vibethink/ui'
import { 
  Folder, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Share, 
  Users, 
  Lock,
  Calendar,
  FileText
} from 'lucide-react'
import type { FolderListCardsProps } from '../types'

export function FolderListCards({ 
  folders, 
  onFolderClick, 
  onFolderEdit, 
  onFolderDelete, 
  loading 
}: FolderListCardsProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Folders</h3>
              <div className="animate-pulse h-4 bg-muted rounded w-20"></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="h-6 w-6 bg-muted rounded"></div>
                          <div className="h-4 w-4 bg-muted rounded"></div>
                        </div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    })
  }

  const handleDeleteClick = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteConfirm(folderId)
  }

  const handleDeleteConfirm = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onFolderDelete(folderId)
    setDeleteConfirm(null)
  }

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteConfirm(null)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Folders</h3>
            <p className="text-sm text-muted-foreground">{folders.length} folders</p>
          </div>
          
          {folders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No folders found</p>
              <p className="text-sm">Create your first folder to organize your files</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {folders.map((folder) => (
                <Card 
                  key={folder.id} 
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => onFolderClick(folder)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header with icon and actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="p-2 rounded-lg" 
                            style={{ backgroundColor: `${folder.color}20` }}
                          >
                            <Folder 
                              className="h-5 w-5" 
                              style={{ color: folder.color }}
                            />
                          </div>
                          {folder.is_shared && (
                            <div className="flex items-center">
                              <Users className="h-3 w-3 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation()
                                onFolderEdit(folder)
                              }}
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('Share folder:', folder.name)
                              }}
                            >
                              <Share className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={(e) => handleDeleteClick(folder.id, e)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {/* Folder name */}
                      <div>
                        <h4 className="font-medium truncate" title={folder.name}>
                          {folder.name}
                        </h4>
                        {folder.description && (
                          <p className="text-sm text-muted-foreground truncate mt-1" title={folder.description}>
                            {folder.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Folder stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <FileText className="h-3 w-3" />
                          <span>{folder.file_count} files</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>{formatBytes(folder.total_size)}</span>
                        </div>
                      </div>
                      
                      {/* Modified date */}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Modified {formatDate(folder.modified_at)}</span>
                      </div>
                      
                      {/* Delete confirmation overlay */}
                      {deleteConfirm === folder.id && (
                        <div className="absolute inset-0 bg-background/95 rounded-lg flex items-center justify-center p-4">
                          <div className="text-center space-y-2">
                            <p className="text-sm font-medium">Delete folder?</p>
                            <p className="text-xs text-muted-foreground">This action cannot be undone</p>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => handleDeleteConfirm(folder.id, e)}
                              >
                                Delete
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleDeleteCancel}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
