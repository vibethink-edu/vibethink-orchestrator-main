# Project Mission
This project is a **Voice Agent Application** featuring "Andrés Cántor", designed to provide an interactive, real-time conversational experience focused on the World Cup 2026. It leverages Google's Gemini models for intelligence and ElevenLabs for high-quality voice synthesis, integrated into a React frontend.

# Tech Stack
The following technologies are the **official standards** for this project. Do not introduce new frameworks or libraries without explicit user approval.

- **Core**: React 19, TypeScript 5.8
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (Utility-first)
- **Backend**: 
  - **Express 4.21.2** (Node.js API Gateway)
  - ⚠️ **IMPORTANTE**: Usamos Express 4 (no Express 5) porque Express 5 tiene problemas de compatibilidad en Digital Ocean Droplets. Express 4 es estable y probado en producción.
- **AI/ML**: 
  - `@google/genai` (Gemini Multimodal Live API - Model: `gemini-2.0-flash-exp`)
  - ElevenLabs WebSocket API (Text-to-Speech)
- **State Management**: React Hooks (`useState`, `useRef`, `useContext` if needed) - *Keep it simple.*
- **Audio**: Native Web Audio API (`AudioContext`, `AudioWorklet` for input, `AudioBufferSourceNode` for output).

## 🚨 CRITICAL: Stack Compatibility

**BEFORE suggesting ANY dependency changes, READ:**
- `STACK_COMPATIBILITY.md` - Compatibilities, warnings, and prohibited dependencies

**Key Rules:**
- ❌ NEVER install Express 5 (use 4.21.2)
- ❌ NEVER mix Vite + Webpack
- ❌ NEVER install `next` in Vite project
- ❌ NEVER install `vite` in Next.js project
- ⚠️ ALWAYS verify compatibility before suggesting updates

**If unsure:** Ask user before installing/updating dependencies.

# Architectural Guidelines

## Directory Structure
- **/components**: Reusable UI components. Must be functional and typed.
- **/services**: Business logic, API calls, and complex state handling (e.g., `voiceService.ts`). Keep UI components dumb.
- **/types**: Shared TypeScript interfaces and types.
- **/assets**: Static assets (images, fonts).
- **/docs**: ALL technical documentation MUST go here. See "Documentation Rules" below.

## Anti-Monolith Rules (AI Assistants)
- Always propose/confirm file-tree + responsibilities before writing code for new features (components in `/components`, hooks in `/hooks`, services in `/services`, types in `/types`).
- Enforce SRP: avoid files >200 lines; split when a file mixes concerns or grows beyond that size.
- One visual component per file; helpers only if tiny (<20 lines) and local. No API calls inside UI components—move to services/hooks.
- Break up large `useEffect` blocks; if an effect handles multiple concerns or exceeds ~30 lines, extract helpers or a hook.
- Deliver work in small pieces: start with types and services, then hooks, then UI. Do not dump full end-to-end code in one response unless explicitly requested.

## Documentation Rules

**CRITICAL:** The root directory MUST remain clean and organized.

### Regla de Organización de Documentación

**Principio:** La raíz debe contener SOLO archivos esenciales según categorías funcionales, no un número fijo.

**Categorías permitidas en raíz:**
- **Navigation files** (finding information): `README.md`, `DOCS_INDEX.md`, `QUICK_START.md`
- **Normative files** (rules & structure): `AGENTS.md`, `ORGANIZATION.md`
- **Reference files** (quick lookup): `VERSIONING.md`, `TROUBLESHOOTING.md`
- **History files** (tracking changes): `CHANGELOG.md`

**Regla:** Si un archivo `.md` NO pertenece a estas categorías → debe ir a `docs/` con subdirectorio apropiado.

