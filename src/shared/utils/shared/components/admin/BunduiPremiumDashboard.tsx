/**
 * BunduiPremiumDashboard - VThink 1.0 Integration
 * 
 * Dashboard premium de exploración completa que muestra todos los componentes
 * premium de Bundui disponibles para VThink Orchestrator.
 */

import React, { useState } from 'react';
import { 
  BunduiPremiumProvider, 
  PremiumComponentWrapper,
  useBunduiPremium 
} from '@/shared/components/bundui-premium/BunduiPremiumProvider';

// Componentes Bundui UI (solo los que existen)
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/shared/components/bundui-premium/components/ui/dropdown-menu';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Label } from '@/shared/components/bundui-premium/components/ui/label';
import { Switch } from '@/shared/components/bundui-premium/components/ui/switch';
import { Slider } from '@/shared/components/bundui-premium/components/ui/slider';
import { Checkbox } from '@/shared/components/bundui-premium/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/shared/components/bundui-premium/components/ui/radio-group';
import { Textarea } from '@/shared/components/bundui-premium/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/bundui-premium/components/ui/select';
import { Skeleton } from '@/shared/components/bundui-premium/components/ui/skeleton';
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/bundui-premium/components/ui/sheet';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/bundui-premium/components/ui/accordion';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/bundui-premium/components/ui/collapsible';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/shared/components/bundui-premium/components/ui/navigation-menu';
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/shared/components/bundui-premium/components/ui/command';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/components/bundui-premium/components/ui/context-menu';
import { 
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/shared/components/bundui-premium/components/ui/menubar';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/bundui-premium/components/ui/popover';
import { 
  ScrollArea,
  ScrollBar,
} from '@/shared/components/bundui-premium/components/ui/scroll-area';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/bundui-premium/components/ui/table';
import { 
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/shared/components/bundui-premium/components/ui/toast';
import { Toggle } from '@/shared/components/bundui-premium/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/bundui-premium/components/ui/toggle-group';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/bundui-premium/components/ui/breadcrumb';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/bundui-premium/components/ui/alert-dialog';

// Componentes especializados Bundui (solo los que existen y exportan correctamente)
import { DateTimePicker } from '@/shared/components/bundui-premium/components/date-time-picker';
import CustomDateRangePicker from '@/shared/components/bundui-premium/components/custom-date-range-picker';
import { ExportButton as CardActionMenus } from '@/shared/components/bundui-premium/components/CardActionMenus';
import Icon from '@/shared/components/bundui-premium/components/icon';
import ActiveTheme from '@/shared/components/bundui-premium/components/ActiveTheme';

// Hooks y utilidades VThink
import { useAuth } from '@/shared/hooks/useAuth';
import SystemDebugPanel from './SystemDebugPanel';
import DashboardNavigator from './DashboardNavigator';
// Elimina cualquier referencia a FeatureGate y a íconos de Lucide inexistentes
// Elimina cualquier uso de componentes que no existan
// El archivo ahora debe ser compilable y funcional.

/**
 * Componente principal del dashboard premium de exploración
 */
const BunduiPremiumDashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const { isPremiumEnabled, theme } = useBunduiPremium();
  const [activeTab, setActiveTab] = useState('overview');
  const [showToast, setShowToast] = useState(false);
  const [sliderValue, setSliderValue] = useState([50]);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [selectValue, setSelectValue] = useState('');
  const [switchValue, setSwitchValue] = useState(false);
  const [toggleValue, setToggleValue] = useState('bold');
  const [textareaValue, setTextareaValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Verificar permisos premium
  if (!hasPermission('ADMIN')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Acceso Premium Requerido
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Necesitas permisos de administrador para acceder al dashboard premium.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BunduiPremiumProvider isPremiumEnabled={true} theme={theme}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        
        {/* Panel de Debug - Solo para rutas de test */}
        {window.location.pathname.includes('test') && (
          <div className="p-4">
            <SystemDebugPanel />
          </div>
        )}
        
        {/* Header Premium */}
        <div className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">VT</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                    VThink Premium Explorer
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Exploración Completa de Componentes Bundui
                  </p>
                </div>
              </div>
            </div>
            
            {/* Dashboard Navigator en el centro */}
            <div className="flex-1 flex justify-center">
              <DashboardNavigator />
            </div>
            
            <div className="ml-auto flex items-center space-x-4">
              <PremiumComponentWrapper
                fallback={
                  <Badge variant="secondary">Versión Estándar</Badge>
                }
              >
                <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  ✨ Premium
                </Badge>
              </PremiumComponentWrapper>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.png" alt="User" />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.email || 'Usuario Premium'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Configuración</DropdownMenuItem>
                  <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 space-y-4 p-4 pt-6">
          {/* Tabs de Exploración */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Vista General</TabsTrigger>
              <TabsTrigger value="components">Componentes</TabsTrigger>
              <TabsTrigger value="forms">Formularios</TabsTrigger>
              <TabsTrigger value="navigation">Navegación</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="data">Datos</TabsTrigger>
            </TabsList>
            
            {/* Vista General */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Métricas Premium */}
                <PremiumComponentWrapper>
                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Componentes UI</CardTitle>
                      <Icon name="paintbrush" className="h-4 w-4 text-blue-200" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">47</div>
                      <p className="text-xs text-blue-200">Componentes disponibles</p>
                    </CardContent>
                  </Card>
                </PremiumComponentWrapper>

                <PremiumComponentWrapper>
                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Temas</CardTitle>
                      <Icon name="paintbrush" className="h-4 w-4 text-green-200" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-green-200">Temas premium</p>
                    </CardContent>
                  </Card>
                </PremiumComponentWrapper>

                <PremiumComponentWrapper>
                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Iconos</CardTitle>
                      <Icon name="zap" className="h-4 w-4 text-purple-200" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1000+</div>
                      <p className="text-xs text-purple-200">Iconos Lucide</p>
                    </CardContent>
                  </Card>
                </PremiumComponentWrapper>

                <PremiumComponentWrapper>
                  <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Funcionalidades</CardTitle>
                      <Icon name="target" className="h-4 w-4 text-orange-200" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">25+</div>
                      <p className="text-xs text-orange-200">Funcionalidades avanzadas</p>
                    </CardContent>
                  </Card>
                </PremiumComponentWrapper>
              </div>

              {/* Componentes Destacados */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <PremiumComponentWrapper>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="calendar" className="h-5 w-5" />
                        Date Range Picker
                      </CardTitle>
                      <CardDescription>
                        Selector de rangos de fechas avanzado
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CustomDateRangePicker />
                    </CardContent>
                  </Card>
                </PremiumComponentWrapper>

                <PremiumComponentWrapper>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="clock" className="h-5 w-5" />
                        DateTime Picker
                      </CardTitle>
                      <CardDescription>
                        Selector de fecha y hora
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DateTimePicker 
                        date={new Date()} 
                        setDate={(date) => {}} 
                      />
                    </CardContent>
                  </Card>
                </PremiumComponentWrapper>

                <PremiumComponentWrapper>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="paintbrush" className="h-5 w-5" />
                        Active Theme
                      </CardTitle>
                      <CardDescription>
                        Información del tema activo
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ActiveTheme />
                    </CardContent>
                  </Card>
                </PremiumComponentWrapper>
              </div>
            </TabsContent>

            {/* Componentes */}
            <TabsContent value="components" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Botones */}
                <Card>
                  <CardHeader>
                    <CardTitle>Botones</CardTitle>
                    <CardDescription>Variantes de botones disponibles</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Button>Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle>Badges</CardTitle>
                    <CardDescription>Indicadores y etiquetas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge variant="outline">Outline</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Avatars */}
                <Card>
                  <CardHeader>
                    <CardTitle>Avatars</CardTitle>
                    <CardDescription>Imágenes de perfil</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Avatar>
                        <AvatarFallback>AB</AvatarFallback>
                      </Avatar>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Progress</CardTitle>
                    <CardDescription>Barras de progreso</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Progress value={33} />
                    <Progress value={66} />
                    <Progress value={100} />
                  </CardContent>
                </Card>

                {/* Skeleton */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skeleton</CardTitle>
                    <CardDescription>Estados de carga</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </CardContent>
                </Card>

                {/* Separator */}
                <Card>
                  <CardHeader>
                    <CardTitle>Separator</CardTitle>
                    <CardDescription>Separadores visuales</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>Contenido arriba</div>
                    <Separator />
                    <div>Contenido abajo</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Formularios */}
            <TabsContent value="forms" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Inputs</CardTitle>
                    <CardDescription>Campos de entrada</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="tu@email.com"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="textarea">Textarea</Label>
                      <Textarea 
                        id="textarea" 
                        placeholder="Escribe algo aquí..."
                        value={textareaValue}
                        onChange={(e) => setTextareaValue(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="select">Select</Label>
                      <Select value={selectValue} onValueChange={setSelectValue}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Opción 1</SelectItem>
                          <SelectItem value="option2">Opción 2</SelectItem>
                          <SelectItem value="option3">Opción 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Controles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Controles</CardTitle>
                    <CardDescription>Switches, checkboxes, etc.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="airplane-mode" 
                        checked={switchValue}
                        onCheckedChange={setSwitchValue}
                      />
                      <Label htmlFor="airplane-mode">Modo avión</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={checkboxValue}
                        onCheckedChange={(checked) => setCheckboxValue(checked === true)}
                      />
                      <Label htmlFor="terms">Acepto los términos</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Radio Group</Label>
                      <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option1" id="r1" />
                          <Label htmlFor="r1">Opción 1</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option2" id="r2" />
                          <Label htmlFor="r2">Opción 2</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option3" id="r3" />
                          <Label htmlFor="r3">Opción 3</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Slider: {sliderValue}</Label>
                      <Slider
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        max={100}
                        step={1}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Navegación */}
            <TabsContent value="navigation" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Breadcrumb */}
                <Card>
                  <CardHeader>
                    <CardTitle>Breadcrumb</CardTitle>
                    <CardDescription>Navegación jerárquica</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Premium</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </CardContent>
                </Card>

                {/* Navigation Menu */}
                <Card>
                  <CardHeader>
                    <CardTitle>Navigation Menu</CardTitle>
                    <CardDescription>Menú de navegación</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="grid gap-3 p-4 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                              <div className="row-span-3">
                                <NavigationMenuLink asChild>
                                  <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                                    <div className="mb-2 mt-4 text-lg font-medium">
                                      VThink Dashboard
                                    </div>
                                    <p className="text-sm leading-tight text-muted-foreground">
                                      Panel principal de administración
                                    </p>
                                  </a>
                                </NavigationMenuLink>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <NavigationMenuLink asChild>
                                  <a className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                    <div className="text-sm font-medium leading-none">Analytics</div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      Métricas y estadísticas
                                    </p>
                                  </a>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                  <a className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                    <div className="text-sm font-medium leading-none">Users</div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      Gestión de usuarios
                                    </p>
                                  </a>
                                </NavigationMenuLink>
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Configuración
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Ayuda
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Feedback */}
            <TabsContent value="feedback" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Alerts</CardTitle>
                    <CardDescription>Mensajes informativos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Icon name="info" className="h-4 w-4" />
                      <AlertDescription>
                        Esta es una alerta informativa.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Icon name="check-circle" className="h-4 w-4" />
                      <AlertDescription>
                        Operación completada exitosamente.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Icon name="alert-circle" className="h-4 w-4" />
                      <AlertDescription>
                        Ha ocurrido un error inesperado.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Dialogs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Dialogs</CardTitle>
                    <CardDescription>Ventanas modales</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Open Dialog</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>¿Estás seguro?</DialogTitle>
                          <DialogDescription>
                            Esta acción no se puede deshacer.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline">Cancelar</Button>
                          <Button>Confirmar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline">Open Sheet</Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Configuración</SheetTitle>
                          <SheetDescription>
                            Ajusta las configuraciones de tu cuenta.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                          <p>Contenido del sheet aquí...</p>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Datos */}
            <TabsContent value="data" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Table</CardTitle>
                    <CardDescription>Tabla de datos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Juan Pérez</TableCell>
                          <TableCell>juan@example.com</TableCell>
                          <TableCell>Admin</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Activo</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>María García</TableCell>
                          <TableCell>maria@example.com</TableCell>
                          <TableCell>Manager</TableCell>
                          <TableCell>
                            <Badge variant="outline">Pendiente</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Carlos López</TableCell>
                          <TableCell>carlos@example.com</TableCell>
                          <TableCell>Employee</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Inactivo</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Accordion */}
                <Card>
                  <CardHeader>
                    <CardTitle>Accordion</CardTitle>
                    <CardDescription>Contenido colapsable</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>¿Qué es VThink?</AccordionTrigger>
                        <AccordionContent>
                          VThink es una plataforma de orquestación empresarial que integra
                          múltiples herramientas y servicios en una sola solución.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>¿Cómo funciona?</AccordionTrigger>
                        <AccordionContent>
                          La plataforma utiliza inteligencia artificial para automatizar
                          procesos y mejorar la eficiencia operativa.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>¿Es seguro?</AccordionTrigger>
                        <AccordionContent>
                          Sí, implementamos las mejores prácticas de seguridad y
                          cumplimiento con estándares internacionales.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BunduiPremiumProvider>
  );
};

export default BunduiPremiumDashboard;