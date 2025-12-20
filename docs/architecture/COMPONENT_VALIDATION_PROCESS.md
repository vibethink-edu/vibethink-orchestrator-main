# Proceso de Validación de Componentes

## 🎯 Objetivo

Establecer un proceso claro y seguro para validar nuevos componentes antes de integrarlos en `@vibethink/ui` o en los dashboards.

---

## 📋 Proceso de Validación

### Fase 1: Análisis Inicial

#### 1.1 Identificar Origen del Componente

```markdown
- [ ] ¿Es un componente nuevo de Bundui Premium?
- [ ] ¿Es un componente nuevo de otra referencia?
- [ ] ¿Es un componente completamente nuevo?
- [ ] ¿Es una mejora de un componente existente?
```

#### 1.2 Verificar Estado de Referencias

```markdown
- [ ] Bundui Original está actualizado (verificar versión)
- [ ] No hay conflictos con componentes existentes
- [ ] El componente no existe ya en @vibethink/ui
```

#### 1.3 Documentar Propósito

```markdown
- [ ] ¿Para qué dashboard es? (/dashboard, /dashboard-bundui, /dashboard-vibethink)
- [ ] ¿Qué problema resuelve?
- [ ] ¿Es crítico o puede esperar?
```

---

### Fase 2: Validación Técnica

#### 2.1 Verificar Dependencias

```bash
# Verificar qué dependencias necesita
npm list [dependencia]
```

```markdown
- [ ] Todas las dependencias están en package.json
- [ ] No hay dependencias prohibidas (ver STACK_COMPATIBILITY.md)
- [ ] Las dependencias son compatibles con el stack
```

#### 2.2 Verificar Compatibilidad con Monorepo

```markdown
- [ ] El componente sigue estructura de @vibethink/ui
- [ ] Usa imports de @vibethink/ui (no locales)
- [ ] Sigue convenciones de naming
- [ ] Tiene tipos TypeScript correctos
```

#### 2.3 Verificar i18n (si aplica)

```markdown
- [ ] ¿El componente tiene textos hardcoded?
- [ ] Si es para /dashboard-vibethink: ¿tiene i18n?
- [ ] Si es para /dashboard-bundui: ¿mantiene inglés? (OK)
- [ ] Si es para /dashboard: ¿tiene i18n?
- [ ] **CRÍTICO:** ¿Tiene traducciones en DOS idiomas? (en, es)
- [ ] ¿Todas las traducciones están completas?
```

---

### Fase 3: Validación de Integración

#### 3.1 Pruebas Locales

```bash
# 1. Build del monorepo
npm run build

# 2. Verificar que compila sin errores
npm run build:dashboard

# 3. Ejecutar en desarrollo
npm run dev:dashboard
```

```markdown
- [ ] El componente compila sin errores
- [ ] No hay errores de TypeScript
- [ ] No hay warnings críticos
- [ ] El componente se renderiza correctamente
```

#### 3.2 Pruebas de Integración

```markdown
- [ ] El componente funciona en el dashboard correcto
- [ ] No rompe componentes existentes
- [ ] Los estilos se aplican correctamente
- [ ] Responsive funciona (mobile/tablet/desktop)
```

#### 3.3 Pruebas de i18n (si aplica)

```markdown
- [ ] Cambio de idioma funciona
- [ ] **Todas las traducciones están presentes en DOS idiomas (en, es)**
- [ ] No hay textos hardcoded
- [ ] Los textos se muestran correctamente en ambos idiomas
- [ ] Verificar inglés (en) - textos completos
- [ ] Verificar español (es) - textos completos
- [ ] No hay claves de traducción faltantes
```

---

### Fase 4: Validación de Impacto

#### 4.1 Verificar Archivos Afectados

```bash
# Buscar imports del componente
grep -r "ComponentName" apps/dashboard/
```

```markdown
- [ ] Listar todos los archivos que usan el componente
- [ ] Verificar que no hay conflictos
- [ ] Documentar dependencias
```

#### 4.2 Verificar Dashboards Afectados

```markdown
- [ ] ¿Afecta a /dashboard? → Validar producción
- [ ] ¿Afecta a /dashboard-bundui? → Validar referencia
- [ ] ¿Afecta a /dashboard-vibethink? → Validar sandbox
```

#### 4.3 Verificar Breaking Changes

```markdown
- [ ] ¿Hay cambios que rompen compatibilidad?
- [ ] ¿Se necesitan actualizaciones en otros componentes?
- [ ] ¿Hay migraciones necesarias?
```

---

### Fase 5: Documentación

#### 5.1 Documentar el Componente

```markdown
- [ ] Agregar JSDoc/TSDoc al componente
- [ ] Documentar props y tipos
- [ ] Agregar ejemplos de uso
- [ ] Documentar casos especiales
```

#### 5.2 Actualizar Documentación del Proyecto

```markdown
- [ ] Actualizar CHANGELOG.md
- [ ] Actualizar DOCS_INDEX.md (si es necesario)
- [ ] Actualizar documentación de arquitectura (si es necesario)
- [ ] Documentar en BUNDUI_PREMIUM_MIGRATION.md (si viene de Bundui)
```

