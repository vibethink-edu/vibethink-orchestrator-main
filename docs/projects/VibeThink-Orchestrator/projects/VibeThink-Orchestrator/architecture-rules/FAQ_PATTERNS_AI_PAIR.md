# FAQ para Developers: Patrones de Diseño y Arquitectura en AI Pair Orchestrator Pro

## 1. ¿Qué patrones de diseño debo usar para lógica compartida entre empresas (tenants)?

**Usa:** Tenant Context + Custom Hooks + Parametric Configuration.

- **Referencia:** [VibeThink_DESIGN_PATTERNS.md](./VibeThink_DESIGN_PATTERNS.md)
- **Ejemplo:**
  - `useTenant()` para obtener el contexto de empresa.
  - `useParametricConfiguration()` para lógica adaptable por país/industria.

---

## 2. ¿Cómo extiendo la lógica de workflows sin modificar el core?

**Usa:** Plugin System + Universal Workflow Engine.

- **Referencia:** [VibeThink_DESIGN_PATTERNS.md](./VibeThink_DESIGN_PATTERNS.md), [WORKFLOW_ARCHITECTURE_PATTERNS.md](./WORKFLOW_ARCHITECTURE_PATTERNS.md)
- **Ejemplo:**
  - Registra un nuevo plugin en el `PluginRegistry`.
  - Implementa hooks `beforeStep` y `afterStep` para lógica específica.

---

## 3. ¿Cómo integro IA de forma segura y escalable?

**Usa:** AI Service Facade + Fallback + Límites por tenant.

- **Referencia:** [VibeThink_DESIGN_PATTERNS.md](./VibeThink_DESIGN_PATTERNS.md)
- **Ejemplo:**
  - Usa `AIServiceFacade` para procesar peticiones de IA.
  - Controla límites y fallback entre proveedores.

---

## 4. ¿Qué patrón usar para componentes que cambian según la configuración del cliente?

**Usa:** Componentes Adaptativos + Configurables.

- **Referencia:** [VibeThink_DESIGN_PATTERNS.md](./VibeThink_DESIGN_PATTERNS.md)
- **Ejemplo:**
  - `AdaptiveComponent` para mostrar u ocultar UI según permisos/features.
  - `ConfigurableWorkflowStep` para renderizar pasos dinámicos.

---

## 5. ¿Cómo garantizo el aislamiento de datos y lógica entre empresas?

**Usa:** Tenant Context + RLS en base de datos + Validación de permisos en hooks y servicios.

- **Referencia:** [PATTERNS_SYNTHESIS.md](./PATTERNS_SYNTHESIS.md), [ADR-004-Universal-Workflow-Engine.md](./ADR-004-Universal-Workflow-Engine.md)
- **Ejemplo:**
  - Siempre filtra por `company_id` en queries.
  - Usa `hasPermission` antes de ejecutar acciones sensibles.

---

## 6. ¿Cuándo usar micro-frontends y atomic design?

**Usa:** Micro-frontends para equipos independientes, Atomic Design para UI reutilizable y escalable.

- **Referencia:** [PATTERNS_COMPARISON_ANALYSIS.md](./PATTERNS_COMPARISON_ANALYSIS.md)
- **Ejemplo:**
  - Divide grandes features (CRM, PQRS, Ecommerce) en micro-frontends.
  - Usa átomos, moléculas y organismos para construir la UI.

---

## 7. ¿Cómo manejo errores y logging contextualizados?

**Usa:** AI Pair Error Boundary + Logging con contexto de tenant.

- **Referencia:** [VibeThink_DESIGN_PATTERNS.md](./VibeThink_DESIGN_PATTERNS.md)
- **Ejemplo:**
  - Envuelve feature components con `VibeThinkErrorBoundary`.
  - Loguea errores con información de empresa y usuario.

---

## 8. ¿Cómo decido qué patrón aplicar en un nuevo módulo?

**Usa:** Matriz de Decisión de Patrones.

- **Referencia:** [PATTERNS_SYNTHESIS.md](./PATTERNS_SYNTHESIS.md)
- **Ejemplo:**
  - Consulta la tabla de escenarios vs patrones.
  - Prioriza patrones que permitan adaptación, aislamiento y extensibilidad.

---

## 9. ¿Por qué no puedo usar valores hardcodeados en el código?

**Usa:** Sistema de Prevención de Hardcoding.

- **Referencia:** [HARDCODING_PREVENTION_SYSTEM.md](./HARDCODING_PREVENTION_SYSTEM.md)
- **Ejemplo:**
  - ❌ `const colombia = "CO";` → ✅ `const currentCountry = getCountryCode();`
  - ❌ `const API_KEY = "sk-123...";` → ✅ `const API_KEY = process.env.REACT_APP_API_KEY;`

**¿Por qué?** Los valores hardcodeados limitan la universalidad de la plataforma. AI Pair debe funcionar para cualquier país, industria o dominio sin cambios de código.

---

## 10. ¿Qué hago si detecto una violación de hardcoding?

**Sigue el proceso de corrección:**

