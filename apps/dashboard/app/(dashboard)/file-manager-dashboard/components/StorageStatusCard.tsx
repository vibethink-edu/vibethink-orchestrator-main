/**
 * Storage Status Card Component
 * File Manager Dashboard - VibeThink Orchestrator
 * 
 * Displays storage usage breakdown and analytics
 * Following VThink 1.0 methodology with HSL colors and multi-tenant security
 */

'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { 
  HardDrive, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  MoreHorizontal
} from 'lucide-react'
import { Progress } from '@/shared/components/ui/progress'
import type { StorageStatusCardProps } from '../types'

export function StorageStatusCard({ metrics, loading }: StorageStatusCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5" />
            <span>Storage Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-2 bg-muted rounded w-full"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5" />
            <span>Storage Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p>No storage data available</p>
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
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const storageUsagePercentage = (metrics.used_storage / metrics.total_storage) * 100
  const availableStorage = metrics.total_storage - metrics.used_storage

  const getStorageStatus = () => {
    if (storageUsagePercentage >= 90) {
      return { status: 'critical', color: 'text-red-600', icon: AlertTriangle }
    } else if (storageUsagePercentage >= 80) {
      return { status: 'warning', color: 'text-yellow-600', icon: AlertTriangle }
    } else {
      return { status: 'healthy', color: 'text-green-600', icon: CheckCircle }
    }
  }

  const statusInfo = getStorageStatus()
  const StatusIcon = statusInfo.icon

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'images':
        return Image
      case 'videos':
        return Video
      case 'audio':
        return Music
      case 'documents':
        return FileText
      case 'archives':
        return Archive
      default:
        return FileText
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'images':
        return 'hsl(142 76% 36%)'
      case 'videos':
        return 'hsl(221 83% 53%)'
      case 'audio':
        return 'hsl(271 81% 56%)'
      case 'documents':
        return 'hsl(25 95% 53%)'
      case 'archives':
        return 'hsl(48 96% 53%)'
      default:
        return 'hsl(215 20% 65%)'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5" />
            <span>Storage Status</span>
          </div>
          <div className={`flex items-center space-x-1 ${statusInfo.color}`}>
            <StatusIcon className="h-4 w-4" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Storage Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Storage Used</span>
            <span className="font-medium">
              {formatBytes(metrics.used_storage)} of {formatBytes(metrics.total_storage)}
            </span>
          </div>
          
          <Progress 
            value={storageUsagePercentage} 
            className="h-2"
          />
          
          <div className="flex items-center justify-between text-xs">
            <span className={statusInfo.color}>
              {storageUsagePercentage.toFixed(1)}% used
            </span>
            <span className="text-muted-foreground">
              {formatBytes(availableStorage)} available
            </span>
          </div>
        </div>

        {/* Storage Breakdown by Type */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Storage by Type</h4>
          <div className="space-y-2">
            {metrics.storage_by_type.slice(0, 5).map((item) => {
              const Icon = getFileTypeIcon(item.type)
              const color = getFileTypeColor(item.type)
              
              return (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      className="h-4 w-4" 
                      style={{ color }} 
                    />
                    <span className="text-sm capitalize">
                      {item.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatBytes(item.size)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.count} files • {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )
            })}
            
            {metrics.storage_by_type.length > 5 && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MoreHorizontal className="h-4 w-4" />
                  <span>Other types</span>
                </div>
                <span>
                  {metrics.storage_by_type.length - 5} more
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Storage Growth Trend */}
        {metrics.growth_trend && metrics.growth_trend.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Recent Growth</h4>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div className="text-sm">
                <span className="font-medium">
                  +{formatBytes(
                    metrics.growth_trend[metrics.growth_trend.length - 1]?.size - 
                    metrics.growth_trend[0]?.size || 0
                  )}
                </span>
                <span className="text-muted-foreground ml-1">this month</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium">Today</div>
                <div className="text-muted-foreground">
                  +{formatBytes(metrics.growth_trend[metrics.growth_trend.length - 1]?.size || 0)}
                </div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium">This Week</div>
                <div className="text-muted-foreground">
                  +{formatBytes(
                    metrics.growth_trend.slice(-7).reduce((sum, item) => sum + item.size, 0)
                  )}
                </div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium">This Month</div>
                <div className="text-muted-foreground">
                  +{formatBytes(
                    metrics.growth_trend.reduce((sum, item) => sum + item.size, 0)
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2 text-xs border border-input rounded hover:bg-accent hover:text-accent-foreground transition-colors">
              Clean up files
            </button>
            <button className="p-2 text-xs border border-input rounded hover:bg-accent hover:text-accent-foreground transition-colors">
              Upgrade storage
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
