import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/shared/components/ui/pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { Building2, Edit, Plus, DollarSign, Users, Zap, Globe, AlertTriangle, Settings, Trash2, Grid2X2, List, Filter } from 'lucide-react';
import { useSuperAdminData } from '@/shared/hooks/hooks/useSuperAdminData';
import CompanyCreationForm from './CompanyCreationForm';

const CompaniesManager = () => {
  const { companies, planDefinitions, loading, assignPlanToCompany, addOverrideToCompany, removeOverrideFromCompany, refetch } = useSuperAdminData();
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [createCompanyDialogOpen, setCreateCompanyDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Changed default to 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [planFilter, setPlanFilter] = useState<string>('ALL');
  const [overrideFilter, setOverrideFilter] = useState<string>('ALL');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // 12 para grid (3x4), múltiplo útil para lista también
  
  const [overrideForm, setOverrideForm] = useState({
    custom_max_users: '',
    custom_max_monthly_ai_requests: '',
    custom_max_monthly_scraping_pages: '',
    reason: ''
  });

  // Filtros aplicados
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.slug.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || company.status === statusFilter;
      
      const matchesPlan = planFilter === 'ALL' || company.plan_display_name === planFilter;
      
      const matchesOverride = overrideFilter === 'ALL' || 
                             (overrideFilter === 'WITH_OVERRIDES' && company.has_overrides) ||
                             (overrideFilter === 'NO_OVERRIDES' && !company.has_overrides);
      
      return matchesSearch && matchesStatus && matchesPlan && matchesOverride;
    });
  }, [companies, searchTerm, statusFilter, planFilter, overrideFilter]);

  // Paginación calculada
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Reset página cuando cambian filtros
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, planFilter, overrideFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'TRIAL': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'SUSPENDED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case 'STARTER': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PROFESSIONAL': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ENTERPRISE': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'CUSTOM': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handlePlanAssignment = async (companyId: string, planName: string) => {
    await assignPlanToCompany(companyId, planName, `Plan cambiado desde Super Admin Dashboard`);
    setPlanDialogOpen(false);
  };

  const handleOverrideSubmit = async () => {
    if (!selectedCompany) return;
    
    const overrides: any = {};
    if (overrideForm.custom_max_users) overrides.custom_max_users = parseInt(overrideForm.custom_max_users);
    if (overrideForm.custom_max_monthly_ai_requests) overrides.custom_max_monthly_ai_requests = parseInt(overrideForm.custom_max_monthly_ai_requests);
    if (overrideForm.custom_max_monthly_scraping_pages) overrides.custom_max_monthly_scraping_pages = parseInt(overrideForm.custom_max_monthly_scraping_pages);
    
    await addOverrideToCompany(selectedCompany.id, overrides, overrideForm.reason);
    setOverrideDialogOpen(false);
    setOverrideForm({ custom_max_users: '', custom_max_monthly_ai_requests: '', custom_max_monthly_scraping_pages: '', reason: '' });
  };

  const handleCompanyCreated = () => {
    console.log('🏢 Company created successfully, refreshing data...');
    setCreateCompanyDialogOpen(false);
    refetch(); // Refresh the companies list
  };

  // Componente de paginación
  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
      const pageNumbers = [];
      const maxVisiblePages = 5;
      
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        pageNumbers.push(
          <PaginationItem key={1}>
            <PaginationLink 
              onClick={() => setCurrentPage(1)}
              isActive={currentPage === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        if (startPage > 2) {
          pageNumbers.push(
            <PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push(
            <PaginationItem key="ellipsis2">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
        pageNumbers.push(
          <PaginationItem key={totalPages}>
            <PaginationLink 
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }

      return pageNumbers;
    };

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Mostrando {startIndex + 1}-{Math.min(endIndex, filteredCompanies.length)} de {filteredCompanies.length}</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => {
            setItemsPerPage(parseInt(value));
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>por página</span>
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {renderPageNumbers()}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Cargando empresas...</div>;
  }

  const uniquePlans = Array.from(new Set(companies.map(c => c.plan_display_name))).filter(Boolean);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gestión de Empresas</h2>
            <p className="text-muted-foreground mt-1">
              Administra empresas, asigna planes y configura overrides especiales ({filteredCompanies.length} de {companies.length})
            </p>
          </div>
          <Dialog open={createCompanyDialogOpen} onOpenChange={setCreateCompanyDialogOpen}>
            <DialogTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      console.log('🔘 Opening company creation dialog...');
                      setCreateCompanyDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Empresa
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Crear una nueva empresa en el sistema</p>
                </TooltipContent>
              </Tooltip>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Empresa</DialogTitle>
                <DialogDescription>
                  Configura una nueva empresa en el sistema con sus límites y plan inicial.
                </DialogDescription>
              </DialogHeader>
              <CompanyCreationForm onCompanyCreated={handleCompanyCreated} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Controles de filtrado y vista */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex-1 min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    placeholder="Buscar por nombre o slug..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Buscar empresas por nombre o identificador único</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los estados</SelectItem>
                    <SelectItem value="ACTIVE">Activo</SelectItem>
                    <SelectItem value="TRIAL">Trial</SelectItem>
                    <SelectItem value="SUSPENDED">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtrar empresas por estado de cuenta</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los planes</SelectItem>
                    {uniquePlans.map(plan => (
                      <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtrar empresas por plan de suscripción</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Select value={overrideFilter} onValueChange={setOverrideFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Overrides" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="WITH_OVERRIDES">Con overrides</SelectItem>
                    <SelectItem value="NO_OVERRIDES">Sin overrides</SelectItem>
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtrar empresas con configuraciones especiales</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid2X2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vista en cuadrícula</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vista en lista</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Vista Grid */}
        {viewMode === 'grid' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedCompanies.map((company) => (
                <Card key={company.id} className={`bg-card border-border hover:shadow-lg transition-shadow ${company.has_overrides ? 'border-orange-200 dark:border-orange-800' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-foreground truncate">{company.name}</CardTitle>
                      <div className="flex gap-1 flex-wrap">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className={getStatusColor(company.status)} variant="outline">
                              {company.status}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Estado de la cuenta: {company.status}</p>
                          </TooltipContent>
                        </Tooltip>
                        {company.has_overrides && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30" variant="outline">
                                ESPECIAL
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Esta empresa tiene configuraciones especiales</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className={getPlanColor(company.plan_display_name)} variant="outline">
                            {company.plan_display_name}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Plan de suscripción actual</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs text-muted-foreground">
                            ${company.effective_monthly_cost?.toFixed(0)}/mes
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Costo mensual efectivo</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Límites efectivos */}
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Usuarios:</span>
                        <span className={`font-medium ${company.custom_max_users ? 'text-orange-600' : ''}`}>
                          {company.effective_max_users}
                          {company.custom_max_users && (
                            <span className="text-xs text-muted-foreground ml-1">
                              (era {company.plan_max_users})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IA/mes:</span>
                        <span className={`font-medium ${company.custom_max_monthly_ai_requests ? 'text-orange-600' : ''}`}>
                          {company.effective_max_ai_requests?.toLocaleString()}
                          {company.custom_max_monthly_ai_requests && (
                            <span className="text-xs text-muted-foreground ml-1">
                              (era {company.plan_max_ai_requests?.toLocaleString()})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Scraping/mes:</span>
                        <span className={`font-medium ${company.custom_max_monthly_scraping_pages ? 'text-orange-600' : ''}`}>
                          {company.effective_max_scraping_pages?.toLocaleString()}
                          {company.custom_max_monthly_scraping_pages && (
                            <span className="text-xs text-muted-foreground ml-1">
                              (era {company.plan_max_scraping_pages?.toLocaleString()})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" className="w-full" onClick={() => setSelectedCompany(company)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Gestionar
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Administrar configuración de {company.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Gestionar {company.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => {
                                  setSelectedCompany(company);
                                  setPlanDialogOpen(true);
                                }}
                                className="w-full"
                                variant="outline"
                              >
                                Cambiar Plan
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Asignar un nuevo plan de suscripción</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => {
                                  setSelectedCompany(company);
                                  setOverrideDialogOpen(true);
                                }}
                                className="w-full"
                                variant="outline"
                              >
                                {company.has_overrides ? 'Modificar' : 'Agregar'} Override Especial
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{company.has_overrides ? 'Modificar límites especiales existentes' : 'Configurar límites especiales personalizados'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
            <PaginationControls />
          </div>
        )}

        {/* Vista Lista */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Usuarios</TableHead>
                    <TableHead>IA/mes</TableHead>
                    <TableHead>Scraping/mes</TableHead>
                    <TableHead>Costo/mes</TableHead>
                    <TableHead>Overrides</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-muted-foreground">{company.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className={getStatusColor(company.status)} variant="outline">
                              {company.status}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Estado de la cuenta</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className={getPlanColor(company.plan_display_name)} variant="outline">
                              {company.plan_display_name}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Plan de suscripción actual</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={company.custom_max_users ? 'text-orange-600 font-medium' : ''}>
                              {company.effective_max_users}
                              {company.custom_max_users && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  (era {company.plan_max_users})
                                </span>
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{company.custom_max_users ? 'Límite personalizado de usuarios' : 'Límite estándar del plan'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={company.custom_max_monthly_ai_requests ? 'text-orange-600 font-medium' : ''}>
                              {company.effective_max_ai_requests?.toLocaleString()}
                              {company.custom_max_monthly_ai_requests && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  (era {company.plan_max_ai_requests?.toLocaleString()})
                                </span>
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{company.custom_max_monthly_ai_requests ? 'Límite personalizado de requests IA' : 'Límite estándar del plan'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={company.custom_max_monthly_scraping_pages ? 'text-orange-600 font-medium' : ''}>
                              {company.effective_max_scraping_pages?.toLocaleString()}
                              {company.custom_max_monthly_scraping_pages && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  (era {company.plan_max_scraping_pages?.toLocaleString()})
                                </span>
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{company.custom_max_monthly_scraping_pages ? 'Límite personalizado de scraping' : 'Límite estándar del plan'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-medium text-green-600">
                              ${company.effective_monthly_cost?.toFixed(0)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Costo mensual efectivo</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {company.has_overrides ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30" variant="outline">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                SÍ
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Empresa con configuraciones especiales</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-muted-foreground text-sm">No</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedCompany(company)}>
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Configurar {company.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Gestionar {company.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    onClick={() => {
                                      setSelectedCompany(company);
                                      setPlanDialogOpen(true);
                                    }}
                                    className="w-full"
                                    variant="outline"
                                  >
                                    Cambiar Plan
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Asignar un nuevo plan de suscripción</p>
                                </TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    onClick={() => {
                                      setSelectedCompany(company);
                                      setOverrideDialogOpen(true);
                                    }}
                                    className="w-full"
                                    variant="outline"
                                  >
                                    {company.has_overrides ? 'Modificar' : 'Agregar'} Override Especial
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{company.has_overrides ? 'Modificar límites especiales existentes' : 'Configurar límites especiales personalizados'}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <PaginationControls />
          </div>
        )}

        {/* Mensaje si no hay resultados */}
        {paginatedCompanies.length === 0 && filteredCompanies.length === 0 && (
          <div className="text-center py-8">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron empresas</h3>
            <p className="text-muted-foreground">
              Intenta ajustar los filtros para encontrar lo que buscas.
            </p>
          </div>
        )}

        {/* Mensaje si no hay resultados en página actual */}
        {paginatedCompanies.length === 0 && filteredCompanies.length > 0 && (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-foreground mb-2">No hay empresas en esta página</h3>
            <p className="text-muted-foreground">
              Hay {filteredCompanies.length} empresas encontradas, pero ninguna en la página {currentPage}.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(1)}
              className="mt-4"
            >
              Ir a la primera página
            </Button>
          </div>
        )}

        {/* Dialog para cambiar plan */}
        <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cambiar Plan - {selectedCompany?.name}</DialogTitle>
              <DialogDescription>
                Selecciona el nuevo plan para esta empresa. Esta acción será registrada en el log de auditoría.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {planDefinitions.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{plan.display_name}</h4>
                    <p className="text-sm text-muted-foreground">${plan.base_price_usd}/mes</p>
                  </div>
                  <Button 
                    onClick={() => handlePlanAssignment(selectedCompany?.id, plan.name)}
                    variant={selectedCompany?.plan_display_name === plan.display_name ? "default" : "outline"}
                  >
                    {selectedCompany?.plan_display_name === plan.display_name ? "Actual" : "Asignar"}
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para overrides */}
        <Dialog open={overrideDialogOpen} onOpenChange={setOverrideDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configuración Especial - {selectedCompany?.name}</DialogTitle>
              <DialogDescription>
                Configura límites especiales para esta empresa. Esto se registrará automáticamente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Usuarios Máximos (actual: {selectedCompany?.effective_max_users})</Label>
                <Input
                  type="number"
                  value={overrideForm.custom_max_users}
                  onChange={(e) => setOverrideForm({...overrideForm, custom_max_users: e.target.value})}
                  placeholder="Dejar vacío para usar límite del plan"
                />
              </div>
              <div>
                <Label>Requests IA Mensuales (actual: {selectedCompany?.effective_max_ai_requests?.toLocaleString()})</Label>
                <Input
                  type="number"
                  value={overrideForm.custom_max_monthly_ai_requests}
                  onChange={(e) => setOverrideForm({...overrideForm, custom_max_monthly_ai_requests: e.target.value})}
                  placeholder="Dejar vacío para usar límite del plan"
                />
              </div>
              <div>
                <Label>Páginas Scraping Mensuales (actual: {selectedCompany?.effective_max_scraping_pages?.toLocaleString()})</Label>
                <Input
                  type="number"
                  value={overrideForm.custom_max_monthly_scraping_pages}
                  onChange={(e) => setOverrideForm({...overrideForm, custom_max_monthly_scraping_pages: e.target.value})}
                  placeholder="Dejar vacío para usar límite del plan"
                />
              </div>
              <div>
                <Label>Razón del Override (requerido para auditoría)</Label>
                <Textarea
                  value={overrideForm.reason}
                  onChange={(e) => setOverrideForm({...overrideForm, reason: e.target.value})}
                  placeholder="Ej: Contrato especial Q1 2025, Cliente enterprise con necesidades adicionales..."
                  required
                />
              </div>
              <Button 
                onClick={handleOverrideSubmit} 
                className="w-full"
                disabled={!overrideForm.reason.trim()}
              >
                Aplicar Configuración Especial
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default CompaniesManager;
