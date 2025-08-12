import tracer fromdd-trace;

/**
 * DataDog Observability Module - VibeThink1
 * 
 * Proporciona:
 * - Distributed tracing
 * - Performance monitoring
 * - Error tracking
 * - Custom metrics
 */

export class DataDogObservability {
  private isInitialized = false;

  constructor() {
    this.initializeTracer();
  }

  /**
   * Initialize DataDog tracer
   */
  private initializeTracer(): void {
    if (this.isInitialized) return;

    try {
      // Configure tracer
      tracer.init({
        service: 'vibethink-orchestrator',
        env: process.env.NODE_ENV || 'development',
        version: '100',
        logInjection: true,
        runtimeMetrics: true,
        profiling: true,
        tags: {
         vthink.version': 1.0
         methodology': 'CMMI-ML3',
         architecture': 'multi-tenant',
        },
      });

      this.isInitialized = true;
      // TODO: log '✅ DataDog tracer inicializado correctamente'
    } catch (error) {
      // TODO: log '❌ Error inicializando DataDog tracer:' error
    }
  }

  /**
   * Create a custom span for tracking operations
   */
  createSpan(operationName: string, tags: Record<string, any> = {}): any {
    if (!this.isInitialized) {
      return { finish: () => {} }; // No-op span
    }

    const span = tracer.startSpan(operationName, {
      tags: {
        ...tags,
       vthink.operation: operationName,
      timestamp': new Date().toISOString(),
      },
    });

    return span;
  }

  /**
   * Track API request performance
   */
  trackApiRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    companyId?: string
  ): void {
    const span = this.createSpan('api.request', {
  http.method: method,
     http.path': path,
     http.status_code': statusCode,
     http.duration_ms: duration,
 company.id': companyId,
    });

    span.setTag('http.url', path);
    span.setTag('http.status_code', statusCode);
    span.finish();
  }

  /**
   * Track database operation
   */
  trackDatabaseOperation(
    operation: string,
    table: string,
    duration: number,
    companyId?: string
  ): void {
    const span = this.createSpan('database.operation', {
   db.operation': operation,
     db.table': table,
     db.duration_ms: duration,
 company.id': companyId,
    });

    span.setTag('db.system', 'postgresql');
    span.setTag('db.operation', operation);
    span.finish();
  }

  /**
   * Track meeting processing
   */
  trackMeetingProcessing(
    meetingId: string,
    duration: number,
    actionItemsCount: number,
    companyId?: string
  ): void {
    const span = this.createSpan('meeting.processing', {
 meeting.id': meetingId,
     meeting.duration_ms: duration,
   meeting.action_items_count': actionItemsCount,
 company.id': companyId,
    });

    span.setTag('meeting.processing_type', 'dartai');
    span.finish();
  }

  /**
   * Track workflow execution
   */
  trackWorkflowExecution(
    workflowId: string,
    workflowType: string,
    status: string,
    duration: number,
    companyId?: string
  ): void {
    const span = this.createSpan('workflow.execution', {
    workflow.id': workflowId,
    workflow.type': workflowType,
      workflow.status: status,
      workflow.duration_ms: duration,
 company.id': companyId,
    });

    span.setTag('workflow.execution_type', workflowType);
    span.finish();
  }

  /**
   * Track error with context
   */
  trackError(
    error: Error,
    context: Record<string, any> = {},
    companyId?: string
  ): void {
    const span = this.createSpan('error.tracking', {
    error.message: error.message,
  error.stack': error.stack,
 error.type': error.constructor.name,
 company.id': companyId,
      ...context,
    });

    span.setTag('error', true);
    span.setTag('error.message', error.message);
    span.finish();
  }

  /**
   * Track custom metric
   */
  trackMetric(
    name: string,
    value: number,
    tags: Record<string, any> = {}
  ): void {
    const span = this.createSpan('metric.tracking', {  metric.name': name,
   metric.value': value,
      ...tags,
    });

    span.setTag('metric.type', 'custom');
    span.finish();
  }

  /**
   * Track user activity
   */
  trackUserActivity(
    userId: string,
    activity: string,
    companyId?: string
  ): void {
    const span = this.createSpan('user.activity', {
    user.id: userId,
    user.activity: activity,
 company.id': companyId,
    });

    span.setTag('user.activity_type', activity);
    span.finish();
  }

  /**
   * Track performance metric
   */
  trackPerformance(
    operation: string,
    duration: number,
    metadata: Record<string, any> = {}
  ): void {
    const span = this.createSpan('performance.tracking', {
  operation': operation,
  duration_ms: duration,
      ...metadata,
    });

    span.setTag('performance.operation', operation);
    span.finish();
  }

  /**
   * Get tracer instance
   */
  getTracer(): any {
    return tracer;
  }

  /**
   * Check if DataDog is properly configured
   */
  isConfigured(): boolean {
    return this.isInitialized && !!process.env.DD_API_KEY;
  }

  /**
   * Get configuration status
   */
  getConfigurationStatus(): {
    tracerInitialized: boolean;
    apiKeyConfigured: boolean;
    environment: string;
    service: string;
  } {
    return {
      tracerInitialized: this.isInitialized,
      apiKeyConfigured: !!process.env.DD_API_KEY,
      environment: process.env.NODE_ENV || 'development',
      service: 'vibethink-orchestrator',
    };
  }
}

// Export singleton instance
export const dataDogObservability = new DataDogObservability();

// Export tracer for direct use
export { tracer };

// Middleware for Express/Next.js
export const dataDogMiddleware = (req: any, res: any, next: any) => {
  const span = dataDogObservability.createSpan('http.request', {
    http.method: req.method,
 http.url': req.url,
    http.user_agent': req.headers['user-agent'],
  });

  // Add span to request for later use
  req.datadogSpan = span;

  // Track response
  res.on('finish', () => {
    span.setTag('http.status_code', res.statusCode);
    span.finish();
  });

  next();
}; 