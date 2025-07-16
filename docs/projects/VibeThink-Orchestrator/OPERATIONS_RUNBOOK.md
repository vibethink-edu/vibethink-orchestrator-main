# Operations Runbook - AI Pair Orchestrator Pro

## 📋 Overview

Este runbook contiene procedimientos operacionales críticos para el mantenimiento, monitoreo y resolución de problemas de AI Pair Orchestrator Pro en producción.

**Audiencia**: DevOps, SRE, Support Engineering  
**Última Actualización**: Diciembre 2024  
**Versión**: v1.0.0

## 🚨 Contactos de Emergencia

### Escalation Matrix
| Severidad | Tiempo Respuesta | Contacto |
|-----------|------------------|----------|
| **P0 - Critical** | 15 minutos | On-call engineer + Tech Lead |
| **P1 - High** | 1 hora | On-call engineer |
| **P2 - Medium** | 4 horas | Support team |
| **P3 - Low** | 24 horas | Support team |

### Key Personnel
- **Tech Lead**: AI Pair Platform Team
- **DevOps Lead**: Infrastructure Team
- **Security Officer**: Security Team
- **Product Owner**: Business Team

## 🔍 Health Checks y Monitoring

### Application Health Endpoints
```bash
# Main application health
curl https://app.VibeThink.com/health

# Database connectivity
curl https://app.VibeThink.com/health/db

# AI services status
curl https://app.VibeThink.com/health/ai

# External integrations
curl https://app.VibeThink.com/health/integrations
```

### Key Metrics to Monitor

#### Application Metrics
- **Response Time**: < 200ms (p95)
- **Error Rate**: < 0.1%
- **Uptime**: > 99.9%
- **Active Users**: Real-time count

#### Database Metrics
- **Connection Pool**: < 80% usage
- **Query Time**: < 100ms (p95)
- **Row-Level Security**: Policies active
- **Backup Status**: Daily successful

#### AI Usage Metrics
- **API Requests**: Per company limits
- **Cost Tracking**: Monthly budget alerts
- **Rate Limiting**: Prevent abuse
- **Success Rate**: > 95%

### Dashboards

#### Production Dashboard
- Grafana: `https://monitoring.VibeThink.com/dashboard/production`
- Key panels: Response time, Error rate, Active users, Database health

#### AI Usage Dashboard  
- Grafana: `https://monitoring.VibeThink.com/dashboard/ai-usage`
- Key panels: API calls by company, Cost tracking, Rate limits, Model usage

#### Security Dashboard
- Grafana: `https://monitoring.VibeThink.com/dashboard/security`
- Key panels: Failed logins, RLS violations, API abuse, SUPPORT actions

## 🚨 Incident Response Procedures

### P0 - Critical (Service Down)

#### Immediate Actions (0-15 minutes)
1. **Acknowledge incident** in incident management system
2. **Check service status**:
   ```bash
   # Verify main application
   curl -I https://app.VibeThink.com
   
   # Check database
   kubectl get pods -n production | grep postgres
   
   # Verify Supabase
   curl https://pikywaoqlekupfynnclg.supabase.co/rest/v1/
   ```

3. **Notify stakeholders** via incident channel
4. **Start incident bridge** if multiple people needed

#### Investigation (15-30 minutes)
1. **Check recent deployments**:
   ```bash
   kubectl rollout history deployment/app -n production
   ```

2. **Review error logs**:
   ```bash
   kubectl logs -f deployment/app -n production --tail=100
   ```

3. **Check external dependencies**:
   - Supabase status page
   - OpenAI API status
   - DNS resolution

#### Resolution Actions
1. **Rollback if recent deployment**:
   ```bash
   kubectl rollout undo deployment/app -n production
   ```

2. **Scale up if resource issue**:
   ```bash
   kubectl scale deployment/app --replicas=5 -n production
   ```

3. **Database issues** - Contact Supabase support immediately

### P1 - High (Degraded Performance)

#### Actions (0-60 minutes)
1. **Identify affected components**
2. **Check resource utilization**
3. **Review slow query logs**
4. **Implement temporary fixes**
5. **Schedule permanent fix**

### Common Troubleshooting

#### Authentication Issues
```bash
# Check auth service logs
kubectl logs -f deployment/auth -n production

# Verify Supabase JWT config
curl -H "Authorization: Bearer $TOKEN" \
     https://pikywaoqlekupfynnclg.supabase.co/rest/v1/auth/user
```

#### Database Connection Issues
```bash
# Check connection pool
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# Check RLS policies
psql $DATABASE_URL -c "SELECT * FROM pg_policies WHERE tablename = 'companies';"
```

#### AI Processing Failures
```bash
# Check Edge Function logs
supabase functions logs meeting-processor --project-ref pikywaoqlekupfynnclg

# Verify OpenAI API key
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models
```

## 🔧 Maintenance Procedures

### Scheduled Maintenance Window
- **Time**: Sundays 02:00-04:00 UTC
- **Duration**: 2 hours maximum
- **Notification**: 48 hours advance notice

### Pre-Maintenance Checklist
- [ ] Database backup completed
- [ ] Rollback plan prepared
- [ ] Stakeholders notified
- [ ] Maintenance mode enabled
- [ ] Health checks documented

### Database Maintenance

#### Backup Verification
```bash
# Check latest backup
supabase db dump --project-ref pikywaoqlekupfynnclg --file backup-$(date +%Y%m%d).sql

# Verify backup integrity
pg_restore --list backup-$(date +%Y%m%d).sql | head -20
```

