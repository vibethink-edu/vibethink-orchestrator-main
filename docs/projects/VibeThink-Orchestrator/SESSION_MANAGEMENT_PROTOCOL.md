# Protocolo de Gestión de Sesiones - AI Pair Orchestrator Pro

## Resumen Ejecutivo

Este documento establece el protocolo completo de gestión de sesiones para la plataforma AI Pair Orchestrator Pro, incluyendo la captura de contexto inicial, trazabilidad y seguridad de sesiones.

## 1. Captura de Contexto Inicial

### 1.1 Protocolo de Inicio de Sesión

Al iniciar cualquier interacción con la plataforma, el sistema debe capturar automáticamente:

#### Información Temporal
```typescript
interface TemporalContext {
  timestamp: Date;
  timezone: string;
  sessionStartTime: Date;
  lastActivityTime: Date;
  sessionDuration: number; // en milisegundos
}
```

#### Información de Usuario
```typescript
interface UserContext {
  userId: string;
  userRole: UserRole;
  companyId: string;
  permissions: Permission[];
  profile: UserProfile;
  preferences: UserPreferences;
}
```

#### Información de Sesión
```typescript
interface SessionContext {
  sessionId: string;
  clientIP: string;
  userAgent: string;
  deviceInfo: DeviceInfo;
  location: GeoLocation;
  securityLevel: 'standard' | 'elevated' | 'critical';
}
```

### 1.2 Flujo de Captura de Contexto

```typescript
// src/hooks/useSessionContext.ts
export const useSessionContext = () => {
  const captureInitialContext = async (): Promise<SessionContext> => {
    const context: SessionContext = {
      // Capturar fecha y hora
      temporal: {
        timestamp: new Date(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        sessionStartTime: new Date(),
        lastActivityTime: new Date(),
        sessionDuration: 0
      },
      
      // Capturar información de usuario
      user: await getCurrentUserContext(),
      
      // Capturar información de sesión
      session: {
        sessionId: generateSessionId(),
        clientIP: await getClientIP(),
        userAgent: navigator.userAgent,
        deviceInfo: getDeviceInfo(),
        location: await getGeoLocation(),
        securityLevel: determineSecurityLevel()
      }
    };
    
    // Registrar contexto en base de datos
    await logSessionContext(context);
    
    return context;
  };
  
  return { captureInitialContext };
};
```

## 2. Gestión de Sesiones

### 2.1 Configuración de Sesión

```typescript
// src/config/session.ts
export const SESSION_CONFIG = {
  // Configuración de JWT
  jwtExpiry: 3600, // 1 hora
  refreshTokenRotation: true,
  refreshTokenReuseInterval: 10,
  
  // Configuración de sesión
  maxSessionsPerUser: 5,
  sessionTimeout: 30 * 60 * 1000, // 30 minutos
  inactivityTimeout: 15 * 60 * 1000, // 15 minutos
  
  // Configuración de seguridad
  requireReauthAfter: 24 * 60 * 60 * 1000, // 24 horas
  maxFailedAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutos
  
  // Configuración de auditoría
  logAllActions: true,
  logSensitiveActions: true,
  retentionPeriod: 90 * 24 * 60 * 60 * 1000 // 90 días
};
```

### 2.2 Inicialización de Sesión

