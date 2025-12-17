import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  Map, 
  Tree, 
  Shield, 
  Users, 
  TestTube, 
  Palette,
  Globe,
  Search,
  Filter
} from 'lucide-react';

interface RouteInfo {
  path: string;
  component: string;
  protected: boolean;
  requireAdmin: boolean;
  requireSuperAdmin: boolean;
  requiredRole: string | null;
  layout: string | null;
  category: string;
}

interface RouteMapData {
  metadata: {
    generatedAt: string;
    totalRoutes: number;
    version: string;
  };
  routes: RouteInfo[];
  categories: {
    public: number;
    protected: number;
    admin: number;
    testing: number;
    mockup: number;
  };
}

const RouteMapVisualizer: React.FC = () => {
  const [routeData, setRouteData] = useState<RouteMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadRouteData();
  }, []);

  const loadRouteData = async () => {
    try {
      setLoading(true);
      // En producción, esto sería una llamada a la API
      // Por ahora, simulamos los datos
      const mockData: RouteMapData = {
        metadata: {
          generatedAt: new Date().toISOString(),
          totalRoutes: 25,
          version: '1.0.0'
        },
        routes: [
          { path: '/', component: 'Index', protected: false, requireAdmin: false, requireSuperAdmin: false, requiredRole: null, layout: null, category: 'public' },
          { path: '/auth', component: 'Auth', protected: false, requireAdmin: false, requireSuperAdmin: false, requiredRole: null, layout: null, category: 'public' },
          { path: '/dashboard', component: 'Dashboard', protected: true, requireAdmin: false, requireSuperAdmin: false, requiredRole: null, layout: 'DashboardLayout', category: 'protected' },
          { path: '/admin', component: 'AdminPanel', protected: true, requireAdmin: true, requireSuperAdmin: false, requiredRole: null, layout: 'DashboardLayout', category: 'admin' },
          { path: '/testing', component: 'TestingLanding', protected: true, requireAdmin: false, requireSuperAdmin: false, requiredRole: 'DEVELOPER', layout: null, category: 'testing' },
          { path: '/mockup-demo', component: 'MockupDemo', protected: false, requireAdmin: false, requireSuperAdmin: false, requiredRole: null, layout: null, category: 'mockup' },
        ],
        categories: {
          public: 4,
          protected: 8,
          admin: 6,
          testing: 7,
          mockup: 6
        }
      };
      
      setRouteData(mockData);
    } catch (err) {
      setError('Error cargando datos de rutas');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'protected': return <Shield className="w-4 h-4" />;
      case 'admin': return <Users className="w-4 h-4" />;
      case 'testing': return <TestTube className="w-4 h-4" />;
      case 'mockup': return <Palette className="w-4 h-4" />;
      default: return <Map className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'protected': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'testing': return 'bg-orange-100 text-orange-800';
      case 'mockup': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissionBadge = (route: RouteInfo) => {
    if (route.requireSuperAdmin) {
      return <Badge variant="destructive">SUPER_ADMIN</Badge>;
    }
    if (route.requireAdmin) {
      return <Badge variant="secondary">ADMIN+</Badge>;
    }
    if (route.protected) {
      return <Badge variant="outline">AUTH</Badge>;
    }
    return <Badge variant="default">PUBLIC</Badge>;
  };

  const filteredRoutes = routeData?.routes.filter(route => {
    const matchesSearch = route.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.component.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || route.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando mapa de rutas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={loadRouteData} className="mt-4">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Map className="w-6 h-6" />
              <CardTitle>Mapa de Rutas</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              Última actualización: {new Date(routeData!.metadata.generatedAt).toLocaleString('es-ES')}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{routeData!.metadata.totalRoutes}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{routeData!.categories.public}</div>
              <div className="text-sm text-muted-foreground">Públicas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{routeData!.categories.protected}</div>
              <div className="text-sm text-muted-foreground">Protegidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{routeData!.categories.admin}</div>
              <div className="text-sm text-muted-foreground">Admin</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{routeData!.categories.testing}</div>
              <div className="text-sm text-muted-foreground">Testing</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar rutas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                Todas
              </Button>
              {Object.entries(routeData!.categories).map(([category, count]) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {getCategoryIcon(category)}
                  {count}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routes List */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="tree">Árbol</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Ruta</th>
                      <th className="text-left p-4 font-medium">Componente</th>
                      <th className="text-left p-4 font-medium">Categoría</th>
                      <th className="text-left p-4 font-medium">Permisos</th>
                      <th className="text-left p-4 font-medium">Layout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoutes.map((route, index) => (
                      <tr key={route.path} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                        <td className="p-4 font-mono text-sm">
                          <code className="bg-muted px-2 py-1 rounded">{route.path}</code>
                        </td>
                        <td className="p-4 text-sm">{route.component}</td>
                        <td className="p-4">
                          <Badge className={getCategoryColor(route.category)}>
                            {getCategoryIcon(route.category)}
                            <span className="ml-1 capitalize">{route.category}</span>
                          </Badge>
                        </td>
                        <td className="p-4">
                          {getPermissionBadge(route)}
                          {route.requiredRole && (
                            <Badge variant="outline" className="ml-1">
                              {route.requiredRole}
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 text-sm">
                          {route.layout || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tree" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="font-mono text-sm space-y-1">
                {filteredRoutes.map((route) => (
                  <div key={route.path} className="flex items-center space-x-2">
                    <span className="text-muted-foreground">
                      {route.path === '/' ? '📄' : 
                       route.category === 'public' ? '🌐' :
                       route.category === 'protected' ? '🔒' :
                       route.category === 'admin' ? '👨‍💼' :
                       route.category === 'testing' ? '🧪' :
                       route.category === 'mockup' ? '🎨' : '📄'}
                    </span>
                    <code className="bg-muted px-2 py-1 rounded">{route.path}</code>
                    <span className="text-muted-foreground">({route.component})</span>
                    {getPermissionBadge(route)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={loadRouteData} variant="outline" size="sm">
              <Map className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Button variant="outline" size="sm">
              <Tree className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteMapVisualizer; 