**Archivos actuales en raíz:**
- `README.md` - Project introduction
- `AGENTS.md` - Rules for AI agents (this file)
- `CHANGELOG.md` - Version history
- `VERSIONING.md` - Version management quick reference
- `DOCS_INDEX.md` - Documentation map for agents
- `ORGANIZATION.md` - Project structure rules
- `QUICK_START.md` - Quick start guide
- `TROUBLESHOOTING.md` - Common problems & solutions

All other documentation is **technical** and belongs in `docs/`.

### ❌ NEVER Create in Root:
- Technical documentation (goes to `docs/`)
- Implementation guides (goes to `docs/`)
- Deployment guides (goes to `docs/`)
- API documentation (goes to `docs/`)
- Session reports (goes to `docs/sessions/`)
- Any other `.md` files

### 📁 Documentation Structure:
```
docs/
├── core/                   ← Core system documentation
│   ├── ARCHITECTURE_V3.md
│   ├── MIGRATION_V2_TO_V3.md
│   └── VERSIONING_POLICY.md
├── voice-providers/        ← Voice provider documentation
│   ├── ELEVENLABS.md
│   ├── CARTESIA.md
│   ├── ULTRAVOX.md
│   └── GEMINI.md
├── deployment/             ← Deployment guides
│   ├── DEPLOYMENT.md       ← Master guide (consolidated)
│   ├── DIGITALOCEAN_DOCKER_DEPLOY.md
│   └── PRODUCTION_SCALABILITY.md
├── ui-ux/                  ← UI/UX documentation
│   ├── UX_UI_MASTER_GUIDE.md
│   ├── CSS_DESIGN_SYSTEM.md
│   ├── SHADCN_UI_GUIDE.md
│   ├── IMAGE_OPTIMIZATION_GUIDE.md
│   ├── VOICE_ORB_GUIDE.md
│   ├── PODCAST_BANNER_MANAGEMENT.md
│   └── THEME_TROUBLESHOOTING.md
├── development/            ← Development guides
│   ├── STYLE_GUIDE.md
│   ├── TTS_MASTER_GUIDE.md
│   ├── DEMO_MODE_METHODOLOGY.md
│   └── VERIFICATION_SYSTEMS_EXPLAINED.md
├── operations/             ← Operations & troubleshooting
│   ├── TROUBLESHOOTING_PM2.md
│   ├── PORT_CONVENTIONS.md
│   ├── TAILWIND_CDN_WARNING.md
│   ├── WORKTREES_EXPLAINED.md
│   └── WORKTREES_QUICK_REFERENCE.md
├── setup/                  ← Setup guides
│   ├── ENV_SETUP_INSTRUCTIONS.md
│   └── GUIA_RAPIDA_WINDOWS.md
├── security/               ← Security docs
│   └── SECURITY_ROTACION_KEY.md
└── sessions/               ← Historical session reports
    └── SESSION_WORKTREES_2025-11-28.md
```

### 🚨 Enforcement:
- **Before creating any `.md` file:** Check if it belongs in root (see allowed list)
- **If not in allowed list:** Create in `docs/` with appropriate subfolder
- **If consolidation is possible:** Merge into existing master docs
- **Update references:** Always update `DOCS_INDEX.md` and `docs/README.md`

### 📝 When to Consolidate:
- If creating a guide that overlaps with existing docs → Consolidate
- If creating multiple related docs → Create one master doc
- If doc is < 200 lines and related to existing doc → Merge
- **Example:** Don't create `DEPLOYMENT_SECURITY.md` + `DEPLOYMENT_STEPS.md` → Use single `docs/DEPLOYMENT.md`

