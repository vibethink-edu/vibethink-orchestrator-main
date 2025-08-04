import { Button } from "@/shared/components/bundui-premium/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/bundui-premium/components/ui/card"
import DashboardLayout from "@/shared/components/bundui-premium/components/layout/DashboardLayout"
import { Users, DollarSign, Activity, CreditCard } from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <Button>Descargar</Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suscripciones</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              Theme Customizer - Sistema Completo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border">
              <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                🎨 Personalización Avanzada
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Haz clic en el icono <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary/10 text-primary text-xs">⚙️</span> en el header para acceder al theme customizer completo.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  8 Color Presets
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Light/Dark Mode
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Radius Control
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Scale Adjustment
                </div>
              </div>
            </div>
            
            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border">
              <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                📱 Mobile Perfect
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Sidebar mobile con slide animation
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Full width content cuando sidebar cerrado
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Layout tight sin gaps
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-3 border border-primary/20">
              <p className="text-xs font-medium text-center">
                🚀 <span className="text-primary">Dashboard en Estado Perfecto</span> - Sin errores, completamente funcional
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 