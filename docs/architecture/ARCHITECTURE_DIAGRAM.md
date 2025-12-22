# 🏗️ Diagrama de Arquitectura: Referencias vs Monorepo

## 🎯 **Visión General**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│                     VIBETHINK ORCHESTRATOR ECOSYSTEM                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────┐          ┌──────────────────────────────────┐
│                                  │          │                                  │
│   REFERENCIAS EXTERNAS           │          │   NUESTRO MONOREPO               │
│   (Solo Lectura)                 │   ──►    │   (Controlamos 100%)             │
│                                  │          │                                  │
└──────────────────────────────────┘          └──────────────────────────────────┘
         │                                                  │
         │ Pueden actualizar                                │ Independiente
         │ (no nos afecta)                                  │ y estable
         │                                                  │
         ▼                                                  ▼
    
    ✅ Siguen funcionando                           ✅ Sigue funcionando
    ✅ Podemos consultarlas                         ✅ Producción estable
    ⏸️ Decidimos si sincronizar                     🚀 Control total
```

---

## 📚 **Referencias Externas (Actualizables)**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  C:\IA Marcelo Labs\                                                        │
│  ├─ bundui\shadcn-ui-kit-dashboard\     ← Bundui Original                  │
│  │  ├─ app\                                                                 │
│  │  │  ├─ default\                                                          │
│  │  │  ├─ analytics\                                                        │
│  │  │  └─ ...                                                               │
│  │  ├─ Puerto: 3050                                                         │
│  │  ├─ Script: scripts/start-bundui-reference.ps1                          │
│  │  ├─ Estado: ✅ PUEDE actualizar Bundui Team                             │
│  │  └─ Nosotros: ❌ SOLO LECTURA                                           │
│                                                                             │
│  ├─ shadcn-ui\ui\apps\v4\               ← Shadcn UI Reference               │
│  │  ├─ components\                                                          │
│  │  ├─ examples\                                                            │
│  │  ├─ Puerto: 3051                                                         │
│  │  ├─ Script: scripts/start-shadcn-reference.ps1                          │
│  │  ├─ Estado: ✅ PUEDE actualizar Shadcn Team                             │
│  │  └─ Nosotros: ❌ SOLO LECTURA                                           │
│                                                                             │
│  └─ xyflow\xyflow\examples\react\       ← XYFlow Reference                 │
│     ├─ examples\                                                            │
│     ├─ Puerto: 3052                                                         │
│     ├─ Script: scripts/start-reactflow-reference.ps1                       │
│     ├─ Estado: ✅ PUEDE actualizar XYFlow Team                             │
│     └─ Nosotros: ❌ SOLO LECTURA                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Consulta
                                    │ Comparación
                                    │ Inspiración
                                    │
                                    ▼
                         ⏸️ Sincronización OPCIONAL


                                    │
                                    │ SI decidimos sincronizar
                                    │ (Manual y evaluado)
                                    ▼
```

---

