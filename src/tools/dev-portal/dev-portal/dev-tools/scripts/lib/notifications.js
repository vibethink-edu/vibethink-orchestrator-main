/**
 * 🔔 Notification Service
 * 
 * Handles all notification and alerting for the porte tracking system
 * 
 * Features:
 * - Slack integration
 * - Teams integration  
 * - Email notifications
 * - Template-based messaging
 * - Escalation chains
 * 
 * Version: 1.0
 * Author: AI Pair Orchestrator Pro
 * Framework: VTK Methodology 1.0
 */

const axios = require('axios');
const nodemailer = require('nodemailer');

class NotificationService {
  constructor(config) {
    this.config = config;
    this.emailTransporter = null;
    
    this.initializeEmailTransporter();
  }

  initializeEmailTransporter() {
    if (!this.config.email) return;
    
    this.emailTransporter = nodemailer.createTransporter({
      host: this.config.email.smtp_host,
      port: this.config.email.smtp_port,
      secure: false,
      auth: {
        user: this.config.email.smtp_user,
        pass: this.config.email.smtp_password
      }
    });
  }

  async sendVersionAlert(alertData) {
    const {
      type,
      porte,
      current_version,
      new_version,
      risk_score,
      decision_reason,
      evaluation_id,
      release_url
    } = alertData;

    const message = this.formatVersionAlert(alertData);

    // Send notifications based on urgency
    const urgency = this.getAlertUrgency(type, risk_score);
    
    const notifications = [];
    
    if (urgency === 'HIGH' || type === 'AUTO_APPROVE') {
      notifications.push(this.sendSlackNotification(message));
      notifications.push(this.sendTeamsNotification(message));
    }
    
    if (urgency === 'HIGH') {
      notifications.push(this.sendEmailNotification(message));
    }

    await Promise.allSettled(notifications);
  }

  async sendPipelineNotification(pipelineData) {
    const { type, pipeline_id, evaluation_id, component, error } = pipelineData;
    
    const message = this.formatPipelineNotification(pipelineData);
    
    const notifications = [
      this.sendSlackNotification(message)
    ];
    
    if (type === 'pipeline_failed' || type === 'rollback_triggered') {
      notifications.push(this.sendTeamsNotification(message));
      notifications.push(this.sendEmailNotification(message));
    }

    await Promise.allSettled(notifications);
  }

  async sendDailySummary(summaryData) {
    const message = this.formatDailySummary(summaryData);
    
    await Promise.allSettled([
      this.sendSlackNotification(message),
      this.sendEmailNotification(message)
    ]);
  }

  async sendWeeklyReport(reportData) {
    const message = this.formatWeeklyReport(reportData);
    
    await Promise.allSettled([
      this.sendSlackNotification(message),
      this.sendEmailNotification(message)
    ]);
  }

  // Slack Integration
  async sendSlackNotification(message) {
    if (!this.config.slack?.webhook_url) {
      console.log('Slack webhook not configured, skipping notification');
      return;
    }

    try {
      const payload = {
        channel: this.config.slack.channel,
        username: this.config.slack.username,
        icon_emoji: this.config.slack.icon_emoji,
        text: message.title,
        attachments: [{
          color: this.getSlackColor(message.urgency),
          fields: message.fields,
          footer: "VibeThink Porte Tracking System",
          ts: Math.floor(Date.now() / 1000)
        }]
      };

      await axios.post(this.config.slack.webhook_url, payload);
      console.log('✅ Slack notification sent successfully');
      
    } catch (error) {
      console.error('❌ Failed to send Slack notification:', error.message);
    }
  }

  // Teams Integration
  async sendTeamsNotification(message) {
    if (!this.config.teams?.webhook_url) {
      console.log('Teams webhook not configured, skipping notification');
      return;
    }

    try {
      const payload = {
        "@type": "MessageCard",
        "@context": "https://schema.org/extensions",
        "summary": message.title,
        "themeColor": this.getTeamsColor(message.urgency),
        "sections": [{
          "activityTitle": message.title,
          "activitySubtitle": message.subtitle,
          "facts": message.fields.map(field => ({
            "name": field.title,
            "value": field.value
          })),
          "markdown": true
        }]
      };

      if (message.actions && message.actions.length > 0) {
        payload.potentialActions = message.actions.map(action => ({
          "@type": "OpenUri",
          "name": action.name,
          "targets": [{
            "os": "default",
            "uri": action.url
          }]
        }));
      }

      await axios.post(this.config.teams.webhook_url, payload);
      console.log('✅ Teams notification sent successfully');
      
    } catch (error) {
      console.error('❌ Failed to send Teams notification:', error.message);
    }
  }

