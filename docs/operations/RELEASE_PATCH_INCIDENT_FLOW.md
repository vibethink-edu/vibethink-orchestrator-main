# ViTo OPS — Release, Patch & Incident Flow

**Status**: SEALED
**Authority**: Engineering Rector Pack v1 · Runtime Canon
**Last Updated**: 2026-01-09
**Scope**: Procedimientos operativos para despliegues, correcciones y gestión de crisis en producción.

---

## 🎯 Objetivo

Eliminar el factor pánico de la operación en producción mediante flujos deterministas, criterios de decisión claros y protocolos de recuperación automáticos. **Estabilidad > Velocidad.**

---

## 1. Release Flow (Despliegue Programado)

*Para nuevas funcionalidades o cambios planeados (Minor/Major).*

1.  **Staging Validation**: El código DEBE pasar el 100% de los checks en el entorno de validación (QA/Staging).
2.  **Release Candidate (RC)**: Se crea un tag de pre-release para pruebas de humo finales.
3.  **Governance Check**: Confirmación de que no hay "WITs" (Work in Transit) críticos o cambios arquitectónicos no documentados.
4.  **Greenlight**: El *Technical Lead (AI or Human)* autoriza el merge a `main`.
5.  **Automated Deploy**: CI/CD despliega a producción.
6.  **Post-Deploy Smoke Test**: Validación automática de salud (`pnpm run validate:ecosystem`).

---

## 2. Patch / Hotfix Flow (Corrección Urgente)

*Para errores detectados en producción que afectan la experiencia del usuario sin romper el core.*

- **Trigger**: Error verificado en logs o reporte de usuario (Severity High/Medium).
- **Procedimiento**:
    1.  **Branch `hotfix/*`**: Rama creada directamente desde el tag de producción actual.
    2.  **Minimal Change**: Solo se permite el código estrictamente necesario para corregir el bug. **PROHIBIDO refactorizar.**
    3.  **Atomic Test**: Creación de un test unitario/integración que reproduzca el fallo para evitar regresiones.
    4.  **Bypass Estándar**: El hotfix puede saltar la cola de features pero NO los quality gates de CI.
    5.  **Merge & Tag**: Merge a `main` y creación de un nuevo Patch Version (ex: `1.0.1` → `1.0.2`).

---

## 3. Rollback Flow (Recuperación ante Desastre)

*Se activa cuando un despliegue (Release o Hotfix) degrada el sistema o compromete la seguridad.*

### Criterios de Activación (Panic Button)
- Error rate > 5% sostenido por 2 minutos.
- Fallo detectado en el aislamiento Multi-tenant.
- Degradación de performance > 50% en rutas críticas.

### Ejecución
1.  **Revert Prioritario**: `git revert HEAD --no-edit` (o apuntar el puntero de producción al último tag conocido como estable).
2.  **Automated Trigger**: Si el despliegue falla el health-check automático post-deploy, el CI/CD DEBE ejecutar el rollback sin intervención humana.
3.  **Estado "Limpio"**: No se permite debuguear en producción. Primero se vuelve al estado estable, luego se analiza en local/staging.

---

## 4. Incident Response Flow (Gestión de Crisis)

*Para fallos críticos que requieren coordinación multi-rol (Severity Critical/Blocker).*

1.  **Detection & Alert**: Notificación inmediata a los canales de incidentes (Cursor, Claude, Usuario).
2.  **Triage**: Determinación de impacto (¿Afecta a todos los tenants o a uno solo?).
3.  **Containment**: Si es necesario, deshabilitar la capacidad afectada mediante *Feature Flags* o poner el sistema en *Maintenance Mode*.
4.  **War Room**: Comunicación activa mediante el protocolo de coordinación de IA. Documentación en tiempo real del incidente.
5.  **Resolution**: Aplicación de Hotfix o Rollback confirmada por auditoría.
6.  **Post-Mortem (Obligatorio)**: Documentación de la causa raíz, lecciones aprendidas y actualización de los FIT gates para prevenir repetición.

---

## 5. Matriz de Severidad (Guía de Acción)

| Nivel | Impacto | Acción | Tiempo de Respuesta |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | Sistema caído o fuga de datos multi-tenant. | Incidente + Rollback total. | Inmediato (< 15 min) |
| **HIGH** | Funcionalidad core rota para un grupo de usuarios. | Hotfix prioritario. | < 60 min |
| **MEDIUM** | Degradación menor o bug estético. | Patch programado. | < 24 horas |
| **LOW** | Mejora o sugerencia técnica. | Backlog / Next Release. | Próximo Ciclo |

---

## 6. Reglas Anti-Pánico

- 🛡️ **No Deploys on Fridays**: A menos que sea un Hotfix crítico (Severity High+).
- 🛡️ **Logs over Guessing**: Nunca aplicar un fix basándose en "intuición". Requiere evidencia en logs o trazas de observabilidad.
- 🛡️ **Isolation**: Errores en un tenant NO deben forzar el rollback de todo el sistema si el fallo es de configuración específica de ese tenant (metering/activation).
- 🛡️ **Immutable History**: Todo cambio en producción debe quedar registrado en el historial de Git. Queda PROHIBIDO el acceso manual a modificar archivos en el servidor directamente.
