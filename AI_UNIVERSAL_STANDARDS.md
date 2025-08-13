# AI Universal Standards - VThink 1.0

**🚨 CRÍTICO: Este archivo DEBE ser leído por TODAS las IAs antes de hacer cambios**

## 🔄 **UNIVERSAL AI SESSION CONTINUITY PROTOCOL**

### **🤖 APLICABLE A TODAS LAS IAs (Claude, Gemini, Cursor, GPT, etc.)**

#### **🌅 PROTOCOLO DE SALUDO UNIVERSAL:**
**Cuando usuario saluda ("Buenos días", "Hola", etc.) → EJECUTAR AUTOMÁTICAMENTE:**

```bash
# 1. OBLIGATORIO - Estado del repositorio (CUALQUIER IA puede hacer)
git status --short                    # Mostrar cambios pendientes
git log --oneline -n 3               # Mostrar últimos 3 commits

# 2. CRÍTICO - Leer contexto de sesión anterior
# Si existe SESSION_SUMMARY.md, leerlo COMPLETO para contexto
# Si no existe, informar que es nueva sesión limpia

# 3. OPCIONAL - Si disponible, validación rápida
npm run validate:quick               # Solo si existe el comando

# 4. CRÍTICO - Mostrar VHELP Command Center
npm run vhelp                        # Sistema interactivo de comandos con seguridad

# 5. RECORDAR: De ahora en adelante, SIEMPRE consultar VHELP antes de ejecutar comandos
# 6. PREGUNTAR al usuario: "¿En qué quieres que trabajemos hoy?"
```

#### **🌙 PROTOCOLO DE DESPEDIDA UNIVERSAL:**
**Cuando usuario se despide ("hasta mañana", "terminamos", etc.) → SIEMPRE:**

```bash
# 1. OBLIGATORIO - PREGUNTAR PRIMERO (CUALQUIER IA):
"¿Quieres que haga push del progreso a git y GitHub antes de terminar?"

# 2. Si usuario responde SÍ, ejecutar según capacidades:
# - PowerShell disponible: ./save-progress.ps1 "Descripción trabajo"
# - Solo bash: git add -A && git commit -m "session end" && git push
# - Crear resumen: ./create-session-summary.ps1 "Descripción trabajo"
```

#### **📋 ARCHIVOS CLAVE PARA CONTINUIDAD:**
- **SESSION_SUMMARY.md** - Contexto completo de última sesión
- **save-progress.ps1** - Script automatizado de guardado
- **create-session-summary.ps1** - Generador de resumen de sesión

---

## 🚨 **REGLAS ABSOLUTAS - NUNCA VIOLAR**

### **📦 DEPENDENCY MANAGEMENT RULES (OBLIGATORIAS):**
```json
// ✅ MANDATORY: Use exact versions only
"next": "15.3.4"  // ✅ YES - exact version
"@radix-ui/react-tooltip": "1.0.7"  // ✅ YES - exact version

// ❌ FORBIDDEN: Never use caret versions
"next": "^15.3.4"  // ❌ NO - causes instability
"@radix-ui/react-tooltip": "^1.0.7"  // ❌ NO - causes instability
```

### **🏗️ MONOREPO RULES (OBLIGATORIAS):**
```bash
# ✅ MANDATORY: Install only in root for shared dependencies
npm install clsx tailwind-merge --save  # ✅ ONLY in root

# ❌ FORBIDDEN: Never install in both places
npm install clsx --save  # ❌ NO in apps/dashboard
npm install clsx --save  # ❌ NO in root (duplicate)
```

### **🛡️ STABILITY RULES (OBLIGATORIAS):**
```typescript
// ✅ MANDATORY: Never change working code
// If it works, DON'T TOUCH IT

// ❌ FORBIDDEN: Don't "improve" working code
// Don't update versions "just because"
// Don't add dependencies "to fix errors"
```

### **📋 MANDATORY CHECKLIST BEFORE ANY CHANGE:**
1. ✅ **READ** existing rules in README.md lines 47-60
2. ✅ **VALIDATE** if change is really necessary
3. ✅ **USE** exact versions (no ^)
4. ✅ **INSTALL** only where appropriate
5. ✅ **DON'T TOUCH** working code

## 🎯 **OBJETIVO**
Este archivo centraliza las reglas que **TODAS las IAs** (Claude, Gemini, Cursor, etc.) deben seguir para evitar dañar el proyecto.

## 📋 **PROTOCOLO OBLIGATORIO - ANTES DE CUALQUIER CAMBIO**

### **1. VALIDACIÓN PREVIA (SIEMPRE)**
```bash
# ✅ SIEMPRE ejecutar ANTES de cambios
npm run validate:quick        # Validación rápida
npm run validate:architecture # Validación de arquitectura
```