  // Email Integration
  async sendEmailNotification(message) {
    if (!this.emailTransporter || !this.config.email?.recipients) {
      console.log('Email not configured, skipping notification');
      return;
    }

    try {
      const htmlContent = this.formatEmailHtml(message);
      
      const mailOptions = {
        from: this.config.email.from_email,
        to: this.config.email.recipients.join(', '),
        subject: `[VibeThink Porte] ${message.title}`,
        html: htmlContent,
        text: this.formatEmailText(message)
      };

      await this.emailTransporter.sendMail(mailOptions);
      console.log('✅ Email notification sent successfully');
      
    } catch (error) {
      console.error('❌ Failed to send email notification:', error.message);
    }
  }

  // Message Formatters
  formatVersionAlert(alertData) {
    const {
      type,
      porte,
      current_version,
      new_version,
      risk_score,
      decision_reason,
      evaluation_id,
      release_url
    } = alertData;

    const urgency = this.getAlertUrgency(type, risk_score);
    const icon = this.getAlertIcon(type);
    
    const message = {
      urgency,
      title: `${icon} ${type.replace('_', ' ').toUpperCase()}: ${porte} v${new_version}`,
      subtitle: `Version update: ${current_version} → ${new_version}`,
      fields: [
        {
          title: "Component",
          value: porte,
          short: true
        },
        {
          title: "Version Change",
          value: `${current_version} → ${new_version}`,
          short: true
        },
        {
          title: "Risk Score",
          value: `${risk_score}/10`,
          short: true
        },
        {
          title: "Decision",
          value: type.replace('_', ' '),
          short: true
        },
        {
          title: "Reason",
          value: decision_reason,
          short: false
        }
      ],
      actions: []
    };

    if (release_url) {
      message.actions.push({
        name: "View Release",
        url: release_url
      });
    }

    if (evaluation_id) {
      message.actions.push({
        name: "View Evaluation",
        url: `${this.config.dashboard_url || 'https://VibeThink.com'}/porte-dashboard/evaluations/${evaluation_id}`
      });
    }

    return message;
  }

  formatPipelineNotification(pipelineData) {
    const { type, pipeline_id, evaluation_id, component, version_change, error } = pipelineData;
    
    const urgency = type.includes('failed') || type.includes('rollback') ? 'HIGH' : 'NORMAL';
    const icon = this.getPipelineIcon(type);
    
    const message = {
      urgency,
      title: `${icon} ${type.replace('_', ' ').toUpperCase()}: ${component}`,
      subtitle: version_change ? `Version: ${version_change}` : '',
      fields: [
        {
          title: "Component",
          value: component,
          short: true
        },
        {
          title: "Pipeline ID",
          value: pipeline_id,
          short: true
        }
      ],
      actions: [{
        name: "View Pipeline",
        url: `${this.config.dashboard_url || 'https://VibeThink.com'}/porte-dashboard/pipelines/${pipeline_id}`
      }]
    };

    if (version_change) {
      message.fields.push({
        title: "Version Change",
        value: version_change,
        short: true
      });
    }

    if (error) {
      message.fields.push({
        title: "Error",
        value: error,
        short: false
      });
    }

    return message;
  }

  formatDailySummary(summaryData) {
    const {
      date,
      total_portes,
      evaluations_completed,
      auto_approved,
      manual_reviews,
      implementations_completed,
      failures
    } = summaryData;

    return {
      urgency: 'NORMAL',
      title: `📊 Daily Porte Summary - ${date}`,
      subtitle: `System activity overview`,
      fields: [
        {
          title: "Total Portes Monitored",
          value: total_portes.toString(),
          short: true
        },
        {
          title: "Evaluations Completed",
          value: evaluations_completed.toString(),
          short: true
        },
        {
          title: "Auto-Approved",
          value: auto_approved.toString(),
          short: true
        },
        {
          title: "Manual Reviews",
          value: manual_reviews.toString(),
          short: true
        },
        {
          title: "Implementations",
          value: implementations_completed.toString(),
          short: true
        },
        {
          title: "Failures",
          value: failures.toString(),
          short: true
        }
      ],
      actions: [{
        name: "View Dashboard",
        url: this.config.dashboard_url || 'https://VibeThink.com/porte-dashboard'
      }]
    };
  }

