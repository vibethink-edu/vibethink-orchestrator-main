/**
 * TestBunduiExplorer - Versión simplificada para pruebas
 * 
 * Componente sin dependencias de autenticación para verificar
 * que los componentes de UI funcionen correctamente
 */

import React, { useState } from 'react';

// Componentes básicos de Bundui
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/shared/components/bundui-premium/components/ui/card';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/bundui-premium/components/ui/tabs';
import SimpleDashboard from './SimpleDashboard';

const TestBunduiExplorer: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState('dashboard');

  const renderContent = () => {
    switch (selectedComponent) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <SimpleDashboard />
          </div>
        );
      case 'components':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test de Componentes</CardTitle>
                <CardDescription>
                  Prueba de componentes básicos de Bundui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <SimpleDashboard />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Bundui Explorer
          </h1>
          <p className="text-gray-600">
            Versión de prueba sin autenticación
          </p>
        </div>
        
        <Tabs value={selectedComponent} onValueChange={setSelectedComponent}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="components">Componentes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            {renderContent()}
          </TabsContent>
          
          <TabsContent value="components" className="mt-6">
            {renderContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestBunduiExplorer;
