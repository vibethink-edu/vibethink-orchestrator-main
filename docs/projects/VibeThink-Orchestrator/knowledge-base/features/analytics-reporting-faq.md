# FAQ: Analytics y Reportes

## 📋 **Índice**
1. [Métricas Principales](#métricas-principales)
2. [Dashboards](#dashboards)
3. [Reportes Específicos](#reportes-específicos)
4. [Exportación y Compartir](#exportación-y-compartir)
5. [Personalización](#personalización)
6. [Alertas y Notificaciones](#alertas-y-notificaciones)
7. [Integración con IA](#integración-con-ia)
8. [Configuración Avanzada](#configuración-avanzada)

---

## 📊 **Métricas Principales**

### **¿Qué métricas principales se pueden trackear?**
- **Métricas de Usuario:** Usuarios activos, sesiones, engagement
- **Métricas de Negocio:** Ventas, conversiones, retención
- **Métricas de Operación:** Tickets, resolución, satisfacción
- **Métricas de Performance:** Tiempo de respuesta, errores
- **Métricas Financieras:** Ingresos, costos, ROI

### **¿Cómo se calculan las métricas clave?**
```tsx
// Cálculo de métricas principales
const calculateKeyMetrics = (data) => {
  return {
    // Usuarios
    activeUsers: data.users.filter(u => u.lastActivity >= getDateDaysAgo(30)).length,
    newUsers: data.users.filter(u => u.createdAt >= getDateDaysAgo(30)).length,
    userGrowth: ((newUsers - previousNewUsers) / previousNewUsers) * 100,
    
    // Negocio
    totalRevenue: data.transactions.reduce((sum, t) => sum + t.amount, 0),
    conversionRate: (data.conversions / data.leads) * 100,
    customerLifetimeValue: totalRevenue / data.customers.length,
    
    // Operación
    ticketsResolved: data.tickets.filter(t => t.status === 'resolved').length,
    avgResolutionTime: calculateAverageResolutionTime(data.tickets),
    customerSatisfaction: calculateAverageSatisfaction(data.surveys),
    
    // Performance
    avgResponseTime: calculateAverageResponseTime(data.activities),
    systemUptime: calculateSystemUptime(data.systemLogs),
    errorRate: (data.errors / data.totalRequests) * 100
  };
};
```

### **¿Qué son las métricas de engagement?**
```tsx
// Métricas de engagement
const calculateEngagementMetrics = (userData) => {
  return {
    // Frecuencia de uso
    dailyActiveUsers: countUsersActiveInPeriod(userData, 1),
    weeklyActiveUsers: countUsersActiveInPeriod(userData, 7),
    monthlyActiveUsers: countUsersActiveInPeriod(userData, 30),
    
    // Duración de sesión
    avgSessionDuration: calculateAverageSessionDuration(userData.sessions),
    sessionsPerUser: userData.sessions.length / userData.users.length,
    
    // Profundidad de uso
    featuresUsed: countUniqueFeaturesUsed(userData),
    pagesPerSession: calculateAveragePagesPerSession(userData.sessions),
    
    // Retención
    retentionRate: calculateRetentionRate(userData, 30),
    churnRate: calculateChurnRate(userData, 30)
  };
};
```

### **¿Cómo calcular métricas de conversión?**
```tsx
// Métricas de conversión
const calculateConversionMetrics = (funnelData) => {
  const stages = ['awareness', 'interest', 'consideration', 'purchase'];
  
  return stages.map((stage, index) => {
    const currentStage = funnelData[stage];
    const previousStage = index > 0 ? funnelData[stages[index - 1]] : currentStage;
    
    return {
      stage,
      count: currentStage,
      conversionRate: index > 0 ? (currentStage / previousStage) * 100 : 100,
      dropoff: index > 0 ? previousStage - currentStage : 0
    };
  });
};
```

---

## 📈 **Dashboards**

### **¿Qué tipos de dashboards están disponibles?**
- **Dashboard Ejecutivo:** Métricas de alto nivel para directivos
- **Dashboard Operacional:** Métricas detalladas para equipos
- **Dashboard de Ventas:** Pipeline, conversiones, performance
- **Dashboard de Soporte:** Tickets, resolución, satisfacción
- **Dashboard Financiero:** Ingresos, costos, proyecciones

### **¿Cómo crear un dashboard personalizado?**
```tsx
// Creación de dashboard personalizado
<CustomDashboard>
  <DashboardHeader 
    title="Mi Dashboard"
    dateRange={dateRange}
    onDateChange={handleDateChange}
  />
  
  <DashboardGrid>
    <MetricCard 
      title="Usuarios Activos"
      value={metrics.activeUsers}
      trend={metrics.userGrowth}
      format="number"
    />
    
    <ChartCard 
      title="Ventas Mensuales"
      data={salesData}
      type="line"
      height={300}
    />
    
    <TableCard 
      title="Top Clientes"
      data={topClients}
      columns={clientColumns}
      pagination={true}
    />
    
    <GaugeCard 
      title="Satisfacción del Cliente"
      value={metrics.satisfaction}
      min={0}
      max={100}
      format="percentage"
    />
  </DashboardGrid>
</CustomDashboard>
```

### **¿Cómo configurar widgets de dashboard?**
```tsx
// Configuración de widgets
const widgetConfig = {
  metric: {
    title: 'Tickets Resueltos',
    dataSource: 'tickets',
    aggregation: 'count',
    filter: { status: 'resolved' },
    format: 'number',
    refreshInterval: 300000 // 5 minutos
  },
  chart: {
    title: 'Tickets por Día',
    dataSource: 'tickets',
    type: 'line',
    xAxis: 'date',
    yAxis: 'count',
    groupBy: 'status',
    timeRange: 'last30days'
  },
  table: {
    title: 'Agentes Top',
    dataSource: 'users',
    columns: ['name', 'ticketsResolved', 'satisfaction'],
    sortBy: 'ticketsResolved',
    limit: 10
  }
};
```

### **¿Cómo implementar dashboards en tiempo real?**
```tsx
// Dashboard en tiempo real
const RealTimeDashboard = () => {
  const [metrics, setMetrics] = useState({});
  
  useEffect(() => {
    // Suscripción a datos en tiempo real
    const subscription = supabase
      .channel('metrics')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'metrics' 
      }, (payload) => {
        setMetrics(prev => ({
          ...prev,
          [payload.table]: payload.new
        }));
      })
      .subscribe();
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <Dashboard>
      <RealTimeMetric 
        value={metrics.activeUsers}
        updateInterval={5000}
      />
      <RealTimeChart 
        data={metrics.salesData}
        updateInterval={10000}
      />
    </Dashboard>
  );
};
```

---

## 📋 **Reportes Específicos**

### **¿Qué reportes están disponibles por módulo?**

#### **Helpdesk/PQRS**
- Reporte de tickets por estado
- Tiempo de resolución promedio
- Satisfacción del cliente
- Performance por agente
- Escalación de tickets

#### **CRM**
- Pipeline de ventas
- Conversión de leads
- Performance por vendedor
- Análisis de clientes
- Predicciones de ventas

#### **Administración**
- Uso del sistema por usuario
- Actividad de la empresa
- Configuración de módulos
- Gestión de permisos

### **¿Cómo generar reportes personalizados?**
```tsx
// Generador de reportes personalizados
const CustomReportGenerator = () => {
  const [config, setConfig] = useState({
    dataSource: '',
    filters: {},
    groupBy: [],
    metrics: [],
    format: 'table'
  });
  
  const generateReport = async () => {
    const data = await apiClient.post('/reports/custom', config);
    
    switch (config.format) {
      case 'table':
        return <DataTable data={data} />;
      case 'chart':
        return <Chart data={data} type={config.chartType} />;
      case 'pdf':
        return <PDFReport data={data} />;
      default:
        return <DataTable data={data} />;
    }
  };
  
  return (
    <div>
      <ReportConfigurator 
        config={config}
        onConfigChange={setConfig}
      />
      <ReportPreview>
        {generateReport()}
      </ReportPreview>
    </div>
  );
};
```

### **¿Cómo crear reportes comparativos?**
```tsx
// Reportes comparativos
const ComparativeReport = ({ periods }) => {
  const [data, setData] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all(
        periods.map(async (period) => {
          const periodData = await apiClient.get('/metrics', {
            params: { startDate: period.start, endDate: period.end }
          });
          return { period, data: periodData };
        })
      );
      
      setData(results);
    };
    
    fetchData();
  }, [periods]);
  
  return (
    <ComparativeChart 
      data={data}
      metrics={['revenue', 'users', 'tickets']}
      periods={periods}
    />
  );
};
```

---

## 📤 **Exportación y Compartir**

### **¿Qué formatos de exportación están disponibles?**
- **PDF:** Reportes formateados para impresión
- **Excel:** Datos tabulares con fórmulas
- **CSV:** Datos simples para análisis externo
- **JSON:** Datos estructurados para APIs
- **PowerPoint:** Presentaciones ejecutivas

### **¿Cómo exportar reportes?**
```tsx
// Exportación de reportes
const exportReport = async (reportData, format) => {
  switch (format) {
    case 'pdf':
      return await generatePDF(reportData);
    
    case 'excel':
      return await generateExcel(reportData);
    
    case 'csv':
      return await generateCSV(reportData);
    
    case 'json':
      return await generateJSON(reportData);
    
    default:
      throw new Error('Formato no soportado');
  }
};

// Ejemplo de uso
const handleExport = async (format) => {
  const reportData = await generateReportData();
  const exportedFile = await exportReport(reportData, format);
  
  // Descargar archivo
  downloadFile(exportedFile, `report-${Date.now()}.${format}`);
};
```

### **¿Cómo programar reportes automáticos?**
```tsx
// Programación de reportes
const scheduleReport = async (config) => {
  const schedule = await apiClient.post('/reports/schedule', {
    name: config.name,
    dataSource: config.dataSource,
    filters: config.filters,
    format: config.format,
    frequency: config.frequency, // daily, weekly, monthly
    recipients: config.recipients,
    deliveryMethod: config.deliveryMethod // email, slack, webhook
  });
  
  return schedule;
};

// Configuración de reporte programado
const reportSchedule = {
  name: 'Reporte Semanal de Ventas',
  dataSource: 'sales',
  filters: { dateRange: 'last7days' },
  format: 'pdf',
  frequency: 'weekly',
  recipients: ['sales@company.com', 'management@company.com'],
  deliveryMethod: 'email'
};
```

### **¿Cómo compartir dashboards?**
```tsx
// Compartir dashboards
const shareDashboard = async (dashboardId, shareConfig) => {
  const share = await apiClient.post(`/dashboards/${dashboardId}/share`, {
    type: shareConfig.type, // public, private, restricted
    permissions: shareConfig.permissions, // view, edit, admin
    recipients: shareConfig.recipients,
    expiresAt: shareConfig.expiresAt
  });
  
  return share;
};

// Configuración de compartir
const shareConfig = {
  type: 'restricted',
  permissions: ['view'],
  recipients: ['user1@company.com', 'user2@company.com'],
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
};
```

---

## 🎨 **Personalización**

### **¿Cómo personalizar métricas por empresa?**
```tsx
// Personalización de métricas
const CustomMetrics = () => {
  const [customMetrics, setCustomMetrics] = useState([]);
  
  const addCustomMetric = (metric) => {
    setCustomMetrics(prev => [...prev, {
      id: generateId(),
      name: metric.name,
      formula: metric.formula,
      dataSource: metric.dataSource,
      filters: metric.filters
    }]);
  };
  
  const calculateCustomMetric = (metric, data) => {
    // Evaluar fórmula personalizada
    const formula = metric.formula
      .replace(/\{(\w+)\}/g, (match, field) => data[field] || 0);
    
    return eval(formula);
  };
  
  return (
    <div>
      <CustomMetricForm onAdd={addCustomMetric} />
      <CustomMetricsList 
        metrics={customMetrics}
        data={currentData}
        onCalculate={calculateCustomMetric}
      />
    </div>
  );
};
```

### **¿Cómo configurar alertas personalizadas?**
```tsx
// Alertas personalizadas
const CustomAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  
  const createAlert = (alertConfig) => {
    const alert = {
      id: generateId(),
      name: alertConfig.name,
      condition: alertConfig.condition,
      threshold: alertConfig.threshold,
      action: alertConfig.action,
      recipients: alertConfig.recipients,
      enabled: true
    };
    
    setAlerts(prev => [...prev, alert]);
    
    // Configurar monitoreo
    setupAlertMonitoring(alert);
  };
  
  return (
    <div>
      <AlertForm onCreate={createAlert} />
      <AlertsList 
        alerts={alerts}
        onToggle={toggleAlert}
        onDelete={deleteAlert}
      />
    </div>
  );
};
```

### **¿Cómo personalizar visualizaciones?**
```tsx
// Personalización de visualizaciones
const CustomVisualization = ({ data, config }) => {
  const chartConfig = {
    ...defaultChartConfig,
    ...config,
    colors: config.colors || defaultColors,
    fonts: config.fonts || defaultFonts,
    layout: config.layout || defaultLayout
  };
  
  return (
    <Chart
      data={data}
      config={chartConfig}
      onConfigChange={handleConfigChange}
    />
  );
};
```

---

## 🔔 **Alertas y Notificaciones**

### **¿Qué tipos de alertas están disponibles?**
- **Alertas de umbral:** Cuando una métrica supera un límite
- **Alertas de tendencia:** Cuando hay cambios significativos
- **Alertas de anomalía:** Cuando se detectan patrones inusuales
- **Alertas de sistema:** Errores, downtime, problemas de performance

### **¿Cómo configurar alertas de umbral?**
```tsx
// Alertas de umbral
const ThresholdAlert = ({ metric, threshold, action }) => {
  const [currentValue, setCurrentValue] = useState(0);
  
  useEffect(() => {
    const checkThreshold = () => {
      if (currentValue > threshold) {
        triggerAlert({
          type: 'threshold',
          metric,
          value: currentValue,
          threshold,
          action
        });
      }
    };
    
    const interval = setInterval(checkThreshold, 60000); // Cada minuto
    return () => clearInterval(interval);
  }, [currentValue, threshold]);
  
  return (
    <AlertIndicator 
      value={currentValue}
      threshold={threshold}
      status={currentValue > threshold ? 'alert' : 'normal'}
    />
  );
};
```

### **¿Cómo implementar alertas de tendencia?**
```tsx
// Alertas de tendencia
const TrendAlert = ({ metric, timeWindow, changeThreshold }) => {
  const [trend, setTrend] = useState(null);
  
  useEffect(() => {
    const calculateTrend = async () => {
      const data = await getMetricData(metric, timeWindow);
      const trend = calculateTrend(data);
      
      if (Math.abs(trend.change) > changeThreshold) {
        triggerAlert({
          type: 'trend',
          metric,
          trend,
          threshold: changeThreshold
        });
      }
      
      setTrend(trend);
    };
    
    calculateTrend();
  }, [metric, timeWindow, changeThreshold]);
  
  return (
    <TrendIndicator 
      trend={trend}
      threshold={changeThreshold}
    />
  );
};
```

---

## 🤖 **Integración con IA**

### **¿Cómo usar IA para análisis predictivo?**
```tsx
// Análisis predictivo con IA
const PredictiveAnalytics = ({ historicalData }) => {
  const [predictions, setPredictions] = useState({});
  
  useEffect(() => {
    const generatePredictions = async () => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: 'Analiza estos datos históricos y genera predicciones para los próximos 30 días.'
        }, {
          role: 'user',
          content: JSON.stringify(historicalData)
        }],
        temperature: 0.1
      });
      
      const predictions = JSON.parse(response.choices[0].message.content);
      setPredictions(predictions);
    };
    
    generatePredictions();
  }, [historicalData]);
  
  return (
    <PredictiveChart 
      historical={historicalData}
      predictions={predictions}
    />
  );
};
```

### **¿Cómo usar IA para detección de anomalías?**
```tsx
// Detección de anomalías
const AnomalyDetection = ({ data }) => {
  const [anomalies, setAnomalies] = useState([]);
  
  useEffect(() => {
    const detectAnomalies = async () => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: 'Identifica anomalías en estos datos. Una anomalía es un patrón que se desvía significativamente de lo normal.'
        }, {
          role: 'user',
          content: JSON.stringify(data)
        }],
        temperature: 0.1
      });
      
      const detectedAnomalies = JSON.parse(response.choices[0].message.content);
      setAnomalies(detectedAnomalies);
    };
    
    detectAnomalies();
  }, [data]);
  
  return (
    <AnomalyChart 
      data={data}
      anomalies={anomalies}
    />
  );
};
```

---

## ⚙️ **Configuración Avanzada**

### **¿Cómo configurar data warehouses?**
```tsx
// Configuración de data warehouse
const DataWarehouseConfig = {
  sources: [
    {
      name: 'production_db',
      type: 'postgresql',
      connection: process.env.PROD_DB_URL,
      syncInterval: '1h'
    },
    {
      name: 'analytics_db',
      type: 'bigquery',
      connection: process.env.BIGQUERY_CONNECTION,
      syncInterval: '4h'
    }
  ],
  transformations: [
    {
      name: 'daily_aggregation',
      schedule: '0 2 * * *', // 2 AM daily
      query: 'SELECT date, COUNT(*) FROM events GROUP BY date'
    }
  ]
};
```

### **¿Cómo implementar caching de reportes?**
```tsx
// Caching de reportes
const ReportCache = {
  // Configuración de cache
  config: {
    ttl: 3600, // 1 hora
    maxSize: 1000, // Máximo 1000 reportes en cache
    strategy: 'lru' // Least Recently Used
  },
  
  // Generar cache key
  generateKey: (reportConfig) => {
    return `report:${JSON.stringify(reportConfig)}`;
  },
  
  // Obtener reporte con cache
  getReport: async (config) => {
    const key = generateKey(config);
    const cached = await cache.get(key);
    
    if (cached) {
      return cached;
    }
    
    const report = await generateReport(config);
    await cache.set(key, report, config.ttl);
    
    return report;
  }
};
```

---

## ✅ **Checklist de Implementación**

### **Antes de crear un reporte:**
- [ ] ¿Están definidas las métricas necesarias?
- [ ] ¿Se configuraron las fuentes de datos?
- [ ] ¿Se definieron los filtros apropiados?
- [ ] ¿Se configuró el formato de salida?

### **Antes de configurar alertas:**
- [ ] ¿Se definieron los umbrales correctos?
- [ ] ¿Se configuraron los destinatarios?
- [ ] ¿Se probó la lógica de alerta?
- [ ] ¿Se configuró el manejo de falsos positivos?

### **Antes de implementar IA:**
- [ ] ¿Se validó la calidad de los datos?
- [ ] ¿Se configuraron los límites de uso?
- [ ] ¿Se implementó el manejo de errores?
- [ ] ¿Se configuró el monitoreo de performance?

---

## 📚 **Recursos Adicionales**

### **Documentación Relacionada:**
- [Arquitectura de Analytics](../development/ANALYTICS_ARCHITECTURE.md)
- [Guía de Métricas](../development/METRICS_GUIDE.md)
- [Configuración de Dashboards](../development/DASHBOARD_CONFIGURATION.md)
- [Integración de IA](../development/AI_INTEGRATION_GUIDE.md)

### **Herramientas:**
- [Componentes de Analytics](../../src/components/analytics/)
- [Hooks de Analytics](../../src/hooks/analytics/)
- [Servicios de Analytics](../../src/services/analytics/)

---

**Nota:** Esta FAQ es fundamental para el uso efectivo de analytics y reportes. Cualquier nueva funcionalidad debe ser documentada aquí. 