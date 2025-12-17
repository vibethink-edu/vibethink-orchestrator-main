import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { Slider } from '@/shared/components/ui/slider';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { 
  Activity, 
  Brain, 
  Zap, 
  TrendingUp, 
  MessageSquare,
  Calendar,
  Building,
  BarChart3
} from 'lucide-react';

interface RecentInteraction {
  id: string;
  type: 'CRM' | 'Email' | 'Calendar';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

interface AIQuickSuggestion {
  id: string;
  text: string;
  category: 'productivity' | 'communication' | 'analytics';
}

const UserManagementSidebar: React.FC = () => {
  const [aiCreativity, setAiCreativity] = useState([70]);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoSuggestions, setAutoSuggestions] = useState(true);

  // Datos de ejemplo - Reemplazar con datos reales
  const recentInteractions: RecentInteraction[] = [
    {
      id: '1',
      type: 'CRM',
      title: 'Cliente creado: Innovación Tech',
      description: 'Nuevo cliente registrado en el sistema',
      timestamp: '2 min',
      user: 'María García'
    },
    {
      id: '2',
      type: 'Email',
      title: 'Plantilla generada: Seguimiento ventas',
      description: 'Email automatizado para seguimiento',
      timestamp: '5 min',
      user: 'Carlos López'
    },
    {
      id: '3',
      type: 'Calendar',
      title: 'Reunión agendada con IA',
      description: 'Coordinación automática completada',
      timestamp: '12 min',
      user: 'Ana Martínez'
    },
    {
      id: '4',
      type: 'CRM',
      title: 'Lead calificado: TechCorp',
      description: 'Lead movido a etapa de propuesta',
      timestamp: '15 min',
      user: 'Luis Rodríguez'
    }
  ];

  const quickSuggestions: AIQuickSuggestion[] = [
    { 
      id: '1', 
      text: 'Crear reporte de ventas mensual', 
      category: 'analytics' 
    },
    { 
      id: '2', 
      text: 'Generar factura para último cliente', 
      category: 'productivity' 
    },
    { 
      id: '3', 
      text: 'Optimizar agenda de mañana', 
      category: 'productivity' 
    },
    { 
      id: '4', 
      text: 'Enviar recordatorio de reunión', 
      category: 'communication' 
    }
  ];

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'CRM':
        return <Building className="h-4 w-4" />;
      case 'Email':
        return <MessageSquare className="h-4 w-4" />;
      case 'Calendar':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'CRM':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400';
      case 'Email':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400';
      case 'Calendar':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400';
    }
  };

  const getSuggestionIcon = (category: string) => {
    switch (category) {
      case 'productivity':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'communication':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'analytics':
        return <BarChart3 className="h-4 w-4 text-green-500" />;
      default:
        return <Zap className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-80 border-l border-border bg-muted/30 h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Recent Interactions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Interacciones Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentInteractions.map((interaction) => (
              <div
                key={interaction.id}
                className="bg-background rounded-lg p-3 border"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getInteractionColor(interaction.type)}`}>
                    {getInteractionIcon(interaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{interaction.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{interaction.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{interaction.user}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{interaction.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Configuración IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-enabled" className="text-sm">IA Habilitada</Label>
                <Switch
                  id="ai-enabled"
                  checked={aiEnabled}
                  onCheckedChange={setAiEnabled}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Creatividad</Label>
              <Slider
                value={aiCreativity}
                onValueChange={setAiCreativity}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservador</span>
                <span>{aiCreativity[0]}%</span>
                <span>Creativo</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-suggestions" className="text-sm">Sugerencias Automáticas</Label>
                <Switch
                  id="auto-suggestions"
                  checked={autoSuggestions}
                  onCheckedChange={setAutoSuggestions}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Uso Mensual</Label>
                <Badge variant="secondary" className="text-xs">12 días</Badge>
              </div>
              <Progress value={45} className="h-2" />
              <div className="text-xs text-muted-foreground">15,420 / 50,000 tokens</div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Suggestions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Sugerencias Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickSuggestions.map((suggestion) => (
              <Button
                key={suggestion.id}
                variant="ghost"
                className="w-full justify-start h-auto p-2 text-sm"
              >
                <div className="flex items-start gap-2 text-left">
                  {getSuggestionIcon(suggestion.category)}
                  <span className="text-xs">{suggestion.text}</span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Estadísticas de Uso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Usuarios Activos</span>
              <Badge variant="outline">24</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Interacciones Hoy</span>
              <Badge variant="outline">156</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tiempo Promedio</span>
              <Badge variant="outline">2.3h</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagementSidebar; 
