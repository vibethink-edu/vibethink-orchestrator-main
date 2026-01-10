# ⚔️ Evaluación: Puck Editor + PayloadCMS (Marketing Stack)

> **Fecha:** 2026-01-09
> **Tipo:** Evaluación de Integración
> **Caso de Uso:** Marketing y Comunicaciones
> **Estado:** 🟡 **VIABLE CON CAVEATS**

---

## 1. Resumen Ejecutivo

**Pregunta:** ¿Pueden Puck Editor y PayloadCMS funcionar juntos para empoderar al equipo de Marketing?

**Respuesta:** **SÍ, pero con integración custom.** No es plug-and-play.

| Aspecto | Evaluación | Notas |
|---------|------------|-------|
| **Viabilidad Técnica** | ✅ Posible | Existe POC (puckload-poc) |
| **Complejidad** | ⚠️ Media-Alta | Requiere custom route en Payload |
| **Madurez** | ⚠️ Experimental | POC, no production-ready |
| **Alternativa** | 🏆 Builder.io | Ya evaluada, más madura |

---

## 2. ¿Qué es Cada Herramienta?

### Puck Editor

**Qué es:** Visual page builder open-source para React.

**Características:**
- Drag-and-drop de componentes React
- Multi-column layouts
- Viewport previewing (mobile/desktop)
- CMS-agnostic (funciona con cualquier backend)

**Licencia:** MIT ✅ (Safe para SaaS)

**Filosofía:**
> "Embebe un page builder directamente en tu app React, sin depender de un CMS específico."

### PayloadCMS

**Qué es:** Headless CMS code-first (TypeScript + Node.js + MongoDB).

**Características:**
- Admin UI robusta
- Schema flexible (code-based)
- Blocks nativos (drag-and-drop)
- Visual editing (enterprise feature, pago)

**Licencia:** MIT ✅ (Safe para SaaS)

**Filosofía:**
> "CMS para desarrolladores. Todo en código, nada en UI de configuración."

---

## 3. La Integración: Puck + Payload

### 3.1 Cómo Funcionaría

**Arquitectura Propuesta:**

```
┌─────────────────────────────────────────────────────┐
│           MARKETING TEAM (Browser)                  │
│  • Edita páginas visualmente con Puck              │
│  • Gestiona contenido estructurado en Payload      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              PAYLOAD ADMIN (Custom Route)           │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Puck Editor (Embedded)                       │ │
│  │  • Drag-and-drop React components             │ │
│  │  • Visual layout builder                      │ │
│  └───────────────────────────────────────────────┘ │
│                        ↓                            │
│  ┌───────────────────────────────────────────────┐ │
│  │  Payload Custom Field                         │ │
│  │  • Stores Puck JSON structure                 │ │
│  │  • { type: "Hero", props: {...} }             │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              PAYLOAD DATABASE (MongoDB)             │
│  • Stores page structure as JSON                   │
│  • Stores content (text, images, metadata)         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              NEXT.JS FRONTEND (VibeThink)           │
│  • Fetches page JSON from Payload API              │
│  • Renders Puck components dynamically             │
│  • Uses existing @vibethink/ui components          │
└─────────────────────────────────────────────────────┘
```

### 3.2 Flujo de Trabajo

1. **Marketing crea página:**
   - Abre Payload Admin
   - Va a custom route `/admin/puck-builder`
   - Arrastra componentes (Hero, CTA, Testimonials)
   - Puck genera JSON: `{ type: "Hero", props: { title: "..." } }`

2. **Payload guarda:**
   - JSON se guarda en campo custom de Payload
   - Metadata (slug, SEO, publish date) en campos normales

3. **Frontend renderiza:**
   - Next.js fetch `GET /api/pages/:slug`
   - Recibe JSON de Puck
   - Renderiza componentes de `@vibethink/ui`

### 3.3 Ejemplo de Código

**Payload Custom Field (Puck JSON):**

```typescript
// payload.config.ts
import { CollectionConfig } from 'payload/types';

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'puckData',
      type: 'json', // Stores Puck structure
      admin: {
        components: {
          Field: PuckEditorField, // Custom component
        },
      },
    },
  ],
};
```

**Custom Puck Editor Field:**

```typescript
// PuckEditorField.tsx
import { Puck } from '@measured/puck';
import { useField } from 'payload/components/forms';

const config = {
  components: {
    Hero: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
      },
      render: ({ title, subtitle }) => (
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      ),
    },
    // ... más componentes
  },
};

export const PuckEditorField = () => {
  const { value, setValue } = useField({ path: 'puckData' });

  return (
    <Puck
      config={config}
      data={value}
      onPublish={(data) => setValue(data)}
    />
  );
};
```

**Frontend Rendering:**

```typescript
// app/[slug]/page.tsx
import { Render } from '@measured/puck';
import { getPayloadClient } from '@/lib/payload';

export default async function Page({ params }) {
  const payload = await getPayloadClient();
  const page = await payload.findByID({
    collection: 'pages',
    id: params.slug,
  });

  return <Render config={config} data={page.puckData} />;
}
```

---

## 4. Ventajas de la Integración

### 4.1 Para Marketing

✅ **Visual editing:** Arrastra y suelta, sin código  
✅ **Preview en tiempo real:** Ve cómo queda antes de publicar  
✅ **Componentes reutilizables:** Usa los mismos de `@vibethink/ui`  
✅ **Control total:** No depende de desarrolladores para cambios visuales  

