/**
 * 📊 Porte Tracker - Database Interface
 * 
 * Manages porte version tracking data and evaluation records
 * 
 * Features:
 * - Version registry management
 * - Evaluation tracking
 * - Implementation history
 * - Pipeline execution tracking
 * 
 * Version: 1.0
 * Author: AI Pair Orchestrator Pro
 * Framework: VTK Methodology 1.0
 */

const { Pool } = require('pg');

class PorteTracker {
  constructor(config) {
    this.config = config;
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.name,
      user: config.user,
      password: config.password,
      ssl: config.ssl === 'true'
    });
    
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Test connection
      await this.pool.query('SELECT NOW()');
      
      // Create tables if they don't exist
      await this.createTables();
      
      this.initialized = true;
      console.log('✅ PorteTracker initialized successfully');
      
    } catch (error) {
      throw new Error(`PorteTracker initialization failed: ${error.message}`);
    }
  }

  async createTables() {
    const queries = [
      // Porte versions table
      `CREATE TABLE IF NOT EXISTS porte_versions (
        id SERIAL PRIMARY KEY,
        component_name VARCHAR(100) NOT NULL,
        upstream_version VARCHAR(50) NOT NULL,
        ported_version VARCHAR(50) NOT NULL,
        upstream_repo VARCHAR(200) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        port_date TIMESTAMP NOT NULL DEFAULT NOW(),
        port_author VARCHAR(100) NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,

      // Version evaluations table
      `CREATE TABLE IF NOT EXISTS version_evaluations (
        id SERIAL PRIMARY KEY,
        porte_version_id INTEGER REFERENCES porte_versions(id),
        upstream_version VARCHAR(50) NOT NULL,
        current_version VARCHAR(50) NOT NULL,
        evaluation_date TIMESTAMP NOT NULL DEFAULT NOW(),
        risk_score DECIMAL(4,2),
        decision VARCHAR(20) NOT NULL,
        decision_reason TEXT NOT NULL,
        confidence_score DECIMAL(4,2),
        change_analysis JSONB,
        risk_assessment JSONB,
        implemented BOOLEAN DEFAULT FALSE,
        implementation_date TIMESTAMP,
        rollback_date TIMESTAMP,
        status VARCHAR(20) DEFAULT 'pending',
        error_message TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,

      // Change analysis table
      `CREATE TABLE IF NOT EXISTS change_analysis (
        id SERIAL PRIMARY KEY,
        evaluation_id INTEGER REFERENCES version_evaluations(id),
        change_type VARCHAR(50) NOT NULL,
        files_affected INTEGER NOT NULL DEFAULT 0,
        lines_added INTEGER NOT NULL DEFAULT 0,
        lines_deleted INTEGER NOT NULL DEFAULT 0,
        complexity_delta INTEGER DEFAULT 0,
        test_coverage_delta DECIMAL(5,2) DEFAULT 0,
        dependencies_added TEXT[],
        dependencies_removed TEXT[],
        breaking_changes TEXT[],
        security_impact TEXT,
        analysis_data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )`,

      // Pipeline executions table
      `CREATE TABLE IF NOT EXISTS pipeline_executions (
        id VARCHAR(100) PRIMARY KEY,
        evaluation_id INTEGER REFERENCES version_evaluations(id),
        component_name VARCHAR(100) NOT NULL,
        from_version VARCHAR(50) NOT NULL,
        to_version VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'running',
        started_at TIMESTAMP NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMP,
        duration_ms INTEGER,
        stages JSONB,
        error_message TEXT,
        dry_run BOOLEAN DEFAULT FALSE,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,

      // Implementation tasks table
      `CREATE TABLE IF NOT EXISTS implementation_tasks (
        id SERIAL PRIMARY KEY,
        evaluation_id INTEGER REFERENCES version_evaluations(id),
        pipeline_execution_id VARCHAR(100) REFERENCES pipeline_executions(id),
        task_type VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'queued',
        priority VARCHAR(20) DEFAULT 'normal',
        scheduled_at TIMESTAMP,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        error_message TEXT,
        result_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,

      // Create indexes for better performance
      `CREATE INDEX IF NOT EXISTS idx_porte_versions_component ON porte_versions(component_name)`,
      `CREATE INDEX IF NOT EXISTS idx_porte_versions_status ON porte_versions(status)`,
      `CREATE INDEX IF NOT EXISTS idx_evaluations_porte_version ON version_evaluations(porte_version_id)`,
      `CREATE INDEX IF NOT EXISTS idx_evaluations_decision ON version_evaluations(decision)`,
      `CREATE INDEX IF NOT EXISTS idx_evaluations_status ON version_evaluations(status)`,
      `CREATE INDEX IF NOT EXISTS idx_pipeline_executions_status ON pipeline_executions(status)`,
      `CREATE INDEX IF NOT EXISTS idx_implementation_tasks_status ON implementation_tasks(status)`
    ];

    for (const query of queries) {
      await this.pool.query(query);
    }
  }

  // Porte Version Management
  async registerNewPorte(componentName, version, upstreamRepo, author, metadata = {}) {
    const query = `
      INSERT INTO porte_versions (component_name, upstream_version, ported_version, upstream_repo, port_author, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [
      componentName, version, version, upstreamRepo, author, JSON.stringify(metadata)
    ]);
    
    return result.rows[0];
  }

  async getCurrentVersion(componentName) {
    const query = `
      SELECT upstream_version, ported_version, status
      FROM porte_versions
      WHERE component_name = $1 AND status = 'ACTIVE'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const result = await this.pool.query(query, [componentName]);
    return result.rows[0]?.ported_version || null;
  }

  async getPorteByComponent(componentName) {
    const query = `
      SELECT *
      FROM porte_versions
      WHERE component_name = $1 AND status = 'ACTIVE'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const result = await this.pool.query(query, [componentName]);
    return result.rows[0] || null;
  }

  async updatePorteVersion(componentName, newVersion) {
    const query = `
      UPDATE porte_versions
      SET ported_version = $2, updated_at = NOW()
      WHERE component_name = $1 AND status = 'ACTIVE'
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [componentName, newVersion]);
    return result.rows[0];
  }

  // Evaluation Management
  async createEvaluation(componentName, upstreamVersion, metadata = {}) {
    // Get current porte version
    const porte = await this.getPorteByComponent(componentName);
    if (!porte) {
      throw new Error(`No active porte found for component: ${componentName}`);
    }

    const query = `
      INSERT INTO version_evaluations (
        porte_version_id, upstream_version, current_version, decision, decision_reason, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [
      porte.id,
      upstreamVersion,
      porte.ported_version,
      'PENDING',
      'Evaluation in progress',
      JSON.stringify(metadata)
    ]);
    
    return result.rows[0];
  }

  async getEvaluation(evaluationId) {
    const query = `
      SELECT ve.*, pv.component_name, pv.upstream_repo
      FROM version_evaluations ve
      JOIN porte_versions pv ON ve.porte_version_id = pv.id
      WHERE ve.id = $1
    `;
    
    const result = await this.pool.query(query, [evaluationId]);
    return result.rows[0] || null;
  }

  async updateEvaluation(evaluationId, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      fields.push(`${key} = $${paramIndex}`);
      if (typeof value === 'object' && value !== null) {
        values.push(JSON.stringify(value));
      } else {
        values.push(value);
      }
      paramIndex++;
    });

    fields.push(`updated_at = NOW()`);

    const query = `
      UPDATE version_evaluations
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    values.push(evaluationId);
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getEvaluationHistory(componentName, limit = 50) {
    const query = `
      SELECT ve.*, pv.component_name
      FROM version_evaluations ve
      JOIN porte_versions pv ON ve.porte_version_id = pv.id
      WHERE pv.component_name = $1
      ORDER BY ve.created_at DESC
      LIMIT $2
    `;
    
    const result = await this.pool.query(query, [componentName, limit]);
    return result.rows;
  }

  async markEvaluationAsImplemented(evaluationId) {
    const query = `
      UPDATE version_evaluations
      SET implemented = true, implementation_date = NOW(), status = 'implemented', updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [evaluationId]);
    return result.rows[0];
  }

  // Pipeline Execution Management
  async createPipelineExecution(execution) {
    const query = `
      INSERT INTO pipeline_executions (
        id, evaluation_id, component_name, from_version, to_version, 
        status, started_at, stages, dry_run, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [
      execution.id,
      execution.evaluation_id,
      execution.component_name,
      execution.from_version,
      execution.to_version,
      execution.status,
      execution.started_at,
      JSON.stringify(execution.stages || {}),
      execution.dry_run || false,
      JSON.stringify(execution.metadata || {})
    ]);
    
    return result.rows[0];
  }

  async updatePipelineExecution(pipelineId, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      fields.push(`${key} = $${paramIndex}`);
      if (key === 'stages' && typeof value === 'object') {
        values.push(JSON.stringify(value));
      } else if (typeof value === 'object' && value !== null) {
        values.push(JSON.stringify(value));
      } else {
        values.push(value);
      }
      paramIndex++;
    });

    fields.push(`updated_at = NOW()`);

    const query = `
      UPDATE pipeline_executions
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    values.push(pipelineId);
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async markPipelineAsFailed(pipelineId, errorMessage) {
    const query = `
      UPDATE pipeline_executions
      SET status = 'failed', error_message = $2, completed_at = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [pipelineId, errorMessage]);
    return result.rows[0];
  }

  // Implementation Task Management
  async createImplementationTask(evaluationId, taskData) {
    const query = `
      INSERT INTO implementation_tasks (
        evaluation_id, task_type, status, priority, scheduled_at, result_data
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [
      evaluationId,
      taskData.task_type || 'implementation',
      taskData.status || 'queued',
      taskData.priority || 'normal',
      taskData.scheduled_at || new Date(),
      JSON.stringify(taskData.result_data || {})
    ]);
    
    return result.rows[0];
  }

  // Analytics and Reporting
  async getComponentStats(componentName) {
    const query = `
      SELECT 
        COUNT(*) as total_evaluations,
        COUNT(*) FILTER (WHERE decision = 'AUTO_APPROVE') as auto_approved,
        COUNT(*) FILTER (WHERE decision = 'MANUAL_REVIEW') as manual_reviews,
        COUNT(*) FILTER (WHERE decision = 'REJECT') as rejected,
        COUNT(*) FILTER (WHERE implemented = true) as implemented,
        AVG(risk_score) as avg_risk_score,
        MAX(evaluation_date) as last_evaluation
      FROM version_evaluations ve
      JOIN porte_versions pv ON ve.porte_version_id = pv.id
      WHERE pv.component_name = $1
      AND ve.created_at > (NOW() - INTERVAL '90 days')
    `;
    
    const result = await this.pool.query(query, [componentName]);
    return result.rows[0];
  }

  async getSystemStats() {
    const query = `
      SELECT 
        COUNT(DISTINCT pv.component_name) as total_portes,
        COUNT(ve.*) as total_evaluations,
        COUNT(pe.*) as total_pipeline_executions,
        COUNT(*) FILTER (WHERE ve.decision = 'AUTO_APPROVE') as auto_approved,
        COUNT(*) FILTER (WHERE pe.status = 'completed') as successful_deployments,
        AVG(ve.risk_score) as avg_risk_score
      FROM porte_versions pv
      LEFT JOIN version_evaluations ve ON pv.id = ve.porte_version_id
      LEFT JOIN pipeline_executions pe ON ve.id = pe.evaluation_id
      WHERE ve.created_at > (NOW() - INTERVAL '30 days')
      OR ve.created_at IS NULL
    `;
    
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  // Cleanup and Maintenance
  async cleanupOldRecords(retentionDays = 90) {
    const queries = [
      `DELETE FROM change_analysis WHERE created_at < (NOW() - INTERVAL '${retentionDays} days')`,
      `DELETE FROM implementation_tasks WHERE created_at < (NOW() - INTERVAL '${retentionDays} days')`,
      `DELETE FROM pipeline_executions WHERE created_at < (NOW() - INTERVAL '${retentionDays} days')`,
      `DELETE FROM version_evaluations WHERE created_at < (NOW() - INTERVAL '${retentionDays} days')`
    ];

    let totalDeleted = 0;
    for (const query of queries) {
      const result = await this.pool.query(query);
      totalDeleted += result.rowCount;
    }

    return { deleted_records: totalDeleted };
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = PorteTracker;
