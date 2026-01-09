# Cursor Refactoring Guide - VTK 1.0

## 🔄 **Guía de Refactoring y Mantenimiento de Reglas Cursor**

### **¿Cuándo actualizar las reglas Cursor?**
Esta guía te ayudará a mantener las reglas Cursor alineadas cuando hagas cambios en la estructura del proyecto.

---

## 📋 **Checklist de Refactoring**

### **Antes de Refactorizar:**

1. **Documenta el cambio:**
   ```typescript
   // Escribe: vtk-task
   const refactorTask = {
     id: 'REFACTOR-001',
     title: 'Refactorizar estructura de apps',
     description: 'Cambiar nombres de carpetas y reorganizar estructura',
     level: 4,
     complexity: 'high',
     // ... resto del template
   };
   ```

2. **Crea un backup:**
   ```bash
   git add .
   git commit -m "🔧 Backup antes de refactoring - [descripción del cambio]"
   ```

3. **Identifica el scope del cambio:**
   - ✅ Cambio de nombres de carpetas
   - ✅ Reorganización de estructura
   - ✅ Nuevas convenciones
   - ✅ Cambios en patrones de import

---

## 🎯 **Tipos de Cambios y su Impacto en las Reglas**

### **1. Cambios de Nombres (NO requieren actualización de reglas)**

#### **Ejemplo: Renombrar apps**
```bash
# ANTES
src/apps/hostis/
src/apps/dashboard/
src/apps/admin/

# DESPUÉS
src/apps/ap/
src/apps/dash/
src/apps/management/
```

#### **¿Qué hacer?**
- ✅ **NO actualices las reglas** - Los patrones siguen siendo válidos
- ✅ Solo actualiza ejemplos si lo consideras necesario
- ✅ Mantén las convenciones de import (`@/apps/ap`)

#### **Reglas que siguen aplicando:**
```typescript
// ✅ Sigue siendo válido
import { Component } from '@/shared/components';
import { useAuth } from '@/shared/hooks';

// ✅ Sigue siendo válido
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('company_id', user.company_id);
```

### **2. Cambios de Estructura (SÍ requieren actualización)**

#### **Ejemplo: Cambiar convención de carpetas**
```bash
# ANTES
src/apps/
src/shared/

# DESPUÉS
src/modules/
src/common/
```

#### **¿Qué hacer?**
- ❌ **SÍ actualiza las reglas** - Cambia la convención base
- ❌ Actualiza ejemplos en `.cursorrules`
- ❌ Actualiza snippets en `.cursor/snippets/`
- ❌ Actualiza documentación

#### **Reglas a actualizar:**
```typescript
// ANTES
import { Component } from '@/shared/components';

// DESPUÉS
import { Component } from '@/common/components';
```

---

## 🛠️ **Scripts de Mantenimiento**

### **1. Script de Validación de Reglas**
```javascript
// scripts/validate-cursor-rules.js
const validateCursorRules = {
  checkStructure: () => {
    // Verifica que las carpetas mencionadas en las reglas existan
    const mentionedPaths = [
      'src/apps/',
      'src/shared/',
      'src/integrations/',
      'src/common/'
    ];
    
    mentionedPaths.forEach(path => {
      if (!fs.existsSync(path)) {
        console.warn(`⚠️ Path mencionado en reglas no existe: ${path}`);
      }
    });
  },
  
  checkImports: () => {
    // Verifica que los patrones de import sean válidos
    const importPatterns = [
      '@/shared/components',
      '@/shared/hooks',
      '@/shared/services'
    ];
    
    // Validar que los alias estén configurados
  },
  
  checkExamples: () => {
    // Verifica que los ejemplos en las reglas sean actuales
    // Compara con la estructura real del proyecto
  }
};
```

### **2. Script de Actualización Automática**
```javascript
// scripts/update-cursor-rules.js
const updateCursorRules = {
  updateExamples: (oldName, newName) => {
    // Actualiza ejemplos en .cursorrules
    const rulesContent = fs.readFileSync('.cursorrules', 'utf8');
    const updatedContent = rulesContent.replace(
      new RegExp(oldName, 'g'), 
      newName
    );
    fs.writeFileSync('.cursorrules', updatedContent);
  },
  
  updateSnippets: (oldName, newName) => {
    // Actualiza snippets en .cursor/snippets/
    const snippetsPath = '.cursor/snippets/vtk-1.0-snippets.json';
    const snippets = JSON.parse(fs.readFileSync(snippetsPath, 'utf8'));
    
    // Actualizar ejemplos en snippets
    Object.keys(snippets).forEach(key => {
      snippets[key].body = snippets[key].body.map(line => 
        line.replace(new RegExp(oldName, 'g'), newName)
      );
    });
    
    fs.writeFileSync(snippetsPath, JSON.stringify(snippets, null, 2));
  },
  
  updateDocumentation: (oldName, newName) => {
    // Actualiza documentación relacionada
    const docsToUpdate = [
      'docs/CURSOR_DEVELOPER_GUIDE.md',
      'docs/PROJECT/03_DESIGN/MONOREPO_MANAGEMENT_V1.0.md'
    ];
    
    docsToUpdate.forEach(doc => {
      if (fs.existsSync(doc)) {
        let content = fs.readFileSync(doc, 'utf8');
        content = content.replace(new RegExp(oldName, 'g'), newName);
        fs.writeFileSync(doc, content);
      }
    });
  }
};
```

---

## 📊 **Matriz de Decisiones**

### **¿Cuándo actualizar las reglas?**

