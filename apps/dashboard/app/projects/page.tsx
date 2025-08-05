'use client'

import React from 'react';
import DashboardLayout from '@/shared/components/bundui-premium/components/layout/DashboardLayout';
import ProjectCard from '@/shared/components/bundui-premium/components/layout/ProjectCard';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/shared/components/bundui-premium/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react';

// Datos de ejemplo para los proyectos
const projects = [
  {
    title: "VibeThink Orchestrator",
    description: "Plataforma de orquestación de IA con múltiples proveedores y gestión avanzada de conversaciones.",
    status: "active" as const,
    progress: 75,
    members: [
      { name: "Marcelo Silva", avatar: "https://bundui-images.netlify.app/avatars/01.png", role: "Lead Developer" },
      { name: "Ana García", avatar: "https://bundui-images.netlify.app/avatars/02.png", role: "UX Designer" },
      { name: "Carlos López", avatar: "https://bundui-images.netlify.app/avatars/03.png", role: "Backend Developer" },
      { name: "María Rodríguez", avatar: "https://bundui-images.netlify.app/avatars/04.png", role: "Product Manager" }
    ],
    dueDate: "Dec 15, 2024",
    budget: "$25,000",
    category: "AI Platform",
    priority: "high" as const
  },
  {
    title: "Bundui Premium Integration",
    description: "Integración completa del sistema de diseño Bundui Premium con componentes avanzados y temas personalizables.",
    status: "completed" as const,
    progress: 100,
    members: [
      { name: "David Chen", avatar: "https://bundui-images.netlify.app/avatars/05.png", role: "Frontend Developer" },
      { name: "Laura Martínez", avatar: "https://bundui-images.netlify.app/avatars/06.png", role: "UI Designer" }
    ],
    dueDate: "Nov 30, 2024",
    budget: "$15,000",
    category: "Design System",
    priority: "medium" as const
  },
  {
    title: "Multi-tenant Dashboard",
    description: "Sistema de dashboards multi-tenant con aislamiento de datos y gestión de roles avanzada.",
    status: "active" as const,
    progress: 45,
    members: [
      { name: "Roberto Pérez", avatar: "https://bundui-images.netlify.app/avatars/07.png", role: "Full Stack Developer" },
      { name: "Sofia Torres", avatar: "https://bundui-images.netlify.app/avatars/08.png", role: "DevOps Engineer" },
      { name: "Javier Ruiz", avatar: "https://bundui-images.netlify.app/avatars/09.png", role: "Security Specialist" }
    ],
    dueDate: "Jan 20, 2025",
    budget: "$35,000",
    category: "Enterprise",
    priority: "high" as const
  },
  {
    title: "AI Chat Analytics",
    description: "Sistema de análisis avanzado para conversaciones de IA con métricas y insights detallados.",
    status: "pending" as const,
    progress: 20,
    members: [
      { name: "Elena Vargas", avatar: "https://bundui-images.netlify.app/avatars/10.png", role: "Data Scientist" },
      { name: "Miguel Santos", avatar: "https://bundui-images.netlify.app/avatars/11.png", role: "ML Engineer" }
    ],
    dueDate: "Feb 10, 2025",
    budget: "$20,000",
    category: "Analytics",
    priority: "medium" as const
  },
  {
    title: "Mobile App Development",
    description: "Aplicación móvil nativa para iOS y Android con sincronización en tiempo real.",
    status: "active" as const,
    progress: 60,
    members: [
      { name: "Carmen Jiménez", avatar: "https://bundui-images.netlify.app/avatars/12.png", role: "Mobile Developer" },
      { name: "Alejandro Morales", avatar: "https://bundui-images.netlify.app/avatars/13.png", role: "Mobile Developer" },
      { name: "Patricia Herrera", avatar: "https://bundui-images.netlify.app/avatars/14.png", role: "QA Engineer" }
    ],
    dueDate: "Mar 15, 2025",
    budget: "$40,000",
    category: "Mobile",
    priority: "high" as const
  },
  {
    title: "API Documentation Portal",
    description: "Portal de documentación interactiva para APIs con ejemplos y playground integrado.",
    status: "archived" as const,
    progress: 90,
    members: [
      { name: "Ricardo Flores", avatar: "https://bundui-images.netlify.app/avatars/15.png", role: "Technical Writer" },
      { name: "Isabel Moreno", avatar: "https://bundui-images.netlify.app/avatars/16.png", role: "Developer Advocate" }
    ],
    dueDate: "Oct 15, 2024",
    budget: "$12,000",
    category: "Documentation",
    priority: "low" as const
  }
];

export default function ProjectsPage() {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track your project progress
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Calendar className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{projects.filter(p => p.status === 'completed').length}</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Users className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">{projects.reduce((acc, p) => acc + p.members.length, 0)}</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">$147K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Projects</DropdownMenuItem>
                <DropdownMenuItem>Active</DropdownMenuItem>
                <DropdownMenuItem>Completed</DropdownMenuItem>
                <DropdownMenuItem>Pending</DropdownMenuItem>
                <DropdownMenuItem>Archived</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              status={project.status}
              progress={project.progress}
              members={project.members}
              dueDate={project.dueDate}
              budget={project.budget}
              category={project.category}
              priority={project.priority}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-muted-foreground">
              <Search className="h-12 w-12" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 