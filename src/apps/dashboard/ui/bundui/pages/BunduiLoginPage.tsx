"use client";

import React, { useState } from 'react';
import { BunduiButton } from '../components/common/BunduiButton';
import { BunduiCard, BunduiCardHeader, BunduiCardTitle, BunduiCardDescription, BunduiCardContent, BunduiCardFooter } from '../components/common/BunduiCard';
import { BunduiInput } from '../components/forms/BunduiInput';
import { BunduiBadge } from '../components/data-display/BunduiBadge';
import { useBunduiTheme } from '../hooks/useBunduiTheme';

export const BunduiLoginPage: React.FC = () => {
  const { currentTheme } = useBunduiTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simular login
    setTimeout(() => {
      setIsLoading(false);
      // Aquí iría la lógica real de login
      console.log('Login attempt:', formData);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            VibeThink Orchestrator
          </h1>
          <p className="text-gray-600">
            Inicia sesión en tu cuenta
          </p>
          <BunduiBadge variant="success" className="mt-2">
            Tema: {currentTheme.name}
          </BunduiBadge>
        </div>

        {/* Login Form */}
        <BunduiCard variant="elevated">
          <BunduiCardHeader>
            <BunduiCardTitle>Iniciar Sesión</BunduiCardTitle>
            <BunduiCardDescription>
              Ingresa tus credenciales para acceder al sistema
            </BunduiCardDescription>
          </BunduiCardHeader>
          
          <BunduiCardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Input */}
              <BunduiInput
                label="Correo Electrónico"
                type="email"
                placeholder="usuario@empresa.com"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                error={!!errors.email}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}

              {/* Password Input */}
              <BunduiInput
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                error={!!errors.password}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">Recordarme</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
          </BunduiCardContent>
        </BunduiCard>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <a href="#" className="text-primary hover:underline font-medium">
              Contacta a tu administrador
            </a>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Demo Credenciales</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Email:</strong> admin@vibethink.com</p>
            <p><strong>Password:</strong> demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 