```typescript
// src/hooks/useAuth.tsx
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionContext, setSessionContext] = useState<SessionContext | null>(null);
  
  const initializeSession = async (user: User) => {
    try {
      console.log('🔄 Inicializando sesión para:', user.email);
      
      // 1. Capturar contexto inicial
      const context = await captureInitialContext();
      
      // 2. Validar permisos y configuración
      const userProfile = await fetchUserProfile(user.id);
      const companyConfig = await fetchCompanyConfiguration(userProfile.company_id);
      
      // 3. Establecer contexto de sesión
      const sessionContext: SessionContext = {
        ...context,
        user: {
          ...context.user,
          profile: userProfile,
          companyConfig: companyConfig
        }
      };
      
      setSessionContext(sessionContext);
      
      // 4. Registrar inicio de sesión
      await logSessionStart(sessionContext);
      
      // 5. Configurar listeners de actividad
      setupActivityListeners(sessionContext.sessionId);
      
      console.log('✅ Sesión inicializada correctamente');
      
    } catch (error) {
      console.error('❌ Error inicializando sesión:', error);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{
      sessionContext,
      initializeSession,
      // ... otros métodos
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2.3 Monitoreo de Actividad

```typescript
// src/utils/activity-monitor.ts
export class ActivityMonitor {
  private sessionId: string;
  private lastActivity: Date;
  private activityTimeout: NodeJS.Timeout | null = null;
  
  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.lastActivity = new Date();
    this.setupActivityListeners();
  }
  
  private setupActivityListeners() {
    // Eventos de actividad del usuario
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => {
      document.addEventListener(event, () => this.updateActivity(), { passive: true });
    });
    
    // Eventos de visibilidad
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.updateActivity();
      }
    });
  }
  
  private updateActivity() {
    this.lastActivity = new Date();
    
    // Actualizar en base de datos
    this.updateSessionActivity();
    
    // Reiniciar timeout de inactividad
    this.resetInactivityTimeout();
  }
  
  private resetInactivityTimeout() {
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }
    
    this.activityTimeout = setTimeout(() => {
      this.handleInactivity();
    }, SESSION_CONFIG.inactivityTimeout);
  }
  
  private async handleInactivity() {
    console.log('⚠️ Usuario inactivo, cerrando sesión');
    
    // Registrar inactividad
    await logSessionInactivity(this.sessionId);
    
    // Cerrar sesión
    await signOut();
  }
}
```

## 3. Trazabilidad de Sesiones

### 3.1 Logs de Sesión

```typescript
// src/utils/session-logger.ts
export const SessionLogger = {
  logSessionStart: async (context: SessionContext) => {
    await supabase.from('session_logs').insert({
      session_id: context.session.sessionId,
      user_id: context.user.userId,
      company_id: context.user.companyId,
      action: 'SESSION_START',
      timestamp: context.temporal.timestamp,
      ip_address: context.session.clientIP,
      user_agent: context.session.userAgent,
      device_info: context.session.deviceInfo,
      location: context.session.location,
      metadata: {
        timezone: context.temporal.timezone,
        security_level: context.session.securityLevel,
        user_role: context.user.userRole
      }
    });
  },
  
  logSessionEnd: async (sessionId: string, reason: string) => {
    await supabase.from('session_logs').insert({
      session_id: sessionId,
      action: 'SESSION_END',
      timestamp: new Date(),
      metadata: { reason }
    });
  },
  
  logActivity: async (sessionId: string, activity: string, details?: any) => {
    await supabase.from('session_logs').insert({
      session_id: sessionId,
      action: activity,
      timestamp: new Date(),
      metadata: details
    });
  }
};
```

### 3.2 Auditoría de Acciones

```typescript
// src/utils/action-auditor.ts
export const ActionAuditor = {
  logSensitiveAction: async (
    sessionId: string,
    userId: string,
    action: string,
    resource: string,
    details: any
  ) => {
    await supabase.from('audit_logs').insert({
      session_id: sessionId,
      user_id: userId,
      action: action,
      resource_type: resource,
      timestamp: new Date(),
      metadata: {
        ...details,
        sensitivity_level: 'high'
      }
    });
  },
  
  logDataAccess: async (
    sessionId: string,
    userId: string,
    tableName: string,
    recordId: string,
    operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
  ) => {
    await supabase.from('audit_logs').insert({
      session_id: sessionId,
      user_id: userId,
      action: operation,
      resource_type: tableName,
      resource_id: recordId,
      timestamp: new Date()
    });
  }
};
```

## 4. Seguridad de Sesiones

### 4.1 Validación de Sesión

```typescript
// src/middleware/session-validator.ts
export const validateSession = async (req: Request): Promise<SessionValidationResult> => {
  try {
    // 1. Extraer token de sesión
    const token = extractTokenFromRequest(req);
    if (!token) {
      return { valid: false, reason: 'NO_TOKEN' };
    }
    
    // 2. Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return { valid: false, reason: 'INVALID_TOKEN' };
    }
    
    // 3. Verificar sesión en base de datos
    const session = await getSessionFromDatabase(decoded.sessionId);
    if (!session) {
      return { valid: false, reason: 'SESSION_NOT_FOUND' };
    }
    
    // 4. Verificar si la sesión está activa
    if (session.status !== 'active') {
      return { valid: false, reason: 'SESSION_INACTIVE' };
    }
    
    // 5. Verificar timeout de inactividad
    const lastActivity = new Date(session.last_activity);
    const now = new Date();
    const inactiveTime = now.getTime() - lastActivity.getTime();
    
    if (inactiveTime > SESSION_CONFIG.inactivityTimeout) {
      await deactivateSession(session.id, 'INACTIVITY_TIMEOUT');
      return { valid: false, reason: 'SESSION_EXPIRED' };
    }
    
    // 6. Verificar límite de sesiones
    const activeSessions = await getActiveSessionsForUser(decoded.userId);
    if (activeSessions.length > SESSION_CONFIG.maxSessionsPerUser) {
      // Cerrar sesión más antigua
      const oldestSession = activeSessions.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )[0];
      
      await deactivateSession(oldestSession.id, 'SESSION_LIMIT_EXCEEDED');
    }
    
    return { valid: true, session };
    
  } catch (error) {
    console.error('Error validating session:', error);
    return { valid: false, reason: 'VALIDATION_ERROR' };
  }
};
```

### 4.2 Protección contra Ataques

```typescript
// src/utils/security-protection.ts
export const SecurityProtection = {
  // Protección contra fuerza bruta
  trackFailedLogin: async (email: string, ip: string) => {
    const key = `failed_login:${email}:${ip}`;
    const attempts = await redis.incr(key);
    
    if (attempts === 1) {
      await redis.expire(key, 3600); // 1 hora
    }
    
    if (attempts >= SESSION_CONFIG.maxFailedAttempts) {
      await lockAccount(email, 'TOO_MANY_FAILED_ATTEMPTS');
      throw new Error('Account locked due to too many failed attempts');
    }
  },
  
  // Detección de actividad sospechosa
  detectSuspiciousActivity: async (sessionId: string, action: string) => {
    const recentActions = await getRecentActions(sessionId, 300000); // 5 minutos
    
    // Detectar patrones sospechosos
    const suspiciousPatterns = [
      { pattern: /DELETE.*users/, threshold: 3 },
      { pattern: /UPDATE.*billing/, threshold: 5 },
      { pattern: /EXPORT.*data/, threshold: 2 }
    ];
    
    for (const { pattern, threshold } of suspiciousPatterns) {
      const matchingActions = recentActions.filter(a => pattern.test(a.action));
      if (matchingActions.length >= threshold) {
        await flagSuspiciousActivity(sessionId, action, matchingActions);
        return true;
      }
    }
    
    return false;
  },
  
  // Validación de ubicación
  validateLocation: async (sessionId: string, currentIP: string) => {
    const session = await getSession(sessionId);
    const originalIP = session.ip_address;
    
    // Si la IP cambió significativamente, verificar
    if (currentIP !== originalIP) {
      const isSuspicious = await checkIPSuspicious(originalIP, currentIP);
      if (isSuspicious) {
        await flagLocationChange(sessionId, originalIP, currentIP);
        return false;
      }
    }
    
    return true;
  }
};
```

## 5. Gestión de Sesiones Múltiples

### 5.1 Control de Sesiones Simultáneas

```typescript
// src/utils/session-manager.ts
export const SessionManager = {
  // Obtener sesiones activas de un usuario
  getActiveSessions: async (userId: string): Promise<Session[]> => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  // Cerrar sesiones excedentes
  closeExcessSessions: async (userId: string) => {
    const activeSessions = await SessionManager.getActiveSessions(userId);
    
    if (activeSessions.length > SESSION_CONFIG.maxSessionsPerUser) {
      // Mantener solo las sesiones más recientes
      const sessionsToClose = activeSessions.slice(SESSION_CONFIG.maxSessionsPerUser);
      
      for (const session of sessionsToClose) {
        await SessionManager.closeSession(session.id, 'SESSION_LIMIT_EXCEEDED');
      }
    }
  },
  
  // Cerrar sesión específica
  closeSession: async (sessionId: string, reason: string) => {
    await supabase
      .from('sessions')
      .update({ 
        status: 'closed',
        closed_at: new Date().toISOString(),
        close_reason: reason
      })
      .eq('id', sessionId);
    
    await SessionLogger.logSessionEnd(sessionId, reason);
  },
  
  // Cerrar todas las sesiones de un usuario
  closeAllUserSessions: async (userId: string, reason: string) => {
    const activeSessions = await SessionManager.getActiveSessions(userId);
    
    for (const session of activeSessions) {
      await SessionManager.closeSession(session.id, reason);
    }
  }
};
```

### 5.2 Dashboard de Sesiones

```typescript
// src/components/SessionDashboard.tsx
export const SessionDashboard: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  
  useEffect(() => {
    if (user) {
      loadUserSessions();
    }
  }, [user]);
  
  const loadUserSessions = async () => {
    const userSessions = await SessionManager.getActiveSessions(user.id);
    setSessions(userSessions);
  };
  
  const closeSession = async (sessionId: string) => {
    await SessionManager.closeSession(sessionId, 'USER_REQUESTED');
    await loadUserSessions();
  };
  
  return (
    <div className="session-dashboard">
      <h2>Sesiones Activas</h2>
      <div className="sessions-list">
        {sessions.map(session => (
          <SessionCard
            key={session.id}
            session={session}
            onClose={() => closeSession(session.id)}
            isCurrentSession={session.id === getCurrentSessionId()}
          />
        ))}
      </div>
    </div>
  );
};
```

## 6. Recuperación y Recuperación de Sesiones

### 6.1 Recuperación de Sesión

```typescript
// src/utils/session-recovery.ts
export const SessionRecovery = {
  // Recuperar sesión interrumpida
  recoverSession: async (sessionId: string): Promise<boolean> => {
    try {
      const session = await getSession(sessionId);
      
      if (!session || session.status !== 'active') {
        return false;
      }
      
      // Verificar si la sesión no ha expirado
      const sessionAge = Date.now() - new Date(session.created_at).getTime();
      if (sessionAge > SESSION_CONFIG.sessionTimeout) {
        return false;
      }
      
      // Restaurar contexto de sesión
      await restoreSessionContext(session);
      
      return true;
      
    } catch (error) {
      console.error('Error recovering session:', error);
      return false;
    }
  },
  
  // Migrar sesión a nuevo dispositivo
  migrateSession: async (oldSessionId: string, newDeviceInfo: DeviceInfo) => {
    const oldSession = await getSession(oldSessionId);
    
    if (!oldSession) {
      throw new Error('Session not found');
    }
    
    // Crear nueva sesión con mismo contexto
    const newSession = await createSession({
      userId: oldSession.user_id,
      deviceInfo: newDeviceInfo,
      context: oldSession.context
    });
    
    // Cerrar sesión anterior
    await SessionManager.closeSession(oldSessionId, 'MIGRATED_TO_NEW_DEVICE');
    
    return newSession;
  }
};
```

### 6.2 Backup de Contexto de Sesión

```typescript
// src/utils/session-backup.ts
export const SessionBackup = {
  // Crear backup del contexto de sesión
  createBackup: async (sessionId: string) => {
    const session = await getSession(sessionId);
    const context = session.context;
    
    const backup = {
      sessionId,
      timestamp: new Date(),
      context: {
        user: context.user,
        preferences: context.preferences,
        recentActions: context.recentActions
      }
    };
    
    await supabase.from('session_backups').insert(backup);
    return backup;
  },
  
  // Restaurar contexto desde backup
  restoreFromBackup: async (sessionId: string) => {
    const { data: backups } = await supabase
      .from('session_backups')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: false })
      .limit(1);
    
    if (backups && backups.length > 0) {
      return backups[0].context;
    }
    
    return null;
  }
};
```

## 7. Testing del Protocolo de Sesiones

### 7.1 Tests Unitarios

```typescript
// tests/unit/session-protocol.test.ts
describe('Session Protocol', () => {
  test('should capture initial context correctly', async () => {
    const context = await captureInitialContext();
    
    expect(context.temporal.timestamp).toBeInstanceOf(Date);
    expect(context.temporal.timezone).toBeDefined();
    expect(context.user.userId).toBeDefined();
    expect(context.session.sessionId).toBeDefined();
  });
  
  test('should validate session correctly', async () => {
    const mockRequest = createMockRequest();
    const result = await validateSession(mockRequest);
    
    expect(result.valid).toBe(true);
    expect(result.session).toBeDefined();
  });
  
  test('should handle session timeout', async () => {
    const session = await createTestSession();
    
    // Simular inactividad
    await simulateInactivity(session.id, SESSION_CONFIG.inactivityTimeout + 1000);
    
    const validation = await validateSession(createMockRequest(session.id));
    expect(validation.valid).toBe(false);
    expect(validation.reason).toBe('SESSION_EXPIRED');
  });
});
```

### 7.2 Tests de Integración

```typescript
// tests/integration/session-management.test.ts
describe('Session Management Integration', () => {
  test('should handle multiple sessions per user', async () => {
    const user = await createTestUser();
    
    // Crear múltiples sesiones
    const sessions = [];
    for (let i = 0; i < SESSION_CONFIG.maxSessionsPerUser + 2; i++) {
      sessions.push(await createSession(user.id));
    }
    
    // Verificar que solo se mantienen las sesiones permitidas
    const activeSessions = await SessionManager.getActiveSessions(user.id);
    expect(activeSessions.length).toBeLessThanOrEqual(SESSION_CONFIG.maxSessionsPerUser);
  });
  
  test('should log all session activities', async () => {
    const session = await createTestSession();
    
    // Realizar acciones
    await performAction(session.id, 'VIEW_DASHBOARD');
    await performAction(session.id, 'EXPORT_DATA');
    
    // Verificar logs
    const logs = await getSessionLogs(session.id);
    expect(logs).toHaveLength(2);
    expect(logs[0].action).toBe('VIEW_DASHBOARD');
    expect(logs[1].action).toBe('EXPORT_DATA');
  });
});
```

## 8. Monitoreo y Métricas

### 8.1 Métricas de Sesión

```typescript
// src/utils/session-metrics.ts
export const SessionMetrics = {
  // Métricas de uso de sesiones
  trackSessionMetrics: async () => {
    const metrics = {
      activeSessions: await getActiveSessionsCount(),
      averageSessionDuration: await getAverageSessionDuration(),
      sessionsPerUser: await getAverageSessionsPerUser(),
      failedLogins: await getFailedLoginsCount(),
      suspiciousActivities: await getSuspiciousActivitiesCount()
    };
    
    await storeMetrics('session_metrics', metrics);
    return metrics;
  },
  
  // Alertas de sesión
  checkSessionAlerts: async () => {
    const alerts = [];
    
    // Verificar sesiones anómalas
    const anomalousSessions = await detectAnomalousSessions();
    if (anomalousSessions.length > 0) {
      alerts.push({
        type: 'ANOMALOUS_SESSIONS',
        severity: 'medium',
        details: anomalousSessions
      });
    }
    
    // Verificar intentos de acceso fallidos
    const failedAttempts = await getRecentFailedAttempts();
    if (failedAttempts.length > 10) {
      alerts.push({
        type: 'MULTIPLE_FAILED_ATTEMPTS',
        severity: 'high',
        details: failedAttempts
      });
    }
    
    return alerts;
  }
};
```

### 8.2 Dashboard de Monitoreo

```typescript
// src/components/SessionMonitoringDashboard.tsx
export const SessionMonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SessionMetrics | null>(null);
  const [alerts, setAlerts] = useState<SessionAlert[]>([]);
  
  useEffect(() => {
    loadMetrics();
    loadAlerts();
    
    const interval = setInterval(() => {
      loadMetrics();
      loadAlerts();
    }, 30000); // Actualizar cada 30 segundos
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="session-monitoring-dashboard">
      <h2>Monitoreo de Sesiones</h2>
      
      {metrics && (
        <div className="metrics-grid">
          <MetricCard title="Sesiones Activas" value={metrics.activeSessions} />
          <MetricCard title="Duración Promedio" value={`${metrics.averageSessionDuration}m`} />
          <MetricCard title="Sesiones por Usuario" value={metrics.sessionsPerUser} />
          <MetricCard title="Intentos Fallidos" value={metrics.failedLogins} />
        </div>
      )}
      
      {alerts.length > 0 && (
        <div className="alerts-section">
          <h3>Alertas</h3>
          {alerts.map(alert => (
            <AlertCard key={alert.type} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
};
```

## 9. Conclusión

El protocolo de gestión de sesiones implementado en AI Pair Orchestrator Pro proporciona:

- **Trazabilidad completa**: Captura y registro de toda la actividad de sesión
- **Seguridad robusta**: Validación continua y protección contra ataques
- **Gestión eficiente**: Control de sesiones múltiples y recuperación
- **Monitoreo en tiempo real**: Métricas y alertas automáticas
- **Cumplimiento**: Adherencia a estándares de seguridad y auditoría

Este protocolo asegura que cada interacción con la plataforma sea segura, trazable y eficiente, manteniendo la integridad del sistema multi-tenant.

---

**Documento creado por**: AI Pair Platform  
**Fecha**: 2025-01-23  
**Versión**: 1.0.0  
**Revisión**: Marcelo SALES 