/**
 * Summary Cards Component
 * File Manager Dashboard - VibeThink Orchestrator
 * 
 * Displays key storage and file metrics in card format
 * Following VThink 1.0 methodology with HSL colors and multi-tenant security
 */

'use client'

import React from 'react'
import { Card, CardContent } from '@vibethink/ui'
import { 
  HardDrive, 
  FileText, 
  Folder, 
  Upload, 
  Download, 
  Share,
  TrendingUp,
  Users
} from 'lucide-react'
import type { SummaryCardsProps } from '../types'

export function SummaryCards({ metrics, loading }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                  <div className="h-8 w-8 bg-muted rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <p>No storage data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const storageUsagePercentage = (metrics.used_storage / metrics.total_storage) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Storage Usage */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {formatBytes(metrics.used_storage)}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{storageUsagePercentage.toFixed(1)}% of {formatBytes(metrics.total_storage)}</span>
                </div>
              </div>
            </div>
            <HardDrive className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" 
                style={{ width: `${Math.min(storageUsagePercentage, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Files */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Files</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {metrics.file_count.toLocaleString()}
                </p>
                <div className="flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">
                    +{metrics.recent_uploads} this week
                  </span>
                </div>
              </div>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Total Folders */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Folders</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {metrics.folder_count.toLocaleString()}
                </p>
                <div className="text-xs text-muted-foreground">
                  Organized structure
                </div>
              </div>
            </div>
            <Folder className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      {/* Shared Files */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Shared Files</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {metrics.shared_files.toLocaleString()}
                </p>
                <div className="flex items-center text-xs">
                  <Users className="h-3 w-3 text-purple-600 mr-1" />
                  <span className="text-purple-600">
                    {Math.round((metrics.shared_files / metrics.file_count) * 100)}% of files
                  </span>
                </div>
              </div>
            </div>
            <Share className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
