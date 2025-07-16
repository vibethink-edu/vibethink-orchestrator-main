import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const CompanyLogin = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Testing mode: accept "12345" as valid password for any email
      if (password !== '12345') {
        setError(t('auth.login.errors.testPassword'));
        setLoading(false);
        return;
      }

      // Create mock user data based on email for company clients
      let role = 'EMPLOYEE';
      let companyData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Demo Company',
        slug: 'demo-company'
      };

      // Role assignment for company clients
      if (email.toLowerCase().includes('admin')) {
        role = 'ADMIN';
        companyData = {
          id: 'company-admin-123',
          name: 'TechCorp Solutions',
          slug: 'techcorp-solutions'
        };
      } else if (email.toLowerCase().includes('manager')) {
        role = 'MANAGER';
        companyData = {
          id: 'company-manager-456',
          name: 'TechCorp Solutions',
          slug: 'techcorp-solutions'
        };
      } else if (email.toLowerCase().includes('support')) {
        role = 'SUPPORT';
        companyData = {
          id: 'company-support-789',
          name: 'TechCorp Solutions',
          slug: 'techcorp-solutions'
        };
      } else {
        role = 'EMPLOYEE';
        companyData = {
          id: 'company-employee-101',
          name: 'TechCorp Solutions',
          slug: 'techcorp-solutions'
        };
      }

      // Create mock user object for company client
      const mockUser = {
        id: `company-user-${Date.now()}`,
        email: email,
        profile: {
          id: `company-user-${Date.now()}`,
          email: email,
          full_name: email.split('@')[0],
          role: role,
          company_id: companyData.id,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        company: companyData
      };

      // Store in localStorage for testing
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_session', JSON.stringify({
        access_token: 'mock-token',
        user: mockUser
      }));

      // Navigate based on role for company clients
      if (role === 'ADMIN' || role === 'OWNER') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError(t('auth.login.errors.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">AI</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('auth.login.title')}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {t('auth.login.subtitle')}
          </CardDescription>
          <Badge variant="secondary" className="mt-2">
            🏢 Cliente Empresarial
          </Badge>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                {t('auth.login.email')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                {t('auth.login.password')}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" 
              disabled={loading}
            >
              {loading ? t('auth.login.signingIn') : t('auth.login.signInButton')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.login.noAccount')}{' '}
              <Link to="/auth" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                {t('auth.login.signUpLink')}
              </Link>
            </p>
          </div>

          {/* Company testing credentials info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                🏢 Credenciales de Empresa Cliente:
              </h3>
              
              <div className="space-y-2">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-600 dark:text-blue-400">⚙️</span>
                    <span className="font-semibold text-blue-700 dark:text-blue-300">ADMIN EMPRESARIAL</span>
                  </div>
                  <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    admin@techcorp.com / 12345
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✅ Gestión completa de la empresa
                  </div>
                </div>
                
                <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-600 dark:text-green-400">👥</span>
                    <span className="font-semibold text-green-700 dark:text-green-300">MANAGER</span>
                  </div>
                  <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    manager@techcorp.com / 12345
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✅ Gestión de equipos y proyectos
                  </div>
                </div>
                
                <div className="p-3 bg-gray-100 dark:bg-gray-900/30 border border-gray-300 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-600 dark:text-gray-400">👤</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">EMPLOYEE</span>
                  </div>
                  <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    employee@techcorp.com / 12345
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✅ Acceso a herramientas de IA
                  </div>
                </div>
                
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-orange-600 dark:text-orange-400">🛡️</span>
                    <span className="font-semibold text-orange-700 dark:text-orange-300">SUPPORT</span>
                  </div>
                  <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    support@techcorp.com / 12345
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✅ Soporte técnico y ayuda
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg text-xs">
                <div className="font-medium text-amber-700 dark:text-amber-300">💡 Información:</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">
                  Estas credenciales simulan una empresa cliente real. Cada rol tiene permisos específicos dentro de la empresa.
                </div>
              </div>
            </div>
          </div>

          {/* Company benefits */}
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
              🚀 Beneficios para Empresas:
            </h4>
            <ul className="text-xs text-green-700 dark:text-green-400 space-y-1">
              <li>• IA personalizada para cada departamento</li>
              <li>• Gestión centralizada de usuarios</li>
              <li>• Análisis y reportes empresariales</li>
              <li>• Soporte técnico dedicado</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyLogin; 