1. **Identifica** el tipo de violación (crítica, alta, media, baja)
2. **Aplica** la corrección según el patrón recomendado
3. **Valida** que no hay regresiones
4. **Documenta** los cambios realizados

- **Críticas:** Bloquean commit - Corregir inmediatamente
- **Altas:** Alerta - Corregir en esta iteración
- **Medias:** Advertencia - Considerar corrección
- **Bajas:** Sugerencia - Mejora futura

---

## 11. ¿Cómo manejo configuraciones específicas sin hardcoding?

**Usa:** Configuración Paramétrica + Variables de Entorno.

- **Referencia:** [HARDCODING_PREVENTION_SYSTEM.md](./HARDCODING_PREVENTION_SYSTEM.md)
- **Ejemplo:**
  ```typescript
  // ❌ MAL
  const dbConfig = { host: "localhost", port: 5432 };
  
  // ✅ BIEN
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432
  };
  ```

---

## 12. ¿Qué pasa si necesito un valor específico temporalmente?

**Documenta y crea ticket de refactoring:**

1. **Justifica** por qué es necesario temporalmente
2. **Crea ticket** de refactoring para futuras versiones
3. **Documenta** la limitación en el código
4. **Planifica** la migración a configuración paramétrica

---

## 13. ¿Dónde encuentro ejemplos y mejores prácticas?

- **Documentos clave:**
  - [VibeThink_DESIGN_PATTERNS.md](./VibeThink_DESIGN_PATTERNS.md)
  - [PATTERNS_COMPARISON_ANALYSIS.md](./PATTERNS_COMPARISON_ANALYSIS.md)
  - [PATTERNS_SYNTHESIS.md](./PATTERNS_SYNTHESIS.md)
  - [WORKFLOW_ARCHITECTURE_PATTERNS.md](./WORKFLOW_ARCHITECTURE_PATTERNS.md)
  - [ADR-004-Universal-Workflow-Engine.md](./ADR-004-Universal-Workflow-Engine.md)
  - [HARDCODING_PREVENTION_SYSTEM.md](./HARDCODING_PREVENTION_SYSTEM.md)

---

## 14. ¿Cómo contribuyo o propongo nuevos patrones?

- Sigue el proceso de documentación en `docs/architecture/`.
- Propón un ADR si el patrón afecta la arquitectura global.
- Añade ejemplos y justificación de negocio.
- Solicita revisión en el equipo de arquitectura.

---

## 15. ¿Qué métricas usamos para evaluar el éxito de los patrones?

- Reutilización de componentes y hooks
- Adaptabilidad automática por tenant
- Uso de plugins vs lógica hardcodeada
- Tasa de fallback en IA
- Reducción de bugs por aislamiento de tenant
- **NUEVO:** Reducción de violaciones de hardcoding

---

## 16. ¿A quién consulto si tengo dudas?

- Revisa primero la documentación enlazada.
- Consulta al equipo de arquitectura o abre un issue en el repositorio.
- Participa en las sesiones de revisión de patrones.
- **Para violaciones críticas:** Contacta inmediatamente a Marcelo (Arquitecto).

---

## 17. ¿Cómo funciona el sistema de detección automática de hardcoding?

**El sistema detecta automáticamente:**

- **Credenciales hardcodeadas** (CRÍTICO - bloquea commit)
- **URLs y endpoints hardcodeados** (ALTO - alerta inmediata)
- **Entidades específicas** (MEDIO - advertencia)
- **Configuraciones hardcodeadas** (MEDIO - advertencia)

**Herramientas:**
- ESLint plugin personalizado
- Pre-commit hooks
- CI/CD pipeline checks
- Notificaciones automáticas al arquitecto

---

## 18. ¿Qué hago si el sistema bloquea mi commit por hardcoding?

1. **Lee** el mensaje de error detallado
2. **Identifica** el valor hardcodeado
3. **Aplica** la corrección sugerida
4. **Valida** que la funcionalidad sigue funcionando
5. **Intenta** el commit nuevamente

**Recuerda:** Las violaciones críticas bloquean el commit para proteger la seguridad y universalidad de la plataforma.

---

## 19. ¿Cómo manejo dependencias de terceros que tienen hardcoding?

**Sistema de monitoreo de dependencias:**

1. **Detecta** cambios en dependencias
2. **Escanea** por violaciones de hardcoding
3. **Notifica** al arquitecto si encuentra problemas
4. **Bloquea** actualización si es necesario
5. **Crea** ticket de sanitización

---

## 20. ¿Cuáles son las mejores prácticas para evitar hardcoding?

1. **Siempre usa variables de entorno** para configuraciones
2. **Parametriza por país/industria** usando configuración dinámica
3. **Usa nombres genéricos** en lugar de específicos
4. **Implementa sistema de plugins** para casos especiales
5. **Documenta** cualquier excepción temporal
6. **Revisa** código regularmente con las herramientas de detección

---

**Recuerda:** La universalidad y parametrización son fundamentales para el éxito de AI Pair Orchestrator Pro. 