## Configuration & Security
- **Credentials**: SENSITIVE KEYS (Gemini API, ElevenLabs) must be stored in `.env.local`.
- **Git**: Never commit `.env` or `.env.local`. Use `.env.example` for templates.
- **Validation**: Services must validate API keys before attempting connections to prevent silent failures.
- **Backend Proxy Pattern (BEST PRACTICE)**:
  - **DO NOT** expose API keys in the browser/frontend for production APIs
  - **DO** create backend proxy servers to handle API calls server-side
  - **Example**: The Ultravox integration uses `server/ultravox-proxy.js` (port 3001) to hide the API key from the browser
  - **Pattern**:
    ```
    Frontend → Backend Proxy → External API
    (no key)    (has key)       (receives authenticated request)
    ```
  - **Current Implementation**: `npm run proxy` starts Ultravox proxy at port 3001
  - **TODO**: Apply this pattern to ALL production API keys (ElevenLabs, Cartesia, Google GenAI)
  - **Reference**: See `server/ultravox-proxy.js` for implementation example
- **⚠️ CRITICAL: Tailwind CDN**: 
  - **DO NOT** remove the Tailwind CDN from `index.html` without explicit user approval
  - **Reason**: Attempted migration to Tailwind v4 native build broke all styles (incident: 2025-11-28)
  - **Current Status**: CDN is stable and working - it's NOT technical debt
  - **Documentation**: See `docs/TAILWIND_CDN_WARNING.md` for full incident report and migration guide
  - **Rule**: Always ask user before attempting architectural changes to styling system

## Communication
- **Components to Services**: Components should call service functions or hooks.
- **Parent to Child**: Props.
- **Global State**: Minimal. Use Context only if strictly necessary. Prefer lifting state up.
  - **Smart Batching**: Buffer text chunks to ensure natural speech flow (avoid sending single words to TTS).

# Workflow for Agents

## General Workflow
1. **Analyze**: Read relevant files (`AGENTS.md`, `DOCS_INDEX.md`, current code) to understand context.
2. **Plan**: Create a short plan before making changes.
3. **Implement**: Write clean, documented code following project standards.
4. **Verify**: Ensure the application builds (`npm run build`) and runs (`npm run dev`) without errors.
5. **Document**: Update `CHANGELOG.md` and `types.ts` (versioning) for significant changes.

## Pre-Commit Checklist (OBLIGATORIO)

**IMPORTANTE:** Antes de ejecutar `git commit`, el agente DEBE seguir este proceso:

1. **❓ Pregunta Obligatoria al Usuario:**
   ```
   ¿Actualizamos la versión en types.ts antes de hacer commit?

   Cambios realizados:
   - [Lista breve de cambios]

   Opciones:
   - Sí: Actualizar versión + CHANGELOG
   - No: Commit sin versión (solo para cambios menores/docs)
   ```

2. **✅ Si el usuario responde "Sí":**
   - Abrir `types.ts` y actualizar:
     - `APP_VERSION_NUMBER` (incrementar MAJOR.MINOR.PATCH según tipo de cambio)
     - `APP_VERSION_DESCRIPTOR` (descripción breve 3-5 palabras)
   - Abrir `CHANGELOG.md` y agregar entrada nueva:
     ```markdown
     ## [X.Y.Z] - YYYY-MM-DD
     ### Added/Changed/Fixed
     - Descripción del cambio
     ```
   - Ejecutar `npm run build` para verificar que compila sin errores
   - Revisar que `components/Footer.tsx` mostrará la versión correcta

3. **✅ Si el usuario responde "No":**
   - Proceder con commit directamente
   - Solo válido para: typos, ajustes de formato, docs menores, logs de debug

4. **🚫 Nunca hacer commit sin pregunta previa**
   - Esta pregunta es OBLIGATORIA en todos los casos
   - Incluso si el agente cree que el cambio es menor, debe preguntar

**Referencia:** Ver `docs/VERSION_WORKFLOW.md` para detalles completos del proceso de versionado.

## Version Management

**Single Source of Truth**: All version information is defined in `types.ts`:
- `APP_VERSION_NUMBER`: Semantic version (e.g., '2.7.0')
- `APP_VERSION_DESCRIPTOR`: Short description (e.g., 'Connection & Duplication Fix')
- `APP_VERSION`: Auto-generated full string (e.g., 'V2 (Connection & Duplication Fix)')