### 4.2 Para Desarrollo

✅ **Code-first:** Componentes en React, no en UI de CMS  
✅ **Type-safe:** TypeScript en todo el stack  
✅ **Monorepo-friendly:** Payload y Puck viven en el mismo repo  
✅ **Open-source:** MIT license, sin vendor lock-in  

---

## 5. Desventajas y Riesgos

### 5.1 Complejidad de Integración

⚠️ **No es plug-and-play:**
- Requiere custom route en Payload Admin
- Requiere custom field component
- Requiere mapeo de componentes Puck ↔ @vibethink/ui

⚠️ **Mantenimiento:**
- Updates de Puck requieren testing de integración
- Updates de Payload pueden romper custom route

### 5.2 Madurez

⚠️ **POC, no producción:**
- `puckload-poc` es proof-of-concept
- No tiene persistencia robusta
- No tiene versionado de páginas (drafts/published)

⚠️ **Falta de features:**
- No hay A/B testing nativo
- No hay analytics integrado
- No hay SEO preview

### 5.3 Alternativa Más Madura

🏆 **Builder.io ya fue evaluado y ganó:**
- Plug-and-play (no custom code)
- Visual editing maduro
- A/B testing incluido
- Analytics incluido
- SEO preview incluido

**Comparación:**

| Feature | Puck + Payload | Builder.io |
|---------|----------------|------------|
| **Setup** | Custom (días) | Plug-and-play (horas) |
| **Visual Editing** | ✅ Sí | ✅ Sí |
| **A/B Testing** | ❌ No | ✅ Sí |
| **Analytics** | ❌ No | ✅ Sí |
| **SEO Preview** | ❌ No | ✅ Sí |
| **Costo** | Free (MIT) | $$ (pero ROI alto) |

---

## 6. Caso de Uso: ¿Cuándo Usar Cada Uno?

### Usar Puck + Payload SI:

1. **Budget cero para herramientas:**
   - No puedes pagar Builder.io
   - Tienes tiempo de desarrollo para integración custom

2. **Control total del código:**
   - Quieres que TODO viva en tu monorepo
   - No quieres dependencias externas (Builder.io cloud)

3. **Contenido estructurado complejo:**
   - Necesitas Payload para blog, help center, docs
   - Y también quieres page builder para landings

### Usar Builder.io SI:

1. **Marketing necesita autonomía YA:**
   - No puedes esperar semanas de desarrollo
   - Quieres que marketing publique hoy

2. **Features avanzadas:**
   - A/B testing es crítico
   - Analytics de conversión es crítico
   - SEO preview es crítico

3. **ROI sobre costo:**
   - Prefieres pagar $$ y tener features maduras
   - Que gastar tiempo de desarrollo en custom code

---

## 7. Recomendación para VibeThink

### Estrategia Híbrida (Best of Both Worlds)

**Usar ambos, pero para casos distintos:**

1. **Builder.io:** Para landings de marketing
   - Campañas
   - Landing pages de producto
   - A/B testing de conversión

2. **PayloadCMS:** Para contenido estructurado
   - Blog
   - Help Center
   - Documentación
   - Case Studies

3. **Puck + Payload:** Solo si budget es crítico
   - Alternativa a Builder.io si no puedes pagar
   - Requiere 1-2 semanas de desarrollo custom

### Decisión Final

**Estado:** 🟡 **VIABLE PERO NO PRIORITARIO**

**Razones:**
1. Builder.io ya fue evaluado y aprobado (más maduro)
2. PayloadCMS ya fue evaluado para contenido estructurado (Trial)
3. Puck + Payload requiere desarrollo custom (ROI bajo vs Builder.io)

**Recomendación:**
- **Fase 1:** Implementar Builder.io (marketing freedom inmediata)
- **Fase 2:** Implementar PayloadCMS (blog, help center)
- **Fase 3 (opcional):** Evaluar Puck + Payload si Builder.io es muy caro

---

## 8. POC de Referencia

**GitHub:** https://github.com/payloadcms/puckload-poc

**Limitaciones del POC:**
- ❌ No production-ready
- ❌ No tiene persistencia robusta
- ❌ Payload blocks nativos no compatibles con Puck
- ❌ Tightly coupled (no es plugin)

**Para usar en producción, necesitarías:**
1. Implementar persistencia (save/publish workflow)
2. Mapear componentes de `@vibethink/ui` a Puck config
3. Crear custom route en Payload Admin
4. Testing exhaustivo de integración

**Esfuerzo estimado:** 1-2 semanas de desarrollo + 1 semana de testing

---

## 9. Conclusión

**¿Pueden funcionar juntos?** SÍ.  
**¿Deberían funcionar juntos para VibeThink?** DEPENDE.

**SI:**
- Budget es crítico (no puedes pagar Builder.io)
- Tienes tiempo de desarrollo (1-2 semanas)
- Quieres control total del código

**NO:**
- Marketing necesita autonomía YA
- Prefieres features maduras (A/B testing, analytics)
- ROI de tiempo de desarrollo es más caro que Builder.io

**Recomendación Final:**
Mantener **Builder.io** como solución principal para marketing. Usar **PayloadCMS** solo para contenido estructurado (blog, docs). Considerar **Puck + Payload** solo si budget se vuelve crítico en el futuro.

---

**Firmado:** Arquitectura VibeThink  
**Próximo Paso:** Implementar Builder.io (ya aprobado) + PayloadCMS (Trial para blog)
