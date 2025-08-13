/**
 * Table Recent Files Component
 * File Manager Dashboard - VibeThink Orchestrator
 * 
 * Displays recent files in table format with actions
 * Following VThink 1.0 methodology with HSL colors and multi-tenant security
 */

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  File,
  Download, 
  Share, 
  Trash2, 
  MoreVertical,
  Star,
  StarOff,
  Eye,
  Clock,
  User
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import type { TableRecentFilesProps } from '../types'

export function TableRecentFiles({ 
  files, 
  onFileClick, 
  onFileDownload, 
  onFileShare, 
  onFileDelete, 
  loading 
}: TableRecentFilesProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="h-10 w-10 bg-muted rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getFileIcon = (mimeType: string | null, type: string) => {
    if (!mimeType) return File

    if (mimeType.startsWith('image/')) return Image
    if (mimeType.startsWith('video/')) return Video
    if (mimeType.startsWith('audio/')) return Music
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText
    if (mimeType.includes('zip') || mimeType.includes('archive')) return Archive
    
    return File
  }

  const getFileIconColor = (mimeType: string | null) => {
    if (!mimeType) return 'hsl(215 20% 65%)'

    if (mimeType.startsWith('image/')) return 'hsl(142 76% 36%)'
    if (mimeType.startsWith('video/')) return 'hsl(221 83% 53%)'
    if (mimeType.startsWith('audio/')) return 'hsl(271 81% 56%)'
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'hsl(25 95% 53%)'
    if (mimeType.includes('zip') || mimeType.includes('archive')) return 'hsl(48 96% 53%)'
    
    return 'hsl(215 20% 65%)'
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
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    })
  }

  const toggleFavorite = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newFavorites = new Set(favorites)
    if (newFavorites.has(fileId)) {
      newFavorites.delete(fileId)
    } else {
      newFavorites.add(fileId)
    }
    setFavorites(newFavorites)
  }

  const getFileTypeLabel = (mimeType: string | null) => {
    if (!mimeType) return 'File'
    
    const type = mimeType.split('/')[0]
    switch (type) {
      case 'image': return 'Image'
      case 'video': return 'Video'
      case 'audio': return 'Audio'
      case 'application':
        if (mimeType.includes('pdf')) return 'PDF'
        if (mimeType.includes('document')) return 'Document'
        if (mimeType.includes('spreadsheet')) return 'Spreadsheet'
        if (mimeType.includes('zip')) return 'Archive'
        return 'File'
      case 'text': return 'Text'
      default: return 'File'
    }
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No recent files</p>
            <p className="text-sm">Upload some files to see them here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Files</span>
          </div>
          <Badge variant="secondary">{files.length} files</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[100px]">Size</TableHead>
              <TableHead className="w-[120px]">Modified</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => {
              const FileIcon = getFileIcon(file.mime_type, file.type)
              const iconColor = getFileIconColor(file.mime_type)
              const isFavorite = favorites.has(file.id)
              
              return (
                <TableRow 
                  key={file.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onFileClick(file)}
                >
                  {/* File Icon */}
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <FileIcon 
                        className="h-5 w-5" 
                        style={{ color: iconColor }}
                      />
                    </div>
                  </TableCell>
                  
                  {/* File Name */}
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium truncate max-w-[200px]" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {file.is_shared && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            Shared
                          </Badge>
                        )}
                        {file.tags.length > 0 && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            {file.tags[0]}
                            {file.tags.length > 1 && ` +${file.tags.length - 1}`}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* File Type */}
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getFileTypeLabel(file.mime_type)}
                    </Badge>
                  </TableCell>
                  
                  {/* File Size */}
                  <TableCell className="font-mono text-sm">
                    {formatBytes(file.size)}
                  </TableCell>
                  
                  {/* Modified Date */}
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(file.modified_at)}
                  </TableCell>
                  
                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => toggleFavorite(file.id, e)}
                      >
                        {isFavorite ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        ) : (
                          <StarOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      
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
                              onFileClick(file)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation()
                              onFileDownload(file.id)
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation()
                              onFileShare(file)
                            }}
                          >
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm(`Delete ${file.name}?`)) {
                                onFileDelete(file.id)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        
        {files.length >= 10 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Files
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}