  formatWeeklyReport(reportData) {
    // Similar to daily summary but with weekly metrics
    return {
      urgency: 'NORMAL',
      title: `📈 Weekly Porte Report`,
      subtitle: `Week ending ${reportData.week_ending}`,
      fields: [
        // Weekly stats fields
      ],
      actions: [{
        name: "View Full Report",
        url: `${this.config.dashboard_url || 'https://VibeThink.com'}/porte-dashboard/reports/weekly`
      }]
    };
  }

  // Utility Methods
  getAlertUrgency(type, riskScore) {
    if (type === 'SECURITY_PATCH' || riskScore >= 8) return 'HIGH';
    if (type === 'MANUAL_REVIEW' || riskScore >= 6) return 'MEDIUM';
    return 'NORMAL';
  }

  getAlertIcon(type) {
    const icons = {
      'AUTO_APPROVE': '✅',
      'CONDITIONAL_APPROVE': '⚠️',
      'MANUAL_REVIEW': '👀',
      'REJECT': '❌',
      'SECURITY_PATCH': '🚨'
    };
    return icons[type] || '📦';
  }

  getPipelineIcon(type) {
    const icons = {
      'pipeline_started': '🚀',
      'pipeline_completed': '✅',
      'pipeline_failed': '❌',
      'rollback_triggered': '🔄'
    };
    return icons[type] || '⚙️';
  }

  getSlackColor(urgency) {
    const colors = {
      'HIGH': 'danger',
      'MEDIUM': 'warning', 
      'NORMAL': 'good'
    };
    return colors[urgency] || 'good';
  }

  getTeamsColor(urgency) {
    const colors = {
      'HIGH': 'FF0000',
      'MEDIUM': 'FFA500',
      'NORMAL': '00FF00'
    };
    return colors[urgency] || '00FF00';
  }

  formatEmailHtml(message) {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
            .title { color: #333; margin: 0 0 10px 0; }
            .subtitle { color: #666; margin: 0; }
            .field { margin: 10px 0; }
            .field-title { font-weight: bold; color: #333; }
            .field-value { color: #555; }
            .actions { margin-top: 20px; }
            .action-link { 
              display: inline-block; 
              background-color: #007bff; 
              color: white; 
              padding: 10px 15px; 
              text-decoration: none; 
              border-radius: 3px; 
              margin-right: 10px; 
            }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 class="title">${message.title}</h2>
            ${message.subtitle ? `<p class="subtitle">${message.subtitle}</p>` : ''}
          </div>
          
          <div class="content">
            ${message.fields.map(field => `
              <div class="field">
                <span class="field-title">${field.title}:</span>
                <span class="field-value">${field.value}</span>
              </div>
            `).join('')}
          </div>
          
          ${message.actions && message.actions.length > 0 ? `
            <div class="actions">
              ${message.actions.map(action => `
                <a href="${action.url}" class="action-link">${action.name}</a>
              `).join('')}
            </div>
          ` : ''}
          
          <div class="footer">
            <p>This is an automated notification from the VibeThink Porte Tracking System.</p>
          </div>
        </body>
      </html>
    `;
  }

  formatEmailText(message) {
    let text = `${message.title}\n\n`;
    
    if (message.subtitle) {
      text += `${message.subtitle}\n\n`;
    }
    
    message.fields.forEach(field => {
      text += `${field.title}: ${field.value}\n`;
    });
    
    if (message.actions && message.actions.length > 0) {
      text += '\nActions:\n';
      message.actions.forEach(action => {
        text += `- ${action.name}: ${action.url}\n`;
      });
    }
    
    text += '\n---\nThis is an automated notification from the VibeThink Porte Tracking System.';
    
    return text;
  }
}

module.exports = NotificationService;
