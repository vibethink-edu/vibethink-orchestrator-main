# ADR-008: Adopción de un Sistema de Gestión de Identidad (IAM) Dedicado

**Fecha:** 2024-06-20

**Estado:** **APROBADO**

**Relacionado con**: `docs/GRANULAR_PERMISSIONS_ARCHITECTURE.md`

---

## 📋 AVISO DE CONFIDENCIALIDAD

**PROPIEDAD DE EUPHORIANET**  
**© 2025 Euphorianet. Todos los derechos reservados.**

**Autor:** Marcelo Escallón, CEO de Euphorianet  
**Fecha:** 22 de junio de 2025  
**Sesión:** Consolidación de Arquitectura AI Pair OS  

**CONFIDENCIAL** - Este documento contiene información propietaria y estratégica de Euphorianet. Su distribución, reproducción o uso sin autorización expresa está prohibida. Este documento forma parte del Sistema de Conocimiento de Producto de Euphorianet y está protegido por derechos de autor.

---


## 1. Contexto

La arquitectura de permisos definida en `GRANULAR_PERMISSIONS_ARCHITECTURE.md` es potente y granular. Sin embargo, su implementación completa utilizando únicamente las capacidades de Supabase Auth y tablas personalizadas en la base de datos, aunque factible para un Producto Mínimo Viable (MVP), implica recrear una gran cantidad de funcionalidades que son estándar en plataformas dedicadas de Gestión de Identidad y Acceso (IAM).

A medida que la plataforma escale y necesite soportar casos de uso empresariales complejos (ej. Single Sign-On con SAML, federación de identidades, políticas de seguridad avanzadas), el mantenimiento de una solución de IAM "casera" se convertirá en un cuello de botella técnico y un riesgo de seguridad.

## 2. Decisión Estratégica

1.  **Adoptar un IAM Dedicado:** Se ha tomado la decisión estratégica de adoptar una solución de IAM dedicada y externa como la **fuente única de verdad** para la identidad, la autenticación y la autorización de alto nivel (roles).

2.  **Selección de FusionAuth:** Se ha seleccionado **FusionAuth** como nuestra plataforma IAM.
    *   **Razón:** FusionAuth ofrece un equilibrio ideal entre potencia, modernidad y una experiencia de desarrollador superior. Su modelo de "Tenants" nativo se alinea perfectamente con nuestro requisito de multi-tenancy a nivel de compañía, y su generosa licencia de auto-alojamiento gratuito cubre todas nuestras necesidades. Se prefiere sobre Keycloak por su curva de aprendizaje más suave y su enfoque API-first.

3.  **Implementación por Fases:**
    *   **Fase 1 (MVP):** Se continuará utilizando **Supabase Auth** para acelerar el desarrollo inicial. La arquitectura se diseñará para ser compatible con la futura migración.
    *   **Fase 2 (Post-MVP / Enterprise Ready):** Se integrará FusionAuth. La autenticación de usuarios será gestionada por FusionAuth, que emitirá JWTs enriquecidos con los datos de sesión del usuario.

## 3. Arquitectura de Integración: FusionAuth + Supabase

La integración se logrará sin sacrificar la seguridad de la base de datos de Supabase.

1.  **Flujo de Autenticación:** El usuario se autentica contra FusionAuth.
2.  **Emisión de JWT Enriquecido:** FusionAuth emite un JWT que contiene `claims` personalizados, tales como `company_id`, `department_ids`, y `roles`.
3.  **Validación de JWT en Supabase:** Supabase se configura para validar los JWTs que han sido firmados por FusionAuth, utilizando la clave pública de este.
4.  **Uso en Políticas de RLS:** Nuestras políticas de Seguridad a Nivel de Fila (RLS) se modifican para extraer la información de identidad directamente del JWT entrante, en lugar de la tabla `auth.users` de Supabase.

**Ejemplo de política RLS modificada:**

```sql
-- Política para leer 'deals'
(
  -- La compañía del deal debe coincidir con la compañía en el token del usuario.
  deals.company_id = (request.jwt.claims ->> 'company_id')::uuid
  AND
  -- El usuario debe tener el rol de MANAGER O el deal debe ser de su propiedad.
  (
    (request.jwt.claims ->> 'roles')::jsonb ? 'MANAGER'
    OR
    deals.owner_id = (request.jwt.claims ->> 'sub')::uuid
  )
)
```

## 4. Consecuencias y Beneficios

*   **Seguridad Mejorada:** Delegamos la lógica de autenticación compleja a una herramienta especializada y auditada, reduciendo nuestra superficie de ataque.
*   **Escalabilidad Empresarial:** Estamos preparados desde el día uno para soportar requisitos de clientes empresariales, como SSO con SAML u OIDC, lo que representa una ventaja competitiva masiva.
*   **Simplificación del Backend:** Gran parte de la lógica de gestión de roles y permisos se traslada a FusionAuth, manteniendo nuestro propio código más limpio y enfocado en la lógica de negocio.
*   **Flexibilidad a Largo Plazo:** Al desacoplar la autenticación de nuestra base de datos principal, ganamos flexibilidad para evolucionar ambas partes de la plataforma de forma independiente en el futuro. 