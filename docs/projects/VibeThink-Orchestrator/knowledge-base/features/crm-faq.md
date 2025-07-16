# FAQ: Módulo CRM

## 📋 **Índice**
1. [Funcionalidades Principales](#funcionalidades-principales)
2. [Gestión de Clientes](#gestión-de-clientes)
3. [Pipeline de Ventas](#pipeline-de-ventas)
4. [Oportunidades y Deals](#oportunidades-y-deals)
5. [Actividades y Seguimiento](#actividades-y-seguimiento)
6. [Reportes y Analytics](#reportes-y-analytics)
7. [Integración con IA](#integración-con-ia)
8. [Configuración y Personalización](#configuración-y-personalización)

---

## 🎯 **Funcionalidades Principales**

### **¿Qué es el módulo CRM?**
El módulo CRM (Customer Relationship Management) es un sistema integral para gestionar relaciones con clientes, pipeline de ventas, oportunidades de negocio y actividades comerciales.

### **¿Qué funcionalidades principales incluye?**
- **Gestión de clientes:** Información completa de contactos y empresas
- **Pipeline de ventas:** Seguimiento de oportunidades y deals
- **Actividades:** Llamadas, reuniones, emails, tareas
- **Reportes:** Analytics y métricas de ventas
- **Integración:** Con Helpdesk, email, calendario
- **IA:** Predicciones, scoring, recomendaciones

### **¿Cómo funciona la interfaz principal?**
```tsx
// Dashboard principal de CRM
<CRMDashboard>
  <SalesPipeline />
  <RecentActivities />
  <KeyMetrics />
  <UpcomingTasks />
  <LeadScoring />
</CRMDashboard>
```

### **¿Qué tipos de entidades maneja el CRM?**
- **Leads:** Contactos potenciales
- **Contacts:** Personas de contacto
- **Companies:** Empresas cliente
- **Opportunities:** Oportunidades de venta
- **Deals:** Negocios en proceso
- **Activities:** Interacciones y tareas

---

## 👥 **Gestión de Clientes**

### **¿Cómo crear un nuevo cliente?**
```tsx
// Formulario de creación de cliente
<ClientForm
  type="company" // o "contact"
  fields={[
    { name: 'name', label: 'Nombre', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Teléfono' },
    { name: 'industry', label: 'Industria', type: 'select' },
    { name: 'source', label: 'Origen', type: 'select' },
    { name: 'notes', label: 'Notas', type: 'textarea' }
  ]}
  onSubmit={handleCreateClient}
/>
```

### **¿Qué información se almacena de un cliente?**
- **Información básica:** Nombre, email, teléfono, dirección
- **Información de empresa:** Industria, tamaño, facturación
- **Información de contacto:** Múltiples contactos por empresa
- **Historial:** Todas las interacciones y actividades
- **Preferencias:** Productos de interés, comunicación
- **Metadatos:** Fechas, origen, estado, tags

### **¿Cómo manejar múltiples contactos por empresa?**
```tsx
// Gestión de contactos múltiples
<CompanyDetail>
  <CompanyInfo company={company} />
  <ContactList 
    contacts={company.contacts}
    onAddContact={handleAddContact}
    onEditContact={handleEditContact}
  />
  <ActivityTimeline activities={company.activities} />
</CompanyDetail>
```

### **¿Cómo funciona el scoring de leads?**
```tsx
// Cálculo de score de lead
const calculateLeadScore = (lead) => {
  let score = 0;
  
  // Factores de comportamiento
  score += lead.websiteVisits * 5;
  score += lead.emailOpens * 2;
  score += lead.downloads * 10;
  
  // Factores de información
  score += lead.hasEmail ? 20 : 0;
  score += lead.hasPhone ? 15 : 0;
  score += lead.hasCompany ? 25 : 0;
  
  // Factores de actividad
  score += lead.recentActivity ? 30 : 0;
  score += lead.qualifiedBySales ? 50 : 0;
  
  return Math.min(score, 100);
};
```

### **¿Cómo segmentar clientes?**
```tsx
// Segmentación de clientes
const segmentClients = (clients, criteria) => {
  return clients.filter(client => {
    switch (criteria.type) {
      case 'industry':
        return client.industry === criteria.value;
      case 'size':
        return client.companySize === criteria.value;
      case 'value':
        return client.totalValue >= criteria.minValue;
      case 'activity':
        return client.lastActivity >= criteria.daysAgo;
      default:
        return true;
    }
  });
};
```

---

## 📈 **Pipeline de Ventas**

### **¿Qué es el pipeline de ventas?**
El pipeline es el proceso visual que muestra las oportunidades de venta en diferentes etapas, desde lead hasta cierre.

### **¿Cuáles son las etapas del pipeline?**
1. **Lead:** Contacto inicial
2. **Qualified:** Lead calificado
3. **Proposal:** Propuesta enviada
4. **Negotiation:** En negociación
5. **Closed Won:** Ganado
6. **Closed Lost:** Perdido

### **¿Cómo configurar etapas personalizadas?**
```tsx
// Configuración de pipeline
const pipelineConfig = {
  stages: [
    { id: 'lead', name: 'Lead', color: '#e3f2fd', probability: 10 },
    { id: 'qualified', name: 'Calificado', color: '#fff3e0', probability: 25 },
    { id: 'proposal', name: 'Propuesta', color: '#f3e5f5', probability: 50 },
    { id: 'negotiation', name: 'Negociación', color: '#fff8e1', probability: 75 },
    { id: 'closed-won', name: 'Ganado', color: '#e8f5e8', probability: 100 },
    { id: 'closed-lost', name: 'Perdido', color: '#ffebee', probability: 0 }
  ],
  customFields: ['budget', 'timeline', 'decision_maker']
};
```

### **¿Cómo mover oportunidades entre etapas?**
```tsx
// Movimiento de oportunidades
const moveOpportunity = async (opportunityId, newStage, data) => {
  // Validar transición
  const canMove = validateStageTransition(opportunity.currentStage, newStage);
  
  if (!canMove) {
    throw new Error('Transición no válida');
  }
  
  // Actualizar oportunidad
  await updateOpportunity(opportunityId, {
    stage: newStage,
    stageChangedAt: new Date(),
    stageData: data
  });
  
  // Crear actividad
  await createActivity({
    type: 'stage_change',
    opportunityId,
    data: { from: opportunity.currentStage, to: newStage }
  });
  
  // Notificar equipo
  await notifyTeam(opportunity, 'stage_changed');
};
```

### **¿Cómo calcular la probabilidad de cierre?**
```tsx
// Cálculo de probabilidad
const calculateProbability = (opportunity) => {
  let probability = getStageProbability(opportunity.stage);
  
  // Factores adicionales
  if (opportunity.hasBudget) probability += 10;
  if (opportunity.hasTimeline) probability += 10;
  if (opportunity.hasDecisionMaker) probability += 15;
  if (opportunity.competition === 'none') probability += 20;
  if (opportunity.urgency === 'high') probability += 15;
  
  return Math.min(probability, 100);
};
```

---

## 💰 **Oportunidades y Deals**

### **¿Cómo crear una nueva oportunidad?**
```tsx
// Formulario de oportunidad
<OpportunityForm
  client={selectedClient}
  fields={[
    { name: 'title', label: 'Título', required: true },
    { name: 'value', label: 'Valor', type: 'currency', required: true },
    { name: 'stage', label: 'Etapa', type: 'select', options: stages },
    { name: 'expectedClose', label: 'Fecha de cierre esperada', type: 'date' },
    { name: 'probability', label: 'Probabilidad', type: 'percentage' },
    { name: 'description', label: 'Descripción', type: 'textarea' }
  ]}
  onSubmit={handleCreateOpportunity}
/>
```

### **¿Qué información incluye una oportunidad?**
- **Información básica:** Título, descripción, valor
- **Información de cierre:** Fecha esperada, probabilidad
- **Información de contacto:** Cliente, contactos clave
- **Información de competencia:** Competidores, diferenciadores
- **Información de presupuesto:** Presupuesto disponible, timeline
- **Actividades:** Llamadas, reuniones, propuestas

### **¿Cómo manejar múltiples oportunidades por cliente?**
```tsx
// Gestión de oportunidades múltiples
<ClientOpportunities>
  <OpportunityList 
    opportunities={client.opportunities}
    onSelect={handleSelectOpportunity}
  />
  <OpportunitySummary 
    totalValue={calculateTotalValue(client.opportunities)}
    weightedValue={calculateWeightedValue(client.opportunities)}
  />
</ClientOpportunities>
```

### **¿Cómo calcular el valor de pipeline?**
```tsx
// Cálculo de valor de pipeline
const calculatePipelineValue = (opportunities) => {
  return opportunities.reduce((total, opp) => {
    const weightedValue = (opp.value * opp.probability) / 100;
    return total + weightedValue;
  }, 0);
};

// Por etapa
const pipelineByStage = opportunities.reduce((acc, opp) => {
  if (!acc[opp.stage]) acc[opp.stage] = 0;
  acc[opp.stage] += opp.value;
  return acc;
}, {});
```

### **¿Cómo manejar propuestas y cotizaciones?**
```tsx
// Gestión de propuestas
const createProposal = async (opportunityId, proposalData) => {
  const proposal = await apiClient.post('/proposals', {
    opportunityId,
    ...proposalData,
    status: 'draft'
  });
  
  // Generar PDF
  const pdf = await generateProposalPDF(proposal);
  
  // Enviar por email
  await sendProposalEmail(proposal, pdf);
  
  return proposal;
};
```

---

## 📞 **Actividades y Seguimiento**

### **¿Qué tipos de actividades se pueden registrar?**
- **Llamadas:** Entrantes, salientes, perdidas
- **Emails:** Enviados, recibidos, respuestas
- **Reuniones:** Presenciales, virtuales, demos
- **Tareas:** Pendientes, completadas, vencidas
- **Notas:** Observaciones, comentarios
- **Documentos:** Propuestas, contratos, facturas

### **¿Cómo registrar una actividad?**
```tsx
// Formulario de actividad
<ActivityForm
  types={['call', 'email', 'meeting', 'task', 'note']}
  relatedTo={selectedClient}
  fields={{
    call: [
      { name: 'direction', label: 'Dirección', type: 'select' },
      { name: 'duration', label: 'Duración', type: 'number' },
      { name: 'outcome', label: 'Resultado', type: 'select' }
    ],
    email: [
      { name: 'subject', label: 'Asunto' },
      { name: 'body', label: 'Contenido', type: 'textarea' },
      { name: 'attachments', label: 'Adjuntos', type: 'file' }
    ],
    meeting: [
      { name: 'date', label: 'Fecha y hora', type: 'datetime' },
      { name: 'duration', label: 'Duración', type: 'number' },
      { name: 'attendees', label: 'Participantes', type: 'multiselect' }
    ]
  }}
  onSubmit={handleCreateActivity}
/>
```

### **¿Cómo programar actividades futuras?**
```tsx
// Programación de actividades
const scheduleActivity = async (activityData) => {
  const activity = await createActivity({
    ...activityData,
    scheduled: true,
    scheduledAt: activityData.scheduledDate
  });
  
  // Crear recordatorio
  if (activityData.reminder) {
    await createReminder({
      activityId: activity.id,
      remindAt: activityData.reminderDate,
      type: activityData.reminderType // email, sms, push
    });
  }
  
  // Sincronizar con calendario
  if (activityData.syncCalendar) {
    await syncWithCalendar(activity);
  }
  
  return activity;
};
```

### **¿Cómo hacer seguimiento de actividades?**
```tsx
// Dashboard de actividades
<ActivityDashboard>
  <UpcomingActivities activities={upcomingActivities} />
  <OverdueTasks tasks={overdueTasks} />
  <ActivityCalendar activities={monthlyActivities} />
  <ActivityMetrics metrics={activityMetrics} />
</ActivityDashboard>
```

### **¿Cómo generar recordatorios automáticos?**
```tsx
// Sistema de recordatorios
const generateReminders = async () => {
  const activities = await getScheduledActivities();
  
  for (const activity of activities) {
    const shouldRemind = checkReminderTime(activity);
    
    if (shouldRemind) {
      await sendReminder(activity);
      await updateActivity(activity.id, { reminded: true });
    }
  }
};
```

---

## 📊 **Reportes y Analytics**

### **¿Qué reportes están disponibles?**
- **Pipeline Report:** Valor y cantidad por etapa
- **Sales Performance:** Rendimiento por vendedor
- **Conversion Rates:** Tasas de conversión
- **Activity Reports:** Actividades por período
- **Customer Reports:** Análisis de clientes
- **Forecast Reports:** Predicciones de ventas

### **¿Cómo generar reportes personalizados?**
```tsx
// Generador de reportes
const generateCustomReport = async (config) => {
  const data = await apiClient.get('/reports/custom', {
    params: {
      type: config.type,
      filters: config.filters,
      groupBy: config.groupBy,
      metrics: config.metrics,
      dateRange: config.dateRange
    }
  });
  
  return formatReportData(data, config.format);
};
```

### **¿Cómo calcular métricas clave?**
```tsx
// Cálculo de métricas
const calculateMetrics = (data) => {
  return {
    // Pipeline
    totalPipeline: data.opportunities.reduce((sum, opp) => sum + opp.value, 0),
    weightedPipeline: data.opportunities.reduce((sum, opp) => 
      sum + (opp.value * opp.probability / 100), 0),
    
    // Conversión
    conversionRate: (data.closedWon / data.totalLeads) * 100,
    
    // Actividad
    avgActivitiesPerDay: data.totalActivities / data.daysInPeriod,
    
    // Performance
    avgDealSize: data.totalRevenue / data.closedDeals,
    salesCycle: data.avgDaysToClose
  };
};
```

### **¿Cómo crear dashboards personalizados?**
```tsx
// Dashboard personalizable
<CustomDashboard>
  <MetricCard 
    title="Pipeline Total"
    value={metrics.totalPipeline}
    trend={metrics.pipelineTrend}
    format="currency"
  />
  <ChartCard 
    title="Ventas por Mes"
    data={salesData}
    type="line"
  />
  <TableCard 
    title="Top Clientes"
    data={topClients}
    columns={clientColumns}
  />
</CustomDashboard>
```

---

## 🤖 **Integración con IA**

### **¿Cómo ayuda la IA en el CRM?**
- **Lead Scoring:** Calificación automática de leads
- **Predicciones:** Probabilidad de cierre, valor esperado
- **Recomendaciones:** Próximas acciones, mejores momentos
- **Análisis de sentimiento:** En emails y llamadas
- **Automatización:** Tareas repetitivas, seguimientos

### **¿Cómo funciona el lead scoring con IA?**
```tsx
// Lead scoring con IA
const scoreLeadWithAI = async (lead) => {
  const features = extractLeadFeatures(lead);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'Evalúa este lead del 1 al 100 basado en su potencial de conversión'
    }, {
      role: 'user',
      content: JSON.stringify(features)
    }],
    temperature: 0.1
  });
  
  return parseInt(response.choices[0].message.content);
};
```

### **¿Cómo predecir probabilidad de cierre?**
```tsx
// Predicción de cierre
const predictCloseProbability = async (opportunity) => {
  const features = {
    stage: opportunity.stage,
    value: opportunity.value,
    daysInStage: opportunity.daysInStage,
    activities: opportunity.recentActivities,
    clientHistory: opportunity.client.purchaseHistory
  };
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'Predice la probabilidad de cierre de esta oportunidad'
    }, {
      role: 'user',
      content: JSON.stringify(features)
    }],
    temperature: 0.1
  });
  
  return parseInt(response.choices[0].message.content);
};
```

### **¿Cómo generar recomendaciones de acción?**
```tsx
// Recomendaciones de IA
const generateRecommendations = async (client) => {
  const context = buildClientContext(client);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'Genera 3 recomendaciones de acción para este cliente'
    }, {
      role: 'user',
      content: context
    }],
    temperature: 0.7
  });
  
  return parseRecommendations(response.choices[0].message.content);
};
```

---

## ⚙️ **Configuración y Personalización**

### **¿Qué se puede configurar en el CRM?**
- **Campos personalizados:** Campos específicos por empresa
- **Etapas de pipeline:** Personalizar flujo de ventas
- **Tipos de actividad:** Definir actividades específicas
- **Reglas de asignación:** Automatizar asignación de leads
- **Integraciones:** Conectar con sistemas externos
- **Reportes:** Configurar métricas y dashboards

### **¿Cómo configurar campos personalizados?**
```tsx
// Configuración de campos
const customFields = {
  'opportunity': [
    { name: 'budget_range', label: 'Rango de Presupuesto', type: 'select' },
    { name: 'decision_maker', label: 'Tomador de Decisiones', type: 'text' },
    { name: 'competition', label: 'Competencia', type: 'multiselect' },
    { name: 'timeline', label: 'Timeline', type: 'date' }
  ],
  'contact': [
    { name: 'role', label: 'Cargo', type: 'text' },
    { name: 'department', label: 'Departamento', type: 'select' },
    { name: 'preferred_contact', label: 'Contacto Preferido', type: 'select' }
  ]
};
```

### **¿Cómo configurar reglas de asignación?**
```tsx
// Reglas de asignación automática
const assignmentRules = [
  {
    condition: { industry: 'technology', value: { min: 10000 } },
    assignTo: 'senior_sales_team',
    priority: 'high'
  },
  {
    condition: { source: 'website', region: 'north' },
    assignTo: 'north_region_team',
    priority: 'medium'
  },
  {
    condition: { value: { min: 50000 } },
    assignTo: 'enterprise_team',
    priority: 'high'
  }
];
```

### **¿Cómo integrar con sistemas externos?**
```tsx
// Integración con email
const emailIntegration = {
  provider: 'gmail', // o outlook, etc.
  sync: {
    incoming: true,
    outgoing: true,
    calendar: true
  },
  rules: [
    { from: '@company.com', createActivity: true },
    { subject: 'proposal', createOpportunity: true }
  ]
};

// Integración con calendario
const calendarIntegration = {
  provider: 'google', // o outlook
  sync: {
    meetings: true,
    reminders: true
  },
  autoCreate: {
    followUps: true,
    reminders: true
  }
};
```

---

## ✅ **Checklist de Implementación**

### **Antes de crear un cliente:**
- [ ] ¿Tengo toda la información necesaria?
- [ ] ¿Está duplicado en el sistema?
- [ ] ¿Tiene la clasificación correcta?
- [ ] ¿Está asignado al vendedor apropiado?

### **Antes de crear una oportunidad:**
- [ ] ¿El cliente está calificado?
- [ ] ¿Tengo información del presupuesto?
- [ ] ¿Conozco el timeline de decisión?
- [ ] ¿Identifiqué al tomador de decisiones?

### **Antes de cerrar una venta:**
- [ ] ¿Se cumplieron todos los términos?
- [ ] ¿El cliente está satisfecho?
- [ ] ¿Se documentó toda la información?
- [ ] ¿Se programó el seguimiento post-venta?

---

## 📚 **Recursos Adicionales**

### **Documentación Relacionada:**
- [Arquitectura CRM](../development/CRM_ARCHITECTURE.md)
- [Guía de Ventas](../development/SALES_GUIDE.md)
- [Integración de IA](../development/AI_INTEGRATION_GUIDE.md)
- [Reportes y Analytics](../development/ANALYTICS_GUIDE.md)

### **Herramientas:**
- [Panel de CRM](../../src/components/crm/)
- [Hooks de CRM](../../src/hooks/crm/)
- [Servicios de CRM](../../src/services/crm/)

---

**Nota:** Esta FAQ es fundamental para todos los usuarios del módulo CRM. Cualquier nueva funcionalidad debe ser documentada aquí. 