# AI Universal Standards - VThink 1.0

**🚨 CRÍTICO: Este archivo DEBE ser leído por TODAS las IAs antes de hacer cambios**

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

## 🛠️ **DESARROLLO - REGLAS ABSOLUTAS**

### **Antes de cambios:**
1. ✅ Leer documentación existente
2. ✅ Ejecutar `npm run validate:quick`
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