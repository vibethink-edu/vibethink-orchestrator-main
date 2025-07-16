import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon
} from 'lucide-react';

interface EfficiencyData {
  averageTime: string;
  targetTime: string;
  timeImprovement: number;
  approvalRate: number;
  targetApprovalRate: number;
  approvalImprovement: number;
  automationLevel: number;
  targetAutomationLevel: number;
  automationImprovement: number;
  satisfaction: number;
  targetSatisfaction: number;
  satisfactionImprovement: number;
}

interface ProcessData {
  id: string;
  name: string;
  description: string;
  beforeTime: string;
  afterTime: string;
  improvement: number;
}

interface AutomationData {
  [key: string]: {
    status: 'active' | 'inactive' | 'partial';
    description: string;
    efficiency: number;
  };
}

const EfficiencyDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<EfficiencyData | null>(null);
  const [processes, setProcesses] = useState<ProcessData[]>([]);
  const [automation, setAutomation] = useState<AutomationData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEfficiencyData();
  }, []);

  const loadEfficiencyData = async () => {
    try {
      setLoading(true);
      
      // ✅ Simular carga de datos (en implementación real, fetch desde API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetrics({
        averageTime: '1.5 días',
        targetTime: '1-2 días',
        timeImprovement: 75,
        approvalRate: 85,
        targetApprovalRate: 85,
        approvalImprovement: 25,
        automationLevel: 70,
        targetAutomationLevel: 70,
        automationImprovement: 40,
        satisfaction: 8,
        targetSatisfaction: 8,
        satisfactionImprovement: 33
      });

      setProcesses([
        {
          id: '1',
          name: 'Búsqueda Exhaustiva',
          description: 'Búsqueda automatizada en múltiples fuentes',
          beforeTime: '2-3 días',
          afterTime: '30 minutos',
          improvement: 85
        },
        {
          id: '2',
          name: 'Validación de Compatibilidad',
          description: 'Verificación automática con ADRs existentes',
          beforeTime: '1 día',
          afterTime: '15 minutos',
          improvement: 90
        },
        {
          id: '3',
          name: 'Generación de Documentación',
          description: 'Creación automática de ADRs y casos de uso',
          beforeTime: '1-2 días',
          afterTime: '5 minutos',
          improvement: 95
        },
        {
          id: '4',
          name: 'Análisis de Riesgos',
          description: 'Evaluación automatizada de riesgos',
          beforeTime: '1 día',
          afterTime: '10 minutos',
          improvement: 85
        }
      ]);

      setAutomation({
        'Búsqueda Automatizada': {
          status: 'active',
          description: 'APIs de GitHub, Stack Overflow, NPM',
          efficiency: 90
        },
        'Validación de Compatibilidad': {
          status: 'active',
          description: 'Parser automático de ADRs',
          efficiency: 85
        },
        'Generación de Documentación': {
          status: 'active',
          description: 'Templates inteligentes',
          efficiency: 95
        },
        'Análisis de Riesgos': {
          status: 'partial',
          description: 'Base de datos de riesgos',
          efficiency: 70
        },
        'Validación de Suposiciones': {
          status: 'inactive',
          description: 'Validación con datos históricos',
          efficiency: 0
        }
      });

    } catch (error) {
      console.error('Error cargando datos de eficiencia:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard de Eficiencia - Stack Evaluation</h1>
        <Badge variant="outline" className="text-sm">
          VThink 1.0 - Optimizado
        </Badge>
      </div>
      
      <EfficiencyMetrics data={metrics!} />
      <ProcessOptimization processes={processes} />
      <AutomationStatus automation={automation} />
      <TimeTracking />
    </div>
  );
};

