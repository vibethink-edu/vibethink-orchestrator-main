/**
 * BunduiExplorer - Componente de Exploración Simple
 * 
 * Componente para explorar y probar los componentes premium de Bundui
 */

import React, { useState } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';

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
import { Progress } from '@/shared/components/bundui-premium/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/bundui-premium/components/ui/avatar';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Label } from '@/shared/components/bundui-premium/components/ui/label';
import { Switch } from '@/shared/components/bundui-premium/components/ui/switch';
import { Checkbox } from '@/shared/components/bundui-premium/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/bundui-premium/components/ui/select';
import { Separator } from '@/shared/components/bundui-premium/components/ui/separator';
import { Alert, AlertDescription } from '@/shared/components/bundui-premium/components/ui/alert';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/bundui-premium/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/shared/components/bundui-premium/components/ui/dropdown-menu';

// Iconos
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Star,
  Heart,
  Share,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Info,
  Palette,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Activity,
  Users,
  Building,
  Database,
  Server,
  Cloud,
  Shield,
  Lock,
  Unlock,
  Star as StarIcon,
  Heart as HeartIcon,
} from 'lucide-react';

// IMPORTAR EL DASHBOARD DE BACKUP
import { Dashboard } from '@/shared/components/bundui/Dashboard';
import SimpleDashboard from './SimpleDashboard';

// Componente para mostrar ejemplos de componentes
const ComponentsShowcase: React.FC = () => {
  const [progress, setProgress] = useState(33);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Sección de Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Componentes UI</CardTitle>
            <CardDescription>
              Explora los componentes básicos de Bundui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Premium</Badge>
              <Badge variant="outline">Activo</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progreso</CardTitle>
            <CardDescription>
              Barras de progreso animadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">{progress}% completado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuario</CardTitle>
            <CardDescription>
              Información del usuario actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Administrador</p>
                <p className="text-sm text-gray-600">admin@example.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Formularios */}
      <Card>
        <CardHeader>
          <CardTitle>Formularios</CardTitle>
          <CardDescription>
            Componentes de formularios interactivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Tu nombre" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="guest">Invitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch id="notifications" />
              <Label htmlFor="notifications">Notificaciones</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Acepto los términos</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de Alertas y Diálogos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
            <CardDescription>
              Diferentes tipos de alertas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Esta es una alerta informativa.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                ¡Operación completada exitosamente!
              </AlertDescription>
            </Alert>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Atención: revisa esta información.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diálogos</CardTitle>
            <CardDescription>
              Modales y diálogos interactivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Abrir Diálogo</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>¿Estás seguro?</DialogTitle>
                  <DialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente
                    los datos seleccionados.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>
                    Continuar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Botones */}
      <Card>
        <CardHeader>
          <CardTitle>Botones y Acciones</CardTitle>
          <CardDescription>
            Diferentes estilos de botones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button>Primario</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructivo</Button>
            <Button disabled>Deshabilitado</Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Menú <MoreHorizontal className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const BunduiExplorer: React.FC = () => {
  // const { user } = useAuth();
  // Mock user para debugging
  const user = {
    id: 'test-user',
    email: 'admin@test.com',
    role: 'ADMIN'
  };
  
  const [selectedComponent, setSelectedComponent] = useState('dashboard');

  const renderContent = () => {
    switch (selectedComponent) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Dashboard Principal</h2>
              <SimpleDashboard />
            </div>
          </div>
        );
      case 'components':
        return <ComponentsShowcase />;
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Dashboard Principal</h2>
              <SimpleDashboard />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bundui Explorer
          </h1>
          <p className="text-gray-600">
            Explora y prueba los componentes premium de Bundui
          </p>
          {user && (
            <p className="text-sm text-gray-500 mt-2">
              Conectado como: {user.email}
            </p>
          )}
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

export default BunduiExplorer; 
