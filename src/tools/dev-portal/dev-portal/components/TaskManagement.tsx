// Componente de Gestión de Tareas Pendientes - Dev Portal
// VibeThink 1.0 - Task Management Component

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Lock,
  Plus,
  Edit,
  Trash2,
  Filter
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  type: 'architecture' | 'development' | 'testing' | 'documentation' | 'ui-ux' | 'security';
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

interface TaskFilters {
  status: string;
  priority: string;
  type: string;
  assignee: string;
}

export const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    type: 'all',
    assignee: 'all'
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    type: 'development' as const,
    assignee: '',
    dueDate: '',
    tags: [] as string[]
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    // Cargar tareas desde la API o localStorage
    const savedTasks = localStorage.getItem('dev-portal-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Tareas por defecto
      const defaultTasks: Task[] = [
        {
          id: '1',
          title: 'Revisión de Estructura Actual',
          description: 'Analizar estructura completa del proyecto y verificar compatibilidad con VibeThink 1.0',
          status: 'pending',
          priority: 'high',
          type: 'architecture',
          assignee: 'Marcelo Escallón',
          dueDate: '2025-07-15',
          createdAt: '2025-07-05T10:00:00Z',
          updatedAt: '2025-07-05T10:00:00Z',
          tags: ['opción-c', 'estructura', 'vibethink-1.0']
        },
        {
          id: '2',
          title: 'Componentes UI para Integraciones Contables',
          description: 'Crear dashboard y formularios para gestión de integraciones contables colombianas',
          status: 'pending',
          priority: 'medium',
          type: 'ui-ux',
          assignee: 'Equipo Desarrollo',
          dueDate: '2025-07-20',
          createdAt: '2025-07-05T10:00:00Z',
          updatedAt: '2025-07-05T10:00:00Z',
          tags: ['opción-c', 'ui', 'contabilidad']
        },
        {
          id: '3',
          title: 'Testing Exhaustivo de Integraciones',
          description: 'Implementar tests unitarios y de integración para todas las integraciones contables',
          status: 'pending',
          priority: 'high',
          type: 'testing',
          assignee: 'Equipo QA',
          dueDate: '2025-07-25',
          createdAt: '2025-07-05T10:00:00Z',
          updatedAt: '2025-07-05T10:00:00Z',
          tags: ['opción-c', 'testing', 'integración']
        },
        {
          id: '4',
          title: 'Automatización de Sincronización',
          description: 'Implementar sincronización automática de datos entre sistemas contables',
          status: 'pending',
          priority: 'medium',
          type: 'development',
          assignee: 'Equipo Desarrollo',
          dueDate: '2025-08-01',
          createdAt: '2025-07-05T10:00:00Z',
          updatedAt: '2025-07-05T10:00:00Z',
          tags: ['opción-c', 'automatización', 'sincronización']
        }
      ];
      setTasks(defaultTasks);
      localStorage.setItem('dev-portal-tasks', JSON.stringify(defaultTasks));
    }
  };

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('dev-portal-tasks', JSON.stringify(updatedTasks));
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'blocked': return <Lock className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'architecture': return '🏗️';
      case 'development': return '🔧';
      case 'testing': return '🧪';
      case 'documentation': return '📚';
      case 'ui-ux': return '🎨';
      case 'security': return '🔒';
      default: return '📋';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.type !== 'all' && task.type !== filters.type) return false;
    if (filters.assignee !== 'all' && task.assignee !== filters.assignee) return false;
    return true;
  });

  const addTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'pending',
      priority: newTask.priority,
      type: newTask.type,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: newTask.tags
    };

    saveTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      type: 'development',
      assignee: '',
      dueDate: '',
      tags: []
    });
    setIsAddDialogOpen(false);
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    highPriority: tasks.filter(t => t.priority === 'high').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Tareas Pendientes</h2>
          <p className="text-gray-600">Sistema de seguimiento de tareas del proyecto VibeThink</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nueva Tarea</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Tarea</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Título de la tarea"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Descripción detallada"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Prioridad</label>
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={newTask.type} onValueChange={(value: any) => setNewTask({ ...newTask, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="architecture">Arquitectura</SelectItem>
                      <SelectItem value="development">Desarrollo</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="documentation">Documentación</SelectItem>
                      <SelectItem value="ui-ux">UI/UX</SelectItem>
                      <SelectItem value="security">Seguridad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Asignado a</label>
                  <Input
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    placeholder="Nombre del responsable"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha límite</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={addTask}>
                  Agregar Tarea
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{taskStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-100">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">{taskStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100">
                <span className="text-2xl">🔄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En Progreso</p>
                <p className="text-2xl font-semibold text-gray-900">{taskStats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completadas</p>
                <p className="text-2xl font-semibold text-gray-900">{taskStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-red-100">
                <span className="text-2xl">🚨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Alta Prioridad</p>
                <p className="text-2xl font-semibold text-gray-900">{taskStats.highPriority}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Estado</label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in-progress">En Progreso</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                  <SelectItem value="blocked">Bloqueada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Prioridad</label>
              <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="architecture">Arquitectura</SelectItem>
                  <SelectItem value="development">Desarrollo</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="documentation">Documentación</SelectItem>
                  <SelectItem value="ui-ux">UI/UX</SelectItem>
                  <SelectItem value="security">Seguridad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Asignado</label>
              <Select value={filters.assignee} onValueChange={(value) => setFilters({ ...filters, assignee: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Marcelo Escallón">Marcelo Escallón</SelectItem>
                  <SelectItem value="Equipo Desarrollo">Equipo Desarrollo</SelectItem>
                  <SelectItem value="Equipo QA">Equipo QA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getTypeIcon(task.type)}</span>
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusIcon(task.status)}
                        <span className="ml-1">{task.status}</span>
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {task.assignee && (
                      <span>👤 {task.assignee}</span>
                    )}
                    {task.dueDate && (
                      <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                    )}
                    <span>🕒 {new Date(task.updatedAt).toLocaleDateString()}</span>
                  </div>
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={task.status} onValueChange={(value: any) => updateTaskStatus(task.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="in-progress">En Progreso</SelectItem>
                      <SelectItem value="completed">Completada</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                      <SelectItem value="blocked">Bloqueada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTask(task)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 