**How to Update Version:**
1. Update `APP_VERSION_NUMBER` in `types.ts` (increment MAJOR.MINOR.PATCH)
2. Update `APP_VERSION_DESCRIPTOR` in `types.ts` (brief description)
3. `APP_VERSION` auto-generates (Footer will update automatically)
4. Add entry to `CHANGELOG.md` using format: `## [APP_VERSION_NUMBER] - YYYY-MM-DD`
5. Commit changes together

**Files that use version:**
- `components/Footer.tsx` - Imports `APP_VERSION` (auto-updates)
- `CHANGELOG.md` - Manual entry (use `APP_VERSION_NUMBER` from `types.ts`)
- `types.ts` - Source of truth (update here first)

---

# Design Mode (Modo Diseño Seguro)

## 🎨 Propósito

**Design Mode** es un modo de trabajo que permite experimentar con UI/UX sin riesgo de romper backend, base de datos o lógica de negocio.

**Cuándo usar:**
- Iteraciones rápidas de diseño
- Cambios de estilos/layout
- Pruebas de UX
- Experimentos visuales

**Cuándo NO usar:**
- Cambios en lógica de negocio
- Modificaciones de API
- Cambios en base de datos
- Nuevas features con backend

---

## 🚨 Reglas Estrictas de Design Mode

### ✅ PERMITIDO

**Archivos que puedes modificar:**
- `src/components/**/*.tsx` - Componentes de UI
- `src/components/**/*.css` - Estilos
- `src/assets/**/*` - Imágenes, íconos
- `tailwind.config.js` - Configuración de Tailwind
- `index.css` - Estilos globales

**Operaciones permitidas:**
- Cambiar estilos (Tailwind, CSS)
- Modificar layout y estructura visual
- Agregar/quitar componentes visuales
- Cambiar animaciones
- Ajustar responsive design
- Usar datos MOCK (falsos) para ejemplos

### ❌ PROHIBIDO

**Archivos que NO puedes tocar:**
- `src/services/**/*` - Lógica de negocio
- `server/**/*` - Backend
- `src/types.ts` - Tipos (excepto UI types)
- `.env*` - Configuración
- `package.json` - Dependencias

**Operaciones prohibidas:**
- Modificar llamadas a APIs
- Cambiar lógica de estado
- Tocar servicios de voz
- Modificar integración con Gemini/ElevenLabs
- Cambiar flujo de datos

---

## 📝 Prompt de Design Mode

**Copiar y pegar este prompt cuando quieras experimentar con UI:**

```
Actúa en MODO DISEÑO SEGURO:

REGLAS ESTRICTAS:
1. Solo modifica archivos de UI (src/components/, src/assets/)
2. NO toques backend (server/, src/services/)
3. NO modifiques lógica de negocio o estado
4. Usa datos MOCK (falsos) en constantes locales
5. Enfócate SOLO en estilos, layout y UX

STACK PERMITIDO:
- React components (JSX/TSX)
- Tailwind CSS
- CSS modules
- Framer Motion (animaciones)
- Imágenes y assets

EJEMPLO DE DATOS MOCK:
```typescript
// ✅ CORRECTO en Design Mode
const MOCK_USER = {
  name: "Demo User",
  avatar: "/placeholder.jpg",
  messages: [
    { text: "Hola Andrés!", timestamp: "10:30 AM" },
    { text: "¿Cómo estás?", timestamp: "10:31 AM" }
  ]
};

// Usar en componente
<ChatMessage user={MOCK_USER} />
```

PROHIBIDO:
```typescript
// ❌ INCORRECTO en Design Mode
const user = await fetchUserFromDB();
const messages = await voiceService.getHistory();
```

OBJETIVO: Iterar rápidamente en diseño sin romper nada.
```

---

## 🎯 Workflow de Design Mode

### **Paso 1: Activar Design Mode**

1. Abrir chat nuevo en Cursor
2. Pegar prompt de Design Mode (arriba)
3. Especificar qué quieres cambiar

