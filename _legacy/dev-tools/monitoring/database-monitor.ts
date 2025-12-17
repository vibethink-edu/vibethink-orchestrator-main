#!/usr/bin/env tsx

/**
 * Database Monitor Script
 * 
 * Generates reports and alerts for the VibeThink platform
 * 
 * @author VibeThink Platform - DevOps Team
 * @version 1.0.0
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = 'https://pikywaoqlekupfynnclg.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_SERVICE_KEY) {
  // TODO: log '❌ SUPABASE_SERVICE_KEY environment variable is required'
  // TODO: log '💡 Get it from: https://supabase.com/dashboard/project/pikywaoqlekupfynnclg/settings/api'
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface MonitoringResult {
  timestamp: string;
  status: 'healthy' | 'warning' | 'critical';
  metrics: {
    users: number;
    companies: number;
    aiUsageLogs: number;
    meetings: number;
    configurations: number;
  };
  performance: {
    activeConnections: number;
    slowQueries: any[];
    tablesSizes: any[];
  };
  security: {
    rlsPolicies: any[];
    authConfig: any;
  };
  alerts: string[];
}

/**
 * Main monitoring function
 */
async function runMonitoring(): Promise<MonitoringResult> {
  // TODO: log '🔍 Starting database monitoring...'
  
  const result: MonitoringResult = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    metrics: {
      users: 0,
      companies: 0,
      aiUsageLogs: 0,
      meetings: 0,
      configurations: 0
    },
    performance: {
      activeConnections: 0,
      slowQueries: [],
      tablesSizes: []
    },
    security: {
      rlsPolicies: [],
      authConfig: {}
    },
    alerts: []
  };

  try {
    // 1. Basic Metrics
    // TODO: log '📊 Collecting basic metrics...'
    await collectBasicMetrics(result);

    // 2. Performance Metrics
    // TODO: log '⚡ Analyzing performance...'
    await collectPerformanceMetrics(result);

    // 3. Security Check
    // TODO: log '🔒 Checking security policies...'
    await collectSecurityMetrics(result);

    // 4. Health Assessment
    // TODO: log '🏥 Assessing overall health...'
    assessHealth(result);

    // TODO: log '✅ Monitoring completed successfully'
    
  } catch (error) {
    // TODO: log '❌ Monitoring failed:' error
    result.status = 'critical';
    result.alerts.push(`Monitoring failed: ${error}`);
  }

  return result;
}

/**
 * Collect basic database metrics
 */
async function collectBasicMetrics(result: MonitoringResult) {
  try {
    // Count users
    const { count: userCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });
    result.metrics.users = userCount || 0;

    // Count companies
    const { count: companyCount } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });
    result.metrics.companies = companyCount || 0;

    // Count AI usage logs
    const { count: aiLogsCount } = await supabase
      .from('ai_usage_logs')
      .select('*', { count: 'exact', head: true });
    result.metrics.aiUsageLogs = aiLogsCount || 0;

    // Count meetings
    const { count: meetingsCount } = await supabase
      .from('meetings')
      .select('*', { count: 'exact', head: true });
    result.metrics.meetings = meetingsCount || 0;

    // Count configurations
    const { count: configCount } = await supabase
      .from('platform_configurations')
      .select('*', { count: 'exact', head: true });
    result.metrics.configurations = configCount || 0;

  } catch (error) {
    result.alerts.push(`Failed to collect basic metrics: ${error}`);
  }
}

/**
 * Collect performance metrics
 */
async function collectPerformanceMetrics(result: MonitoringResult) {
  try {
    // Basic performance metrics without RPC functions
    result.performance.activeConnections = 0; // Would need RPC function
    result.performance.tablesSizes = []; // Would need RPC function
    result.performance.slowQueries = []; // Would need pg_stat_statements

  } catch (error) {
    result.alerts.push(`Failed to collect performance metrics: ${error}`);
  }
}

/**
 * Collect security metrics
 */
async function collectSecurityMetrics(result: MonitoringResult) {
  try {
    // Basic security check
    result.security.rlsPolicies = [];
    result.security.authConfig = {};

  } catch (error) {
    result.alerts.push(`Failed to collect security metrics: ${error}`);
  }
}

/**
 * Assess overall health and generate alerts
 */
function assessHealth(result: MonitoringResult) {
  const alerts: string[] = [];

  // Check user growth
  if (result.metrics.users === 0) {
    alerts.push('⚠️ No users found in database');
  }

  // Check company setup
  if (result.metrics.companies === 0) {
    alerts.push('⚠️ No companies found in database');
  }

  // Check AI usage
  if (result.metrics.aiUsageLogs > 10000) {
    alerts.push('📈 High AI usage detected - consider upgrading plan');
  }

  // Check performance
  if (result.performance.activeConnections > 50) {
    alerts.push('🔗 High number of active connections detected');
  }

  // Determine overall status
  if (alerts.length === 0) {
    result.status = 'healthy';
  } else if (alerts.some(alert => alert.includes('⚠️'))) {
    result.status = 'warning';
  } else {
    result.status = 'critical';
  }

  result.alerts.push(...alerts);
}

