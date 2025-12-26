# Reglas de Oro del Arquitecto - VibeThink Orchestrator

**Version:** 1.0.0  
**Last Updated:** 2025-12-25  
**Authority:** Arquitecto (Marcelo Escallón)  
**Status:** 🔒 INMUTABLE - Estas reglas NO se negocian

---

## 🎯 Propósito

Este documento contiene las **reglas absolutas** del proyecto VibeThink Orchestrator. Son decisiones arquitectónicas fundamentales que **NUNCA** deben violarse, sin importar la presión o el contexto.

**Si un developer olvida estas reglas, el proyecto se rompe.**

---

## 🔒 Reglas Absolutas (ZERO TOLERANCE)

### 1. React 19 ONLY
**Regla:** El proyecto usa **exclusivamente React 19.0.0** en todo el monorepo.

**Enforcement:**
- `package.json` root tiene `overrides` que fuerzan React 19
- Cualquier dependencia que requiera React 18 o anterior → RECHAZADA
- No se permiten excepciones "temporales"

**Por qué:**
- Evita el error "Dual React" (Objects are not valid as React child)
- Garantiza compatibilidad con Next.js 15+
- Aprovecha Server Components y nuevas APIs

**Verificación:**
```bash
npm list react
# Debe mostrar SOLO React 19.0.0
```

**Documento:** `docs/architecture/REACT_VERSION_STRATEGY.md`

---

### 2. NPM Estricto (No pnpm, No yarn)
**Regla:** El proyecto usa **NPM 10.2.4** como único gestor de paquetes.

**Enforcement:**
- `package.json` especifica `"packageManager": "npm@10.2.4"`
- No se permiten archivos `pnpm-lock.yaml` o `yarn.lock`
- Cualquier referencia a `workspace:*` debe reemplazarse con versiones npm

**Por qué:**
- Consistencia en todo el equipo
- Evita conflictos de lockfiles
- Simplifica CI/CD

**Verificación:**
```bash
cat package.json | grep packageManager
# Debe mostrar: "packageManager": "npm@10.2.4"
```

---

### 3. 9 Idiomas OBLIGATORIOS
**Regla:** Todo texto visible para el usuario DEBE estar traducido a **9 idiomas**.

**Idiomas:**
1. English (en)
2. Spanish (es)
3. Arabic (ar)
4. Chinese (zh)
5. French (fr)
6. Portuguese (pt)
7. German (de)
8. Japanese (ja)
9. Hindi (hi)

**Enforcement:**
- ZERO TOLERANCE para strings hardcoded
- Todo componente nuevo debe tener traducciones completas
- Script de validación debe pasar: `npm run lang-quality`

**Por qué:**
- VibeThink es un producto global
- La i18n no es opcional, es parte del core

**Verificación:**
```bash
npm run lang-quality
# Debe mostrar: ✅ All namespaces complete
```

**Documento:** `docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md`

---

### 4. Provider-First Organization
**Regla:** Los recursos de terceros se organizan **por proveedor**, no por tipo.

**Estructura correcta:**
```
vibethink-asset-library/
├── shadcn-ecosystem/
├── bundui-premium/
└── vercel-ai-sdk/
```

**Estructura INCORRECTA:**
```
❌ vibethink-asset-library/
   ├── components/
   ├── templates/
   └── libraries/
```

**Por qué:**
- Escalable (podemos tener 100 proveedores)
- Fácil de mantener (cada proveedor tiene su SYNC_STATUS)
- Claro de dónde viene cada cosa

**Documento:** `docs/architecture/THIRD_PARTY_COMPONENTS_POLICY.md`

---

### 5. Asset Library es READ-ONLY
**Regla:** El Asset Library es **solo referencia**. TODO el desarrollo se hace en Orchestrator.

**Prohibido:**
- ❌ Desarrollar en Asset Library
- ❌ Modificar código en Asset Library
- ❌ Hacer commits de features en Asset Library

**Permitido:**
- ✅ Actualizar con nuevas versiones de proveedores
- ✅ Agregar nuevos componentes de referencia
- ✅ Actualizar SYNC_STATUS.md

**Por qué:**
- Separación clara entre "referencia" y "producción"
- Evita mezclar código de terceros con código propio

---

### 6. QA Checklist ANTES de Integrar
**Regla:** NINGÚN componente de terceros se integra sin pasar el QA Checklist.

**Proceso obligatorio:**
1. Encontrar componente interesante
2. Ejecutar QA Checklist (`THIRD_PARTY_ONBOARDING_QA.md`)
3. Si APROBADO → Agregar a Asset Library
4. Si RECHAZADO → Buscar alternativa

**No se permiten:**
- ❌ "Lo probamos y vemos"
- ❌ "Es solo temporal"
- ❌ "Lo arreglamos después"

**Por qué:**
- Evita deuda técnica
- Garantiza calidad desde el inicio
- Ahorra tiempo a largo plazo

