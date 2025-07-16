# Implementación del Dashboard de Stack - VThink Orchestrator

> **Implementación práctica del sistema de control visual de versiones**

## 🎯 **Plan de Implementación**

### **Fase 1: Estructura Base (Semana 1)**

#### **1.1 Configuración del Proyecto**
```bash
# Crear estructura del dashboard
mkdir -p dev-portal/components/stack
mkdir -p dev-portal/data
mkdir -p dev-portal/services
mkdir -p dev-portal/utils
```

#### **1.2 Archivo de Configuración del Stack**
```json
// dev-portal/data/stack-config.json
{
  "categories": {
    "frontend": {
      "name": "Frontend",
      "color": "#3B82F6",
      "icon": "MonitorIcon",
      "components": [
        "react",
        "react-dom",
        "reactflow",
        "shadcn",
        "tailwindcss"
      ]
    },
    "backend": {
      "name": "Backend",
      "color": "#10B981",
      "icon": "ServerIcon",
      "components": [
        "supabase",
        "node-fetch",
        "cors"
      ]
    },
    "tools": {
      "name": "Development Tools",
      "color": "#F59E0B",
      "icon": "WrenchIcon",
      "components": [
        "typescript",
        "vite",
        "eslint",
        "prettier"
      ]
    },
    "ai": {
      "name": "AI & ML",
      "color": "#8B5CF6",
      "icon": "BrainIcon",
      "components": [
        "openai",
        "firecrawl",
        "knotie"
      ]
    }
  },
  "monitoring": {
    "checkInterval": 86400000, // 24 horas
    "securityCheckInterval": 21600000, // 6 horas
    "notifications": {
      "slack": true,
      "email": true,
      "dashboard": true
    }
  }
}
```

### **Fase 2: Componentes del Dashboard (Semana 2)**

#### **2.1 Dashboard Principal**
```typescript
// dev-portal/components/stack/StackDashboard.tsx
import React, { useState, useEffect } from 'react';
import { StackOverview } from './StackOverview';
import { StackMetrics } from './StackMetrics';
import { SecurityAlerts } from './SecurityAlerts';
import { RecommendedActions } from './RecommendedActions';

export const StackDashboard: React.FC = () => {
  const [stackData, setStackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStackData();
  }, []);

  const loadStackData = async () => {
    try {
      setLoading(true);
      const data = await fetch('/api/stack/status');
      const stackData = await data.json();
      setStackData(stackData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading stack data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Stack Technology Dashboard</h1>
      
      <StackMetrics data={stackData.metrics} />
      <SecurityAlerts alerts={stackData.alerts} />
      <StackOverview data={stackData.categories} />
      <RecommendedActions actions={stackData.recommendations} />
    </div>
  );
};
```

#### **2.2 Componente de Métricas**
```typescript
// dev-portal/components/stack/StackMetrics.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

interface StackMetricsProps {
  data: {
    totalComponents: number;
    upToDate: number;
    updateAvailable: number;
    securityCritical: number;
    healthScore: number;
  };
}

export const StackMetrics: React.FC<StackMetricsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <MetricCard
        title="Total Components"
        value={data.totalComponents}
        color="blue"
        icon="📦"
      />
      <MetricCard
        title="Up to Date"
        value={data.upToDate}
        color="green"
        icon="✅"
      />
      <MetricCard
        title="Updates Available"
        value={data.updateAvailable}
        color="yellow"
        icon="🔄"
      />
      <MetricCard
        title="Security Critical"
        value={data.securityCritical}
        color="red"
        icon="🚨"
      />
      <MetricCard
        title="Health Score"
        value={`${data.healthScore}%`}
        color={data.healthScore > 80 ? 'green' : data.healthScore > 60 ? 'yellow' : 'red'}
        icon="💚"
      />
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  color: string;
  icon: string;
}> = ({ title, value, color, icon }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold" style={{ color: getColorValue(color) }}>
        {value}
      </div>
    </CardContent>
  </Card>
);
```

### **Fase 3: Servicios de Datos (Semana 3)**

