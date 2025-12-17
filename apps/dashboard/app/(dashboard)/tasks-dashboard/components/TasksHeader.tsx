/**
 * Tasks Header Component - VibeThink Orchestrator
 * 
 * Header with quick actions and filters for task management
 * Following VThink 1.0 methodology with shadcn/ui compatibility
 */

'use client'

import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@vibethink/ui'
import { Badge } from '@/shared/components/ui/badge'
import { 
  Plus,
  Download,
  Filter,
  Search,
  Calendar,
  Users,
  Target
} from 'lucide-react'

interface TasksHeaderProps {
  onCreateTask: () => void
  onExportData: () => void
  filtersCount: number
}

export default function TasksHeader({ 
  onCreateTask, 
  onExportData, 
  filtersCount 
}: TasksHeaderProps) {
  return (
    <Card className="border-0 shadow-none bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          {/* Title and Description */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Tasks Management
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Track, manage, and optimize your team's productivity with comprehensive task management
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  85% Completion Rate
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  5 Active Members
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
                <Calendar className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  12 Due This Week
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            {/* Filters Badge */}
            {filtersCount > 0 && (
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {filtersCount} filter{filtersCount !== 1 ? 's' : ''} active
                </Badge>
              </div>
            )}

            {/* Export Button */}
            <Button
              variant="outline"
              onClick={onExportData}
              className="flex items-center space-x-2 bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>

            {/* Create Task Button */}
            <Button
              onClick={onCreateTask}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Create Task</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
