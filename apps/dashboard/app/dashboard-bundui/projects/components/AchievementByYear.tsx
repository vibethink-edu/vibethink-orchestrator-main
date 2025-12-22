/**
 * Achievement By Year Component
 * VibeThink Orchestrator
 * 
 * Yearly achievement tracking with project completion metrics
 * Following VThink 1.0 methodology and DOI principle with HSL colors
 */

'use client'

import React, { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Badge
} from '@vibethink/ui'
import {
  Award,
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  Download
} from 'lucide-react'
import { useProjectData } from '../hooks/useProjectData'

import { AchievementChartData } from '../types'
import { useTranslation } from '@/lib/i18n'

interface AchievementByYearProps {
  className?: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm capitalize">{item.dataKey.replace('_', ' ')}</span>
            </div>
            <span className="text-sm font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Generate achievement data - replace with real data
const generateAchievementData = (): AchievementChartData[] => {
  const currentYear = new Date().getFullYear()
  const data: AchievementChartData[] = []

  for (let i = 4; i >= 0; i--) {
    const year = currentYear - i

    // Generate realistic achievement data with growth trends
    const baseProjects = 20 + i * 5 + Math.floor(Math.random() * 10)
    const baseMilestones = baseProjects * 3 + Math.floor(Math.random() * 15)
    const baseGoals = Math.floor(baseProjects * 0.8) + Math.floor(Math.random() * 5)

    data.push({
      year: year.toString(),
      projects: baseProjects,
      milestones: baseMilestones,
      goals: baseGoals
    })
  }

  return data
}

export const AchievementByYear: React.FC<AchievementByYearProps> = ({
  className
}) => {
  const { t } = useTranslation('projects')
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'projects' | 'milestones' | 'goals'>('all')
  const { projects, isLoading } = useProjectData()

  const chartData = useMemo(() => {
    return generateAchievementData()
  }, [])

  const currentYearData = useMemo(() => {
    const currentYear = new Date().getFullYear().toString()
    return chartData.find(item => item.year === currentYear)
  }, [chartData])

  const totalAchievements = useMemo(() => {
    return chartData.reduce((acc, year) => ({
      projects: acc.projects + year.projects,
      milestones: acc.milestones + year.milestones,
      goals: acc.goals + year.goals
    }), { projects: 0, milestones: 0, goals: 0 })
  }, [chartData])

  const yearOverYearGrowth = useMemo(() => {
    if (chartData.length < 2) return { projects: 0, milestones: 0, goals: 0 }

    const lastYear = chartData[chartData.length - 2]
    const currentYear = chartData[chartData.length - 1]

    return {
      projects: lastYear.projects > 0 ? Math.round(((currentYear.projects - lastYear.projects) / lastYear.projects) * 100) : 0,
      milestones: lastYear.milestones > 0 ? Math.round(((currentYear.milestones - lastYear.milestones) / lastYear.milestones) * 100) : 0,
      goals: lastYear.goals > 0 ? Math.round(((currentYear.goals - lastYear.goals) / lastYear.goals) * 100) : 0
    }
  }, [chartData])

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{t('sections.yearlyAchievements')}</CardTitle>
          <CardDescription>{t('common.loading')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>{t('sections.yearlyAchievements')}</span>
            </CardTitle>
            <CardDescription>
              {t('sections.yearlyAchievementsDesc')}
            </CardDescription>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allMetrics')}</SelectItem>
                <SelectItem value="projects">{t('reports.projects')}</SelectItem>
                <SelectItem value="milestones">{t('reminders.milestone')}</SelectItem>
                <SelectItem value="goals">{t('reports.goals')}</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('achievements.projectsCompleted')}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-bold">{currentYearData?.projects || 0}</p>
                  {yearOverYearGrowth.projects > 0 && (
                    <Badge variant="default" className="text-xs">
                      +{yearOverYearGrowth.projects}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-lg">
                <Trophy className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('reminders.milestone')}s</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-bold">{currentYearData?.milestones || 0}</p>
                  {yearOverYearGrowth.milestones > 0 && (
                    <Badge variant="default" className="text-xs">
                      +{yearOverYearGrowth.milestones}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500/10 rounded-lg">
                <Award className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('achievements.goalsAchieved')}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-bold">{currentYearData?.goals || 0}</p>
                  {yearOverYearGrowth.goals > 0 && (
                    <Badge variant="default" className="text-xs">
                      +{yearOverYearGrowth.goals}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="year"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {(selectedMetric === 'all' || selectedMetric === 'projects') && (
                  <Bar
                    dataKey="projects"
                    fill="hsl(var(--chart-1))"
                    name={t('reports.projects')}
                    radius={[2, 2, 0, 0]}
                  />
                )}

                {(selectedMetric === 'all' || selectedMetric === 'milestones') && (
                  <Bar
                    dataKey="milestones"
                    fill="hsl(var(--chart-2))"
                    name={t('reminders.milestone')}
                    radius={[2, 2, 0, 0]}
                  />
                )}

                {(selectedMetric === 'all' || selectedMetric === 'goals') && (
                  <Bar
                    dataKey="goals"
                    fill="hsl(var(--chart-3))"
                    name={t('reports.goals')}
                    radius={[2, 2, 0, 0]}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{t('achievements.fiveYearSummary')}</span>
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('summary.totalProjects')}</span>
                  <span className="font-medium">{totalAchievements.projects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('achievements.totalMilestones')}</span>
                  <span className="font-medium">{totalAchievements.milestones}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('achievements.goalsAchieved')}</span>
                  <span className="font-medium">{totalAchievements.goals}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>{t('achievements.growthTrends')}</span>
              </h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>• {t('achievements.consistentGrowth')}</p>
                <p>• {yearOverYearGrowth.projects > 0 ? `${yearOverYearGrowth.projects}% ${t('achievements.increase')}` : t('achievements.stable')} {t('achievements.inProjectCompletion')}</p>
                <p>• {t('achievements.strongMilestone')}</p>
                <p>• {Math.round((totalAchievements.goals / totalAchievements.projects) * 100)}% {t('achievements.goalCompletionRatio')}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
