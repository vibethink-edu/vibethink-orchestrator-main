/**
 * Tasks Reports Component - VibeThink Orchestrator
 * 
 * Comprehensive reporting and analytics for tasks
 * Following VThink 1.0 methodology with shadcn/ui compatibility
 */

'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@vibethink/ui'
import { Badge } from '@/shared/components/ui/badge'
import { FileText, Download, Calendar, TrendingUp, Users, Target } from 'lucide-react'

const reportTypes = [
  {
    id: 'productivity',
    name: 'Productivity Report',
    description: 'Team productivity metrics and trends',
    icon: TrendingUp,
    generated: '2 days ago',
    format: 'PDF'
  },
  {
    id: 'completion',
    name: 'Task Completion Report',
    description: 'Completion rates and timeline analysis',
    icon: Target,
    generated: '1 week ago',
    format: 'Excel'
  },
  {
    id: 'team-performance',
    name: 'Team Performance Report',
    description: 'Individual and team performance insights',
    icon: Users,
    generated: '3 days ago',
    format: 'PDF'
  },
  {
    id: 'time-tracking',
    name: 'Time Tracking Report',
    description: 'Time allocation and efficiency analysis',
    icon: Calendar,
    generated: '5 days ago',
    format: 'Excel'
  }
]

export default function TasksReports() {
  const handleGenerateReport = (reportId: string) => {
    console.log('Generating report:', reportId)
    // TODO: Implement report generation
  }

  const handleDownloadReport = (reportId: string) => {
    console.log('Downloading report:', reportId)
    // TODO: Implement report download
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Task Reports</span>
            </CardTitle>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Custom Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {reportTypes.map((report) => {
              const IconComponent = report.icon
              return (
                <Card key={report.id} className="border-dashed">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{report.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {report.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{report.format}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Last generated: {report.generated}
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleGenerateReport(report.id)}
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reports Generated</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data Export</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Download className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled Reports</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
