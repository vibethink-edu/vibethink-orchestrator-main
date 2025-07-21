/**
 * Support Panel - Gestión de Soporte desde Super Admin
 * 
 * Panel para gestionar tickets de soporte, issues críticos,
 * y comunicación con empresas clientes desde el Super Admin
 * 
 * @author AI Pair Platform - Support Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Phone, 
  Mail,
  User,
  Building2,
  Calendar,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Zap
} from 'lucide-react';

interface SupportTicket {
  id: string
  company: string
  user: string
  subject: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
  created_at: string
  updated_at: string
  assigned_to?: string
  tags: string[]
}

// Mock data - en producción vendría de la base de datos
const mockTickets: SupportTicket[] = [
  {
    id: 'TICK-001',
    company: 'Empresa ABC',
    user: 'juan.perez@empresaabc.com',
    subject: 'Error en integración con CRM',
    description: 'La integración con HubSpot no está sincronizando los contactos correctamente.',
    priority: 'high',
    status: 'open',
    created_at: '2025-06-10T09:00:00Z',
    updated_at: '2025-06-10T09:00:00Z',
    tags: ['integration', 'crm', 'hubspot']
  },
  {
    id: 'TICK-002',
    company: 'TechCorp',
    user: 'maria.garcia@techcorp.com',
    subject: 'Límite de IA excedido',
    description: 'Necesitamos aumentar nuestro límite mensual de requests de IA.',
    priority: 'medium',
    status: 'in_progress',
    created_at: '2025-06-09T14:30:00Z',
    updated_at: '2025-06-10T08:15:00Z',
    assigned_to: 'support@VibeThink.com',
    tags: ['billing', 'limits', 'ai-usage']
  },
  {
    id: 'TICK-003',
    company: 'StartupXYZ',
    user: 'carlos.lopez@startupxyz.com',
    subject: 'Sistema caído - CRÍTICO',
    description: 'No podemos acceder a la plataforma desde las 3:00 AM.',
    priority: 'critical',
    status: 'in_progress',
    created_at: '2025-06-10T03:00:00Z',
    updated_at: '2025-06-10T03:05:00Z',
    assigned_to: 'escalation@VibeThink.com',
    tags: ['critical', 'downtime', 'access']
  }
]

export function SupportPanel() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700'
      case 'in_progress': return 'bg-purple-100 text-purple-700'
      case 'waiting': return 'bg-yellow-100 text-yellow-700'
      case 'resolved': return 'bg-green-100 text-green-700'
      case 'closed': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-3 h-3" />
      case 'in_progress': return <Clock className="w-3 h-3" />
      case 'waiting': return <MessageSquare className="w-3 h-3" />
      case 'resolved': return <CheckCircle className="w-3 h-3" />
      case 'closed': return <CheckCircle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority
    
    return matchesSearch && matchesPriority
  })

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    critical: tickets.filter(t => t.priority === 'critical').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{ticketStats.total}</div>
                <div className="text-xs text-muted-foreground">Total Tickets</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-red-600">{ticketStats.critical}</div>
                <div className="text-xs text-muted-foreground">Críticos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{ticketStats.open}</div>
                <div className="text-xs text-muted-foreground">Abiertos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{ticketStats.inProgress}</div>
                <div className="text-xs text-muted-foreground">En Progreso</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="escalations">Escalaciones</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">Todas las prioridades</option>
                    <option value="critical">Crítico</option>
                    <option value="high">Alto</option>
                    <option value="medium">Medio</option>
                    <option value="low">Bajo</option>
                  </select>
                  
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Nuevo Ticket
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {ticket.id}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1">{ticket.status.replace('_', ' ').toUpperCase()}</span>
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-sm mb-1">{ticket.subject}</h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {ticket.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {ticket.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ticket.user}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {ticket.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {ticket.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredTickets.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No se encontraron tickets</h3>
                  <p className="text-muted-foreground">
                    No hay tickets que coincidan con los filtros seleccionados.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="escalations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Escalaciones Críticas
              </CardTitle>
              <CardDescription>
                Tickets que requieren atención inmediata del equipo de Super Admin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.filter(t => t.priority === 'critical').map((ticket) => (
                  <div key={ticket.id} className="border-l-4 border-red-500 pl-4 py-3 bg-red-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-red-800">{ticket.subject}</h4>
                        <p className="text-sm text-red-600">{ticket.company} - {ticket.user}</p>
                        <p className="text-xs text-red-500 mt-1">
                          Creado: {new Date(ticket.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive">
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Management</CardTitle>
              <CardDescription>
                Gestiona artículos y documentación para el equipo de soporte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>
                <p className="text-muted-foreground mb-4">
                  Función en desarrollo - Gestión de artículos de ayuda y documentación
                </p>
                <Button variant="outline">
                  Próximamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tickets por Prioridad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Crítico</span>
                    <span className="font-bold text-red-600">
                      {tickets.filter(t => t.priority === 'critical').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Alto</span>
                    <span className="font-bold text-orange-600">
                      {tickets.filter(t => t.priority === 'high').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Medio</span>
                    <span className="font-bold text-yellow-600">
                      {tickets.filter(t => t.priority === 'medium').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bajo</span>
                    <span className="font-bold text-green-600">
                      {tickets.filter(t => t.priority === 'low').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tickets por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Abiertos</span>
                    <span className="font-bold">
                      {tickets.filter(t => t.status === 'open').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">En Progreso</span>
                    <span className="font-bold">
                      {tickets.filter(t => t.status === 'in_progress').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Esperando</span>
                    <span className="font-bold">
                      {tickets.filter(t => t.status === 'waiting').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Resueltos</span>
                    <span className="font-bold text-green-600">
                      {tickets.filter(t => t.status === 'resolved').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 