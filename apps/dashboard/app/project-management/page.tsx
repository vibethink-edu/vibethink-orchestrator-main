'use client'

import React from 'react';
import DashboardLayout from '@/shared/components/bundui-premium/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Progress } from '@/shared/components/bundui-premium/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/bundui-premium/components/ui/avatar';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/bundui-premium/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/shared/components/bundui-premium/components/ui/dropdown-menu';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  MoreHorizontal,
  Calendar,
  DollarSign,
  UserPlus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock as ClockIcon,
  Trophy,
  Star,
  Activity
} from 'lucide-react';

// Datos de ejemplo para las métricas principales
const mainMetrics = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "positive",
    icon: DollarSign,
    description: "from last month"
  },
  {
    title: "Active Projects",
    value: "1.423",
    change: "+5.02%",
    changeType: "positive",
    icon: Target,
    description: "from last month"
  },
  {
    title: "New Leads",
    value: "3.500",
    change: "-3.58%",
    changeType: "negative",
    icon: UserPlus,
    description: "from last month"
  },
  {
    title: "Time Spent",
    value: "168h 40m",
    change: "-3.58%",
    changeType: "negative",
    icon: Clock,
    description: "from last month"
  }
];

// Datos de proyectos recientes
const recentProjects = [
  {
    name: "Product Development",
    client: "Kevin Heal",
    startDate: "20/03/2024",
    deadline: "05/04/2024",
    status: "active",
    progress: 30
  },
  {
    name: "New Office Building",
    client: "Sarah Johnson",
    startDate: "15/03/2024",
    deadline: "10/04/2024",
    status: "cancel",
    progress: 60
  },
  {
    name: "Mobile app design",
    client: "Michael Chen",
    startDate: "10/03/2024",
    deadline: "01/04/2024",
    status: "completed",
    progress: 100
  },
  {
    name: "Website & Blog",
    client: "Emily Rodriguez",
    startDate: "05/03/2024",
    deadline: "20/03/2024",
    status: "pending",
    progress: 50
  },
  {
    name: "Marketing Campaign",
    client: "David Wilson",
    startDate: "01/03/2024",
    deadline: "15/04/2024",
    status: "active",
    progress: 45
  },
  {
    name: "E-commerce Platform",
    client: "Jessica Lee",
    startDate: "25/02/2024",
    deadline: "10/05/2024",
    status: "pending",
    progress: 20
  }
];

// Datos de reminders
const reminders = [
  {
    priority: "low",
    time: "Today, 12:30",
    title: "Create a design training for beginners.",
    category: "Design Education"
  },
  {
    priority: "medium",
    time: "Today, 10:00",
    title: "Have a meeting with the new design team.",
    category: "Meeting"
  },
  {
    priority: "high",
    time: "Tomorrow, 16:30",
    title: "Respond to customer support emails.",
    category: "Customer Support"
  }
];

// Datos de highlights
const highlights = [
  { label: "Avg. Client Rating", value: "7.8 / 10", icon: Star },
  { label: "Avg. Quotes", value: "730", icon: Activity },
  { label: "Avg. Agent Earnings", value: "$2,309", icon: DollarSign }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    case 'pending':
      return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    case 'cancel':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function ProjectManagementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>
            <p className="text-muted-foreground">
              09 Jul 2025 - 05 Aug 2025
            </p>
          </div>
          <Button>Export</Button>
        </div>

        {/* Main Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mainMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change} {metric.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Projects Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Projects Overview</CardTitle>
                    <CardDescription>Total for the last 3 months</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Last 3 months</Button>
                    <Button variant="outline" size="sm">Last 30 days</Button>
                    <Button variant="outline" size="sm">Last 7 days</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Professionals</span>
                    </div>
                    <span className="text-2xl font-bold">357</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Today's Heroes</span>
                    </div>
                    <span className="text-2xl font-bold">ESOJABSTIAMT</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Projects Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProjects.map((project, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.client}</TableCell>
                        <TableCell>{project.startDate}</TableCell>
                        <TableCell>{project.deadline}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(project.status)}
                            <Badge variant="outline" className="capitalize">
                              {project.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={project.progress} className="w-16" />
                            <span className="text-sm">%{project.progress}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Project</DropdownMenuItem>
                              <DropdownMenuItem>Archive Project</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 text-sm text-muted-foreground">
                  0 of 12 row(s) selected.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <highlight.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{highlight.label}</span>
                    </div>
                    <span className="font-semibold">{highlight.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reminders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reminder</CardTitle>
                  <Button variant="outline" size="sm">Set Reminder</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {reminders.map((reminder, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(reminder.priority)}`}
                      >
                        {reminder.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{reminder.time}</span>
                    </div>
                    <p className="text-sm font-medium">{reminder.title}</p>
                    <p className="text-xs text-muted-foreground">{reminder.category}</p>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full">
                  Show the other 10 reminders
                </Button>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card>
              <CardHeader>
                <CardTitle>Achievement by Year</CardTitle>
                <CardDescription>
                  You completed more projects per day on average this year than last year.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">57 projects</span>
                    <span className="text-sm">29 projects</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">35 projects</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">January - June 2026</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle>Project Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">High Performance</span>
                  </div>
                  <Progress value={85} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    85% efficiency rate achieved
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 