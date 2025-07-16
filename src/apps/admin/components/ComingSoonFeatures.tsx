
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { 
  Brain, 
  Scale, 
  ChefHat, 
  Building2, 
  Shield, 
  Stethoscope, 
  GraduationCap, 
  Car, 
  Home,
  Briefcase,
  Mic,
  Bot,
  Database,
  Zap,
  Globe,
  MessageSquare,
  Phone,
  FileText,
  BarChart3,
  Mail
} from 'lucide-react';

const ComingSoonFeatures = () => {
  const specializedRags = [
    {
      id: 'legal',
      name: 'RAG Jurídico',
      icon: Scale,
      description: 'Especializado en leyes, jurisprudencia y documentos legales',
      features: ['Análisis de contratos', 'Consultas legales', 'Precedentes judiciales', 'Compliance automático'],
      industries: ['Bufetes de abogados', 'Departamentos legales', 'Notarías'],
      status: 'In Development',
      estimatedLaunch: 'Q2 2025'
    },
    {
      id: 'restaurant',
      name: 'RAG Restaurantes',
      icon: ChefHat,
      description: 'Gestión integral para la industria gastronómica',
      features: ['Recetas inteligentes', 'Gestión de inventario', 'Análisis nutricional', 'Compliance sanitario'],
      industries: ['Restaurantes', 'Cadenas de comida', 'Catering'],
      status: 'Planning',
      estimatedLaunch: 'Q3 2025'
    },
    {
      id: 'healthcare',
      name: 'RAG Médico',
      icon: Stethoscope,
      description: 'Asistencia médica con protocolos y bases de datos especializadas',
      features: ['Diagnóstico asistido', 'Protocolos médicos', 'Farmacovigilancia', 'Historiales clínicos'],
      industries: ['Hospitales', 'Clínicas', 'Consultorios'],
      status: 'Research',
      estimatedLaunch: 'Q4 2025'
    },
    {
      id: 'government',
      name: 'RAG Gubernamental',
      icon: Shield,
      description: 'Optimizado para entidades públicas y administración',
      features: ['Trámites ciudadanos', 'Normativas públicas', 'Gestión documental', 'Transparencia'],
      industries: ['Municipios', 'Ministerios', 'Entidades públicas'],
      status: 'Planning',
      estimatedLaunch: 'Q3 2025'
    },
    {
      id: 'education',
      name: 'RAG Educativo',
      icon: GraduationCap,
      description: 'Herramientas pedagógicas y gestión académica',
      features: ['Contenido curricular', 'Evaluaciones automáticas', 'Tutoría personalizada', 'Gestión académica'],
      industries: ['Universidades', 'Colegios', 'Institutos'],
      status: 'Planning',
      estimatedLaunch: 'Q4 2025'
    },
    {
      id: 'automotive',
      name: 'RAG Automotriz',
      icon: Car,
      description: 'Especializado en la industria automotriz',
      features: ['Manuales técnicos', 'Diagnósticos', 'Piezas y repuestos', 'Mantenimiento'],
      industries: ['Concesionarios', 'Talleres', 'Flotas'],
      status: 'Research',
      estimatedLaunch: 'Q1 2026'
    }
  ];

  const upcomingServices = [
    {
      id: 'voice-agent',
      name: 'Agente de Voz Web',
      icon: Mic,
      description: 'Integración de asistente de voz en sitios web',
      features: ['Widget embebido', 'Múltiples idiomas', 'RAG personalizado', 'Analytics de conversaciones'],
      pricing: 'Por minuto de conversación',
      status: 'Beta Testing',
      estimatedLaunch: 'Q1 2025'
    },
    {
      id: 'chatbot-advanced',
      name: 'Chatbot Avanzado',
      icon: MessageSquare,
      description: 'Chatbots con IA conversacional avanzada',
      features: ['Intención múltiple', 'Contexto persistente', 'Integración CRM', 'Handoff humano'],
      pricing: 'Por conversación',
      status: 'In Development',
      estimatedLaunch: 'Q2 2025'
    },
    {
      id: 'phone-assistant',
      name: 'Asistente Telefónico',
      icon: Phone,
      description: 'IA para atención telefónica automatizada',
      features: ['Reconocimiento de voz', 'Transferencia inteligente', 'Grabación y análisis', 'Multi-idioma'],
      pricing: 'Por llamada procesada',
      status: 'Planning',
      estimatedLaunch: 'Q3 2025'
    },
    {
      id: 'document-ai',
      name: 'Procesamiento Documental IA',
      icon: FileText,
      description: 'Análisis y extracción inteligente de documentos',
      features: ['OCR avanzado', 'Clasificación automática', 'Extracción de datos', 'Validación inteligente'],
      pricing: 'Por documento procesado',
      status: 'In Development',
      estimatedLaunch: 'Q2 2025'
    },
    {
      id: 'analytics-ai',
      name: 'Analytics con IA',
      icon: BarChart3,
      description: 'Dashboards inteligentes y predicciones',
      features: ['Predicciones automáticas', 'Anomalías detectadas', 'Insights automáticos', 'Reportes narrativos'],
      pricing: 'Por dashboard activo',
      status: 'Planning',
      estimatedLaunch: 'Q4 2025'
    },
    {
      id: 'email-ai',
      name: 'Email Marketing IA',
      icon: Mail,
      description: 'Automatización inteligente de email marketing',
      features: ['Contenido generado', 'Segmentación IA', 'A/B testing automático', 'Optimización de envío'],
      pricing: 'Por email enviado',
      status: 'Research',
      estimatedLaunch: 'Q1 2026'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Beta Testing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'In Development': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Planning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Research': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Coming Soon Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Próximas funcionalidades y servicios especializados que revolucionarán la experiencia de nuestros clientes
        </p>
      </div>

      {/* RAGs Especializados */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold text-foreground">RAGs Especializados por Industria</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specializedRags.map((rag) => {
            const IconComponent = rag.icon;
            return (
              <Card key={rag.id} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-8 h-8 text-primary" />
                      <div>
                        <CardTitle className="text-lg text-foreground">{rag.name}</CardTitle>
                        <Badge className={getStatusColor(rag.status)} variant="outline">
                          {rag.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm mt-2">
                    {rag.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <span className="text-sm font-medium text-foreground">Características:</span>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      {rag.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Industries */}
                  <div>
                    <span className="text-sm font-medium text-foreground">Industrias objetivo:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rag.industries.map((industry, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Launch Date */}
                  <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Lanzamiento estimado: <span className="font-medium">{rag.estimatedLaunch}</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Servicios Adicionales */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold text-foreground">Nuevos Servicios y Funcionalidades</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-6 h-6 text-primary" />
                      <div>
                        <CardTitle className="text-base text-foreground">{service.name}</CardTitle>
                        <Badge className={getStatusColor(service.status)} variant="outline">
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm mt-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Features */}
                  <div>
                    <span className="text-sm font-medium text-foreground">Funcionalidades:</span>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Model */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div>
                      <span className="text-xs text-muted-foreground">Modelo de precio:</span>
                      <div className="text-xs font-medium text-green-600">{service.pricing}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Lanzamiento:</span>
                      <div className="text-xs font-medium">{service.estimatedLaunch}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="text-center py-8">
          <h3 className="text-xl font-bold text-foreground mb-2">
            ¿Tienes una industria específica en mente?
          </h3>
          <p className="text-muted-foreground mb-4">
            Contáctanos para desarrollar un RAG especializado para tu sector
          </p>
          <Button className="bg-primary hover:bg-primary/90">
            <Mail className="w-4 h-4 mr-2" />
            Solicitar RAG Personalizado
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonFeatures;
