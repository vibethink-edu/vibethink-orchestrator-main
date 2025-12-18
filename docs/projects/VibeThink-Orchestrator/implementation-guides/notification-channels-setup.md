# Guía de Implementación: Configuración de Canales de Notificación

## 📅 Fecha: 05/07/2025
## 🎯 Objetivo: Configurar canales de notificación (Slack, Email, SMS)

---

## 🔧 Configuración de Slack

### **Paso 1: Crear App en Slack**
1. Ve a [api.slack.com/apps](https://api.slack.com/apps)
2. Click en "Create New App" → "From scratch"
3. Nombre: `VThink-Alerts`
4. Workspace: Selecciona tu workspace

### **Paso 2: Configurar Webhook**
1. En tu app, ve a "Incoming Webhooks"
2. Activa "Incoming Webhooks"
3. Click en "Add New Webhook to Workspace"
4. Selecciona el canal: `#dev-alerts`
5. Copia la URL del webhook

### **Paso 3: Configurar Variables de Entorno**
```bash
# .env
SLACK_WEBHOOK_URL=your-slack-webhook-url-here
SLACK_CHANNEL=#dev-alerts
SLACK_USERNAME=VThink-Alerts
SLACK_ICON_EMOJI=:warning:
```

### **Paso 4: Probar Integración**
```typescript
// scripts/test-slack-integration.js
import { alertService } from '@/shared/services/alertService';

const testSlackAlert = async () => {
  await alertService.sendAlert({
    type: AlertType.SECURITY_SCAN,
    priority: AlertPriority.HIGH,
    title: 'Test Alert - Slack',
    message: 'Esta es una alerta de prueba para Slack',
    channels: [AlertChannel.SLACK],
    metadata: {
      test: true,
      timestamp: new Date().toISOString()
    }
  });
};

testSlackAlert();
```

---

## 📧 Configuración de Email

### **Paso 1: Configurar SMTP (Gmail)**
1. Activa 2FA en tu cuenta de Gmail
2. Genera una "App Password"
3. Configura las variables de entorno

### **Paso 2: Variables de Entorno**
```bash
# .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
ALERT_EMAIL_RECIPIENTS=admin@company.com,dev@company.com,security@company.com
ALERT_EMAIL_FROM=VThink-Alerts <alerts@company.com>
```

### **Paso 3: Crear Template de Email**
```html
<!-- templates/alert-email.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{alert.title}}</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: {{priorityColor}}; color: white; padding: 20px; border-radius: 5px;">
            <h1>{{alert.title}}</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin-top: 20px;">
            <p><strong>Mensaje:</strong></p>
            <p>{{alert.message}}</p>
            
            <div style="margin-top: 20px;">
                <p><strong>Tipo:</strong> {{alert.type}}</p>
                <p><strong>Prioridad:</strong> {{alert.priority}}</p>
                <p><strong>Fecha:</strong> {{formattedDate}}</p>
            </div>
            
            {{#if alert.metadata}}
            <div style="margin-top: 20px; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                <h3>Metadatos:</h3>
                <pre>{{JSON.stringify alert.metadata null 2}}</pre>
            </div>
            {{/if}}
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #666;">
            <p>Enviado por VThink 1.0 Alert System</p>
        </div>
    </div>
</body>
</html>
```

### **Paso 4: Probar Integración**
```typescript
// scripts/test-email-integration.js
import { alertService } from '@/shared/services/alertService';

const testEmailAlert = async () => {
  await alertService.sendAlert({
    type: AlertType.VULNERABILITY_DETECTED,
    priority: AlertPriority.CRITICAL,
    title: 'Vulnerabilidad Crítica Detectada',
    message: 'Se ha detectado una vulnerabilidad de seguridad crítica que requiere atención inmediata.',
    channels: [AlertChannel.EMAIL],
    metadata: {
      cve: 'CVE-2024-XXXX',
      severity: 'critical',
      affectedComponents: ['auth-service', 'user-api']
    }
  });
};

testEmailAlert();
```

---

## 📱 Configuración de SMS

### **Paso 1: Elegir Proveedor**
**Opción A: Twilio**
```bash
# .env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
ALERT_SMS_NUMBERS=+1234567890,+0987654321
```

**Opción B: AWS SNS**
```bash
# .env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789012:alerts
```

### **Paso 2: Implementar Handler**
```typescript
// src/shared/services/channelHandlers.ts
export const smsHandler = async (alert: Alert): Promise<void> => {
  // Solo enviar SMS para alertas críticas
  if (alert.priority !== AlertPriority.CRITICAL) {
    return;
  }

  const phoneNumbers = process.env.ALERT_SMS_NUMBERS?.split(',') || [];
  
  for (const phone of phoneNumbers) {
    const message = `🚨 ${alert.title}: ${alert.message}`;
    
    // Implementar según el proveedor elegido
    await sendSMS(phone, message);
  }
};

// Función para enviar SMS (implementar según proveedor)
async function sendSMS(to: string, message: string) {
  // Implementación específica del proveedor
}
```

### **Paso 3: Probar Integración**
```typescript
// scripts/test-sms-integration.js
import { alertService } from '@/shared/services/alertService';

const testSMSAlert = async () => {
  await alertService.sendAlert({
    type: AlertType.SECURITY_SCAN,
    priority: AlertPriority.CRITICAL,
    title: 'Alerta Crítica',
    message: 'Sistema comprometido - Acción inmediata requerida',
    channels: [AlertChannel.SMS],
    metadata: {
      emergency: true,
      requiresImmediateAction: true
    }
  });
};

testSMSAlert();
```

---

## 🔧 Configuración de Discord

### **Paso 1: Crear Webhook**
1. Ve a tu servidor de Discord
2. Configuración del canal → Integraciones → Webhooks
3. Crear webhook → Copiar URL

### **Paso 2: Variables de Entorno**
```bash
# .env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/123456789/abcdefghijklmnop
DISCORD_CHANNEL_ID=123456789012345678
```

### **Paso 3: Probar Integración**
```typescript
// scripts/test-discord-integration.js
import { alertService } from '@/shared/services/alertService';

const testDiscordAlert = async () => {
  await alertService.sendAlert({
    type: AlertType.DEPLOYMENT_STATUS,
    priority: AlertPriority.HIGH,
    title: 'Deployment Fallido',
    message: 'El deployment a producción ha fallado. Revisar logs inmediatamente.',
    channels: [AlertChannel.DISCORD],
    metadata: {
      deploymentId: 'deploy-123',
      environment: 'production',
      buildNumber: '1.2.3'
    }
  });
};

testDiscordAlert();
```

---

## ⚙️ Configuración de Microsoft Teams

### **Paso 1: Crear Webhook**
1. Ve al canal donde quieres recibir alertas
2. Click en "..." → "Conectores"
3. Busca "Incoming Webhook" → Configurar
4. Nombre: `VThink-Alerts`
5. Copia la URL del webhook

### **Paso 2: Variables de Entorno**
```bash
# .env
TEAMS_WEBHOOK_URL=https://company.webhook.office.com/webhookb2/12345678-1234-1234-1234-123456789012@12345678-1234-1234-1234-123456789012/IncomingWebhook/abcdefghijklmnop/12345678-1234-1234-1234-123456789012
```

### **Paso 3: Probar Integración**
```typescript
// scripts/test-teams-integration.js
import { alertService } from '@/shared/services/alertService';

const testTeamsAlert = async () => {
  await alertService.sendAlert({
    type: AlertType.SYSTEM_HEALTH,
    priority: AlertPriority.MEDIUM,
    title: 'Alerta de Sistema',
    message: 'El sistema está experimentando latencia alta. Monitoreando.',
    channels: [AlertChannel.TEAMS],
    metadata: {
      cpuUsage: '85%',
      memoryUsage: '78%',
      responseTime: '2.5s'
    }
  });
};

testTeamsAlert();
```

---

## 🧪 Scripts de Prueba

### **Script de Prueba Completa**
```bash
#!/bin/bash
# scripts/test-all-channels.sh

echo "🧪 Probando todos los canales de notificación..."

echo "📧 Probando Email..."
npm run test:email-integration

echo "💬 Probando Slack..."
npm run test:slack-integration

echo "📱 Probando SMS..."
npm run test:sms-integration

echo "🎮 Probando Discord..."
npm run test:discord-integration

echo "💼 Probando Teams..."
npm run test:teams-integration

echo "✅ Todas las pruebas completadas"
```

### **Agregar Scripts al package.json**
```json
{
  "scripts": {
    "test:email-integration": "node scripts/test-email-integration.js",
    "test:slack-integration": "node scripts/test-slack-integration.js",
    "test:sms-integration": "node scripts/test-sms-integration.js",
    "test:discord-integration": "node scripts/test-discord-integration.js",
    "test:teams-integration": "node scripts/test-teams-integration.js",
    "test:all-channels": "bash scripts/test-all-channels.sh"
  }
}
```

---

## 📋 Checklist de Implementación

### **✅ Slack**
- [ ] Crear app en Slack
- [ ] Configurar webhook
- [ ] Agregar variables de entorno
- [ ] Probar integración
- [ ] Configurar filtros de canal

### **✅ Email**
- [ ] Configurar SMTP
- [ ] Crear template de email
- [ ] Agregar variables de entorno
- [ ] Probar integración
- [ ] Configurar destinatarios

### **✅ SMS**
- [ ] Elegir proveedor (Twilio/AWS SNS)
- [ ] Configurar credenciales
- [ ] Implementar handler
- [ ] Probar integración
- [ ] Configurar números de emergencia

### **✅ Discord**
- [ ] Crear webhook
- [ ] Agregar variables de entorno
- [ ] Probar integración
- [ ] Configurar canal

### **✅ Teams**
- [ ] Crear webhook
- [ ] Agregar variables de entorno
- [ ] Probar integración
- [ ] Configurar canal

---

## 🚨 Configuración de Alertas Automáticas

### **Alertas por Prioridad**
```typescript
const alertConfig = {
  [AlertPriority.CRITICAL]: {
    channels: [AlertChannel.SMS, AlertChannel.SLACK, AlertChannel.EMAIL],
    immediate: true,
    sound: true
  },
  [AlertPriority.HIGH]: {
    channels: [AlertChannel.SLACK, AlertChannel.EMAIL],
    immediate: true,
    sound: false
  },
  [AlertPriority.MEDIUM]: {
    channels: [AlertChannel.SLACK, AlertChannel.DISCORD],
    immediate: false,
    sound: false
  },
  [AlertPriority.LOW]: {
    channels: [AlertChannel.DASHBOARD],
    immediate: false,
    sound: false
  }
};
```

---

**Documentado por**: Marcelo Escallón  
**Fecha**: 05/07/2025  
**Versión**: VThink 1.0  
**Estado**: Listo para implementación 