
-- Tabla para almacenar configuraciones OAuth de Google Workspace por empresa
CREATE TABLE public.google_workspace_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) NOT NULL,
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  redirect_uri TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT ARRAY[
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/spreadsheets'
  ],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para almacenar tokens de acceso de usuarios
CREATE TABLE public.google_workspace_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_id UUID REFERENCES companies(id) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  scope TEXT NOT NULL,
  token_type TEXT NOT NULL DEFAULT 'Bearer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS para configuraciones OAuth (solo admins de la empresa)
ALTER TABLE public.google_workspace_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company admins can manage Google configs" 
  ON public.google_workspace_configs 
  FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('ADMIN', 'OWNER')
    )
  );

-- RLS para tokens (usuarios solo ven sus propios tokens)
ALTER TABLE public.google_workspace_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own Google tokens" 
  ON public.google_workspace_tokens 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own Google tokens" 
  ON public.google_workspace_tokens 
  FOR ALL 
  USING (user_id = auth.uid());

-- Índices para optimizar consultas
CREATE INDEX idx_google_workspace_configs_company_id ON google_workspace_configs(company_id);
CREATE INDEX idx_google_workspace_tokens_user_id ON google_workspace_tokens(user_id);
CREATE INDEX idx_google_workspace_tokens_company_id ON google_workspace_tokens(company_id);

-- Función para limpiar tokens expirados
CREATE OR REPLACE FUNCTION clean_expired_google_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM google_workspace_tokens 
  WHERE expires_at < now() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;