**Ejemplo:**
```
[Pegar prompt de Design Mode]

Quiero mejorar el ChatColumn:
- Hacer los mensajes más grandes
- Agregar avatares
- Mejorar el scroll
- Usar colores más vibrantes
```

### **Paso 2: Iterar**

La IA solo modificará archivos de UI y usará datos MOCK.

**Ejemplo de iteración:**
```
Usuario: "Haz los mensajes más grandes"
IA: [Modifica ChatColumn.tsx con estilos más grandes]

Usuario: "Agrega avatares"
IA: [Agrega avatares usando MOCK_USER.avatar]

Usuario: "Prueba con colores azules"
IA: [Cambia Tailwind classes a blue-*]
```

### **Paso 3: Verificar**

```bash
npm run dev
```

Verifica que:
- ✅ Los cambios visuales se ven bien
- ✅ No hay errores en consola
- ✅ El backend sigue funcionando
- ✅ Los servicios de voz no se rompieron

### **Paso 4: Commit (Opcional)**

Si te gusta el resultado:

```bash
git add src/components/
git commit -m "UI: Mejoras visuales en ChatColumn"
```

---

## 💡 Ejemplos de Uso

### **Ejemplo 1: Cambiar Colores del Chat**

**Prompt:**
```
[Design Mode]

Cambia el ChatColumn a tema oscuro:
- Fondo negro
- Texto blanco
- Mensajes del usuario en azul
- Mensajes del asistente en gris oscuro
```

**Resultado:** Solo se modifican clases de Tailwind en `ChatColumn.tsx`

---

### **Ejemplo 2: Agregar Animaciones**

**Prompt:**
```
[Design Mode]

Agrega animaciones suaves:
- Fade in cuando aparecen mensajes nuevos
- Slide in desde la derecha para mensajes del usuario
- Slide in desde la izquierda para mensajes del asistente
```

**Resultado:** Se agregan animaciones con Framer Motion sin tocar lógica

---

### **Ejemplo 3: Responsive Design**

**Prompt:**
```
[Design Mode]

Haz el HeroSection responsive:
- En mobile: columnas apiladas verticalmente
- En tablet: 2 columnas
- En desktop: 3 columnas (actual)
```

**Resultado:** Solo se modifican clases responsive de Tailwind

---

## 🚨 Qué Hacer Si Algo Se Rompe

### **Si el diseño se ve mal:**

1. Revertir cambios:
```bash
git checkout -- src/components/
```

2. Reiniciar con prompt más específico

### **Si el backend se rompió (NO DEBERÍA PASAR):**

1. Verificar que NO se modificaron archivos de `services/` o `server/`
2. Si se modificaron, revertir:
```bash
git checkout -- src/services/ server/
```

3. Reportar a usuario que Design Mode fue violado

---

## ✅ Checklist de Design Mode

Antes de salir de Design Mode, verificar:

- [ ] Solo se modificaron archivos de UI
- [ ] No se tocó backend ni services
- [ ] Se usaron datos MOCK (no llamadas a API)
- [ ] `npm run dev` funciona sin errores
- [ ] Los servicios de voz siguen funcionando
- [ ] El chat sigue respondiendo

---

# Key Components & Services

## Voice Modes Architecture

The application supports **7 voice modes**, each with isolated configuration:

| Modo | LLM | TTS | Descripción |
|------|-----|-----|-------------|
| 1 - **Pro (PVC)** | Gemini | ElevenLabs Pro Clone | Alta calidad y estabilidad |
| 2 - **Instant (IVC)** | Gemini | ElevenLabs Instant Clone | Baja latencia |
| 3 - **Google Native** | Gemini | Google Cloud TTS | Sin API externa |
| 4 - **Ultravox Native** | Ultravox | Ultravox | LLM + Voice integrado |
| 5 - **Ultravox + ElevenLabs** | Ultravox | ElevenLabs | Híbrido |
| 6 - **Cartesia (IVP)** | Gemini | Cartesia Sonic | Ultra baja latencia |
| 7 - **Cartesia Pro (PVP)** | Gemini | Cartesia Pro | Máxima calidad |

