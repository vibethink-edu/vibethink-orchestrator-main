import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import OAuthButtons from './components/OAuthButtons';

const Login = () => {
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
        setError('Contraseña de prueba incorrecta. Use "12345"');
        setLoading(false);
        return;
      }

      // Create mock user data based on email
      let role = 'EMPLOYEE';
      let companyData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Demo Company',
        slug: 'demo-company'
      };

      // Role assignment with improved logic - Updated AI Pair structure
      if (email.toLowerCase() === 'superadmin@VibeThink.co') {
        role = 'SUPER_ADMIN';
        companyData = {
          id: '111e1111-e11b-11d1-a111-111111111111',
          name: 'AI Pair Platform',
          slug: 'VibeThink-platform'
        };
      } else if (email.toLowerCase() === 'admin@VibeThink.co') {
        role = 'ADMIN';
        companyData = {
          id: '111e1111-e11b-11d1-a111-111111111111',
          name: 'AI Pair Platform',
          slug: 'VibeThink-platform'
        };
      } else if (email.toLowerCase() === 'manager@VibeThink.co') {
        role = 'MANAGER';
        companyData = {
          id: '111e1111-e11b-11d1-a111-111111111111',
          name: 'AI Pair Platform',
          slug: 'VibeThink-platform'
        };
      } else if (email.toLowerCase() === 'employee@VibeThink.co') {
        role = 'EMPLOYEE';
        companyData = {
          id: '111e1111-e11b-11d1-a111-111111111111',
          name: 'AI Pair Platform',
          slug: 'VibeThink-platform'
        };
      } else if (email.toLowerCase() === 'support@VibeThink.co') {
        role = 'SUPPORT';
        companyData = {
          id: '111e1111-e11b-11d1-a111-111111111111',
          name: 'AI Pair Platform',
          slug: 'VibeThink-platform'
        };
      } else if (email.toLowerCase().includes('admin')) {
        role = 'ADMIN';
      } else if (email.toLowerCase().includes('manager')) {
        role = 'MANAGER';
      } else if (email.toLowerCase().includes('support')) {
        role = 'SUPPORT';
      }

      // Create mock user object
      const mockUser = {
        id: `user-${Date.now()}`,
        email: email,
        profile: {
          id: `user-${Date.now()}`,
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

      // Navigate based on role
      if (role === 'SUPER_ADMIN' && companyData.slug === 'VibeThink-platform') {
        navigate('/super-admin');
      } else if (role === 'ADMIN' || role === 'OWNER') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                🧪 TESTING MODE
              </Badge>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
              Accede a tu cuenta de VibeThink
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 h-12"
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors" 
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* OAuth Buttons */}
            <OAuthButtons 
              isLoading={loading}
              setIsLoading={setLoading}
              setError={setError}
            />

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                ¿No tienes cuenta?{' '}
                <Link to="/auth" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>

            {/* Testing credentials info */}
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Credenciales de Prueba:</h3>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">👑</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">SUPER_ADMIN</span>
                  </div>
                  <div className="text-sm font-mono text-slate-700 dark:text-slate-300">
                    superadmin@VibeThink.co / 12345
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✅ Puede cambiar de roles | ✅ Administración global
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                    👥 Equipo AI Pair (@VibeThink.co)
                  </div>
                  
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 dark:text-blue-400">⚙️ ADMIN:</span>
                      <span className="font-mono text-sm">admin@VibeThink.co / 12345</span>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 dark:text-green-400">👥 MANAGER:</span>
                      <span className="font-mono text-sm">manager@VibeThink.co / 12345</span>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">👤 EMPLOYEE:</span>
                      <span className="font-mono text-sm">employee@VibeThink.co / 12345</span>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600 dark:text-orange-400">🛡️ SUPPORT:</span>
                      <span className="font-mono text-sm">support@VibeThink.co / 12345</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-xs">
                  <div className="font-medium text-amber-600 dark:text-amber-400">🔒 Restricción Importante:</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1">
                    Solo <strong>superadmin@VibeThink.co</strong> puede cambiar de roles temporalmente.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login; 