### **2. LECTURA DE DOCUMENTACIÓN EXISTENTE**
**REGLAS CRÍTICAS:**
- ✅ **LEER** `QUICK_REFERENCE_RULES.md` antes de cualquier cambio
- ✅ **LEER** `ARCHITECTURE_RULES.md` para cambios estructurales
- ✅ **CONSULTAR** `CLAUDE.md` para detalles técnicos
- ✅ **VERIFICAR** `.cursorrules` para patrones de desarrollo

### **3. VALIDACIÓN POSTERIOR (SIEMPRE)**
```bash
# ✅ SIEMPRE ejecutar DESPUÉS de cambios
npm run validate:universal    # Validación completa
npm run validate:architecture # Verificar que no se rompió la arquitectura
```

## 🏗️ **ARQUITECTURA - REGLAS ABSOLUTAS**

### **Estructura del Monorepo:**
```
vibethink-orchestrator/
├── apps/                     # ✅ Apps van AQUÍ
│   ├── dashboard/           # ✅ Dashboard app
│   ├── admin/              # ✅ Admin app
│   └── login/              # ✅ Login app
├── src/                     # ✅ Código compartido AQUÍ
│   ├── shared/             # ✅ Componentes compartidos
│   └── integrations/       # ✅ Integraciones
└── docs/                   # ✅ Documentación
```

### **❌ NUNCA en root:**
- `.next/`
- `next.config.js`
- `app/`
- `pages/`
- `src/app/`
- `src/pages/`

## 🔒 **SEGURIDAD - REGLAS ABSOLUTAS**

### **Multi-tenant (SIEMPRE):**
```typescript
// ✅ SIEMPRE filtrar por company_id
const data = await supabase
  .from('users')
  .select('*')
  .eq('company_id', user.company_id);

// ❌ NUNCA sin company_id
const data = await supabase.from('users').select('*');
```

### **Roles (SIEMPRE verificar):**
```typescript
// ✅ SIEMPRE verificar permisos
if (hasPermission('ADMIN')) {
  // Funcionalidad admin
}
```

## 🎨 **BRANDING - REGLAS ABSOLUTAS**

### **VThink vs VibeThink:**
- ✅ **VThink** = Metodología (documentación, procesos)
- ✅ **VibeThink** = Software/Brand (código, UI, productos)
- ❌ **NUNCA** confundir los dos términos

### **Validación de Branding:**
```bash
# ✅ SIEMPRE validar branding
npm run validate:branding
```

## 🌐 Domains & Sites Architecture (CANÓNICO)

- Producto/Website (marketing): vibethink.co
  - www.vibethink.co → Website público en `apps/website` (Next.js, sin auth, sin multi-tenant)
  - docs.vibethink.co → Documentación/Blog en `docusaurus-docs`
  - status.vibethink.co → Status page (externo recomendado; opcional `apps/status`)
- Aplicación SaaS: vibethink.ai
  - app.vibethink.ai → `apps/dashboard`
  - admin.vibethink.ai → `apps/admin`
  - help.vibethink.ai → `apps/helpdesk`

Políticas:
- Website está exento de multi-tenant/RLS y no persiste sesión. Solo redirige a `app.vibethink.ai/login`.
- Mantener reglas mínimas del monorepo: dependencias exactas en root; build/start vía scripts root; sin node_modules en apps.
- Supabase: Allowed Redirect URLs deben incluir `.ai` y `.co`. Autenticación siempre concluye en `.ai`.

Referencias canónicas:
- `docs/architecture/DOMAINS_AND_SITES.md`
- `docusaurus-dev/docs/architecture/DOMAINS_AND_SITES.md`
- `docusaurus-docs/docs/architecture/domains-and-sites.md`

## 🛠️ **DESARROLLO - REGLAS ABSOLUTAS**

### **🎨 COMPONENTES UI - BUNDUI REFERENCE FIRST:**
**REGLA NUEVA: Antes de implementar CUALQUIER componente UI:**

```bash
# 1. 🥇 PRIMERO - Buscar en bundui-reference
cd apps/bundui-reference
grep -r "ComponentName\|pattern\|error" . --include="*.tsx"

# 2. 🥈 SEGUNDO - Si existe, copiar implementación exacta
# 3. 🥉 TERCERO - Solo si NO existe, consultar UI_MASTER_GUIDE.md
# 4. 🏅 CUARTO - Integrar multitenant requirements
```

**Justificación:** bundui-reference ya tiene patrones probados y errores solucionados (ej: hydration).

### **🧭 PROTOCOLO VHELP-FIRST OBLIGATORIO:**
**ANTES de ejecutar CUALQUIER comando, seguir esta regla:**

