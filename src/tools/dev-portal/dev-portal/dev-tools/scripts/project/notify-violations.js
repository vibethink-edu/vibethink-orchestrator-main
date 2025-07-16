#!/usr/bin/env node

/**
 * Script de Notificaciones para Violaciones de Hardcoding
 * 
 * Este script notifica al arquitecto y al equipo sobre violaciones
 * críticas de hardcoding detectadas en el código.
 */

const fs = require('fs');
const path = require('path');

class ViolationNotifier {
  constructor() {
    this.notificationChannels = {
      slack: process.env.SLACK_WEBHOOK_URL,
      email: process.env.EMAIL_NOTIFICATION,
      teams: process.env.TEAMS_WEBHOOK_URL,
      discord: process.env.DISCORD_WEBHOOK_URL
    };
    
    this.architectEmail = process.env.ARCHITECT_EMAIL || 'marcelo@VibeThink.com';
    this.architectSlack = process.env.ARCHITECT_SLACK || '@marcelo';
  }

  /**
   * Notifica violaciones críticas al arquitecto
   */
  async notifyCriticalViolations(violations, context = {}) {
    console.log('🚨 Notificando violaciones críticas al arquitecto...');
    
    const message = this.buildCriticalViolationMessage(violations, context);
    
    // Enviar a todos los canales disponibles
    await Promise.all([
      this.sendToSlack(message),
      this.sendEmailToArchitect(violations, context),
      this.sendToTeams(message),
      this.sendToDiscord(message)
    ]);
    
    console.log('✅ Notificaciones enviadas');
  }