#### Migration Application
```bash
# Apply pending migrations
supabase db push --project-ref pikywaoqlekupfynnclg

# Verify migration status
supabase migration list --project-ref pikywaoqlekupfynnclg
```

### Application Deployment

#### Blue/Green Deployment
```bash
# Deploy to green environment
kubectl apply -f k8s/green-deployment.yaml

# Health check green environment
curl https://green.VibeThink.com/health

# Switch traffic to green
kubectl patch service app -p '{"spec":{"selector":{"version":"green"}}}'

# Monitor for 10 minutes before cleanup
kubectl delete -f k8s/blue-deployment.yaml
```

## 📊 Performance Optimization

### Database Optimization

#### Query Performance
```sql
-- Identify slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE tablename = 'companies';
```

#### Connection Pool Tuning
```bash
# Check current connections
SELECT count(*) as total_connections,
       count(*) FILTER (WHERE state = 'active') as active_connections,
       count(*) FILTER (WHERE state = 'idle') as idle_connections
FROM pg_stat_activity;
```

### Application Performance

#### Memory Usage
```bash
# Check memory usage
kubectl top pods -n production

# Identify memory leaks
kubectl exec -it pod/app-xxx -n production -- node --inspect
```

#### Bundle Size Analysis
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for unused dependencies
npx depcheck
```

## 🔒 Security Procedures

### Security Incident Response

#### Data Breach (P0)
1. **Immediate isolation** - Block affected accounts
2. **Evidence preservation** - Capture logs and database state
3. **Legal notification** - Contact legal team within 1 hour
4. **User communication** - Prepare breach notification
5. **Remediation** - Fix vulnerability and reset credentials

#### Suspicious Activity Detection
```bash
# Check failed login attempts
SELECT user_id, count(*) as failed_attempts, max(created_at) as last_attempt
FROM auth.failed_logins 
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY user_id
HAVING count(*) > 10;

# Review SUPPORT role actions
SELECT * FROM support_actions_log 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### Access Management

#### Emergency Access Procedures
1. **SUPER_ADMIN access** - Only for platform emergencies
2. **SUPPORT access** - Limited to VibeThink-platform company members
3. **Database access** - Through bastion host only
4. **Audit logging** - All privileged access logged

#### Key Rotation Schedule
- **API Keys**: Quarterly rotation
- **Database passwords**: Bi-annually
- **TLS Certificates**: Annual renewal
- **OAuth secrets**: Annual rotation

## 📈 Capacity Planning

### Scaling Triggers

#### Horizontal Scaling
- **CPU usage** > 70% for 5 minutes
- **Memory usage** > 80% for 5 minutes
- **Response time** > 500ms (p95) for 2 minutes

#### Vertical Scaling
- **Database connections** > 80% of pool
- **Storage usage** > 85% of capacity
- **AI API rate limits** approaching monthly quota

### Resource Allocation

#### Per Company Limits
```sql
-- Monitor company usage
SELECT company_id, 
       current_usage->>'users' as users,
       current_usage->>'ai_requests' as ai_requests,
       current_usage->>'storage_mb' as storage_mb
FROM company_limits 
WHERE current_usage->>'ai_requests' > '8000';
```

#### Infrastructure Scaling
```bash
# Scale application pods
kubectl scale deployment/app --replicas=10 -n production

# Scale database (contact Supabase for compute scaling)
# Increase connection pool size
kubectl patch configmap app-config -p '{"data":{"DB_POOL_SIZE":"20"}}'
```

## 🔄 Backup & Recovery

### Backup Strategy

#### Database Backups
- **Frequency**: Daily automated backups
- **Retention**: 30 days point-in-time recovery
- **Location**: Supabase managed + additional S3 backup
- **Testing**: Weekly restoration test

#### Application Backups
- **Configuration**: GitOps - all config in git
- **Static assets**: CDN with multiple zones
- **Logs**: 90 days retention in centralized logging

### Recovery Procedures

#### Database Recovery
```bash
# Point-in-time recovery (Supabase)
supabase db branch create recovery-$(date +%Y%m%d) \
  --project-ref pikywaoqlekupfynnclg \
  --restore-point "2024-12-18 10:30:00"

# Full database restore
supabase db reset --project-ref pikywaoqlekupfynnclg \
  --restore-point "2024-12-18 10:30:00"
```

#### Application Recovery
```bash
# Rollback to previous version
kubectl rollout undo deployment/app -n production

# Restore from specific backup
kubectl apply -f backups/2024-12-18-production-state.yaml
```

### Recovery Time Objectives (RTO/RPO)

| Component | RTO | RPO |
|-----------|-----|-----|
| **Application** | 15 minutes | 0 (blue/green) |
| **Database** | 30 minutes | 5 minutes |
| **AI Services** | 5 minutes | 0 (stateless) |
| **File Storage** | 60 minutes | 1 hour |

## 📚 Additional Resources

### Documentation Links
- [Security Policies](./SECURITY.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [API Documentation](./API.md)
- [Architecture Overview](./TECHNICAL_ARCHITECTURE.md)

### External Resources
- **Supabase Dashboard**: https://app.supabase.com/project/pikywaoqlekupfynnclg
- **Monitoring**: https://monitoring.VibeThink.com
- **Status Page**: https://status.VibeThink.com
- **Incident Management**: https://incidents.VibeThink.com

### Emergency Contacts
- **Supabase Support**: support@supabase.com
- **OpenAI Support**: help@openai.com
- **Infrastructure Provider**: As per contract

---

**🔄 Maintenance**: Este runbook debe revisarse mensualmente y actualizarse después de cada incidente mayor.

**📋 Training**: Todo el personal de operaciones debe estar familiarizado con estos procedimientos. 