```bash
# 1. 🎯 SIEMPRE consultar VHELP primero
npm run vhelp

# 2. 🔍 Buscar el comando apropiado en la salida
# 3. 🛡️ Verificar nivel de seguridad:
#    🟢 SEGURO: Ejecutar directo
#    🟡 MODERADO: Revisar qué hace
#    🔴 PELIGROSO: PEDIR AUTORIZACIÓN AL USUARIO

# 4. ✅ Ejecutar comando oficial (no inventar soluciones)
```

**❌ PROHIBIDO:** Inventar comandos o usar puertos aleatorios
**✅ OBLIGATORIO:** Usar comandos oficiales de VHELP

### **Antes de cambios:**
1. ✅ **OBLIGATORIO:** `npm run vhelp` para ver comandos disponibles  
2. ✅ Leer documentación existente
3. ✅ Ejecutar `npm run validate:quick`
3. ✅ Verificar arquitectura actual

### **Durante cambios:**
1. ✅ Seguir patrones existentes
2. ✅ No duplicar código
3. ✅ Mantener estructura monorepo

### **Después de cambios:**
1. ✅ Ejecutar `npm run validate:universal`
2. ✅ Verificar que no se rompió nada
3. ✅ Documentar cambios

## 📁 **ARCHIVOS CRÍTICOS QUE LEER**

### **ANTES de cualquier cambio:**
1. `QUICK_REFERENCE_RULES.md` - Reglas rápidas
2. `ARCHITECTURE_RULES.md` - Reglas de arquitectura
3. `CLAUDE.md` - Detalles técnicos
4. `.cursorrules` - Patrones de desarrollo

### **Para cambios específicos:**
- **UI/Componentes:** `UI_GENERIC_PRINCIPLES.md`
- **Arquitectura:** `ARCHITECTURE_PROTECTION_RULES.md`
- **Validación:** `dev-tools/validation/quick-validator.cjs`

## 🚨 **VIOLACIONES CRÍTICAS - NUNCA HACER**

### **Arquitectura:**
- ❌ Crear archivos Next.js en root
- ❌ Mover apps fuera de `apps/`
- ❌ Usar imports relativos entre apps

### **Seguridad:**
- ❌ Queries sin `company_id`
- ❌ Acceso sin verificar permisos
- ❌ Bypass de RLS policies

### **Branding:**
- ❌ Confundir "VThink" con "VibeThink"
- ❌ Usar términos incorrectos en código

### **Desarrollo:**
- ❌ Duplicar código existente
- ❌ Saltarse validaciones
- ❌ No leer documentación existente

## ✅ **CHECKLIST OBLIGATORIO**

### **Antes de cualquier cambio:**
- [ ] Leer `QUICK_REFERENCE_RULES.md`
- [ ] Ejecutar `npm run validate:quick`
- [ ] Verificar arquitectura actual
- [ ] Leer documentación relevante

### **Durante el cambio:**
- [ ] Seguir patrones existentes
- [ ] No duplicar código
- [ ] Mantener estructura monorepo
- [ ] Filtrar por `company_id` si aplica

### **Después del cambio:**
- [ ] Ejecutar `npm run validate:universal`
- [ ] Verificar que no se rompió nada
- [ ] Documentar cambios si es necesario

## 🎯 **COMANDOS CRÍTICOS**

### **Validación (SIEMPRE usar):**
```bash
npm run validate:quick        # ✅ ANTES de cambios
npm run validate:architecture # ✅ Para cambios estructurales
npm run validate:universal    # ✅ DESPUÉS de cambios
npm run validate:branding     # ✅ Para cambios de contenido
```

### **Desarrollo:**
```bash
npm run dev                   # ✅ Desarrollo
npm run build                 # ✅ Build
npm run test                  # ✅ Testing
```

## 📚 **REFERENCIAS CRUCIALES**

### **Documentación principal:**
- `QUICK_REFERENCE_RULES.md` - Reglas rápidas
- `ARCHITECTURE_RULES.md` - Arquitectura
- `CLAUDE.md` - Detalles técnicos
- `.cursorrules` - Patrones Cursor

### **Validación:**
- `dev-tools/validation/quick-validator.cjs`
- `dev-tools/validation/architecture-validator.cjs`
- `dev-tools/validation/architecture-guard.cjs`

### **Protección:**
- `ARCHITECTURE_PROTECTION_RULES.md`
- `AI_MANDATORY_REVIEW_SYSTEM.md`

---

**🚨 RECORDATORIO: Este archivo es OBLIGATORIO para TODAS las IAs. NUNCA hacer cambios sin seguir estas reglas.**

## 🏗️ Build Policy (AI)
- NPM-only (no pnpm/yarn/bun)
- Dashboard build: usar script root → `npm run build:dashboard` (internamente: `cd apps/dashboard && npx --no-install next build`)
- No ejecutar `next build` directo en apps fuera de scripts root
- Dependencias solo en root; apps sin node_modules