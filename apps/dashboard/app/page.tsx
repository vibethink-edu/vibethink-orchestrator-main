import { BunduiButton, BunduiCard, BunduiCardHeader } from "@vthink/bundui"

// =============================================================================
// DASHBOARD MAIN PAGE
// =============================================================================
// 
// Página principal del dashboard que consume Bundui.
// Implementa el mismo diseño que la demo de Shadcn UI Kit.
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant ready
// - ✅ Bundui integration
// - ✅ Performance optimized
// - ✅ Type-safe
// =============================================================================

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <BunduiCardHeader className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="ml-auto flex items-center space-x-4">
            <BunduiButton variant="outline" size="sm">
              Configuración
            </BunduiButton>
            <BunduiButton variant="default" size="sm">
              Perfil
            </BunduiButton>
          </div>
        </div>
      </BunduiCardHeader>
      
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <BunduiButton>Descargar</BunduiButton>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <BunduiCard>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Ingresos Totales</div>
            </div>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% desde el mes pasado
            </p>
          </BunduiCard>
          
          <BunduiCard>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Suscripciones</div>
            </div>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% desde el mes pasado
            </p>
          </BunduiCard>
          
          <BunduiCard>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Ventas</div>
            </div>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% desde el mes pasado
            </p>
          </BunduiCard>
          
          <BunduiCard>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Usuarios Activos</div>
            </div>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 desde el mes pasado
            </p>
          </BunduiCard>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <BunduiCard className="col-span-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Ventas Recientes</h3>
                <BunduiButton variant="outline" size="sm">
                  Ver todo
                </BunduiButton>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Sofía Martínez
                    </p>
                    <p className="text-sm text-muted-foreground">
                      sofia.martinez@vibeThink.co
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$1,999.00</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Santiago López
                    </p>
                    <p className="text-sm text-muted-foreground">
                      santiago.lopez@vibeThink.co
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$39.00</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Isabela Rodríguez
                    </p>
                    <p className="text-sm text-muted-foreground">
                      isabela.rodriguez@vibeThink.co
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$299.00</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Guillermo Kim
                    </p>
                    <p className="text-sm text-muted-foreground">
                      guillermo.kim@vibeThink.co
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$99.00</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Sofía Díaz
                    </p>
                    <p className="text-sm text-muted-foreground">
                      sofia.diaz@vibeThink.co
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$39.00</div>
                </div>
              </div>
            </div>
          </BunduiCard>
          
          <BunduiCard className="col-span-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Actividad Reciente</h3>
                <BunduiButton variant="outline" size="sm">
                  Ver todo
                </BunduiButton>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Nuevo usuario registrado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hace 2 minutos
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Nueva suscripción
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hace 5 minutos
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Pago procesado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hace 10 minutos
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Usuario actualizado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hace 15 minutos
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Nueva venta
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hace 20 minutos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </BunduiCard>
        </div>
      </div>
    </div>
  )
} 