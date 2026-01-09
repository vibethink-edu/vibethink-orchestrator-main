# Developer FAQ - VTK 1.0

## 🤔 **Preguntas Frecuentes para Developers**

### **Preguntas sobre Reglas Cursor**

---

## ❓ **¿Necesito actualizar las reglas Cursor cuando cambio nombres de carpetas?**

**Respuesta: NO, las reglas están diseñadas para ser agnósticas.**

```typescript
// Las reglas usan patrones, no nombres específicos
// ✅ Esto funciona igual si cambias 'admin' por 'management'
import { Component } from '@/shared/components';
const { data } = await supabase.from('users').eq('company_id', user.company_id);
```

**¿Cuándo SÍ necesito actualizar reglas?**
- Solo si cambias la **convención base** (ej: de `@/shared/` a `@/common/`)
- Solo si cambias los **patrones de import** fundamentales
- Solo si cambias la **metodología XTP** misma

---

## ❓ **¿Qué pasa si renombro una app de 'hostis' a 'ap'?**

**Respuesta: NADA, las reglas siguen funcionando igual.**

```bash
# ANTES
src/apps/hostis/

# DESPUÉS  
src/apps/ap/

# Las reglas siguen siendo válidas porque:
# - Usan patrones agnósticos
# - No dependen de nombres específicos
# - Se basan en convenciones universales
```

**¿Qué debo hacer?**
- ✅ Nada especial
- ✅ Solo actualizar imports en tu código
- ✅ Las reglas Cursor siguen funcionando

---

## ❓ **¿Las reglas Cursor son específicas para este proyecto?**

**Respuesta: NO, son universales y agnósticas.**

```typescript
// Las reglas se basan en:
// 1. Metodología XTP (universal)
// 2. Patrones de desarrollo (agnósticos)
// 3. Mejores prácticas (aplicables a cualquier proyecto)
```

**¿Por qué son universales?**
- ✅ Se basan en metodología XTP, no en el proyecto específico
- ✅ Usan patrones estándar de la industria
- ✅ Son agnósticas a tecnologías específicas
- ✅ Funcionan con cualquier estructura de proyecto

---

## ❓ **¿Qué documentación debo leer para empezar?**

**Respuesta: Lee en este orden:**

1. **`docs/CURSOR_QUICK_REFERENCE.md`** - Referencia rápida (5 min)
2. **`docs/CURSOR_DEVELOPER_GUIDE.md`** - Guía completa (15 min)
3. **`docs/CURSOR_RULES_EXPLANATION.md`** - Explicación de reglas (10 min)
4. **`docs/CURSOR_REFACTORING_GUIDE.md`** - Solo si vas a hacer refactoring

**Para metodología XTP:**
- `docs/XTP_METHODOLOGY/README.md` - Introducción a XTP
- `docs/XTP_METHODOLOGY/01_PRINCIPLES/` - Principios fundamentales

---

## ❓ **¿Qué snippets puedo usar en Cursor?**

**Respuesta: Escribe estos comandos y Cursor te autocompletará:**

```bash
# Snippets principales:
vtk-session      # Protocolo de sesión obligatorio
vtk-component    # Componente con seguridad multi-tenant
vtk-query        # Query segura con company_id
vtk-test         # Tests completos por nivel
vtk-task         # Task management XTP
vtk-commit       # Git commit con compliance
vtk-docs         # Documentación XTP

# Snippets especializados:
vtk-security     # Patrones de seguridad
vtk-performance  # Optimización de performance
vtk-monorepo     # Gestión de monorepo
```

---

## ❓ **¿Cómo sé si estoy siguiendo las reglas correctamente?**

**Respuesta: Usa estos comandos de validación:**

```bash
# Validación completa
npm run validate:xtp

# Validación específica
npm run test:multi-tenant
npm run lint:accents
npm run lint:spelling
npm run quality-check

# Validación de reglas Cursor
node scripts/validate-cursor-rules.js
```

**Indicadores de que lo estás haciendo bien:**
- ✅ Tests pasando
- ✅ No hay errores de linting
- ✅ Build exitoso
- ✅ Reglas validadas correctamente

---

