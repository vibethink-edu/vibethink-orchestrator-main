/**
 * Servicio de API para el sistema de gestión de desarrollo interno
 * Conecta con Supabase para operaciones CRUD de proyectos, tareas, hitos, etc.
 * 
 * @author Marcelo + AI
 * @version 1.0.0
 * @date 2025-01-27
 */

import { supabase } from '@/integrations/supabase/client';
import {
  DevelopmentProject,
  DevelopmentTask,
  DevelopmentMilestone,
  DevelopmentAssignment,
  DevelopmentTimeLog,
  DevelopmentReport,
  CreateTaskForm,
  UpdateTaskForm,
  CreateProjectForm,
  TaskFilters,
  ProjectFilters,
  TaskType,
  TaskPriority,
  TaskStatus,
  ProjectPhase,
  ProjectStatus,
  MilestoneStatus,
  AssignmentRole,
  ReportType
} from '@/components/development/task-manager/taskTypes';

// Constante para el tenant interno AI-PAIR
const AI_PAIR_COMPANY_ID = process.env.NEXT_PUBLIC_AI_PAIR_COMPANY_ID || 'AI-PAIR-UUID';

/**
 * Clase principal para el servicio de desarrollo
 */
export class DevelopmentService {
  private companyId: string;

  constructor(companyId: string = AI_PAIR_COMPANY_ID) {
    this.companyId = companyId;
  }

  // ========================================
  // PROYECTOS
  // ========================================