#### **3.1 Servicio de Stack**
```typescript
// dev-portal/services/StackService.ts
export class StackService {
  private static instance: StackService;
  private stackData: any = null;
  private lastUpdate: Date | null = null;

  static getInstance(): StackService {
    if (!StackService.instance) {
      StackService.instance = new StackService();
    }
    return StackService.instance;
  }

  async getStackStatus(): Promise<any> {
    // Verificar si necesitamos actualizar
    if (this.shouldUpdate()) {
      await this.updateStackData();
    }

    return {
      categories: this.stackData.categories,
      metrics: this.calculateMetrics(),
      alerts: this.getSecurityAlerts(),
      recommendations: this.getRecommendations()
    };
  }

  private async updateStackData(): Promise<void> {
    try {
      // Cargar configuración del stack
      const config = await this.loadStackConfig();
      
      // Verificar versiones actuales
      const currentVersions = await this.getCurrentVersions();
      
      // Verificar versiones más recientes
      const latestVersions = await this.getLatestVersions();
      
      // Analizar estado de cada componente
      const components = await this.analyzeComponents(
        config,
        currentVersions,
        latestVersions
      );

      this.stackData = {
        categories: this.groupByCategory(components),
        lastUpdate: new Date()
      };
    } catch (error) {
      console.error('Error updating stack data:', error);
      throw error;
    }
  }

  private async getCurrentVersions(): Promise<Record<string, string>> {
    // Leer package.json del proyecto principal
    const packageJson = await this.readPackageJson();
    return {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
  }

  private async getLatestVersions(): Promise<Record<string, string>> {
    const versions: Record<string, string> = {};
    const components = Object.keys(await this.getCurrentVersions());

    for (const component of components) {
      try {
        const response = await fetch(
          `https://registry.npmjs.org/${component}/latest`
        );
        const data = await response.json();
        versions[component] = data.version;
      } catch (error) {
        console.warn(`Could not fetch latest version for ${component}`);
        versions[component] = 'unknown';
      }
    }

    return versions;
  }

  private calculateMetrics(): any {
    const components = this.getAllComponents();
    
    return {
      totalComponents: components.length,
      upToDate: components.filter(c => c.status === 'up-to-date').length,
      updateAvailable: components.filter(c => c.status === 'update-available').length,
      securityCritical: components.filter(c => c.status === 'security-critical').length,
      healthScore: this.calculateHealthScore(components)
    };
  }

  private getSecurityAlerts(): any[] {
    const components = this.getAllComponents();
    return components
      .filter(c => c.status === 'security-critical')
      .map(c => ({
        id: c.name,
        component: c.name,
        severity: 'critical',
        message: `Security vulnerability detected in ${c.name} ${c.currentVersion}`,
        action: 'immediate_update_required'
      }));
  }

  private getRecommendations(): any[] {
    const recommendations = [];
    const components = this.getAllComponents();

    // Security updates
    const securityComponents = components.filter(c => c.status === 'security-critical');
    if (securityComponents.length > 0) {
      recommendations.push({
        id: 'security-updates',
        title: 'Security Updates Required',
        description: `${securityComponents.length} components have security vulnerabilities`,
        priority: 'critical',
        action: 'execute_security_updates',
        components: securityComponents.map(c => c.name)
      });
    }

    // Major updates
    const majorUpdates = components.filter(c => c.priority === 'high');
    if (majorUpdates.length > 0) {
      recommendations.push({
        id: 'major-updates',
        title: 'Major Updates Available',
        description: `${majorUpdates.length} components have major updates`,
        priority: 'high',
        action: 'review_major_updates',
        components: majorUpdates.map(c => c.name)
      });
    }

    return recommendations;
  }
}
```

#### **3.2 API Endpoints**
```typescript
// dev-portal/api/stack/status.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { StackService } from '../../../services/StackService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const stackService = StackService.getInstance();
    const stackStatus = await stackService.getStackStatus();
    
    res.status(200).json(stackStatus);
  } catch (error) {
    console.error('Error fetching stack status:', error);
    res.status(500).json({ 
      message: 'Error fetching stack status',
      error: error.message 
    });
  }
}
```

### **Fase 4: Automatización (Semana 4)**

#### **4.1 Script de Monitoreo**
```javascript
// dev-portal/dev-tools/automation/stack-monitor.js
const cron = require('node-cron');
const { StackService } = require('../../services/StackService');
const { NotificationService } = require('./notifications/NotificationService');

class StackMonitor {
  constructor() {
    this.stackService = StackService.getInstance();
    this.notificationService = new NotificationService();
  }

  async startMonitoring() {
    console.log('🚀 Starting stack monitoring...');

    // Verificar stack diariamente a las 9:00 AM
    cron.schedule('0 9 * * *', async () => {
      await this.dailyCheck();
    });

    // Verificar seguridad cada 6 horas
    cron.schedule('0 */6 * * *', async () => {
      await this.securityCheck();
    });

    // Verificar versiones cada hora
    cron.schedule('0 * * * *', async () => {
      await this.versionCheck();
    });
  }

