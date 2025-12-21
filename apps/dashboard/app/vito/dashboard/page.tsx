import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@vibethink/ui/components/card'
import { Badge } from '@vibethink/ui/components/badge'
import { Button } from '@vibethink/ui/components/button'
import { Avatar, AvatarFallback } from '@vibethink/ui/components/avatar'
import { Progress } from '@vibethink/ui/components/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vibethink/ui/components/tabs'
import {
    Building2,
    Users,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Package,
    UserCheck,
    DollarSign
} from 'lucide-react'
import { getBranding } from '@/lib/branding'

export default function ViToDashboard() {
    const branding = getBranding()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            {/* Header */}
            <header className="border-b bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${branding.gradient.from} ${branding.gradient.to} rounded-xl flex items-center justify-center`}>
                                <span className="text-white font-bold text-xl">{branding.gradient.text}</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{branding.name}</h1>
                                <p className="text-sm text-muted-foreground">{branding.tagline}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm">
                                <Users className="w-4 h-4 mr-2" />
                                Invitar equipo
                            </Button>
                            <Avatar>
                                <AvatarFallback className={`bg-gradient-to-br ${branding.gradient.from} ${branding.gradient.to} text-white font-semibold`}>
                                    ME
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Procesos Activos</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-green-600 font-medium">+2</span> desde ayer
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Compromisos Pendientes</CardTitle>
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">34</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-red-600 font-medium">5 vencidos</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completados Hoy</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-green-600 font-medium">+60%</span> vs promedio
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Equipo</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                miembros activos
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* My Commitments Today */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            🎯 Mis Compromisos Hoy
                            <Badge variant="destructive">2 urgentes</Badge>
                        </CardTitle>
                        <CardDescription>
                            Acciones que requieren tu atención inmediata
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-4 p-4 border rounded-lg bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div className="flex-1">
                                <div className="font-medium">Enviar propuesta a Acme Corp</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    Vence en 2 horas • Para: juan@acmecorp.com
                                </div>
                            </div>
                            <Button size="sm">Ver detalles</Button>
                        </div>

                        <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div className="flex-1">
                                <div className="font-medium">Follow up con TechCorp</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    Vence mañana • Última interacción: hace 5 días
                                </div>
                            </div>
                            <Button size="sm" variant="outline">Posponer</Button>
                        </div>

                        <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                                <div className="font-medium">Revisar envío #1234</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    Retraso detectado • Cliente: RetailCo
                                </div>
                            </div>
                            <Button size="sm" variant="outline">Contactar carrier</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Departments Tabs */}
                <Tabs defaultValue="sales" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="sales" className="gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Ventas
                        </TabsTrigger>
                        <TabsTrigger value="operations" className="gap-2">
                            <Package className="w-4 h-4" />
                            Operaciones
                        </TabsTrigger>
                        <TabsTrigger value="hr" className="gap-2">
                            <UserCheck className="w-4 h-4" />
                            HR
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="sales" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pipeline de Ventas</CardTitle>
                                <CardDescription>12 deals activos • $450k en pipeline</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Deal 1 */}
                                    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">Acme Corp</span>
                                                <Badge variant="secondary">Proposal</Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                $50k • Última actividad: hace 2 días
                                            </div>
                                            <Progress value={75} className="mt-2 h-2" />
                                        </div>
                                        <Button size="sm">Ver timeline</Button>
                                    </div>

                                    {/* Deal 2 */}
                                    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">TechCorp</span>
                                                <Badge variant="outline">Qualified</Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                $120k • Última actividad: hace 5 días
                                            </div>
                                            <Progress value={45} className="mt-2 h-2" />
                                        </div>
                                        <Button size="sm" variant="outline">Follow up</Button>
                                    </div>

                                    {/* Deal 3 - At Risk */}
                                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">GlobalCo</span>
                                                <Badge variant="destructive">En riesgo</Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                $200k • Sin actividad: 10 días
                                            </div>
                                            <Progress value={60} className="mt-2 h-2" />
                                        </div>
                                        <Button size="sm">Acción urgente</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="operations" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Envíos Activos</CardTitle>
                                <CardDescription>8 envíos en tránsito • 2 con retrasos</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                                        <Package className="w-10 h-10 text-blue-600" />
                                        <div className="flex-1">
                                            <div className="font-medium">Order #1234 → ClientCo</div>
                                            <div className="text-sm text-muted-foreground mb-2">
                                                FedEx: 1234567890 • En tránsito → Bogotá
                                            </div>
                                            <Progress value={75} className="h-2" />
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Entrega estimada: Mañana
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline">Notificar cliente</Button>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                                        <AlertCircle className="w-10 h-10 text-red-600" />
                                        <div className="flex-1">
                                            <div className="font-medium">Order #1235 → RetailCo</div>
                                            <div className="text-sm text-muted-foreground mb-2">
                                                DHL: 9876543210 • Retenido en aduana
                                            </div>
                                            <Progress value={60} className="h-2" />
                                            <div className="text-xs text-red-600 mt-1 font-medium">
                                                Retraso: +3 días
                                            </div>
                                        </div>
                                        <Button size="sm">Contactar carrier</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="hr" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Equipo</CardTitle>
                                <CardDescription>8 miembros • 3 evaluaciones pendientes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                                        <Avatar>
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                                MG
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="font-medium">María González</div>
                                            <div className="text-sm text-muted-foreground">
                                                Sales Manager • Próximo 1-on-1: Mañana 3pm
                                            </div>
                                        </div>
                                        <Badge>Activo</Badge>
                                    </div>

                                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                                        <Avatar>
                                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white font-semibold">
                                                JP
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="font-medium">Juan Pérez</div>
                                            <div className="text-sm text-muted-foreground">
                                                Sales Rep • Performance review: En 5 días
                                            </div>
                                        </div>
                                        <Badge variant="outline">Review pendiente</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* AI Companion Hint */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${branding.gradient.from} ${branding.gradient.to} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white text-2xl">🤖</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold mb-1">{branding.name} está aprendiendo tu empresa</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Presiona <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border rounded text-xs">Cmd+K</kbd> en cualquier momento para hablar con {branding.name}
                            </p>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline">Ver sugerencias</Button>
                                <Button size="sm" variant="outline">Configurar DNA</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