  /**
   * Crear un nuevo proyecto de desarrollo
   */
  async createProject(project: CreateProjectForm): Promise<DevelopmentProject> {
    try {
      const { data, error } = await supabase
        .from('development_projects')
        .insert({
          ...project,
          company_id: this.companyId,
          actual_cost: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // TODO: log 'Error creating project:' error
      throw new Error(`Error al crear proyecto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtener todos los proyectos con filtros opcionales
   */
  async getProjects(filters?: ProjectFilters): Promise<DevelopmentProject[]> {
    try {
      let query = supabase
        .from('development_projects')
        .select('*')
        .eq('company_id', this.companyId);

      // Aplicar filtros
      if (filters?.phase?.length) {
        query = query.in('phase', filters.phase);
      }
      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }
      if (filters?.start_date_from) {
        query = query.gte('start_date', filters.start_date_from);
      }
      if (filters?.start_date_to) {
        query = query.lte('start_date', filters.start_date_to);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      // TODO: log 'Error fetching projects:' error
      throw new Error(`Error al obtener proyectos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtener un proyecto por ID
   */
  async getProject(id: string): Promise<DevelopmentProject> {
    try {
      const { data, error } = await supabase
        .from('development_projects')
        .select('*')
        .eq('id', id)
        .eq('company_id', this.companyId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // TODO: log 'Error fetching project:' error
      throw new Error(`Error al obtener proyecto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Actualizar un proyecto
   */
  async updateProject(id: string, updates: Partial<DevelopmentProject>): Promise<DevelopmentProject> {
    try {
      const { data, error } = await supabase
        .from('development_projects')
        .update(updates)
        .eq('id', id)
        .eq('company_id', this.companyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // TODO: log 'Error updating project:' error
      throw new Error(`Error al actualizar proyecto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Eliminar un proyecto
   */
  async deleteProject(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('development_projects')
        .delete()
        .eq('id', id)
        .eq('company_id', this.companyId);

      if (error) throw error;
    } catch (error) {
      // TODO: log 'Error deleting project:' error
      throw new Error(`Error al eliminar proyecto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  // ========================================
  // TAREAS
  // ========================================

  /**
   * Crear una nueva tarea
   */
  async createTask(task: CreateTaskForm): Promise<DevelopmentTask> {
    try {
      const { data, error } = await supabase
        .from('development_tasks')
        .insert({
          ...task,
          company_id: this.companyId,
          actual_hours: 0
        })
        .select(`
          *,
          project:development_projects(*),
          assignee:user_profiles(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // TODO: log 'Error creating task:' error
      throw new Error(`Error al crear tarea: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtener todas las tareas con filtros opcionales
   */
  async getTasks(filters?: TaskFilters): Promise<DevelopmentTask[]> {
    try {
      let query = supabase
        .from('development_tasks')
        .select(`
          *,
          project:development_projects(*),
          assignee:user_profiles(*),
          assignments:development_assignments(*),
          time_logs:development_time_logs(*)
        `)
        .eq('company_id', this.companyId);

      // Aplicar filtros
      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }
      if (filters?.priority?.length) {
        query = query.in('priority', filters.priority);
      }
      if (filters?.task_type?.length) {
        query = query.in('task_type', filters.task_type);
      }
      if (filters?.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      if (filters?.project_id) {
        query = query.eq('project_id', filters.project_id);
      }
      if (filters?.due_date_from) {
        query = query.gte('due_date', filters.due_date_from);
      }
      if (filters?.due_date_to) {
        query = query.lte('due_date', filters.due_date_to);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      // TODO: log 'Error fetching tasks:' error
      throw new Error(`Error al obtener tareas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtener una tarea por ID
   */
  async getTask(id: string): Promise<DevelopmentTask> {
    try {
      const { data, error } = await supabase
        .from('development_tasks')
        .select(`
          *,
          project:development_projects(*),
          assignee:user_profiles(*),
          assignments:development_assignments(*),
          time_logs:development_time_logs(*)
        `)
        .eq('id', id)
        .eq('company_id', this.companyId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // TODO: log 'Error fetching task:' error
      throw new Error(`Error al obtener tarea: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Actualizar una tarea
   */
  async updateTask(id: string, updates: UpdateTaskForm): Promise<DevelopmentTask> {
    try {
      const { data, error } = await supabase
        .from('development_tasks')
        .update(updates)
        .eq('id', id)
        .eq('company_id', this.companyId)
        .select(`
          *,
          project:development_projects(*),
          assignee:user_profiles(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // TODO: log 'Error updating task:' error
      throw new Error(`Error al actualizar tarea: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Eliminar una tarea
   */
  async deleteTask(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('development_tasks')
        .delete()
        .eq('id', id)
        .eq('company_id', this.companyId);

      if (error) throw error;
    } catch (error) {
      // TODO: log 'Error deleting task:' error
      throw new Error(`Error al eliminar tarea: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  // ========================================
  // HITOS
  // ========================================

  /**
   * Crear un nuevo hito
   */
  async createMilestone(milestone: Omit<DevelopmentMilestone, 'id' | 'created_at' | 'updated_at'>): Promise<DevelopmentMilestone> {
    try {
      const { data, error } = await supabase
        .from('development_milestones')
        .insert({
          ...milestone,
          company_id: this.companyId
        })
        .select(`
          *,
          project:development_projects(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // TODO: log 'Error creating milestone:' error
      throw new Error(`Error al crear hito: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtener hitos de un proyecto
   */
  async getMilestones(projectId: string): Promise<DevelopmentMilestone[]> {
    try {
      const { data, error } = await supabase
        .from('development_milestones')
        .select(`
          *,
          project:development_projects(*)
        `)
        .eq('project_id', projectId)
        .eq('company_id', this.companyId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      // TODO: log 'Error fetching milestones:' error
      throw new Error(`Error al obtener hitos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Actualizar un hito
   */
  async updateMilestone(id: string, updates: Partial<DevelopmentMilestone>): Promise<DevelopmentMilestone> {
    try {
      const { data, error } = await supabase
        .from('development_milestones')
        .update(updates)
        .eq('id', id)
        .eq('company_id', this.companyId)
        .select(`
          *,
          project:development_projects(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // TODO: log 'Error updating milestone:' error
      throw new Error(`Error al actualizar hito: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  // ========================================
  // ASIGNACIONES
  // ========================================

  /**
   * Asignar un usuario a una tarea
   */
  async assignTask(taskId: string, userId: string, role: AssignmentRole): Promise<DevelopmentAssignment> {
    try {
      const { data, error } = await supabase
        .from('development_assignments')
        .insert({
          task_id: taskId,
          user_id: userId,
          company_id: this.companyId,
          role
        })
        .select(`
          *,
          task:development_tasks(*),
          user:user_profiles(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // TODO: log 'Error assigning task:' error
      throw new Error(`Error al asignar tarea: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Desasignar un usuario de una tarea
   */
  async unassignTask(taskId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('development_assignments')
        .delete()
        .eq('task_id', taskId)
        .eq('user_id', userId)
        .eq('company_id', this.companyId);

      if (error) throw error;
    } catch (error) {
      // TODO: log 'Error unassigning task:' error
      throw new Error(`Error al desasignar tarea: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  // ========================================
  // LOGS DE TIEMPO
  // ========================================

  /**
   * Registrar tiempo en una tarea
   */
  async logTime(taskId: string, hours: number, description?: string, date?: string): Promise<DevelopmentTimeLog> {
    try {
      const { data, error } = await supabase
        .from('development_time_logs')
        .insert({
          task_id: taskId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          company_id: this.companyId,
          hours,
          description,
          date: date || new Date().toISOString().split('T')[0]
        })
        .select(`
          *,
          task:development_tasks(*),
          user:user_profiles(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // TODO: log 'Error logging time:' error
      throw new Error(`Error al registrar tiempo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtener logs de tiempo de una tarea
   */
  async getTimeLogs(taskId: string): Promise<DevelopmentTimeLog[]> {
    try {
      const { data, error } = await supabase
        .from('development_time_logs')
        .select(`
          *,
          task:development_tasks(*),
          user:user_profiles(*)
        `)
        .eq('task_id', taskId)
        .eq('company_id', this.companyId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      // TODO: log 'Error fetching time logs:' error
      throw new Error(`Error al obtener logs de tiempo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  // ========================================
  // REPORTES
  // ========================================

  /**
   * Generar un reporte
   */
  async generateReport(reportType: ReportType, reportData: Record<string, any>): Promise<DevelopmentReport> {
    try {
      const { data, error } = await supabase
        .from('development_reports')
        .insert({
          company_id: this.companyId,
          report_type: reportType,
          report_data: reportData,
          generated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select(`
          *,
          generator:user_profiles(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // TODO: log 'Error generating report:' error
      throw new Error(`Error al generar reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtener reportes
   */
  async getReports(reportType?: ReportType): Promise<DevelopmentReport[]> {
    try {
      let query = supabase
        .from('development_reports')
        .select(`
          *,
          generator:user_profiles(*)
        `)
        .eq('company_id', this.companyId);

      if (reportType) {
        query = query.eq('report_type', reportType);
      }

      const { data, error } = await query.order('generated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      // TODO: log 'Error fetching reports:' error
      throw new Error(`Error al obtener reportes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}

// Instancia singleton del servicio
export const developmentService = new DevelopmentService();

// Exportar tipos para uso en otros archivos
export type { 
  DevelopmentProject,
  DevelopmentTask,
  DevelopmentMilestone,
  DevelopmentAssignment,
  DevelopmentTimeLog,
  DevelopmentReport,
  CreateTaskForm,
  UpdateTaskForm,
  CreateProjectForm,
  TaskFilters,
  ProjectFilters
}; 