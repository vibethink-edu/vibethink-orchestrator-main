/**
 * Chart File Transfer Component
 * File Manager Dashboard - VibeThink Orchestrator
 * 
 * Displays file transfer metrics and trends using Recharts
 * Following VThink 1.0 methodology with HSL colors and DOI principle
 */

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { 
  Upload, 
  Download, 
  Activity, 
  Clock,
  TrendingUp,
  TrendingDown,
  Zap
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts'
import type { ChartFileTransferProps } from '../types'

export function ChartFileTransfer({ data, loading }: ChartFileTransferProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>File Transfer Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-full mb-4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>File Transfer Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transfer data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatSpeed = (bytesPerSecond: number) => {
    return formatBytes(bytesPerSecond) + '/s'
  }

  // Transform data for charts
  const chartData = data.upload_trend.map((item, index) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    uploads: item.uploads,
    downloads: data.download_trend[index]?.downloads || 0,
    uploadSize: item.size,
    downloadSize: data.download_trend[index]?.size || 0
  }))

  const peakHoursData = data.peak_hours.map(hour => ({
    hour: `${hour.hour}:00`,
    transfers: hour.transfers,
    type: hour.peak_type
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>File Transfer Activity</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-hsl(var(--chart-1))"></div>
              <span className="text-muted-foreground">Uploads</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-hsl(var(--chart-2))"></div>
              <span className="text-muted-foreground">Downloads</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4 text-hsl(var(--chart-1))" />
                    <span className="text-sm font-medium">Uploads Today</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{data.uploads_today}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+15% vs yesterday</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Download className="h-4 w-4 text-hsl(var(--chart-2))" />
                    <span className="text-sm font-medium">Downloads Today</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{data.downloads_today}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      <span>-5% vs yesterday</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer Trend Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="uploads"
                    stackId="1"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.6}
                    name="Uploads"
                  />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stackId="2"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.6}
                    name="Downloads"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            {/* Data Transfer Volume */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickFormatter={formatBytes}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                    formatter={(value: number) => [formatBytes(value), '']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="uploadSize"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
                    name="Upload Volume"
                  />
                  <Line
                    type="monotone"
                    dataKey="downloadSize"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
                    name="Download Volume"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Summary */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-hsl(var(--chart-1))">
                  {chartData.reduce((sum, item) => sum + item.uploads, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Uploads</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-hsl(var(--chart-2))">
                  {chartData.reduce((sum, item) => sum + item.downloads, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">
                  {formatBytes(
                    chartData.reduce((sum, item) => sum + item.uploadSize + item.downloadSize, 0)
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Total Data</p>
              </div>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Transfer Speed</span>
                </div>
                <p className="text-xl font-bold">{formatSpeed(data.transfer_speed)}</p>
                <p className="text-xs text-muted-foreground">Average speed</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Success Rate</span>
                </div>
                <p className="text-xl font-bold">{data.success_rate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Transfer success</p>
              </div>
            </div>

            {/* Peak Hours Chart */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Peak Transfer Hours</span>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="hour" 
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar
                      dataKey="transfers"
                      fill="hsl(var(--chart-3))"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}