"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Mail, Lock, Building2, Users } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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

      // Role assignment with improved logic
      if (email.toLowerCase() === 'superadmin@VibeThink.co') {
        role = 'SUPER_ADMIN';
        companyData = {
          id: '111e1111-e11b-11d1-a111-111111111111',
          name: 'VibeThink Platform',
          slug: 'VibeThink-platform'
        };
      } else if (email.toLowerCase() === 'admin@VibeThink.co') {
        role = 'ADMIN';
        companyData = {
          id: '111e1111-e11b-11d1-a111-111111111111',
          name: 'VibeThink Platform',
          slug: 'VibeThink-platform'
        };
      } else if (email.toLowerCase() === 'manager@VibeThink.co') {
        role = 'MANAGER';
        companyData = {
          id: '111e1111-e11b-11d1-a111-111111111111',
          name: 'VibeThink Platform',
          slug: 'VibeThink-platform'
        };
      } else if (email.toLowerCase() === 'employee@VibeThink.co') {
        role = 'EMPLOYEE';
        companyData = {
          id: '111e1111-e11b-11d1-a111-111111111111',
          name: 'VibeThink Platform',
          slug: 'VibeThink-platform'
        };
      } else if (email.toLowerCase() === 'support@VibeThink.co') {
        role = 'SUPPORT';
        companyData = {
          id: '111e1111-e11b-11d1-a111-111111111111',
          name: 'VibeThink Platform',
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
        router.push('/admin');
      } else if (role === 'ADMIN' || role === 'OWNER') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
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
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            VibeThink Orchestrator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enterprise SaaS Platform
          </p>
          <Badge variant="secondary" className="mt-2">
            VThink 1.0
          </Badge>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Test Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Credenciales de Prueba:
              </h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span><strong>SUPER_ADMIN:</strong> superadmin@VibeThink.co</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span><strong>ADMIN:</strong> admin@VibeThink.co</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span><strong>MANAGER:</strong> manager@VibeThink.co</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span><strong>EMPLOYEE:</strong> employee@VibeThink.co</span>
                </div>
                <div className="mt-2 text-xs">
                  <strong>Password para todos:</strong> 12345
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 VibeThink Orchestrator. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
} 