---

## 🚨 Precauciones Especiales

### Para Componentes de Bundui Premium

```markdown
⚠️ ATENCIÓN: Componentes de Bundui NO tienen i18n

1. ✅ Verificar que viene de Bundui Original (referencia)
2. ✅ Identificar todos los textos hardcoded
3. ✅ Crear estructura de i18n antes de migrar
4. ✅ Migrar a @vibethink/ui (NO a bundui-premium/)
5. ✅ Agregar i18n durante la migración
6. ✅ **CRÍTICO: Crear traducciones en DOS idiomas (en, es)**
7. ✅ Verificar que todas las claves tienen traducción en ambos idiomas
8. ✅ Probar cambio de idioma (inglés ↔ español)
```

### Para Componentes Nuevos

```markdown
⚠️ ATENCIÓN: Componentes nuevos deben seguir estándares

1. ✅ Crear en @vibethink/ui (NO en bundui-premium/)
2. ✅ Usar i18n desde el inicio (si es para /dashboard-vibethink o /dashboard)
3. ✅ **CRÍTICO: Crear traducciones en DOS idiomas (en, es) desde el inicio**
4. ✅ Seguir estructura de monorepo
5. ✅ Usar componentes base de @vibethink/ui
6. ✅ Verificar que todas las claves tienen traducción en ambos idiomas
7. ✅ Documentar completamente
```

### Para Actualizaciones de Componentes Existentes

```markdown
⚠️ ATENCIÓN: Actualizaciones pueden romper compatibilidad

1. ✅ Verificar versión actual del componente
2. ✅ Identificar cambios (git diff)
3. ✅ Probar en ambiente de desarrollo
4. ✅ Validar que no rompe usos existentes
5. ✅ Actualizar documentación
6. ✅ Considerar versión semántica
```

---

## ✅ Checklist Completo de Validación

### Pre-validación

- [ ] Origen del componente identificado
- [ ] Propósito documentado
- [ ] Dashboard objetivo definido
- [ ] Dependencias verificadas

### Validación Técnica

- [ ] Compila sin errores
- [ ] TypeScript correcto
- [ ] Compatible con monorepo
- [ ] i18n implementado (si aplica)
- [ ] **Traducciones en DOS idiomas (en, es) completas**
- [ ] Estilos correctos
- [ ] Responsive funciona

### Validación de Integración

- [ ] Funciona en dashboard objetivo
- [ ] No rompe componentes existentes
- [ ] Pruebas de cambio de idioma (si aplica)
- [ ] **Pruebas de ambos idiomas (en, es) funcionando correctamente**
- [ ] Pruebas de responsive

### Validación de Impacto

- [ ] Archivos afectados identificados
- [ ] No hay breaking changes inesperados
- [ ] Migraciones necesarias documentadas

### Documentación

- [ ] Componente documentado
- [ ] CHANGELOG actualizado
- [ ] Documentación de arquitectura actualizada (si necesario)

---

## 🔄 Proceso de Aprobación

### Para Componentes Críticos

1. **Análisis completo** (Fase 1-2)
2. **Revisión de código** (peer review)
3. **Pruebas exhaustivas** (Fase 3)
4. **Validación de impacto** (Fase 4)
5. **Aprobación final** (antes de merge)

### Para Componentes Menores

1. **Validación técnica básica** (Fase 2)
2. **Pruebas locales** (Fase 3.1)
3. **Aprobación rápida** (si no hay riesgos)

---

## 📝 Template de Validación

```markdown
## Validación de Componente: [Nombre]

### Información Básica
- **Origen:** [Bundui Premium / Nuevo / Otro]
- **Dashboard:** [/dashboard / /dashboard-bundui / /dashboard-vibethink]
- **Fecha:** YYYY-MM-DD
- **Validado por:** [Nombre]

### Análisis
- [ ] Origen identificado
- [ ] Dependencias verificadas
- [ ] Compatibilidad verificada

### Pruebas
- [ ] Compila sin errores
- [ ] Funciona correctamente
- [ ] i18n funciona (si aplica)
- [ ] Responsive funciona

### Impacto
- [ ] Archivos afectados: [Lista]
- [ ] Breaking changes: [Sí/No]
- [ ] Migraciones necesarias: [Lista]

### Aprobación
- [ ] Validación técnica: ✅
- [ ] Pruebas: ✅
- [ ] Documentación: ✅
- [ ] Aprobado para merge: ✅
```

---

## 🚨 Reglas Críticas

1. **NUNCA agregar componentes a `bundui-premium/`**
   - Todos los componentes nuevos van a `@vibethink/ui`

2. **SIEMPRE validar i18n para `/dashboard-vibethink` y `/dashboard`**
   - `/dashboard-bundui` puede mantener inglés

3. **SIEMPRE verificar compatibilidad con monorepo**
   - Usar imports de `@vibethink/ui`
   - Seguir estructura establecida

4. **SIEMPRE documentar cambios**
   - CHANGELOG.md
   - Documentación de arquitectura

---

**Última actualización:** 2025-12-19  
**Mantenido por:** Equipo de Desarrollo VibeThink