## ❓ **¿Qué hago si encuentro un error en las reglas?**

**Respuesta: Sigue este proceso:**

1. **Documenta el error:**
   ```typescript
   // Escribe: vtk-task
   const bugTask = {
     id: 'BUG-001',
     title: 'Error en reglas Cursor',
     description: 'Descripción del error encontrado',
     level: 1,
     complexity: 'low'
   };
   ```

2. **Reporta el problema:**
   - Crea un issue en el repositorio
   - Incluye contexto y pasos para reproducir
   - Adjunta logs de validación

3. **Solución temporal:**
   - Usa las reglas como guía, no como restricción absoluta
   - Documenta la desviación temporal
   - Continúa con el desarrollo

---

## ❓ **¿Las reglas Cursor interfieren con mi flujo de trabajo?**

**Respuesta: NO, están diseñadas para facilitar tu trabajo.**

```typescript
// Las reglas te ayudan a:
// ✅ Escribir código más seguro
// ✅ Seguir mejores prácticas
// ✅ Mantener consistencia
// ✅ Evitar errores comunes
// ✅ Documentar automáticamente
```

**¿Cómo te facilitan el trabajo?**
- ✅ Snippets automáticos para tareas comunes
- ✅ Validación automática de seguridad
- ✅ Templates para documentación
- ✅ Patrones probados y validados
- ✅ Menos tiempo en decisiones de arquitectura

---

## ❓ **¿Qué pasa si no sigo las reglas?**

**Respuesta: No hay penalización, pero pierdes beneficios.**

```typescript
// Si NO sigues las reglas:
// ❌ Más tiempo en debugging
// ❌ Inconsistencias en el código
// ❌ Problemas de seguridad
// ❌ Documentación incompleta
// ❌ Dificultad para onboarding

// Si SÍ sigues las reglas:
// ✅ Desarrollo más rápido
// ✅ Código más seguro
// ✅ Mejor documentación
// ✅ Onboarding más fácil
// ✅ Menos errores
```

**Recomendación:**
- Usa las reglas como **guía**, no como restricción
- Si tienes una buena razón para desviarte, **documéntala**
- Las reglas están ahí para **ayudarte**, no para limitarte

---

## ❓ **¿Cómo contribuyo a mejorar las reglas?**

**Respuesta: Participa en la mejora continua.**

```typescript
// Formas de contribuir:
// 1. Reporta bugs o inconsistencias
// 2. Sugiere mejoras en patrones
// 3. Comparte mejores prácticas
// 4. Documenta casos de uso específicos
// 5. Participa en reviews de código
```

**Proceso de mejora:**
1. **Identifica la oportunidad** de mejora
2. **Documenta la propuesta** con contexto
3. **Discute con el equipo** la viabilidad
4. **Implementa la mejora** si es aprobada
5. **Valida que funciona** en diferentes escenarios

---

## ❓ **¿Las reglas Cursor son solo para este proyecto?**

**Respuesta: NO, son parte de la metodología XTP universal.**

```typescript
// Las reglas Cursor son:
// ✅ Parte de la metodología XTP
// ✅ Aplicables a cualquier proyecto
// ✅ Basadas en mejores prácticas universales
// ✅ Independientes del proyecto específico
```

**¿Puedo usar estas reglas en otros proyectos?**
- ✅ Sí, son universales
- ✅ Adapta según las necesidades específicas
- ✅ La metodología XTP es reutilizable
- ✅ Los patrones son agnósticos

---

## 🎯 **Conclusión**

### **Recuerda:**
1. **Las reglas están para ayudarte**, no para complicarte
2. **Son agnósticas** - funcionan con cualquier estructura
3. **Usa los snippets** para desarrollo más rápido
4. **Valida regularmente** para mantener calidad
5. **Contribuye** a mejorar las reglas

### **Beneficios principales:**
- ✅ Desarrollo más eficiente
- ✅ Código más seguro y consistente
- ✅ Mejor documentación automática
- ✅ Onboarding más fácil para nuevos developers
- ✅ Menos errores y debugging

---

*FAQ creado para resolver dudas comunes de developers sobre reglas Cursor y VTK 1.0* 