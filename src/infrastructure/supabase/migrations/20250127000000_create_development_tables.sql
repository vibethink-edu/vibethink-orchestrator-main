-- Migración: Sistema de Gestión de Desarrollo Interno
-- Fecha: 2025-01-27
-- Autor: Marcelo + AI
-- Propósito: Crear tablas para el módulo de desarrollo interno

-- Proyectos de Desarrollo
CREATE TABLE development_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    phase VARCHAR(50) NOT NULL CHECK (phase IN ('PHASE_0', 'PHASE_1', 'PHASE_2')),
    status VARCHAR(50) NOT NULL DEFAULT 'PLANNING' CHECK (status IN ('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD')),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2),
    actual_cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT development_projects_company_fk FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Tareas de Desarrollo
CREATE TABLE development_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES development_projects(id),
    company_id UUID REFERENCES companies(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) NOT NULL CHECK (task_type IN ('FEATURE', 'BUG', 'REFACTOR', 'TESTING', 'DOCUMENTATION')),
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(50) NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'REVIEW', 'TESTING', 'DONE')),
    assigned_to UUID REFERENCES user_profiles(id),
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2) DEFAULT 0,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT development_tasks_company_fk FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Hitos de Desarrollo
CREATE TABLE development_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES development_projects(id) NOT NULL,
    company_id UUID REFERENCES companies(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED')),
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT development_milestones_company_fk FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Asignaciones de Desarrollo
CREATE TABLE development_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES development_tasks(id) NOT NULL,
    user_id UUID REFERENCES user_profiles(id) NOT NULL,
    company_id UUID REFERENCES companies(id) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('DEVELOPER', 'REVIEWER', 'TESTER', 'LEAD')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT development_assignments_company_fk FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Logs de Tiempo
CREATE TABLE development_time_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES development_tasks(id) NOT NULL,
    user_id UUID REFERENCES user_profiles(id) NOT NULL,
    company_id UUID REFERENCES companies(id) NOT NULL,
    hours DECIMAL(4,2) NOT NULL CHECK (hours > 0),
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT development_time_logs_company_fk FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Reportes de Desarrollo
CREATE TABLE development_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) NOT NULL,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('DAILY', 'WEEKLY', 'MONTHLY', 'PROJECT')),
    report_data JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_by UUID REFERENCES user_profiles(id),
    
    CONSTRAINT development_reports_company_fk FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Índices para optimización
CREATE INDEX idx_development_projects_company ON development_projects(company_id);
CREATE INDEX idx_development_projects_status ON development_projects(status);
CREATE INDEX idx_development_tasks_company ON development_tasks(company_id);
CREATE INDEX idx_development_tasks_project ON development_tasks(project_id);
CREATE INDEX idx_development_tasks_status ON development_tasks(status);
CREATE INDEX idx_development_tasks_assigned ON development_tasks(assigned_to);
CREATE INDEX idx_development_milestones_project ON development_milestones(project_id);
CREATE INDEX idx_development_assignments_task ON development_assignments(task_id);
CREATE INDEX idx_development_time_logs_task ON development_time_logs(task_id);
CREATE INDEX idx_development_time_logs_user ON development_time_logs(user_id);

-- Habilitar RLS
ALTER TABLE development_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_reports ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para vibethink (tenant interno)
-- Nota: Reemplazar 'vibethink-UUID' con el UUID real de la empresa vibethink
CREATE POLICY "ai_pair_development_projects_access" ON development_projects
    FOR ALL USING (company_id = 'vibethink-UUID');

CREATE POLICY "ai_pair_development_tasks_access" ON development_tasks
    FOR ALL USING (company_id = 'vibethink-UUID');

CREATE POLICY "ai_pair_development_milestones_access" ON development_milestones
    FOR ALL USING (company_id = 'vibethink-UUID');

CREATE POLICY "ai_pair_development_assignments_access" ON development_assignments
    FOR ALL USING (company_id = 'vibethink-UUID');

CREATE POLICY "ai_pair_development_time_logs_access" ON development_time_logs
    FOR ALL USING (company_id = 'vibethink-UUID');

CREATE POLICY "ai_pair_development_reports_access" ON development_reports
    FOR ALL USING (company_id = 'vibethink-UUID');

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_development_projects_updated_at 
    BEFORE UPDATE ON development_projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_development_tasks_updated_at 
    BEFORE UPDATE ON development_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_development_milestones_updated_at 
    BEFORE UPDATE ON development_milestones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 