## 🏢 **Nuestro Monorepo (Estable)**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  C:\IA Marcelo Labs\vibethink-orchestrator-main\                           │
│  │                                                                          │
│  ├─ apps\                                                                   │
│  │  ├─ dashboard\                         ← App Principal (Next.js)        │
│  │  │  ├─ app\                                                              │
│  │  │  │  ├─ dashboard-bundui\            ← ESPEJO de Bundui (modificable) │
│  │  │  │  │  ├─ default\                                                    │
│  │  │  │  │  ├─ analytics\                                                  │
│  │  │  │  │  ├─ crm\                                                        │
│  │  │  │  │  ├─ layout.tsx                ← Bundui Sidebar                 │
│  │  │  │  │  └─ page.tsx                  ← Index de Bundui                │
│  │  │  │  │                                                                 │
│  │  │  │  └─ dashboard-vibethink\         ← PERSONALIZACIONES (libre)      │
│  │  │  │     ├─ crm\                                                        │
│  │  │  │     ├─ sales\                                                      │
│  │  │  │     ├─ ecommerce\                                                  │
│  │  │  │     ├─ layout.tsx                ← VibeThink Sidebar              │
│  │  │  │     └─ page.tsx                  ← Index de VibeThink             │
│  │  │  │                                                                    │
│  │  │  ├─ components.json                 ← Shadcn config (monorepo)       │
│  │  │  ├─ Puerto: 3005                                                      │
│  │  │  └─ Script: scripts/start-dashboard.ps1                              │
│  │  │                                                                       │
│  │  └─ bundui-reference\                  ← Referencia DENTRO monorepo     │
│  │     ├─ Puerto: 3004                    (NO modificar - es reference)    │
│  │     └─ ❌ SOLO LECTURA                                                  │
│  │                                                                          │
│  ├─ packages\                                                               │
│  │  ├─ ui\                                ← Shadcn Components (nuestros)   │
│  │  │  ├─ src\                                                              │
│  │  │  │  ├─ components\                  ← Componentes Shadcn adaptados   │
│  │  │  │  └─ styles\                                                        │
│  │  │  ├─ components.json                 ← Shadcn config (package)        │
│  │  │  └─ ✅ MODIFICABLE (es nuestro)                                      │
│  │  │                                                                       │
│  │  └─ utils\                             ← Utilidades compartidas         │
│  │     └─ ✅ MODIFICABLE                                                   │
│  │                                                                          │
│  ├─ scripts\                              ← Scripts operacionales           │
│  │  ├─ start-dashboard.ps1                                                  │
│  │  ├─ start-bundui-reference.ps1                                           │
│  │  ├─ compare-bundui-reference-vs-monorepo.js                              │
│  │  └─ ...                                                                  │
│  │                                                                          │
│  ├─ docs\                                 ← Documentación                   │
│  │  └─ architecture\                                                        │
│  │     ├─ REFERENCE_RULES.md                                                │
│  │     ├─ REFERENCE_SYNC_PROCESS.md                                         │
│  │     └─ ...                                                               │
│  │                                                                          │
│  ├─ AGENTS.md                             ← Reglas para AI                  │
│  ├─ package.json                          ← Monorepo config                 │
│  └─ Estado: ✅ SIEMPRE MONOREPO (estable e independiente)                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Flujo de Sincronización (Opcional)**

```
PASO 1: DETECTAR ACTUALIZACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Referencias Externas
    ┌─────────────────┐
    │  Bundui v1.0    │
    └─────────────────┘
            │
            │ Bundui Team actualiza
            ▼
    ┌─────────────────┐
    │  Bundui v2.0    │  ← Nueva versión disponible
    │  + Payment v2   │
    │  + New Charts   │
    └─────────────────┘
            │
            │
            ▼
    🔍 DETECCIÓN:
       node scripts/compare-bundui-reference-vs-monorepo.js
       
       Output:
       ✅ Payment v2 - NUEVO en Reference
       ✅ Charts mejorados - DIFERENTE
       ✅ Otros cambios detectados



PASO 2: EVALUAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ❓ ¿Es útil?           ❓ ¿Compatible?        ❓ ¿Vale la pena?
    ├─ ✅ SÍ              ├─ ✅ SÍ              ├─ ✅ SÍ
    │  Payment es útil    │  React 19 OK        │  2 horas trabajo
    │                     │  Next.js 15 OK      │  Alto beneficio
    │                     │  TypeScript OK      │
    └─ Decisión: ✅ SINCRONIZAR
    
    ❌ Ejemplo de NO sincronizar:
    └─ Cambio de puerto → ❌ NO (mantener 3005)



PASO 3: EJECUTAR SINCRONIZACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    1. Crear rama:
       git checkout -b sync-bundui-v2.0
    
    2. Copiar MANUALMENTE (revisar cada archivo):
       
       Reference (LEER)                    Monorepo (ESCRIBIR + ADAPTAR)
       ┌─────────────────┐                 ┌──────────────────────────┐
       │ bundui\         │                 │ apps\dashboard\app\      │
       │ app\payment-v2\ │  ─────────►     │ dashboard-bundui\        │
       │ ├─ page.tsx     │  Copiar +       │ payment-v2\              │
       │ ├─ components\  │  Adaptar        │ ├─ page.tsx              │
       │ └─ hooks\       │                 │ ├─ components\           │
       └─────────────────┘                 │ └─ hooks\                │
                                           │                          │
       Adaptaciones:                       │ Imports cambiados:       │
       ❌ import 'components/...'          │ ✅ '@vibethink/ui'       │
       ❌ href="/dashboard/..."            │ ✅ '/dashboard-bundui/'  │
       ❌ Types sin definir                │ ✅ Types agregados       │
                                           └──────────────────────────┘
    
    3. Probar:
       npm run build:dashboard
       npm run dev:dashboard
       # Verificar http://localhost:3005/dashboard-bundui/payment-v2
    
    4. Commit:
       git commit -m "sync(bundui): Payment v2 desde Reference"



PASO 4: DOCUMENTAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    CHANGELOG.md
    ────────────────────────────────────────
    ## [3.1.0] - 2025-12-19
    ### Changed
    - Sincronizado con Bundui Reference v2.0
      - Agregado: Payment v2 dashboard
      - Mejorado: Chart components
    
    ### Manual Adjustments
    - Adaptados imports a @vibethink/ui
    - Actualizadas rutas a /dashboard-bundui/*
    
    
    docs/sessions/SYNC_SESSION_2025-12-19.md
    ────────────────────────────────────────
    # Sincronización: Bundui v2.0 → Monorepo
    
    ## Sincronizado:
    - Payment v2 dashboard
    - Chart improvements
    
    ## NO Sincronizado:
    - Puerto (mantener 3005)
    - Tailwind config
    
    ## Testing: ✅ Exitoso
```