const EfficiencyMetrics: React.FC<{ data: EfficiencyData }> = ({ data }) => {
  const getMetricColor = (improvement: number) => {
    return improvement > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getMetricIcon = (improvement: number) => {
    return improvement > 0 ? <TrendingUpIcon className="h-4 w-4" /> : <TrendingDownIcon className="h-4 w-4" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Tiempo Promedio"
        value={data.averageTime}
        target={data.targetTime}
        improvement={data.timeImprovement}
        icon={<ClockIcon className="h-4 w-4" />}
        color={getMetricColor(data.timeImprovement)}
        trendIcon={getMetricIcon(data.timeImprovement)}
      />
      <MetricCard
        title="Tasa de Aprobación"
        value={`${data.approvalRate}%`}
        target={`${data.targetApprovalRate}%`}
        improvement={data.approvalImprovement}
        icon={<CheckCircleIcon className="h-4 w-4" />}
        color={getMetricColor(data.approvalImprovement)}
        trendIcon={getMetricIcon(data.approvalImprovement)}
      />
      <MetricCard
        title="Automatización"
        value={`${data.automationLevel}%`}
        target={`${data.targetAutomationLevel}%`}
        improvement={data.automationImprovement}
        icon={<TrendingUpIcon className="h-4 w-4" />}
        color={getMetricColor(data.automationImprovement)}
        trendIcon={getMetricIcon(data.automationImprovement)}
      />
      <MetricCard
        title="Satisfacción"
        value={`${data.satisfaction}/10`}
        target={`${data.targetSatisfaction}/10`}
        improvement={data.satisfactionImprovement}
        icon={<CheckCircleIcon className="h-4 w-4" />}
        color={getMetricColor(data.satisfactionImprovement)}
        trendIcon={getMetricIcon(data.satisfactionImprovement)}
      />
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  target: string;
  improvement: number;
  icon: React.ReactNode;
  color: string;
  trendIcon: React.ReactNode;
}> = ({ title, value, target, improvement, icon, color, trendIcon }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`flex items-center gap-1 ${color}`}>
            {trendIcon}
            <span className="text-sm font-medium">{improvement}%</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Objetivo: {target}
        </div>
        <Progress value={Math.min(improvement + 50, 100)} className="h-2" />
      </div>
    </CardContent>
  </Card>
);

const ProcessOptimization: React.FC<{ processes: ProcessData[] }> = ({ processes }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUpIcon className="h-5 w-5" />
          Optimización de Procesos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {processes.map(process => (
            <ProcessRow key={process.id} process={process} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ProcessRow: React.FC<{ process: ProcessData }> = ({ process }) => {
  const getImprovementColor = (improvement: number) => {
    if (improvement >= 80) return 'bg-green-100 text-green-800';
    if (improvement >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium">{process.name}</h3>
        <p className="text-sm text-muted-foreground">{process.description}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Antes</div>
          <div className="font-medium">{process.beforeTime}</div>
        </div>
        <div className="text-muted-foreground">
          →
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Después</div>
          <div className="font-medium text-green-600">{process.afterTime}</div>
        </div>
        <Badge className={getImprovementColor(process.improvement)}>
          {process.improvement}% mejora
        </Badge>
      </div>
    </div>
  );
};

const AutomationStatus: React.FC<{ automation: AutomationData }> = ({ automation }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-4 w-4" />;
      case 'partial': return <AlertTriangleIcon className="h-4 w-4" />;
      case 'inactive': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUpIcon className="h-5 w-5" />
          Estado de Automatización
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(automation).map(([name, data]) => (
            <AutomationRow key={name} name={name} data={data} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AutomationRow: React.FC<{ name: string; data: AutomationData[string] }> = ({ name, data }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-4 w-4" />;
      case 'partial': return <AlertTriangleIcon className="h-4 w-4" />;
      case 'inactive': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${getStatusColor(data.status)}`} />
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">{data.description}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-muted-foreground">Eficiencia</div>
        <div className="font-medium">{data.efficiency}%</div>
      </div>
    </div>
  );
};

const TimeTracking: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5" />
          Seguimiento de Tiempo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TimeCard
            title="Evaluación Promedio"
            value="1.5 días"
            target="1-2 días"
            status="on-track"
          />
          <TimeCard
            title="Fast-Track Menor"
            value="4 horas"
            target="4 horas"
            status="achieved"
          />
          <TimeCard
            title="Fast-Track Estándar"
            value="1 día"
            target="1 día"
            status="achieved"
          />
          <TimeCard
            title="Fast-Track Crítico"
            value="3 días"
            target="3 días"
            status="achieved"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const TimeCard: React.FC<{
  title: string;
  value: string;
  target: string;
  status: 'achieved' | 'on-track' | 'behind';
}> = ({ title, value, target, status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'text-green-600';
      case 'on-track': return 'text-yellow-600';
      case 'behind': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'achieved': return <CheckCircleIcon className="h-4 w-4" />;
      case 'on-track': return <AlertTriangleIcon className="h-4 w-4" />;
      case 'behind': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="text-center p-4 border rounded-lg">
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">Objetivo: {target}</div>
      <div className={`flex items-center justify-center gap-1 mt-2 ${getStatusColor(status)}`}>
        {getStatusIcon(status)}
        <span className="text-sm font-medium capitalize">{status}</span>
      </div>
    </div>
  );
};

export default EfficiencyDashboard; 