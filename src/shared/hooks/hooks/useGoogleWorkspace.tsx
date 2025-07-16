
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface GoogleWorkspaceConfig {
  id: string;
  company_id: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scopes: string[];
  is_active: boolean;
}

interface GoogleWorkspaceToken {
  id: string;
  user_id: string;
  company_id: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string;
  scope: string;
  token_type: string;
}

export const useGoogleWorkspace = () => {
  const [config, setConfig] = useState<GoogleWorkspaceConfig | null>(null);
  const [token, setToken] = useState<GoogleWorkspaceToken | null>(null);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // ============= CONFIGURATION MANAGEMENT =============
  const saveConfig = async (configData: {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
  }) => {
    setLoading(true);
    try {
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile) {
        throw new Error('No se encontró el perfil de usuario');
      }

      const { data, error } = await supabase
        .from('google_workspace_configs')
        .upsert({
          company_id: userProfile.company_id,
          client_id: configData.client_id,
          client_secret: configData.client_secret,
          redirect_uri: configData.redirect_uri,
          scopes: [
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/documents',
            'https://www.googleapis.com/auth/spreadsheets'
          ],
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setConfig(data);
      toast.success('Configuración de Google Workspace guardada');
      return data;
    } catch (error) {
      console.error('Error saving Google config:', error);
      toast.error('Error al guardar la configuración');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ============= OAUTH FLOW =============
  const initiateOAuth = async () => {
    if (!config) {
      toast.error('Primero configura las credenciales OAuth');
      return;
    }

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', config.client_id);
    authUrl.searchParams.set('redirect_uri', config.redirect_uri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', config.scopes.join(' '));
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');

    // Abrir ventana de autorización
    window.open(authUrl.toString(), '_blank');
  };

  const handleOAuthCallback = async (code: string) => {
    if (!config) return;

    setLoading(true);
    try {
      // Intercambiar código por tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: config.client_id,
          client_secret: config.client_secret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: config.redirect_uri,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error_description || 'Error al obtener tokens');
      }

      // Guardar tokens en Supabase
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();
      
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const { data, error } = await supabase
        .from('google_workspace_tokens')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          company_id: userProfile?.company_id,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: expiresAt,
          scope: tokenData.scope,
          token_type: tokenData.token_type || 'Bearer'
        })
        .select()
        .single();

      if (error) throw error;

      setToken(data);
      setIsConnected(true);
      toast.success('¡Conectado exitosamente a Google Workspace!');
      return data;
    } catch (error) {
      console.error('Error in OAuth callback:', error);
      toast.error('Error al conectar con Google Workspace');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ============= TOKEN REFRESH =============
  const refreshToken = async () => {
    if (!config || !token?.refresh_token) return;

    try {
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: config.client_id,
          client_secret: config.client_secret,
          refresh_token: token.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        throw new Error('Error al refrescar token');
      }

      const expiresAt = new Date(Date.now() + refreshData.expires_in * 1000).toISOString();

      const { data, error } = await supabase
        .from('google_workspace_tokens')
        .update({
          access_token: refreshData.access_token,
          expires_at: expiresAt,
        })
        .eq('id', token.id)
        .select()
        .single();

      if (error) throw error;

      setToken(data);
      return data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      setIsConnected(false);
      return null;
    }
  };

  // ============= GOOGLE APIS =============
  const makeGoogleAPICall = async (url: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error('No hay token de acceso disponible');
    }

    // Verificar si el token está próximo a expirar
    const expiresAt = new Date(token.expires_at);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();

    // Si expira en menos de 5 minutos, renovar
    if (timeUntilExpiry < 5 * 60 * 1000) {
      await refreshToken();
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `${token.token_type} ${token.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    return response.json();
  };

  // ============= ASSISTANT FUNCTIONS =============
  const sendEmail = async (to: string[], subject: string, body: string, cc?: string[]) => {
    try {
      const message = {
        raw: btoa(
          `To: ${to.join(', ')}\r\n` +
          (cc ? `Cc: ${cc.join(', ')}\r\n` : '') +
          `Subject: ${subject}\r\n` +
          `Content-Type: text/html; charset=utf-8\r\n\r\n` +
          body
        ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      };

      const result = await makeGoogleAPICall(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          body: JSON.stringify(message),
        }
      );

      toast.success('Email enviado exitosamente');
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error al enviar email');
      throw error;
    }
  };

  const createDocument = async (title: string, content: string) => {
    try {
      // Crear documento
      const createResult = await makeGoogleAPICall(
        'https://docs.googleapis.com/v1/documents',
        {
          method: 'POST',
          body: JSON.stringify({
            title,
          }),
        }
      );

      // Insertar contenido
      if (content) {
        await makeGoogleAPICall(
          `https://docs.googleapis.com/v1/documents/${createResult.documentId}:batchUpdate`,
          {
            method: 'POST',
            body: JSON.stringify({
              requests: [
                {
                  insertText: {
                    location: {
                      index: 1,
                    },
                    text: content,
                  },
                },
              ],
            }),
          }
        );
      }

      toast.success('Documento creado exitosamente');
      return createResult;
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Error al crear documento');
      throw error;
    }
  };

  const organizeFile = async (fileId: string, targetFolderId: string) => {
    try {
      // Mover archivo a carpeta
      const result = await makeGoogleAPICall(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            addParents: targetFolderId,
          }),
        }
      );

      toast.success('Archivo organizado exitosamente');
      return result;
    } catch (error) {
      console.error('Error organizing file:', error);
      toast.error('Error al organizar archivo');
      throw error;
    }
  };

  // ============= INITIALIZATION =============
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('company_id')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (userProfile) {
          const { data: configData } = await supabase
            .from('google_workspace_configs')
            .select('*')
            .eq('company_id', userProfile.company_id)
            .eq('is_active', true)
            .single();

          if (configData) {
            setConfig(configData);
          }

          const { data: tokenData } = await supabase
            .from('google_workspace_tokens')
            .select('*')
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
            .single();

          if (tokenData) {
            setToken(tokenData);
            setIsConnected(true);
          }
        }
      } catch (error) {
        console.error('Error loading Google Workspace config:', error);
      }
    };

    loadConfig();
  }, []);

  return {
    // State
    config,
    token,
    loading,
    isConnected,

    // Configuration
    saveConfig,

    // OAuth Flow
    initiateOAuth,
    handleOAuthCallback,
    refreshToken,

    // Assistant Functions
    sendEmail,
    createDocument,
    organizeFile,
    makeGoogleAPICall,
  };
};
