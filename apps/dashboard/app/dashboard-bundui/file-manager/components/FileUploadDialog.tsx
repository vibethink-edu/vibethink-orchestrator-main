/**
 * File Upload Dialog Component
 * File Manager Dashboard - VibeThink Orchestrator
 * 
 * Modal dialog for file upload with drag & drop and options
 * Following VThink 1.0 methodology with HSL colors and multi-tenant security
 */

'use client'

import React, { useState, useRef, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Checkbox,
  Badge,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@vibethink/ui'
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  File,
  AlertCircle,
  CheckCircle,
  Loader2,
  FolderOpen,
  Tag
} from "@vibethink/ui/icons"
import type { FileUploadDialogProps } from '../types'

type UploadFile = {
  file: File
  id: string
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
}

export function FileUploadDialog({ 
  isOpen, 
  onClose, 
  onUpload, 
  currentFolder 
}: FileUploadDialogProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadOptions, setUploadOptions] = useState({
    destination_folder: currentFolder || '',
    overwrite_existing: false,
    create_thumbnails: true,
    scan_for_viruses: true,
    notify_users: false,
    tags: [] as string[]
  })
  const [tagInput, setTagInput] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (file: File) => {
    const type = file.type
    if (type.startsWith('image/')) return Image
    if (type.startsWith('video/')) return Video
    if (type.startsWith('audio/')) return Music
    if (type.includes('pdf') || type.includes('document')) return FileText
    if (type.includes('zip') || type.includes('archive')) return Archive
    return File
  }

  const getFileIconColor = (file: File) => {
    const type = file.type
    if (type.startsWith('image/')) return 'hsl(142 76% 36%)'
    if (type.startsWith('video/')) return 'hsl(221 83% 53%)'
    if (type.startsWith('audio/')) return 'hsl(271 81% 56%)'
    if (type.includes('pdf') || type.includes('document')) return 'hsl(25 95% 53%)'
    if (type.includes('zip') || type.includes('archive')) return 'hsl(48 96% 53%)'
    return 'hsl(215 20% 65%)'
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const processFiles = (fileList: FileList) => {
    const newFiles: UploadFile[] = Array.from(fileList).map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      status: 'pending',
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [])

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const addTag = () => {
    if (tagInput.trim() && !uploadOptions.tags.includes(tagInput.trim())) {
      setUploadOptions(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setUploadOptions(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    
    for (const file of files) {
      try {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'uploading', progress: 0 }
            : f
        ))

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f => {
            if (f.id === file.id && f.progress < 90) {
              return { ...f, progress: f.progress + 10 }
            }
            return f
          }))
        }, 200)

        await onUpload(file.file, uploadOptions)
        
        clearInterval(progressInterval)
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'completed', progress: 100 }
            : f
        ))
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                status: 'error', 
                progress: 0,
                error: error instanceof Error ? error.message : 'Upload failed'
              }
            : f
        ))
      }
    }
    
    setUploading(false)
    
    // Close dialog if all uploads completed successfully
    const hasErrors = files.some(f => f.status === 'error')
    if (!hasErrors) {
      setTimeout(() => {
        onClose()
        setFiles([])
      }, 1000)
    }
  }

  const handleClose = () => {
    if (!uploading) {
      onClose()
      setFiles([])
    }
  }

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0)
  const completedFiles = files.filter(f => f.status === 'completed').length
  const errorFiles = files.filter(f => f.status === 'error').length

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Files</span>
          </DialogTitle>
          <DialogDescription>
            Upload files to your storage. Drag and drop files or click to browse.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted hover:border-primary/50'
              }
            `}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              {dragActive ? 'Drop files here' : 'Upload your files'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here, or click to browse
            </p>
            <Button onClick={handleFileSelect} disabled={uploading}>
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>

          {/* Upload Options */}
          {files.length > 0 && (
            <div className="space-y-4 border rounded-lg p-4">
              <h4 className="font-medium">Upload Options</h4>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Destination Folder */}
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination Folder</Label>
                  <Select
                    value={uploadOptions.destination_folder}
                    onValueChange={(value) => 
                      setUploadOptions(prev => ({ ...prev, destination_folder: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Root Folder</SelectItem>
                      <SelectItem value="documents">Documents</SelectItem>
                      <SelectItem value="images">Images</SelectItem>
                      <SelectItem value="videos">Videos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tags"
                      placeholder="Add tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button type="button" size="sm" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  {uploadOptions.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {uploadOptions.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                          <X 
                            className="h-3 w-3 ml-1 cursor-pointer" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="overwrite"
                    checked={uploadOptions.overwrite_existing}
                    onCheckedChange={(checked) => 
                      setUploadOptions(prev => ({ ...prev, overwrite_existing: !!checked }))
                    }
                  />
                  <Label htmlFor="overwrite" className="text-sm">
                    Overwrite existing files
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="thumbnails"
                    checked={uploadOptions.create_thumbnails}
                    onCheckedChange={(checked) => 
                      setUploadOptions(prev => ({ ...prev, create_thumbnails: !!checked }))
                    }
                  />
                  <Label htmlFor="thumbnails" className="text-sm">
                    Create thumbnails
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="virus-scan"
                    checked={uploadOptions.scan_for_viruses}
                    onCheckedChange={(checked) => 
                      setUploadOptions(prev => ({ ...prev, scan_for_viruses: !!checked }))
                    }
                  />
                  <Label htmlFor="virus-scan" className="text-sm">
                    Scan for viruses
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notify"
                    checked={uploadOptions.notify_users}
                    onCheckedChange={(checked) => 
                      setUploadOptions(prev => ({ ...prev, notify_users: !!checked }))
                    }
                  />
                  <Label htmlFor="notify" className="text-sm">
                    Notify team members
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Files to Upload</h4>
                <div className="text-sm text-muted-foreground">
                  {files.length} files • {formatBytes(totalSize)}
                </div>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((file) => {
                  const FileIcon = getFileIcon(file.file)
                  const iconColor = getFileIconColor(file.file)
                  
                  return (
                    <div
                      key={file.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <FileIcon 
                        className="h-8 w-8 flex-shrink-0" 
                        style={{ color: iconColor }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatBytes(file.file.size)}
                        </p>
                        
                        {file.status === 'uploading' && (
                          <Progress value={file.progress} className="mt-2 h-1" />
                        )}
                        
                        {file.status === 'error' && file.error && (
                          <p className="text-sm text-red-600 mt-1">{file.error}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {file.status === 'completed' && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {file.status === 'error' && (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        {file.status === 'uploading' && (
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        )}
                        
                        {!uploading && file.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Upload Summary */}
              {(completedFiles > 0 || errorFiles > 0) && (
                <div className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                  <div className="flex items-center space-x-4">
                    {completedFiles > 0 && (
                      <span className="text-green-600">
                        ✓ {completedFiles} completed
                      </span>
                    )}
                    {errorFiles > 0 && (
                      <span className="text-red-600">
                        ✗ {errorFiles} failed
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={files.length === 0 || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