**IMPORTANTE:** Cada modo mantiene configuración aislada (regla de Voice Mode Isolation).

## Core Services

### `services/voiceService.ts`
**Propósito:** Orquestador principal de interacciones de voz

**Responsabilidades:**
- Integración con Gemini (conversational AI)
- Speech-to-text (STT) vía Web Speech API
- Text-to-speech (TTS) vía ElevenLabs/Cartesia
- Streaming de mensajes en tiempo real
- Detección y activación de CTAs

**Funciones clave:**
- `initialize()` - Configura servicios
- `startRecording()` - Activa micrófono
- `stopRecording()` - Detiene mic, procesa transcripción
- `sendToGemini()` - Envía input del usuario a Gemini
- `streamToElevenLabs()` - Stream de texto a ElevenLabs TTS
- `streamToCartesia()` - Stream de texto a Cartesia TTS

**Documentación:** Ver `DOCS_INDEX.md` para guías específicas por modo.

### `services/cartesiaService.ts`
**Propósito:** Gestión de Cartesia WebSocket streaming

**Características:**
- Buffer prosódico (slicing inteligente de oraciones)
- Extracción de emociones/estilo del texto
- Procesamiento de chunks de audio PCM
- Lógica de auto-reconexión

**Funciones clave:**
- `streamTextToAudio()` - Función principal de streaming
- `CartesiaStyleProcessor` - Extrae cues emocionales

**Documentación:** `docs/CARTESIA.md`

### `services/prosodicBufferManager.ts`
**Propósito:** Sistema avanzado de buffering para ElevenLabs

**Características:**
- Chunking a nivel de oración
- Mecanismo de forced flush
- Auto-mode para streaming continuo sin cortes
- Manejo inteligente de límites de puntuación

**Clase principal:**
- `ProsodicBufferManager` - Gestiona acumulación de texto y lógica de flush

**Documentación:** `docs/ELEVENLABS.md`

### `services/ultravoxService.ts`
**Propósito:** Integración con Ultravox.ai

**Características:**
- Comunicación en tiempo real basada en WebRTC
- Síntesis de voz + LLM integrados
- Conversational AI de baja latencia
- Soporte para Voice IDs personalizados

**Documentación:** `docs/ULTRAVOX.md`

### `services/useUltravoxConversation.ts`
**Propósito:** React hook para gestión de conversaciones Ultravox

**Características:**
- Gestión del ciclo de vida de llamadas (join/leave)
- Manejo de estado del micrófono
- Streaming de transcripciones
- Control de reproducción de audio

## UI Components

### `components/HeroSection.tsx`
**Propósito:** Landing page principal con layout de 3 columnas

**Columnas:**
1. **Agent Column** - Selección de modo de voz y configuración
2. **Chat Column** - Interfaz de conversación en tiempo real
3. **CTA Column** - Promociones de sponsors y formularios interactivos

**Responsabilidades:**
- Orquestación de modos de voz
- Gestión de estado de configuración
- Coordinación entre columnas

### `components/ChatColumn.tsx`
**Propósito:** Interfaz principal de chat

**Características:**
- Renderizado de mensajes en tiempo real
- Diferenciación User/Assistant
- Indicadores de typing
- Historial de transcripciones scrollable
- Panel de debug logs (colapsable)

### `components/AgentColumn.tsx`
**Propósito:** Panel de configuración de voz

**Características:**
- Selector de modo de voz (7 modos)
- Settings de TTS (stability, similarity, style)
- Configuración de API keys
- Preview de settings en tiempo real

### `components/CtaColumn.tsx`
**Propósito:** Gestor de contenido promocional

