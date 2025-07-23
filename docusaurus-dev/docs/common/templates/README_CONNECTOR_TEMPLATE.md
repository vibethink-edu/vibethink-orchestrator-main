# 📦 [NOMBRE DEL CONECTOR]

> **NOTA:** Siempre que sea posible, automatiza la generación y actualización de esta documentación mediante scripts, CI/CD o herramientas AI. La documentación viva y automatizada es clave para la calidad y la mejora continua.

> Plantilla evolutiva para documentar conectores (correo, integraciones, etc.) bajo la metodología VibeThink/VTK. Actualiza y adapta según necesidades y aprendizajes continuos.

---

## 1. 📝 Resumen del Conector
- **Propósito:** ¿Qué problema resuelve? ¿Qué sistemas integra?
- **Alcance:** ¿Qué funcionalidades cubre? ¿Qué no cubre?
- **Stakeholders:** ¿Quiénes lo usan o dependen de él?

---

## 2. ⚙️ Arquitectura y Diseño
- **Diagrama de flujo/arquitectura:** (Mermaid, ASCII, imagen)
- **Tecnologías y dependencias:**
- **Patrones y decisiones clave:**
- **Puntos de extensión/evolución futura:**

---

## 2.1. 📦 Dependencias técnicas
- Librerías, APIs externas, servicios requeridos

## 2.2. 🔑 Variables de entorno
- Ejemplo: VITE_API_KEY, VITE_ENDPOINT_URL, etc.

## 2.3. 🌐 Endpoints/API expuestos
- Ejemplo: /api/correo/send, /api/correo/status

## 2.4. 🧑‍💻 Ejemplo de uso mínimo
```js
// Ejemplo de integración básica
import { sendMail } from '@/connectors/correo';
sendMail({ to: 'test@acme.com', subject: 'Hola', body: 'Prueba' });
```

---

## 3. 🔒 Seguridad y Multi-tenant
- **Aislamiento multi-tenant:** ¿Cómo se garantiza?
- **Validación de permisos y roles:**
- **Gestión de secretos y credenciales:**
- **Cumplimiento normativo (CMMI, GDPR, etc.):**

---

## 3.1. ⚠️ Riesgos y mitigaciones
- Riesgo: Fuga de credenciales → Mitigación: Uso de secrets manager

---

## 4. 🧪 Testing y Calidad
- **Cobertura mínima esperada:** (ej: 80% unitario, 100% flujos críticos)
- **Estrategia de tests:** Unitarios, integración, E2E, mocks
- **Casos de prueba críticos:**
- **Validación de errores y edge cases:**

---

## 4.1. 🛡️ Validación en CI/CD
- Tests automáticos, lint, auditoría de seguridad, validación de cobertura

---

## 5. 🚦 Criterios de Aceptación
- [ ] Funcionalidad principal implementada y validada
- [ ] Seguridad multi-tenant validada
- [ ] Permisos y roles correctamente gestionados
- [ ] Tests unitarios y de integración pasando
- [ ] Documentación técnica y de usuario actualizada
- [ ] Performance validada (<2s respuesta)
- [ ] Accesibilidad y usabilidad (si aplica)
- [ ] Logging y monitoreo configurados
- [ ] Checklist de riesgos y mitigaciones

---

## 6. 📈 Métricas y Observabilidad
- **KPIs relevantes:** (ej: tiempo de respuesta, errores, throughput)
- **Monitoreo y alertas:**
- **Logs estructurados y trazabilidad:**

---

## 6.1. 📝 Ejemplo de log estructurado
```json
{ "event": "correo_sent", "status": "ok", "user": "user123", "company_id": "acme" }
```

---

## 7. 🔄 Mejora Continua y Feedback
- **Lecciones aprendidas:**
- **Pendientes y oportunidades de mejora:**
- **Propuestas de evolución futura:**

---

## 8. 📚 Referencias y Recursos
- **APIs/documentación externa:**
- **Enlaces a código fuente y tests:**
- **Historial de cambios y decisiones:**

---

## 9. ✅ Checklist de documentación
- [ ] Todos los campos completados
- [ ] Revisado por otro dev
- [ ] Validado en CI/CD

---

## 10. 🛠️ Referencia a scripts de automatización
- Para regenerar o actualizar la documentación: `node scripts/generate-connector-doc.cjs`

---

## 11. 🗂️ Notas de versionado/documentación evolutiva
- v1.0: Primera versión
- v1.1: Añadido soporte multi-tenant

---

## 🕰️ Referencias Históricas y Plantillas Legacy

- Plantilla DocumentXTR (legacy, pre-VTK): [`README_DOCUMENTXTR_TEMPLATE_LEGACY.md`](./README_DOCUMENTXTR_TEMPLATE_LEGACY.md)
- Copia adicional de referencia: [`README_DOCUMENTXTR_TEMPLATE_LEGACY_COPY.md`](./README_DOCUMENTXTR_TEMPLATE_LEGACY_COPY.md)
- Plantilla VTK general: [`README_DOCUMENTVTK_TEMPLATE.md`](./README_DOCUMENTVTK_TEMPLATE.md)

> **Nota:** Estas plantillas legacy se mantienen solo para trazabilidad y consulta histórica. Toda nueva documentación debe seguir la plantilla moderna y evolucionar según las mejores prácticas VibeThink/VTK.

---

> **Esta plantilla debe evolucionar con cada nuevo conector, integrando feedback, aprendizajes y mejores prácticas del equipo.** 