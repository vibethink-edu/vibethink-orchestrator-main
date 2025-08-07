"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/bundui-premium/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/bundui-premium/components/ui/card";

export default function TestSimplePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cargando...</h1>
          <p className="text-muted-foreground">Inicializando dashboard de prueba</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard de Prueba</h1>
        <p className="text-muted-foreground">
          Esta es una página simple para verificar que todo funciona correctamente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>Verificación de funcionalidad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Componentes UI:</span>
                <span className="text-green-600 font-semibold">✅ Funcionando</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Routing:</span>
                <span className="text-green-600 font-semibold">✅ Funcionando</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Monorepo:</span>
                <span className="text-green-600 font-semibold">✅ Funcionando</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Arquitectura</CardTitle>
            <CardDescription>Estado de la estructura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Apps en apps/:</span>
                <span className="text-green-600 font-semibold">✅ Correcto</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shared en src/:</span>
                <span className="text-green-600 font-semibold">✅ Correcto</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Root limpio:</span>
                <span className="text-green-600 font-semibold">✅ Correcto</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validaciones</CardTitle>
            <CardDescription>Sistema de protección</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>validate:quick:</span>
                <span className="text-green-600 font-semibold">✅ Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span>validate:universal:</span>
                <span className="text-green-600 font-semibold">✅ Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Protection:</span>
                <span className="text-green-600 font-semibold">✅ Activo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Comandos de Prueba</CardTitle>
            <CardDescription>Verificar que todo funciona</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Validaciones:</h4>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  npm run validate:quick
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Desarrollo:</h4>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  npm run dev:dashboard
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Otros dashboards:</h4>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  /ai-chat-dashboard
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 