---

## ✅ **Ventajas de Esta Arquitectura**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  1. 🛡️ ESTABILIDAD                                                      │
│     ├─ Monorepo NUNCA se rompe por cambios externos                    │
│     ├─ Producción es predecible y confiable                            │
│     └─ Sin sorpresas desagradables                                      │
│                                                                         │
│  2. 🎯 CONTROL                                                          │
│     ├─ Decidimos QUÉ sincronizar                                       │
│     ├─ Decidimos CUÁNDO sincronizar                                    │
│     └─ Evaluamos CADA cambio                                           │
│                                                                         │
│  3. 📚 APRENDIZAJE                                                      │
│     ├─ Referencias siempre disponibles                                 │
│     ├─ Podemos comparar implementaciones                               │
│     └─ Inspiración para mejoras                                        │
│                                                                         │
│  4. 🔄 FLEXIBILIDAD                                                     │
│     ├─ Sincronizamos lo útil                                           │
│     ├─ Ignoramos lo incompatible                                       │
│     └─ Adaptamos según necesidad                                       │
│                                                                         │
│  5. 🚀 INDEPENDENCIA                                                    │
│     ├─ No dependemos de timing de otras teams                          │
│     ├─ No nos afectan breaking changes externos                        │
│     └─ Nuestro roadmap es nuestro                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🚨 **Reglas Críticas (Nunca Violar)**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ✅ SIEMPRE:                                                             │
│  ├─ Referencias son SOLO LECTURA                                        │
│  ├─ Monorepo es SIEMPRE MONOREPO                                        │
│  ├─ Sincronización es OPCIONAL                                          │
│  ├─ Evaluamos CADA cambio antes de traer                                │
│  └─ Documentamos TODO                                                   │
│                                                                          │
│  ❌ NUNCA:                                                               │
│  ├─ Modificar referencias directamente                                  │
│  ├─ Copiar automáticamente sin revisar                                  │
│  ├─ Sincronizar sin testing                                             │
│  ├─ Asumir que todo es compatible                                       │
│  └─ Cambiar estructura de monorepo                                      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 📖 **Documentación Relacionada**

- `REFERENCE_RULES.md` - Reglas completas de referencias
- `REFERENCE_SYNC_PROCESS.md` - Workflow de sincronización
- `AGENTS.md` - Filosofía arquitectónica
- `CHANGELOG.md` - Historial de sincronizaciones

---

**Última actualización**: 2025-12-18  
**Estado**: ✅ DOCUMENTO ACTIVO  
**Versión**: 1.0






