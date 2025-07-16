
-- Crear tabla para repositorios operacionales
CREATE TABLE public.operational_repositories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('prompts', 'naming-conventions', 'folder-structures', 'mixed')),
  orchestrator_email TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Crear tabla para templates de prompts
CREATE TABLE public.prompt_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  repository_id UUID REFERENCES public.operational_repositories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '[]',
  category TEXT NOT NULL,
  industry TEXT,
  department TEXT,
  created_by UUID NOT NULL REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  version TEXT NOT NULL DEFAULT '1.0.0',
  tags TEXT[] DEFAULT '{}',
  usage_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Crear tabla para convenciones de nomenclatura
CREATE TABLE public.naming_conventions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  repository_id UUID REFERENCES public.operational_repositories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  pattern TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('file', 'folder', 'document', 'project')),
  examples TEXT[] DEFAULT '{}',
  department TEXT,
  created_by UUID NOT NULL REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Crear tabla para templates de estructura de carpetas
CREATE TABLE public.folder_structure_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  repository_id UUID REFERENCES public.operational_repositories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  structure JSONB NOT NULL DEFAULT '[]',
  department TEXT,
  industry TEXT,
  created_by UUID NOT NULL REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  google_drive_integration JSONB DEFAULT NULL
);

-- Crear tabla para orquestadores de empresa
CREATE TABLE public.company_orchestrators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('primary', 'secondary')),
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(company_id, email)
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.operational_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.naming_conventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folder_structure_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_orchestrators ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para operational_repositories
CREATE POLICY "Users can view company repositories" ON public.operational_repositories
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Orchestrators can manage repositories" ON public.operational_repositories
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    ) AND (
      EXISTS (
        SELECT 1 FROM public.company_orchestrators 
        WHERE company_id = operational_repositories.company_id 
        AND email = (SELECT email FROM public.user_profiles WHERE id = auth.uid())
        AND is_active = true
      )
    )
  );

-- Políticas RLS para prompt_templates
CREATE POLICY "Users can view company prompt templates" ON public.prompt_templates
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Orchestrators can manage prompt templates" ON public.prompt_templates
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    ) AND (
      EXISTS (
        SELECT 1 FROM public.company_orchestrators 
        WHERE company_id = prompt_templates.company_id 
        AND email = (SELECT email FROM public.user_profiles WHERE id = auth.uid())
        AND is_active = true
      )
    )
  );

-- Políticas RLS para naming_conventions
CREATE POLICY "Users can view company naming conventions" ON public.naming_conventions
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Orchestrators can manage naming conventions" ON public.naming_conventions
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    ) AND (
      EXISTS (
        SELECT 1 FROM public.company_orchestrators 
        WHERE company_id = naming_conventions.company_id 
        AND email = (SELECT email FROM public.user_profiles WHERE id = auth.uid())
        AND is_active = true
      )
    )
  );

-- Políticas RLS para folder_structure_templates
CREATE POLICY "Users can view company folder templates" ON public.folder_structure_templates
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Orchestrators can manage folder templates" ON public.folder_structure_templates
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    ) AND (
      EXISTS (
        SELECT 1 FROM public.company_orchestrators 
        WHERE company_id = folder_structure_templates.company_id 
        AND email = (SELECT email FROM public.user_profiles WHERE id = auth.uid())
        AND is_active = true
      )
    )
  );

-- Políticas RLS para company_orchestrators
CREATE POLICY "Users can view company orchestrators" ON public.company_orchestrators
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Primary orchestrators can manage orchestrators" ON public.company_orchestrators
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM public.user_profiles WHERE id = auth.uid()
    ) AND (
      EXISTS (
        SELECT 1 FROM public.company_orchestrators 
        WHERE company_id = company_orchestrators.company_id 
        AND email = (SELECT email FROM public.user_profiles WHERE id = auth.uid())
        AND role = 'primary'
        AND is_active = true
      )
    )
  );

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_operational_repositories_company_id ON public.operational_repositories(company_id);
CREATE INDEX idx_prompt_templates_company_id ON public.prompt_templates(company_id);
CREATE INDEX idx_naming_conventions_company_id ON public.naming_conventions(company_id);
CREATE INDEX idx_folder_structure_templates_company_id ON public.folder_structure_templates(company_id);
CREATE INDEX idx_company_orchestrators_company_id ON public.company_orchestrators(company_id);
CREATE INDEX idx_company_orchestrators_email ON public.company_orchestrators(email);
