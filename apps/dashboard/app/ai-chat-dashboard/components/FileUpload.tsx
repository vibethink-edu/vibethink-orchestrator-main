'use client'

// =============================================================================
// FILE UPLOAD COMPONENT
// =============================================================================
// 
// Componente para subir archivos adjuntos al chat
// Incluye drag & drop, validación y preview
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security
// - ✅ File validation
// - ✅ DOI Principle (Bundui Visual + Shadcn Technical)
// - ✅ Accessibility ready
// =============================================================================

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/shared/components/bundui-premium/components/ui/button'
import { Progress } from '@/shared/components/bundui-premium/components/ui/progress'
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge'
import { Alert, AlertDescription } from '@/shared/components/bundui-premium/components/ui/alert'
import { 
  Upload,
  File,
  FileText,
  Image,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { FileUploadProps } from '../types'

/**
 * Componente de upload de archivos
 * Soporte para drag & drop, validación y preview
 */
export function FileUpload({
  onFileSelect,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt', '.md'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  disabled = false
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validar archivo
  const validateFile = (file: File): string | null => {
    // Verificar tamaño
    if (file.size > maxFileSize) {
      return `File "${file.name}" is too large. Maximum size is ${formatFileSize(maxFileSize)}.`
    }

    // Verificar tipo (simplificado)
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      }
      if (type.includes('/*')) {
        const mainType = type.split('/')[0]
        return file.type.startsWith(mainType)
      }
      return file.type === type
    })

    if (!isValidType) {
      return `File type "${file.type}" is not supported.`
    }

    return null
  }

  // Manejar selección de archivos
  const handleFiles = useCallback((files: FileList | File[]) => {
    setError(null)
    const fileArray = Array.from(files)

    // Verificar límite de archivos
    if (selectedFiles.length + fileArray.length > maxFiles) {
      setError(`Cannot upload more than ${maxFiles} files at once.`)
      return
    }

    // Validar cada archivo
    const validFiles: File[] = []
    const errors: string[] = []

    for (const file of fileArray) {
      const validationError = validateFile(file)
      if (validationError) {
        errors.push(validationError)
      } else {
        validFiles.push(file)
      }
    }

    if (errors.length > 0) {
      setError(errors[0]) // Mostrar solo el primer error
      return
    }

    // Agregar archivos válidos
    const newFiles = [...selectedFiles, ...validFiles]
    setSelectedFiles(newFiles)
    onFileSelect(newFiles)
  }, [selectedFiles, acceptedTypes, maxFileSize, maxFiles, onFileSelect])

  // Manejar input de archivos
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFiles(files)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Manejar drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (disabled) return

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files) {
      handleFiles(files)
    }
  }

  // Remover archivo
  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onFileSelect(newFiles)
  }

  // Limpiar todos los archivos
  const clearFiles = () => {
    setSelectedFiles([])
    setError(null)
    onFileSelect([])
  }

  // Obtener icono de archivo
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />
    }
    return <FileText className="w-4 h-4" />
  }

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          dragActive && "border-primary bg-primary/5",
          !dragActive && "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground">
              {acceptedTypes.join(', ')} up to {formatFileSize(maxFileSize)}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={disabled}
          >
            <Upload className="w-4 h-4" />
            Choose Files
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading files...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Selected Files ({selectedFiles.length}/{maxFiles})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFiles}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
              >
                {/* File Icon */}
                <div className="shrink-0">
                  {getFileIcon(file)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                  </p>
                </div>

                {/* Status */}
                <div className="shrink-0 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Ready
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              Total size: {formatFileSize(selectedFiles.reduce((total, file) => total + file.size, 0))}
            </p>
            <p>
              These files will be attached to your message and processed by the AI.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}