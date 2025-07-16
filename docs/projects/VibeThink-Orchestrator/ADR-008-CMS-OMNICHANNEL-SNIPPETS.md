# ADR-008: CMS para Snippets Omnicanal

**Versión:** 1.0.0  
**Fecha:** 2025-01-22  
**Autor:** AI Pair Platform (asistente de Marcelo Escallón)  
**Estado:** Aprobado  
**Impacto:** Alto - Afecta múltiples componentes de la plataforma  

---

## Contexto

La plataforma necesita un sistema de gestión de contenido (CMS) para manejar snippets dinámicos que se muestran en múltiples canales: portal del cliente, landing pages, formularios, soporte y agentes de atención IA. Estos snippets deben ser personalizables por empresa, actualizables en tiempo real y optimizados para engagement.

**Problema:** Actualmente el contenido es estático o hardcodeado, limitando la personalización, escalabilidad y experiencia de usuario.

---

## Decisiones Evaluadas

### **Opción 1: Strapi (RECOMENDADA)**
- **Licencia:** MIT (libre)
- **Multi-tenant:** Nativo con plugins oficiales
- **Integración:** Excelente con PostgreSQL/RLS
- **Comunidad:** 36.5k stars, muy madura
- **Performance:** 7.5/10
- **DX:** 8.5/10

### **Opción 2: PayloadCMS (ALTERNATIVA)**
- **Licencia:** MIT (libre)
- **Multi-tenant:** Configuración manual
- **Integración:** Muy buena, TypeScript nativo
- **Comunidad:** 18.2k stars, creciente
- **Performance:** 9.0/10
- **DX:** 9.0/10

### **Opción 3: Desarrollo Propio**
- **Licencia:** Propietaria
- **Multi-tenant:** Completo control
- **Integración:** Perfecta
- **Comunidad:** N/A
- **Performance:** Variable
- **DX:** Variable

---

## Decisión

**Se selecciona Strapi como CMS principal** para la gestión de snippets omnicanal.

### **Razones de la Decisión:**

1. **Multi-tenant Nativo:** Plugins oficiales que garantizan aislamiento de datos por empresa
2. **Integración PostgreSQL/RLS:** Compatibilidad perfecta con nuestro stack existente
3. **Comunidad Madura:** 36.5k stars, soporte extenso, casos de uso probados
4. **Licencia MIT:** Sin lock-in, costos predecibles, libertad total
5. **Escalabilidad:** Probado en SaaS empresariales con miles de empresas
6. **Soporte Comercial:** Disponible si es necesario

### **Alternativa de Contingencia:**
PayloadCMS como plan B si Strapi no cumple las expectativas, especialmente si la prioridad máxima se convierte en DX sobre estabilidad.

---

## Consecuencias

### **Positivas:**
- ✅ **Personalización Total:** Cada empresa puede personalizar su experiencia
- ✅ **Escalabilidad:** Soporte nativo para miles de empresas
- ✅ **Performance:** Caching y optimización integrados
- ✅ **Seguridad:** Aislamiento de datos garantizado
- ✅ **Flexibilidad:** API REST/GraphQL, webhooks, plugins
- ✅ **Costos:** Sin licenciamiento oculto, predictible

### **Riesgos y Mitigación:**
- **Complejidad Multi-tenant:** Usar plugins oficiales, documentación extensa
- **Curva de Aprendizaje:** Training estructurado, mentoring
- **Performance:** Implementar caching, optimización de queries
- **Integración:** Testing exhaustivo, rollback plan

---

## Implementación

### **Plan de Fases:**
1. **Fase 1 (2 semanas):** Instalación, configuración multi-tenant, integración auth
2. **Fase 2 (3 semanas):** Widget snippets, formularios inteligentes, agentes IA
3. **Fase 3 (2 semanas):** Performance, caching, SEO, mobile
4. **Fase 4 (1 semana):** Testing, documentación, deploy, monitoring

### **Recursos Requeridos:**
- 1 Backend Developer (Full-time)
- 1 Frontend Developer (Full-time)
- 1 DevOps Engineer (Part-time, 50%)
- 1 QA Engineer (Part-time, 25%)
- 1 Tech Writer (Part-time, 25%)

### **Infraestructura:**
- Servidor Strapi: 2 vCPU, 4GB RAM, 50GB SSD
- PostgreSQL con RLS habilitado
- Redis para caching
- CDN para assets estáticos

---

## Métricas de Éxito

### **Técnicas:**
- Tiempo de carga snippets: < 200ms
- Uptime CMS: > 99.9%
- Escalabilidad: 1000+ empresas concurrentes
- Performance: < 1s para queries complejas

### **Negocio:**
- Adopción snippets: > 80% empresas
- Mejora conversiones: > 25%
- Reducción tiempo soporte: > 30%
- Satisfacción cliente: > 4.5/5

### **Operacionales:**
- Tiempo configuración empresa: < 30 min
- Mantenimiento semanal: < 2 horas
- Tiempo resolución issues: < 4 horas
- ROI positivo: < 6 meses

---

## Componentes Afectados

### **Alto Impacto:**
- **Portal del Cliente:** Snippets dinámicos, branding personalizado
- **Landing Pages:** Contenido adaptativo, formularios inteligentes
- **Agentes de Atención IA:** Conocimiento dinámico, personalización
- **Multi-tenant:** Aislamiento nativo, configuración automática

### **Medio Impacto:**
- **Sistema de Formularios:** Campos dinámicos, validación inteligente
- **Soporte:** FAQs dinámicas, escalación inteligente
- **Analytics:** Tracking de snippets, A/B testing
- **SEO:** Meta tags dinámicos, sitemap automático

---

## Revisión y Monitoreo

### **Cronograma de Revisión:**
- **3 meses:** Feedback inicial y ajustes menores
- **6 meses:** Análisis de adopción y performance
- **12 meses:** Evaluación estratégica completa

### **KPIs de Monitoreo:**
- Performance del CMS
- Adopción por empresas
- Engagement de snippets
- Tiempo de resolución de issues
- Satisfacción del equipo

---

## Documentación Relacionada

- [Evaluación Detallada](./evaluations/cms-snippets-evaluation.md)
- [FAQ del Equipo](./foundation/faqs/universal/cms-stack-evaluation-faq.md)
- [Análisis de Impacto](./features/CMS_INTEGRATION_IMPACT_ANALYSIS.md)
- [Roadmap de Implementación](./features/CMS_INTEGRATION_ROADMAP.md)
- [Criterios de Evaluación de Stack](./STACK_EVALUATION_CRITERIA.md)

---

## Conclusión

Strapi es la opción óptima para nuestro CMS de snippets omnicanal, proporcionando la combinación perfecta de madurez, escalabilidad, integración y flexibilidad que necesitamos para transformar la plataforma en un sistema de contenido dinámico y personalizable.

**Próximo paso:** Iniciar implementación siguiendo el roadmap detallado.

---

## Historial de Cambios

- **2025-01-22** | AI Pair Platform (asistente de Marcelo Escallón) | Creación inicial del ADR para la decisión del CMS de snippets omnicanal 