| Tipo de Cambio | Impacto en Reglas | Acción Requerida |
|----------------|-------------------|------------------|
| Renombrar app/carpeta | Bajo | Solo actualizar ejemplos si es necesario |
| Reorganizar estructura | Medio | Actualizar ejemplos y documentación |
| Cambiar convención base | Alto | Actualizar reglas, snippets y docs |
| Agregar nueva app | Bajo | No requiere cambios |
| Cambiar patrones de import | Alto | Actualizar reglas y snippets |
| Agregar nueva tecnología | Medio | Extender reglas si es necesario |

---

## 🔧 **Workflow de Refactoring**

### **Paso 1: Evaluar el Cambio**
```typescript
const changeAssessment = {
  type: 'rename' | 'restructure' | 'convention',
  scope: 'app' | 'folder' | 'pattern' | 'global',
  impact: 'low' | 'medium' | 'high'
};
```

### **Paso 2: Ejecutar Refactoring**
```bash
# 1. Backup
git add .
git commit -m "🔧 Backup antes de refactoring"

# 2. Refactorizar código
# (renombrar carpetas, actualizar imports, etc.)

# 3. Validar que todo funcione
npm run test
npm run build
```

### **Paso 3: Actualizar Reglas (si es necesario)**
```bash
# Si el cambio es de convención base:
node scripts/update-cursor-rules.js oldName newName

# Validar reglas actualizadas:
node scripts/validate-cursor-rules.js
```

### **Paso 4: Commit y Documentación**
```bash
git add .
git commit -m "🔄 Refactoring: [descripción] - Reglas Cursor actualizadas"
```

---

## 📚 **Templates de Actualización**

### **Template para Cambios de Convención**
```markdown
# Refactoring: [Nombre del Cambio]

## Cambios Realizados
- [ ] Renombrado: `src/apps/oldName/` → `src/apps/newName/`
- [ ] Actualizado: Patrones de import
- [ ] Actualizado: Documentación
- [ ] Actualizado: Reglas Cursor

## Reglas Afectadas
- [ ] `.cursorrules` - Ejemplos actualizados
- [ ] `.cursor/snippets/` - Snippets actualizados
- [ ] `docs/CURSOR_DEVELOPER_GUIDE.md` - Guía actualizada

## Validación
- [ ] Tests pasando
- [ ] Build exitoso
- [ ] Reglas validadas
- [ ] Documentación actualizada

## Rollback Plan
Si algo falla, revertir a commit: `[hash]`
```

### **Template para Cambios Menores**
```markdown
# Refactoring Menor: [Nombre del Cambio]

## Cambios Realizados
- [ ] Renombrado: `ComponentName` → `NewComponentName`
- [ ] Actualizado: Imports relacionados

## Reglas Afectadas
- [ ] Solo ejemplos en documentación (si es necesario)

## Validación
- [ ] Tests pasando
- [ ] Build exitoso
```

---

## 🚫 **Anti-Patterns de Refactoring**

### **Lo que NO debes hacer:**
```typescript
// ❌ NO actualices reglas por cambios menores
// Si solo cambias el nombre de una app, las reglas siguen siendo válidas

// ❌ NO rompas la convención sin actualizar reglas
// Si cambias de src/apps/ a src/modules/, actualiza las reglas

// ❌ NO ignores la validación
// Siempre valida que las reglas sigan siendo correctas

// ❌ NO hagas cambios sin backup
// Siempre haz commit antes de refactorizar
```

### **Lo que SÍ debes hacer:**
```typescript
// ✅ Documenta el cambio
// ✅ Haz backup antes de empezar
// ✅ Valida que todo funcione
// ✅ Actualiza reglas solo si es necesario
// ✅ Mantén la consistencia
```

---

## 🎯 **Comandos Útiles para Refactoring**

### **Validación Rápida:**
```bash
# Validar estructura
npm run validate:structure

# Validar imports
npm run validate:imports

# Validar reglas Cursor
npm run validate:cursor-rules

# Testing completo
npm run test:full
```

### **Actualización Automática:**
```bash
# Actualizar ejemplos en reglas
node scripts/update-cursor-rules.js oldName newName

# Validar reglas actualizadas
node scripts/validate-cursor-rules.js

# Generar reporte de cambios
node scripts/generate-refactor-report.js
```

---

## 📞 **Soporte y Recursos**

### **Archivos Clave:**
- `.cursorrules` - Reglas principales
- `.cursor/rules/` - Reglas especializadas
- `.cursor/snippets/` - Snippets de desarrollo
- `docs/CURSOR_DEVELOPER_GUIDE.md` - Guía de desarrollo

### **Scripts de Mantenimiento:**
- `scripts/validate-cursor-rules.js` - Validación de reglas
- `scripts/update-cursor-rules.js` - Actualización automática
- `scripts/generate-refactor-report.js` - Reporte de cambios

### **Documentación Relacionada:**
- `docs/PROJECT/03_DESIGN/MONOREPO_MANAGEMENT_V1.0.md`
- `docs/PROJECT/03_DESIGN/REORGANIZATION_V4.5_REPORT.md`

---

## 🎉 **Conclusión**

### **Reglas de Oro:**
1. **Las reglas son agnósticas al nombre** - Solo actualiza si cambias la convención
2. **Siempre haz backup** antes de refactorizar
3. **Valida que todo funcione** después del cambio
4. **Documenta los cambios** importantes
5. **Mantén la consistencia** en todo el proyecto

### **Beneficios:**
- ✅ Desarrollo más eficiente
- ✅ Menos errores en refactoring
- ✅ Reglas siempre actualizadas
- ✅ Mejor mantenibilidad
- ✅ Equipo más productivo

---

*Última actualización: VTK 1.0 - Cursor Refactoring Guide* 