  async dailyCheck() {
    try {
      console.log('📊 Running daily stack check...');
      
      const status = await this.stackService.getStackStatus();
      
      // Enviar reporte diario
      await this.notificationService.sendDailyReport(status);
      
      // Verificar alertas críticas
      if (status.alerts.length > 0) {
        await this.notificationService.sendSecurityAlerts(status.alerts);
      }
      
      console.log('✅ Daily stack check completed');
    } catch (error) {
      console.error('❌ Error in daily check:', error);
      await this.notificationService.sendErrorAlert(error);
    }
  }

  async securityCheck() {
    try {
      console.log('🔒 Running security check...');
      
      const status = await this.stackService.getStackStatus();
      const securityIssues = status.alerts.filter(
        alert => alert.severity === 'critical'
      );
      
      if (securityIssues.length > 0) {
        await this.notificationService.sendSecurityAlerts(securityIssues);
      }
      
      console.log('✅ Security check completed');
    } catch (error) {
      console.error('❌ Error in security check:', error);
    }
  }

  async versionCheck() {
    try {
      console.log('🔄 Running version check...');
      
      const status = await this.stackService.getStackStatus();
      const updates = status.metrics.updateAvailable;
      
      if (updates > 0) {
        await this.notificationService.sendUpdateNotification(updates);
      }
      
      console.log('✅ Version check completed');
    } catch (error) {
      console.error('❌ Error in version check:', error);
    }
  }
}

// Iniciar monitoreo
const monitor = new StackMonitor();
monitor.startMonitoring();
```

#### **4.2 Servicio de Notificaciones**
```typescript
// dev-portal/dev-tools/automation/notifications/NotificationService.ts
export class NotificationService {
  async sendDailyReport(status: any): Promise<void> {
    const message = {
      type: 'daily_report',
      metrics: status.metrics,
      alerts: status.alerts.length,
      recommendations: status.recommendations.length
    };

    await this.sendSlackNotification(message);
    await this.sendEmailReport(message);
  }

  async sendSecurityAlerts(alerts: any[]): Promise<void> {
    for (const alert of alerts) {
      const message = {
        type: 'security_alert',
        component: alert.component,
        severity: alert.severity,
        message: alert.message,
        action: alert.action
      };

      await this.sendSlackNotification(message);
      await this.sendEmailAlert(message);
    }
  }

  async sendUpdateNotification(updateCount: number): Promise<void> {
    const message = {
      type: 'update_notification',
      count: updateCount,
      message: `${updateCount} components have updates available`
    };

    await this.sendSlackNotification(message);
  }

  private async sendSlackNotification(message: any): Promise<void> {
    // Implementar envío a Slack
    console.log('📱 Slack notification:', message);
  }

  private async sendEmailAlert(message: any): Promise<void> {
    // Implementar envío por email
    console.log('📧 Email alert:', message);
  }

  private async sendEmailReport(message: any): Promise<void> {
    // Implementar reporte por email
    console.log('📧 Email report:', message);
  }
}
```

### **Fase 5: Interfaz de Usuario (Semana 5)**

#### **5.1 Página del Dashboard**
```html
<!-- dev-portal/stack-dashboard.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stack Dashboard - VThink Orchestrator</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-6">
                    <h1 class="text-2xl font-bold text-gray-900">
                        Stack Technology Dashboard
                    </h1>
                    <div class="flex items-center space-x-4">
                        <button id="refresh-btn" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Refresh
                        </button>
                        <span id="last-updated" class="text-sm text-gray-500">
                            Last updated: Loading...
                        </span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Metrics -->
            <div id="metrics" class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <!-- Metrics will be loaded here -->
            </div>

            <!-- Alerts -->
            <div id="alerts" class="mb-8">
                <!-- Alerts will be loaded here -->
            </div>

            <!-- Categories -->
            <div id="categories" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <!-- Categories will be loaded here -->
            </div>

            <!-- Recommendations -->
            <div id="recommendations" class="mb-8">
                <!-- Recommendations will be loaded here -->
            </div>
        </main>
    </div>

    <script src="js/stack-dashboard.js"></script>
</body>
</html>
```

#### **5.2 JavaScript del Dashboard**
```javascript
// dev-portal/js/stack-dashboard.js
class StackDashboard {
  constructor() {
    this.apiUrl = '/api/stack/status';
    this.refreshInterval = 300000; // 5 minutos
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
    this.startAutoRefresh();
  }

