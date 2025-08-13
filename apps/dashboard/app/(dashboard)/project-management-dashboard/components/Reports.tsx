/**
 * Reports Component
 * VibeThink Orchestrator
 * 
 * Project reports and insights with filtering and export options
 * Following VThink 1.0 methodology with multi-tenant security
 */

'use client'

import React, { useState, useMemo } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Input } from '@/shared/components/ui/input'
import { 
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Target,
  RefreshCw
} from 'lucide-react'
import { useProjectData } from '../hooks/useProjectData'
import { ProjectReport } from '../types'

interface ReportsProps {
  className?: string
}

type ReportType = 'status' | 'performance' | 'budget' | 'timeline' | 'team'
type ReportFormat = 'pdf' | 'excel' | 'csv'

const mockReports: ProjectReport[] = [
  {
    id: '1',
    name: 'Monthly Project Status Report',
    description: 'Comprehensive overview of all active projects and their current status',
    type: 'status',
    date_range: {
      start: '2024-01-01',
      end: '2024-01-31'
    },
    generated_at: new Date().toISOString(),
    file_url: '/reports/monthly-status-jan-2024.pdf'
  },
  {
    id: '2',
    name: 'Team Performance Analysis',
    description: 'Detailed analysis of team productivity and efficiency metrics',
    type: 'performance',
    date_range: {
      start: '2024-01-01',
      end: '2024-01-31'
    },
    generated_at: new Date(Date.now() - 86400000).toISOString(),
    file_url: '/reports/team-performance-jan-2024.pdf'
  },
  {
    id: '3',
    name: 'Budget Utilization Report',
    description: 'Financial overview showing budget allocation and spending patterns',
    type: 'budget',
    date_range: {
      start: '2024-01-01',
      end: '2024-01-31'
    },
    generated_at: new Date(Date.now() - 172800000).toISOString(),
    file_url: '/reports/budget-utilization-jan-2024.pdf'
  },
  {
    id: '4',
    name: 'Project Timeline Analysis',
    description: 'Timeline performance and milestone completion analysis',
    type: 'timeline',
    date_range: {
      start: '2024-01-01',
      end: '2024-01-31'
    },
    generated_at: new Date(Date.now() - 259200000).toISOString(),
    file_url: '/reports/timeline-analysis-jan-2024.pdf'
  },
  {
    id: '5',
    name: 'Team Workload Distribution',
    description: 'Analysis of team member workload and capacity utilization',
    type: 'team',
    date_range: {
      start: '2024-01-01',
      end: '2024-01-31'
    },
    generated_at: new Date(Date.now() - 345600000).toISOString(),
    file_url: '/reports/team-workload-jan-2024.pdf'
  }
]

const getReportTypeIcon = (type: ReportType) => {
  switch (type) {
    case 'status': return <BarChart3 className="h-4 w-4" />
    case 'performance': return <TrendingUp className="h-4 w-4" />
    case 'budget': return <DollarSign className="h-4 w-4" />
    case 'timeline': return <Clock className="h-4 w-4" />
    case 'team': return <Users className="h-4 w-4" />
    default: return <FileText className="h-4 w-4" />
  }
}

const getReportTypeBadge = (type: ReportType) => {
  const variants = {
    status: 'default',
    performance: 'secondary',
    budget: 'outline',
    timeline: 'destructive',
    team: 'default'
  } as const

  const labels = {
    status: 'Status',
    performance: 'Performance',
    budget: 'Budget',
    timeline: 'Timeline',
    team: 'Team'
  }

  return (
    <Badge variant={variants[type] as any}>
      {labels[type]}
    </Badge>
  )
}

const ReportGenerationCard = () => {
  const [reportType, setReportType] = useState<ReportType>('status')
  const [dateRange, setDateRange] = useState('30d')
  const [format, setFormat] = useState<ReportFormat>('pdf')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
    // Here you would typically trigger the actual report generation
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Generate New Report</span>
        </CardTitle>
        <CardDescription>
          Create custom reports for project analysis and insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Project Status</SelectItem>
                  <SelectItem value="performance">Team Performance</SelectItem>
                  <SelectItem value="budget">Budget Analysis</SelectItem>
                  <SelectItem value="timeline">Timeline Review</SelectItem>
                  <SelectItem value="team">Team Workload</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select value={format} onValueChange={(value: ReportFormat) => setFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateReport} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export const Reports: React.FC<ReportsProps> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const { projects, isLoading } = useProjectData()

  const filteredReports = useMemo(() => {
    return mockReports.filter(report => {
      const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === 'all' || report.type === typeFilter
      
      return matchesSearch && matchesType
    })
  }, [searchTerm, typeFilter])

  const handleDownloadReport = (report: ProjectReport) => {
    // Simulate download
    console.log('Downloading report:', report.name)
    // In a real app, you would trigger the actual download
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Report Generation */}
      <ReportGenerationCard />
      
      {/* Existing Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                View and download previously generated project reports
              </CardDescription>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="timeline">Timeline</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="h-10 w-10 bg-muted rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                  </div>
                  <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-muted-foreground">
                {searchTerm || typeFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Generate your first report to get started'
                }
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {getReportTypeIcon(report.type)}
                            <span className="font-medium">{report.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {report.description}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getReportTypeBadge(report.type)}
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(report.date_range.start).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</div>
                          <div className="text-muted-foreground">
                            to {new Date(report.date_range.end).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          {new Date(report.generated_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                          <div className="text-muted-foreground">
                            {new Date(report.generated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReport(report)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>Quick Insights</span>
          </CardTitle>
          <CardDescription>
            Key metrics and trends from recent reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">94%</div>
              <div className="text-sm text-muted-foreground">Project Success Rate</div>
              <div className="text-xs text-muted-foreground mt-1">
                ↑ 3.2% from last period
              </div>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">87%</div>
              <div className="text-sm text-muted-foreground">On-Time Delivery</div>
              <div className="text-xs text-muted-foreground mt-1">
                ↑ 5.1% from last period
              </div>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">$2.4M</div>
              <div className="text-sm text-muted-foreground">Total Budget Managed</div>
              <div className="text-xs text-muted-foreground mt-1">
                92% utilization rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}