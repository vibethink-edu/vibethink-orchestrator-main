import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Separator } from '@/shared/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { usePlanDefinitions } from '@/shared/hooks/useCompanyLimits';
import { TooltipWrapper } from '@/shared/components/ui/TooltipWrapper';
import { HelpCircle } from 'lucide-react';

interface CompanyCreationFormProps {
  onCompanyCreated: () => void;
}

type CompanyStatus = 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
type SubscriptionPlan = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'CUSTOM';

interface FormData {
  name: string;
  slug: string;
  domain: string;
  status: CompanyStatus;
  subscription_plan: SubscriptionPlan;
  plan_definition_id: string;
}

/**
 * Formulario para crear nuevas empresas en el sistema
 * Incluye validación de slug único y asignación automática de plan
 */
const CompanyCreationForm = ({ onCompanyCreated }: CompanyCreationFormProps) => {
  const { plans } = usePlanDefinitions();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    domain: '',
    status: 'TRIAL',
    subscription_plan: 'STARTER',
    plan_definition_id: ''
  });

  // Establecer el plan STARTER por defecto cuando los planes se cargan
  React.useEffect(() => {
    if (plans.length > 0 && !formData.plan_definition_id) {
      const starterPlan = plans.find(p => p.name === 'STARTER');
      if (starterPlan) {
        setFormData(prev => ({
          ...prev,
          plan_definition_id: starterPlan.id
        }));
      }
    }
  }, [plans, formData.plan_definition_id]);

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handlePlanChange = (planName: SubscriptionPlan) => {
    const selectedPlan = plans.find(p => p.name === planName);
    if (selectedPlan) {
      setFormData(prev => ({
        ...prev,
        subscription_plan: planName,
        plan_definition_id: selectedPlan.id
      }));
    }
  };

  const selectedPlan = plans.find(p => p.id === formData.plan_definition_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: log '🔄 Iniciando creación de empresa...' formData
    
    setLoading(true);

    try {
      // Validaciones básicas
      if (!formData.name.trim()) {
        toast.error('El nombre de la empresa es requerido');
        setLoading(false);
        return;
      }

      if (!formData.slug.trim()) {
        toast.error('El slug es requerido');
        setLoading(false);
        return;
      }

      if (!formData.plan_definition_id) {
        toast.error('Debe seleccionar un plan');
        setLoading(false);
        return;
      }

      // TODO: log '✅ Validaciones básicas pasadas'

      // Verificar que el slug no exista
      // TODO: log '🔍 Verificando disponibilidad del slug...'
      const { data: existingCompany, error: checkError } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', formData.slug)
        .maybeSingle();

      if (checkError) {
        // TODO: log '❌ Error al verificar slug:' checkError
        toast.error(`Error al verificar disponibilidad del slug: ${checkError.message}`);
        setLoading(false);
        return;
      }

      if (existingCompany) {
        // TODO: log '❌ Slug ya existe:' formData.slug
        toast.error('El slug ya existe. Por favor usa otro.');
        setLoading(false);
        return;
      }

      // TODO: log '✅ Slug disponible'

      // Crear la empresa
      const companyData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        domain: formData.domain.trim() || null,
        status: formData.status,
        subscription_plan: formData.subscription_plan,
        plan_definition_id: formData.plan_definition_id
      };

      // TODO: log '📤 Enviando datos de empresa:' companyData

      const { data: newCompany, error } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single();

      if (error) {
        // TODO: log '❌ Error al crear empresa:' error
        toast.error(`Error al crear la empresa: ${error.message}`);
        setLoading(false);
        return;
      }

      // TODO: log '✅ Empresa creada exitosamente:' newCompany
      
      toast.success(`¡Empresa "${formData.name}" creada exitosamente!`, {
        description: `Slug: ${formData.slug} | Plan: ${formData.subscription_plan}`,
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: '',
        slug: '',
        domain: '',
        status: 'TRIAL',
        subscription_plan: 'STARTER',
        plan_definition_id: plans.find(p => p.name === 'STARTER')?.id || ''
      });

      // Notificar al componente padre
      onCompanyCreated();

    } catch (error: any) {
      // TODO: log '❌ Error inesperado al crear empresa:' error
      toast.error(`Error inesperado: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-foreground">Nombre de la Empresa *</Label>
                <TooltipWrapper content="Nombre completo de la empresa como aparecerá en el sistema">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </TooltipWrapper>
              </div>
              <TooltipWrapper content="Ingresa el nombre completo de la empresa">
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ej: EuphoriaNet"
                  className="bg-background border-border text-foreground"
                  required
                  disabled={loading}
                />
              </TooltipWrapper>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-foreground">Slug (URL) *</Label>
                <TooltipWrapper content="Identificador único para la URL de la empresa. Se genera automáticamente pero puedes editarlo">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </TooltipWrapper>
              </div>
              <TooltipWrapper content="URL única para identificar la empresa en el sistema">
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="ej: euphoria-net"
                  className="bg-background border-border text-foreground"
                  required
                  disabled={loading}
                />
              </TooltipWrapper>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-foreground">Dominio (Opcional)</Label>
                <TooltipWrapper content="Dominio personalizado para la empresa. Opcional para configuración posterior">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </TooltipWrapper>
              </div>
              <TooltipWrapper content="Dominio web de la empresa (opcional)">
                <Input
                  value={formData.domain}
                  onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                  placeholder="ej: euphoria-net.com"
                  className="bg-background border-border text-foreground"
                  disabled={loading}
                />
              </TooltipWrapper>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-foreground">Estado</Label>
                <TooltipWrapper content="Estado inicial de la empresa. TRIAL para periodo de prueba, ACTIVE para empresas activas">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </TooltipWrapper>
              </div>
              <TooltipWrapper content="Selecciona el estado inicial de la empresa">
                <Select 
                  value={formData.status} 
                  onValueChange={(value: CompanyStatus) => setFormData(prev => ({ ...prev, status: value }))}
                  disabled={loading}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="TRIAL" className="text-foreground">TRIAL</SelectItem>
                    <SelectItem value="ACTIVE" className="text-foreground">ACTIVE</SelectItem>
                    <SelectItem value="SUSPENDED" className="text-foreground">SUSPENDED</SelectItem>
                    <SelectItem value="CANCELLED" className="text-foreground">CANCELLED</SelectItem>
                  </SelectContent>
                </Select>
              </TooltipWrapper>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-foreground">Plan de Suscripción *</Label>
              <TooltipWrapper content="Plan que define los límites y características disponibles para la empresa">
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </TooltipWrapper>
            </div>
            <TooltipWrapper content="Selecciona el plan de suscripción que mejor se adapte a las necesidades de la empresa">
              <Select 
                value={formData.subscription_plan} 
                onValueChange={handlePlanChange}
                disabled={loading}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Selecciona un plan" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.name} className="text-foreground">
                      {plan.display_name} (${plan.base_price_usd}/mes)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TooltipWrapper>
          </div>

          {/* Mostrar información del plan seleccionado (solo lectura) */}
          {selectedPlan && (
            <Card className="bg-muted/50 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-foreground">Límites del Plan Seleccionado</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Estos límites se aplicarán automáticamente. Usa overrides después si necesitas valores diferentes.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Máximo Usuarios</Label>
                  <div className="text-sm font-medium text-foreground">{selectedPlan.max_users}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Requests IA/mes</Label>
                  <div className="text-sm font-medium text-foreground">{selectedPlan.max_monthly_ai_requests?.toLocaleString()}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Scraping/mes</Label>
                  <div className="text-sm font-medium text-foreground">{selectedPlan.max_monthly_scraping_pages?.toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>
          )}

          <TooltipWrapper content={
            loading ? "Creando empresa..." : 
            !formData.name.trim() || !formData.plan_definition_id ? 
            "Completa todos los campos requeridos para crear la empresa" : 
            "Crear nueva empresa con la configuración seleccionada"
          }>
            <Button 
              type="submit" 
              disabled={loading || !formData.name.trim() || !formData.plan_definition_id}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? 'Creando empresa...' : 'Crear Empresa'}
            </Button>
          </TooltipWrapper>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyCreationForm;