/**
 * Generate monitoring report
 */
function generateReport(result: MonitoringResult) {
  // TODO: log '\n' + '='.repeat(60)
  // TODO: log '📊 DATABASE MONITORING REPORT'
  // TODO: log '='.repeat(60)
  
  // Status
  const statusIcon = {
    'healthy': '✅',
    'warning': '⚠️',
    'critical': '❌'
  }[result.status];
  
  // TODO: log `\n${statusIcon} Overall Status: ${result.status.toUpperCase()}`
  // TODO: log `🕐 Timestamp: ${result.timestamp}`

  // Metrics
  // TODO: log '\n📊 METRICS:'
  // TODO: log `👥 Users: ${result.metrics.users}`
  // TODO: log `🏢 Companies: ${result.metrics.companies}`
  // TODO: log `🤖 AI Usage Logs: ${result.metrics.aiUsageLogs}`
  // TODO: log `📅 Meetings: ${result.metrics.meetings}`
  // TODO: log `⚙️ Configurations: ${result.metrics.configurations}`

  // Performance
  // TODO: log '\n⚡ PERFORMANCE:'
  // TODO: log `🔗 Active Connections: ${result.performance.activeConnections}`
  // TODO: log `📊 Table Sizes: ${result.performance.tablesSizes.length} tables analyzed`

  // Security
  // TODO: log '\n🔒 SECURITY:'
  // TODO: log `🛡️ RLS Policies: ${result.security.rlsPolicies.length} policies checked`

  // Alerts
  if (result.alerts.length > 0) {
    // TODO: log '\n🚨 ALERTS:'
    result.alerts.forEach(alert => {
      // TODO: log `  ${alert}`
    });
  } else {
    // TODO: log '\n✅ No alerts - system is healthy!'
  }

  // TODO: log '\n' + '='.repeat(60)
}

/**
 * Save report to file
 */
async function saveReport(result: MonitoringResult) {
  const fs = await import('fs');
  const path = await import('path');
  
  const reportsDir = 'monitoring-reports';
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  const filename = `monitoring-${new Date().toISOString().split('T')[0]}.json`;
  const filepath = path.join(reportsDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
  // TODO: log `📄 Report saved to: ${filepath}`
}

/**
 * Create RPC functions for monitoring
 */
async function createMonitoringFunctions() {
  // TODO: log '🔧 Creating monitoring RPC functions...'

  const functions = [
    {
      name: 'get_active_connections',
      sql: `
        CREATE OR REPLACE FUNCTION get_active_connections()
        RETURNS TABLE(pid int, state text, query text, query_start timestamp)
        LANGUAGE sql
        SECURITY DEFINER
        AS $$
          SELECT pid, state, query, query_start
          FROM pg_stat_activity
          WHERE state IS NOT NULL AND state != 'idle';
        $$;
      `
    },
    {
      name: 'get_table_sizes',
      sql: `
        CREATE OR REPLACE FUNCTION get_table_sizes()
        RETURNS TABLE(table_name text, size_bytes bigint, size_pretty text)
        LANGUAGE sql
        SECURITY DEFINER
        AS $$
          SELECT 
            t.table_name::text,
            pg_total_relation_size(t.table_name::regclass) as size_bytes,
            pg_size_pretty(pg_total_relation_size(t.table_name::regclass)) as size_pretty
          FROM information_schema.tables t
          WHERE t.table_schema = 'public'
          ORDER BY pg_total_relation_size(t.table_name::regclass) DESC;
        $$;
      `
    },
    {
      name: 'check_rls_policies',
      sql: `
        CREATE OR REPLACE FUNCTION check_rls_policies()
        RETURNS TABLE(table_name text, policy_name text, policy_cmd text)
        LANGUAGE sql
        SECURITY DEFINER
        AS $$
          SELECT 
            tablename::text,
            policyname::text,
            cmd::text
          FROM pg_policies
          WHERE schemaname = 'public';
        $$;
      `
    }
  ];

  for (const func of functions) {
    try {
      const { error } = await supabase.rpc('exec', { sql: func.sql });
      if (error) {
        // TODO: log `⚠️ Function ${func.name} may already exist or failed to create`
      } else {
        // TODO: log `✅ Created function: ${func.name}`
      }
    } catch (error) {
      // TODO: log `⚠️ Could not create function ${func.name}: ${error}`
    }
  }
}

/**
 * Main execution
 */
async function main() {
  // TODO: log '🚀 VibeThink Database Monitor v1.0.0'
  // TODO: log '=' .repeat(50)

  try {
    // Create monitoring functions first
    await createMonitoringFunctions();

    // Run monitoring
    const result = await runMonitoring();

    // Generate and display report
    generateReport(result);

    // Save report
    await saveReport(result);

    // Exit with appropriate code
    process.exit(result.status === 'critical' ? 1 : 0);

  } catch (error) {
    // TODO: log '💥 Fatal error:' error
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { runMonitoring, generateReport }; 