**Características:**
- Renderizado dinámico de CTAs basado en sponsors mencionados
- Formularios interactivos (registro individual/grupal)
- Tracking de estado de submissions
- Display de mensajes de bienvenida

## Data Layer

### `data/knowledgeBase.ts`
**Propósito:** Pares de Q&A sobre Andrés Cántor

**Contenido:**
- Carrera de broadcasting
- Estilo de narración
- Momentos icónicos
- Historia de Copas del Mundo

**Uso:** Enriquecer respuestas de Gemini con información contextual.

### `data/prompts.ts`
**Propósito:** Templates de prompts centralizados

**Contenido:**
- System prompts para diferentes modos de voz
- Rasgos de personalidad (apasionado, energético, knowledgeable)
- Guías de conversación
- Triggers de activación de CTAs

### `data/tools.ts`
**Propósito:** Definiciones de function calling para Gemini

**Funciones:**
- `activateCTA` - Dispara promociones de sponsors
- `getMatchInfo` - Recupera datos de partidos
- Tool schemas para respuestas estructuradas

---

# Debugging Guide

Para debugging, consultar `DOCS_INDEX.md` sección "Debugging / Troubleshooting" que incluye:

## Problemas Comunes

### Audio cortado/pausas (ElevenLabs)
**Leer:** `docs/ELEVENLABS.md`

### Configuración Cartesia errónea
**Leer:** `docs/CARTESIA.md`

### Problemas con Ultravox
**Leer:** `docs/ULTRAVOX.md` (sección "Errores Comunes")

### Versión no se actualiza
**Leer:** `VERSIONING.md` + `docs/VERSIONING_POLICY.md`

### Micrófono no funciona
**Leer:** `README.md` (sección "Solución de Problemas")

---

# Documentation Map

**IMPORTANTE:** Antes de trabajar en cualquier área, consultar `DOCS_INDEX.md` para saber qué documentos leer.

Este archivo (`AGENTS.md`) es la **fuente de verdad normativa** (reglas y workflow).
Los docs técnicos en `docs/` son **fuentes de verdad descriptivas** (implementaciones específicas).

**Jerarquía de lectura:**
1. `AGENTS.md` (este archivo) - Reglas generales
2. `DOCS_INDEX.md` - Mapa de navegación
3. Docs específicos del área
4. Código fuente

---

# Git Workflow & Worktrees

## Git Worktrees Best Practices

Este proyecto utiliza **git worktrees** para trabajar en múltiples ramas simultáneamente sin conflictos.

### ⚠️ Prevención de Corrupción de Worktrees

**IMPORTANTE:** Cursor y otros editores pueden corromper worktrees si no se manejan correctamente.

**Reglas para evitar corrupción:**

1. **Nunca editar archivos del worktree directamente desde el editor principal**
   - ❌ NO abrir `C:\Users\marce\.claude-worktrees\...` en Cursor/VSCode directamente
   - ✅ SÍ usar Claude Code que maneja worktrees automáticamente

2. **Antes de cerrar sesión:**
   ```bash
   # Verificar que no hay cambios sin commit
   git status

   # Si hay cambios, commitear o stashear
   git add -A && git commit -m "WIP: descripción"
   # O
   git stash save "descripción del WIP"
   ```

3. **Si el worktree se corrompe:**
   ```bash
   # 1. Ir al repositorio principal
   cd "C:\IA Marcelo Labs\v3-andres-cantor-fdp-voice-agent"

   # 2. Listar worktrees
   git worktree list

   # 3. Remover worktree corrupto
   git worktree remove brave-khorana --force

   # 4. Limpiar referencias
   git worktree prune

   # 5. Recrear worktree limpio
   git worktree add C:\Users\marce\.claude-worktrees\v3-andres-cantor-fdp-voice-agent\brave-khorana brave-khorana
   ```

4. **Limpieza periódica:**
   ```bash
   # Cada semana, verificar integridad
   git fsck

   # Limpiar worktrees obsoletos
   git worktree prune
   ```