  /**
   * Construye el mensaje para violaciones críticas
   */
  buildCriticalViolationMessage(violations, context) {
    const timestamp = new Date().toISOString();
    const violationCount = violations.length;
    
    let message = {
      text: '🚨 VIOLACIONES CRÍTICAS DE HARDCODING DETECTADAS',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 Violaciones Críticas de Hardcoding',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*CRÍTICO: ${violationCount} credenciales hardcodeadas detectadas*\n\nEsto requiere atención inmediata del arquitecto.`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Fecha:*\n${timestamp}`
            },
            {
              type: 'mrkdwn',
              text: `*Violaciones:*\n${violationCount} críticas`
            }
          ]
        }
      ]
    };

    // Agregar contexto si está disponible
    if (context.branch || context.author || context.pr) {
      message.blocks.push({
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Rama:*\n${context.branch || 'N/A'}`
          },
          {
            type: 'mrkdwn',
            text: `*Autor:*\n${context.author || 'N/A'}`
          }
        ]
      });
    }

    // Agregar detalles de las violaciones
    if (violations.length > 0) {
      const violationDetails = violations.slice(0, 5).map((v, index) => ({
        type: 'mrkdwn',
        text: `*${index + 1}. ${v.file}:${v.line}*\n${v.message}`
      }));

      message.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Archivos afectados:*'
        }
      });

      message.blocks.push({
        type: 'section',
        fields: violationDetails
      });

      if (violations.length > 5) {
        message.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*... y ${violations.length - 5} más*`
          }
        });
      }
    }

    // Agregar acciones requeridas
    message.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*🔧 Acciones Requeridas:*\n• Revisar violaciones críticas\n• Guiar al desarrollador en las correcciones\n• Validar que las correcciones siguen los principios de AI Pair\n• Aprobar el PR una vez corregido'
      }
    });

    // Agregar footer
    message.blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: 'Notificación automática del Sistema de Prevención de Hardcoding - AI Pair Orchestrator Pro'
        }
      ]
    });

    return message;
  }

  /**
   * Envía notificación a Slack
   */
  async sendToSlack(message) {
    if (!this.notificationChannels.slack) {
      console.log('⚠️  Slack webhook no configurado');
      return;
    }

    try {
      const response = await fetch(this.notificationChannels.slack, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      if (response.ok) {
        console.log('✅ Notificación enviada a Slack');
      } else {
        console.error('❌ Error al enviar a Slack:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error al enviar a Slack:', error.message);
    }
  }

  /**
   * Envía email al arquitecto
   */
  async sendEmailToArchitect(violations, context) {
    if (!this.architectEmail) {
      console.log('⚠️  Email del arquitecto no configurado');
      return;
    }

    try {
      const emailContent = this.buildEmailContent(violations, context);
      
      // Aquí usarías tu servicio de email preferido
      // Por ejemplo, usando nodemailer o un servicio como SendGrid
      console.log('📧 Email al arquitecto:', this.architectEmail);
      console.log('📧 Contenido:', emailContent.subject);
      
      // Implementar envío real de email según tu configuración
      // await this.sendEmail(emailContent);
      
      console.log('✅ Email preparado para el arquitecto');
    } catch (error) {
      console.error('❌ Error al preparar email:', error.message);
    }
  }

  /**
   * Construye el contenido del email
   */
  buildEmailContent(violations, context) {
    const timestamp = new Date().toISOString();
    const violationCount = violations.length;
    
    const subject = `🚨 Violaciones Críticas de Hardcoding - ${violationCount} detectadas`;
    
    let body = `
    <h2>🚨 Violaciones Críticas de Hardcoding Detectadas</h2>
    
    <p><strong>Fecha:</strong> ${timestamp}</p>
    <p><strong>Violaciones críticas:</strong> ${violationCount}</p>
    `;

    if (context.branch || context.author || context.pr) {
      body += `
      <h3>Contexto:</h3>
      <ul>
        <li><strong>Rama:</strong> ${context.branch || 'N/A'}</li>
        <li><strong>Autor:</strong> ${context.author || 'N/A'}</li>
        <li><strong>PR:</strong> ${context.pr || 'N/A'}</li>
      </ul>
      `;
    }

    if (violations.length > 0) {
      body += `
      <h3>Archivos Afectados:</h3>
      <ul>
      `;
      
      violations.forEach((v, index) => {
        body += `
        <li><strong>${index + 1}. ${v.file}:${v.line}</strong><br>
        Tipo: ${v.type}<br>
        Mensaje: ${v.message}<br>
        Código: <code>${v.code}</code><br>
        Sugerencia: ${v.suggestion}</li>
        `;
      });
      
      body += `</ul>`;
    }

    body += `
    <h3>🔧 Acciones Requeridas:</h3>
    <ul>
      <li>Revisar violaciones críticas</li>
      <li>Guiar al desarrollador en las correcciones</li>
      <li>Validar que las correcciones siguen los principios de AI Pair</li>
      <li>Aprobar el PR una vez corregido</li>
    </ul>
    
    <hr>
    <p><em>Notificación automática del Sistema de Prevención de Hardcoding - AI Pair Orchestrator Pro</em></p>
    `;

    return {
      to: this.architectEmail,
      subject: subject,
      body: body
    };
  }

  /**
   * Envía notificación a Microsoft Teams
   */
  async sendToTeams(message) {
    if (!this.notificationChannels.teams) {
      console.log('⚠️  Teams webhook no configurado');
      return;
    }

    try {
      const teamsMessage = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "FF0000",
        "summary": "Violaciones Críticas de Hardcoding",
        "sections": [
          {
            "activityTitle": "🚨 Violaciones Críticas de Hardcoding",
            "activitySubtitle": "Requiere atención inmediata del arquitecto",
            "facts": [
              {
                "name": "Fecha",
                "value": new Date().toISOString()
              },
              {
                "name": "Violaciones",
                "value": `${message.blocks[2].fields[1].text.split(':')[1].trim()}`
              }
            ]
          }
        ]
      };

      const response = await fetch(this.notificationChannels.teams, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamsMessage)
      });

      if (response.ok) {
        console.log('✅ Notificación enviada a Teams');
      } else {
        console.error('❌ Error al enviar a Teams:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error al enviar a Teams:', error.message);
    }
  }

  /**
   * Envía notificación a Discord
   */
  async sendToDiscord(message) {
    if (!this.notificationChannels.discord) {
      console.log('⚠️  Discord webhook no configurado');
      return;
    }

    try {
      const discordMessage = {
        embeds: [
          {
            title: "🚨 Violaciones Críticas de Hardcoding",
            description: "Requiere atención inmediata del arquitecto",
            color: 0xFF0000,
            fields: [
              {
                name: "Fecha",
                value: new Date().toISOString(),
                inline: true
              },
              {
                name: "Violaciones",
                value: `${message.blocks[2].fields[1].text.split(':')[1].trim()}`,
                inline: true
              }
            ],
            footer: {
              text: "Sistema de Prevención de Hardcoding - AI Pair Orchestrator Pro"
            }
          }
        ]
      };

      const response = await fetch(this.notificationChannels.discord, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordMessage)
      });

      if (response.ok) {
        console.log('✅ Notificación enviada a Discord');
      } else {
        console.error('❌ Error al enviar a Discord:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error al enviar a Discord:', error.message);
    }
  }

  /**
   * Notifica violaciones altas (no críticas)
   */
  async notifyHighViolations(violations, context = {}) {
    console.log('⚠️  Notificando violaciones altas...');
    
    const message = this.buildHighViolationMessage(violations, context);
    
    // Solo enviar a Slack para violaciones altas
    await this.sendToSlack(message);
    
    console.log('✅ Notificación de violaciones altas enviada');
  }

  /**
   * Construye el mensaje para violaciones altas
   */
  buildHighViolationMessage(violations, context) {
    const timestamp = new Date().toISOString();
    const violationCount = violations.length;
    
    return {
      text: '⚠️ Violaciones Altas de Hardcoding Detectadas',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '⚠️ Violaciones Altas de Hardcoding',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*ALERTA: ${violationCount} violaciones altas detectadas*\n\nConsidera corregir estas violaciones en esta iteración.`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Fecha:*\n${timestamp}`
            },
            {
              type: 'mrkdwn',
              text: `*Violaciones:*\n${violationCount} altas`
            }
          ]
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: 'Notificación automática del Sistema de Prevención de Hardcoding'
            }
          ]
        }
      ]
    };
  }

  /**
   * Genera un reporte de resumen
   */
  generateSummaryReport(violations) {
    const summary = {
      critical: violations.critical.length,
      high: violations.high.length,
      medium: violations.medium.length,
      low: violations.low.length,
      total: violations.critical.length + violations.high.length + 
             violations.medium.length + violations.low.length
    };

    return {
      summary,
      recommendations: this.generateRecommendations(summary),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Genera recomendaciones basadas en el resumen
   */
  generateRecommendations(summary) {
    const recommendations = [];

    if (summary.critical > 0) {
      recommendations.push({
        priority: 'CRÍTICA',
        message: 'BLOQUEA COMMIT - Corrige credenciales hardcodeadas inmediatamente',
        action: 'Usa variables de entorno para todas las credenciales'
      });
    }

    if (summary.high > 0) {
      recommendations.push({
        priority: 'ALTA',
        message: 'ALERTA INMEDIATA - Corrige URLs hardcodeadas',
        action: 'Usa variables de entorno para configuraciones'
      });
    }

    if (summary.medium > 0) {
      recommendations.push({
        priority: 'MEDIA',
        message: 'ADVERTENCIA - Considera parametrizar entidades específicas',
        action: 'Usa nombres paramétricos y configuración dinámica'
      });
    }

    return recommendations;
  }
}

/**
 * Función principal del script
 */
async function main() {
  const args = process.argv.slice(2);
  const reportPath = args[0] || 'hardcoding-report.json';
  
  if (!fs.existsSync(reportPath)) {
    console.error('❌ No se encontró el archivo de reporte:', reportPath);
    process.exit(1);
  }

  try {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const notifier = new ViolationNotifier();
    
    // Notificar violaciones críticas
    if (report.violations.critical.length > 0) {
      await notifier.notifyCriticalViolations(report.violations.critical, {
        branch: process.env.GITHUB_REF_NAME,
        author: process.env.GITHUB_ACTOR,
        pr: process.env.GITHUB_PR_NUMBER
      });
    }
    
    // Notificar violaciones altas
    if (report.violations.high.length > 0) {
      await notifier.notifyHighViolations(report.violations.high, {
        branch: process.env.GITHUB_REF_NAME,
        author: process.env.GITHUB_ACTOR,
        pr: process.env.GITHUB_PR_NUMBER
      });
    }
    
    // Generar reporte de resumen
    const summaryReport = notifier.generateSummaryReport(report.violations);
    console.log('📊 Reporte de resumen:', summaryReport);
    
  } catch (error) {
    console.error('❌ Error al procesar notificaciones:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ViolationNotifier; 