  async loadData() {
    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();
      
      this.renderMetrics(data.metrics);
      this.renderAlerts(data.alerts);
      this.renderCategories(data.categories);
      this.renderRecommendations(data.recommendations);
      this.updateLastUpdated();
    } catch (error) {
      console.error('Error loading stack data:', error);
      this.showError('Failed to load stack data');
    }
  }

  renderMetrics(metrics) {
    const container = document.getElementById('metrics');
    container.innerHTML = `
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-blue-100">
            <span class="text-2xl">📦</span>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Components</p>
            <p class="text-2xl font-semibold text-gray-900">${metrics.totalComponents}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-green-100">
            <span class="text-2xl">✅</span>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Up to Date</p>
            <p class="text-2xl font-semibold text-gray-900">${metrics.upToDate}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-yellow-100">
            <span class="text-2xl">🔄</span>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Updates Available</p>
            <p class="text-2xl font-semibold text-gray-900">${metrics.updateAvailable}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-red-100">
            <span class="text-2xl">🚨</span>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Security Critical</p>
            <p class="text-2xl font-semibold text-gray-900">${metrics.securityCritical}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-green-100">
            <span class="text-2xl">💚</span>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Health Score</p>
            <p class="text-2xl font-semibold text-gray-900">${metrics.healthScore}%</p>
          </div>
        </div>
      </div>
    `;
  }

  renderAlerts(alerts) {
    const container = document.getElementById('alerts');
    
    if (alerts.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <span class="text-2xl">🚨</span>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Security Alerts (${alerts.length})
            </h3>
            <div class="mt-2 text-sm text-red-700">
              ${alerts.map(alert => `
                <p>• ${alert.component}: ${alert.message}</p>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCategories(categories) {
    const container = document.getElementById('categories');
    container.innerHTML = Object.entries(categories).map(([key, category]) => `
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">${category.name}</h3>
          <span class="px-2 py-1 text-xs font-medium rounded-full ${
            category.status === 'stable' ? 'bg-green-100 text-green-800' :
            category.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }">
            ${category.status}
          </span>
        </div>
        <div class="space-y-2">
          ${category.components.map(component => `
            <div class="flex items-center justify-between p-2 rounded-md bg-gray-50">
              <span class="text-sm font-medium">${component.name}</span>
              <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-500">${component.currentVersion}</span>
                ${component.status === 'update-available' ? 
                  `<span class="text-xs text-blue-600">→ ${component.latestVersion}</span>` : 
                  ''
                }
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  renderRecommendations(recommendations) {
    const container = document.getElementById('recommendations');
    
    if (recommendations.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Recommended Actions</h3>
        <div class="space-y-3">
          ${recommendations.map(rec => `
            <div class="flex items-center justify-between p-3 rounded-md border ${
              rec.priority === 'critical' ? 'border-red-200 bg-red-50' :
              rec.priority === 'high' ? 'border-yellow-200 bg-yellow-50' :
              'border-blue-200 bg-blue-50'
            }">
              <div>
                <h4 class="font-medium text-gray-900">${rec.title}</h4>
                <p class="text-sm text-gray-600">${rec.description}</p>
              </div>
              <button class="px-3 py-1 text-sm font-medium rounded-md ${
                rec.priority === 'critical' ? 'bg-red-600 text-white hover:bg-red-700' :
                rec.priority === 'high' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
                'bg-blue-600 text-white hover:bg-blue-700'
              }">
                ${rec.priority === 'critical' ? 'Fix Now' :
                  rec.priority === 'high' ? 'Review' : 'Update'}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  updateLastUpdated() {
    const element = document.getElementById('last-updated');
    element.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
  }

  setupEventListeners() {
    document.getElementById('refresh-btn').addEventListener('click', () => {
      this.loadData();
    });
  }

  startAutoRefresh() {
    setInterval(() => {
      this.loadData();
    }, this.refreshInterval);
  }

  showError(message) {
    // Implementar mostrar error
    console.error(message);
  }
}

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', () => {
  new StackDashboard();
});
```

## 🚀 **Despliegue**

### **1. Configuración del Entorno**
```bash
# Instalar dependencias
npm install node-cron node-fetch

# Configurar variables de entorno
cp .env.example .env
```

### **2. Script de Inicio**
```bash
# dev-portal/start-stack-monitor.sh
#!/bin/bash
echo "🚀 Starting Stack Monitor..."
node dev-tools/automation/stack-monitor.js
```

### **3. Integración con Dev-Portal**
```html
<!-- Agregar al menú del dev-portal -->
<a href="stack-dashboard.html" class="nav-item">
  <span class="icon">📊</span>
  Stack Dashboard
</a>
```

---

**Este sistema proporciona control visual completo del stack tecnológico, permitiendo gestión proactiva y automatizada de versiones.** 