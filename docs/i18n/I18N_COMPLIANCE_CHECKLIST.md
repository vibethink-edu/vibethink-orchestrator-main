# ✅ i18n Compliance Checklist

Use este checklist antes de integrar cualquier módulo, componente o librería al stack de VibeThink.

---

## 📋 Pre-Integration Checklist

### 1. Archivos de Traducción

- [ ] **Inglés (en)**: Archivo `en/module-name.json` existe y está 100% completo
- [ ] **Español (es)**: Archivo `es/module-name.json` existe y está 100% completo
- [ ] **Francés (fr)**: Archivo `fr/module-name.json` existe
- [ ] **Portugués (pt)**: Archivo `pt/module-name.json` existe
- [ ] **Alemán (de)**: Archivo `de/module-name.json` existe
- [ ] **Italiano (it)**: Archivo `it/module-name.json` existe
- [ ] **Coreano (ko)**: Archivo `ko/module-name.json` existe
- [ ] **Árabe (ar)**: Archivo `ar/module-name.json` existe
- [ ] **Chino (zh)**: Archivo `zh/module-name.json` existe

### 2. Estructura y Formato

- [ ] Todos los archivos JSON son válidos (sin errores de sintaxis)
- [ ] Las claves están organizadas semánticamente (no flat)
- [ ] Uso de naming conventions correctas (camelCase para keys)
- [ ] No hay claves duplicadas en ningún idioma
- [ ] Todos los idiomas tienen la misma estructura de claves

### 3. Calidad de Traducciones

- [ ] **Inglés**: 100% de las claves tienen valores
- [ ] **Español**: 100% de las claves tienen valores
- [ ] **Otros idiomas**: Mínimo 90% de las claves tienen valores
- [ ] No hay valores vacíos (`""`) en idiomas base (en, es)
- [ ] No hay traducciones automáticas obvias (verificar calidad)

### 4. Código (No Hardcoded Strings)

- [ ] No hay strings de UI hardcodeados en JSX/TSX
- [ ] Todos los textos usan `t()` o función de traducción
- [ ] Labels de formularios están traducidos
- [ ] Placeholders están traducidos
- [ ] Mensajes de error están traducidos
- [ ] Tooltips y aria-labels están traducidos

### 5. RTL Support (Árabe)

- [ ] UI se adapta correctamente a `dir="rtl"`
- [ ] No hay posicionamiento absoluto fijo (left/right)
- [ ] Íconos direccionales se invierten correctamente
- [ ] Márgenes y padding se adaptan (usar logical properties)
- [ ] Layout flex/grid se invierte correctamente
- [ ] Testing manual con árabe completado

### 6. Namespace y Registro

- [ ] Namespace único y descriptivo
- [ ] Registrado en `i18nConfig` o equivalente
- [ ] Pre-loading configurado si es necesario
- [ ] TypeScript types generados (si aplica)

### 7. Testing

- [ ] Test unitario: Cada idioma carga correctamente
- [ ] Test unitario: Fallback a inglés funciona
- [ ] Test manual: Cambiar entre idiomas funciona
- [ ] Test manual: RTL (árabe) funciona correctamente
- [ ] Test manual: Caracteres especiales se muestran correctamente (zh, ko, ar)

### 8. Documentación

- [ ] README del módulo menciona soporte de i18n
- [ ] Instrucciones de cómo agregar nuevas traducciones
- [ ] Ejemplos de uso de traducciones incluidos
- [ ] Contribuidores saben cómo actualizar traducciones

### 9. CI/CD

- [ ] Pipeline valida que existen 9 idiomas
- [ ] Pipeline valida estructura de archivos JSON
- [ ] Pipeline falla si faltan claves en inglés o español
- [ ] Pipeline advierte si faltan claves en otros idiomas

### 10. Librerías de Terceros

Solo si integras una librería externa:

- [ ] Wrapper creado con traducciones de VibeThink
- [ ] Todos los textos de la librería están traducidos
- [ ] Configuración regional de la librería configurada
- [ ] Documentación de cómo la librería maneja i18n

---

## 🔍 Validation Commands

Ejecuta estos comandos para validar:

```bash
# 1. Validar estructura de archivos
npm run i18n:validate-structure

# 2. Validar contenido de traducciones
npm run i18n:validate-content

# 3. Encontrar claves faltantes
npm run i18n:find-missing

# 4. Encontrar strings hardcodeados
npm run i18n:find-hardcoded

# 5. Validar RTL
npm run i18n:test-rtl
```

---

## 📊 Scoring

**Puntaje mínimo para aprobación: 90/100**

| Categoría | Peso | Puntos |
|-----------|------|--------|
| Archivos de traducción (9 idiomas) | 30 | __/30 |
| Calidad de traducciones (en, es 100%) | 25 | __/25 |
| No hardcoded strings | 20 | __/20 |
| RTL Support | 15 | __/15 |
| Testing | 10 | __/10 |
| **TOTAL** | 100 | __/100 |

---

## ✅ Aprobación Final

**Reviewer**: _________________
**Fecha**: _________________
**Puntaje**: ____ / 100
**Status**: [ ] ✅ Aprobado  [ ] ❌ Rechazado  [ ] ⚠️ Requiere cambios

**Comentarios**:
```
[Espacio para notas del reviewer]
```

---

## 🚀 Post-Integration

Después de integrar el módulo:

- [ ] Agregar módulo a la documentación de i18n
- [ ] Actualizar cobertura de i18n en dashboard
- [ ] Notificar al equipo de traducciones
- [ ] Monitorear errores de traducción en producción

---

**Template version**: 1.0.0
**Last updated**: 2025-12-27