### 📡 Git con Proxy

**Configuración del servidor con proxy:**

Este servidor utiliza un proxy corporativo. Git debe configurarse correctamente para push/pull.

**Configurar proxy globalmente:**
```bash
# HTTP Proxy
git config --global http.proxy http://proxy.ejemplo.com:8080

# HTTPS Proxy
git config --global https.proxy https://proxy.ejemplo.com:8080

# Si requiere autenticación
git config --global http.proxy http://usuario:password@proxy.ejemplo.com:8080
```

**Verificar configuración:**
```bash
git config --global --list | grep proxy
```

**Desactivar proxy temporalmente:**
```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

**Configurar proxy solo para este repositorio:**
```bash
cd /ruta/al/repo
git config http.proxy http://proxy.ejemplo.com:8080
```

### 🚀 Scripts de Git (package.json)

**IMPORTANTE:** No hay scripts de git en `package.json` por diseño.

**Razones:**
1. Git push/pull debe hacerse **manualmente** para control total
2. Evita commits/push accidentales
3. Permite revisar cambios antes de push
4. Compatible con workflow de Pre-Commit Checklist

**Workflow manual recomendado:**
```bash
# 1. Verificar estado
git status

# 2. Agregar cambios
git add -A

# 3. Commit (siguiendo Pre-Commit Checklist)
git commit -m "mensaje descriptivo"

# 4. Push con proxy (si es necesario)
# Si el proxy está configurado globalmente, simplemente:
git push origin brave-khorana

# Si necesitas especificar proxy para este push:
http_proxy=http://proxy:8080 git push origin brave-khorana
```

### 🔑 Autenticación con GitHub

**Personal Access Token (PAT):**

El remote usa un PAT embebido en la URL:
```
https://ghp_TOKEN@github.com/vibethink-edu/Futbol-de-Primera-v2.git
```

**⚠️ NUNCA compartir el PAT**
- El PAT actual: `ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (placeholder - usar PAT real en producción)
- Debe mantenerse privado
- Si se expone, generar uno nuevo en GitHub Settings → Developer Settings → Personal Access Tokens

**Renovar PAT:**
```bash
# Si el PAT expira, actualizar remote:
git remote set-url origin https://NUEVO_PAT@github.com/vibethink-edu/Futbol-de-Primera-v2.git
```

### 📊 Estructura de Worktrees Actual

```
Main Repo: C:\IA Marcelo Labs\v3-andres-cantor-fdp-voice-agent\
    Branch: agent-hold
    Commit: cbc59ff

Worktree: C:\Users\marce\.claude-worktrees\...\brave-khorana\
    Branch: brave-khorana
    Commit: b3120de (HEAD - commit reciente de docs)
```

### ✅ Checklist de Mantenimiento de Worktrees

**Diariamente (al terminar sesión):**
- [ ] `git status` - Verificar que no hay cambios sin commit
- [ ] Commit o stash de cambios pendientes

**Semanalmente:**
- [ ] `git worktree list` - Verificar worktrees activos
- [ ] `git worktree prune` - Limpiar worktrees obsoletos
- [ ] `git fsck` - Verificar integridad del repositorio

**Mensualmente:**
- [ ] Revisar PAT (si está próximo a expirar)
- [ ] Limpiar ramas obsoletas: `git branch -d rama-vieja`
- [ ] Backup del repositorio principal

### 🚨 Troubleshooting

**Error: "fatal: 'brave-khorana' is already checked out"**
```bash
git worktree remove brave-khorana --force
git worktree prune
git worktree add ... brave-khorana
```

**Error: "fatal: unable to access... Proxy error"**
```bash
# Verificar proxy
git config --global --list | grep proxy

# Configurar proxy correcto
git config --global http.proxy http://proxy:8080
```

**Error: "fatal: Authentication failed"**
```bash
# PAT expirado o inválido
git remote set-url origin https://NUEVO_PAT@github.com/...
```