**Documento:** `docs/architecture/THIRD_PARTY_ONBOARDING_QA.md`

---

### 7. Source Headers Obligatorios
**Regla:** Todo código de terceros DEBE tener header de origen.

**Formato obligatorio:**
```typescript
/**
 * @source VibeThink Asset Library: provider-name
 * @origin path/to/original/component.tsx
 * @version 1.0.0 (Imported: 2025-12-25)
 * @url https://provider.com/component
 * @adaptations i18n, design tokens, TypeScript
 */
```

**Por qué:**
- Trazabilidad (sabemos de dónde viene)
- Mantenibilidad (sabemos qué actualizar)
- Auditoría (sabemos qué hemos modificado)

**Verificación:**
```bash
grep -r "@source" apps/dashboard/components/
# Debe mostrar todos los componentes de terceros
```

---

### 8. Namespaces con Sub-namespaces
**Regla:** Las keys de traducción SIEMPRE usan sub-namespaces.

**Correcto:**
```json
{
  "tasks": {
    "table": {
      "selectAll": "Select All"
    }
  }
}
```

**INCORRECTO:**
```json
{
  "tasks_table_selectAll": "Select All"
}
```

**Por qué:**
- Organización jerárquica
- Fácil de navegar
- Escalable

**Documento:** `docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md`

---

### 9. Documentar ANTES de Codificar
**Regla:** Toda decisión arquitectónica se documenta ANTES de implementar.

**Proceso:**
1. Tomar decisión arquitectónica
2. Documentar en `docs/architecture/`
3. Revisar con equipo
4. Implementar

**No se permite:**
- ❌ Codificar primero, documentar después
- ❌ "Lo documento mañana"
- ❌ Documentación oral (Slack, reuniones)

**Por qué:**
- La documentación es la memoria del proyecto
- Si no está escrito, no existe
- Los developers olvidan, los docs no

---

### 10. Git Commits Descriptivos
**Regla:** Los commits siguen Conventional Commits.

**Formato:**
```
type(scope): description

- Detail 1
- Detail 2
```

**Tipos permitidos:**
- `feat:` Nueva funcionalidad
- `fix:` Bug fix
- `docs:` Documentación
- `chore:` Mantenimiento
- `refactor:` Refactorización
- `test:` Tests

**Ejemplo correcto:**
```
feat(i18n): add timeline translations to projects namespace

- Add timeline.events keys for en, es, ar
- Update SYNC_STATUS.md
```

**Ejemplo INCORRECTO:**
```
❌ "fixed stuff"
❌ "wip"
❌ "updates"
```

---

## 🚨 Consecuencias de Violación

### Para Developers
- ❌ PR rechazado inmediatamente
- ❌ Código no puede ir a producción
- ❌ Debe refactorizar antes de merge

### Para el Proyecto
- 💥 Deuda técnica
- 💥 Bugs en producción
- 💥 Tiempo perdido en fixes

---

## ✅ Checklist de Cumplimiento

**Antes de cada PR, verificar:**

- [ ] React 19 ONLY (no otras versiones)
- [ ] NPM usado (no pnpm/yarn)
- [ ] Traducciones completas (9 idiomas)
- [ ] Componentes de terceros en Asset Library
- [ ] QA Checklist ejecutado
- [ ] Source headers presentes
- [ ] Namespaces correctos (sub-namespaces)
- [ ] Documentación actualizada
- [ ] Commits descriptivos

---

## 📞 Escalación

**Si un developer quiere violar una regla:**
1. Debe justificar POR QUÉ la regla no aplica
2. Debe proponer alternativa que cumpla el espíritu de la regla
3. Debe obtener aprobación del Arquitecto

**No hay excepciones sin aprobación explícita.**

---

## 🔄 Actualización de Reglas

**Estas reglas pueden actualizarse SOLO si:**
1. El Arquitecto identifica una regla obsoleta
2. Se documenta POR QUÉ la regla cambia
3. Se actualiza este documento
4. Se notifica a todo el equipo

**Versión actual:** 1.0.0  
**Última actualización:** 2025-12-25

---

## 📚 Documentos Relacionados

- `docs/architecture/THIRD_PARTY_MASTER_INDEX.md` - Índice maestro
- `docs/architecture/REACT_VERSION_STRATEGY.md` - React 19 enforcement
- `docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md` - i18n methodology
- `docs/architecture/THIRD_PARTY_COMPONENTS_POLICY.md` - Third-party policy
- `docs/architecture/THIRD_PARTY_ONBOARDING_QA.md` - QA checklist

---

**"Las reglas existen para proteger la calidad. La calidad protege el producto."**

---

**Aprobado por:** Marcelo Escallón (Arquitecto)  
**Fecha:** 2025-12-25  
**Status:** 🔒 INMUTABLE
