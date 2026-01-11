"use client";

import { useState } from "react";
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle, Label } from '@vibethink/ui';
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Building2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implementar autenticación real
    // Por ahora, redirigir después de un delay simulado
    setTimeout(() => {
      setIsLoading(false);
      // Redirigir al dashboard principal después del login
      // Usamos el CRM de VibeThink como landing inicial
      router.push("/dashboard-vibethink/crm");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">VibeThink Orchestrator</CardTitle>
          <CardDescription>
            Inicia sesión para acceder a tu dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  suppressHydrationWarning
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  suppressHydrationWarning
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar sesión
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-center text-muted-foreground mb-4">
              Accesos de demostración:
            </p>
            <div className="space-y-2 text-sm">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setEmail("demo@vibethink.co");
                  setPassword("12345vtk");
                }}
              >
                Usar credenciales de demo (demo@vibethink.co)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
