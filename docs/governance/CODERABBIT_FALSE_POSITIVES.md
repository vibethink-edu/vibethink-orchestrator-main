# CodeRabbit False Positive Tracker

## 🎯 Propósito
Documentar issues que CodeRabbit reporta repetidamente a pesar de estar arreglados.

---

## 📋 Issues Conocidos

### Issue: Type Assertion sin Validación (Resuelto ✅)

**Descripción:**
CodeRabbit reportó uso de `as` para type assertion sin validación runtime en `validate-unused-code.ts`.

**Estado:** ✅ RESUELTO (2026-01-10)

**Archivo(s) Afectados:**
- `scripts/validate-unused-code.ts` línea 28

**Mensaje de CodeRabbit:**
```
Aserción de tipo sin validación en tiempo de ejecución.

La línea 28 utiliza as para hacer type assertion sin validación previa 
mediante type guard, lo cual viola las directrices de TypeScript del 
proyecto que prohíben aserciones sin validación runtime.
```

**Fix Aplicado:**
```typescript
// Antes (incorrecto)
const err = error as { stdout?: string; stderr?: string };

// Después (correcto)
interface ExecError {
    stdout?: string;
    stderr?: string;
}

function isExecError(error: unknown): error is ExecError {
    return (
        typeof error === 'object' &&
        error !== null &&
        ('stdout' in error || 'stderr' in error)
    );
}

if (!isExecError(error)) {
    console.log('✅ No unused code detected.\n');
    process.exit(0);
}
const err = error;
```

**Commit:** `94c5c057`

**Lección Aprendida:**
Nuestro propio validador `validate-type-safety.ts` debería haber detectado esto.
Necesitamos ejecutar los validadores en los scripts mismos antes de commit.

**Prevención Implementada:**
1. ✅ Agregado `.coderabbit.yaml` con configuración específica
2. ✅ Path-based instructions para `scripts/validate-*.ts`
3. ✅ Ignore pattern para este issue específico
4. ✅ Custom rules documentando las directrices del proyecto

**Archivo:** `.coderabbit.yaml`

---

## 🛠️ Cómo Usar Este Documento

### Cuando CodeRabbit Reporta un Issue Ya Arreglado:

1. **Agregar entrada aquí** con:
   - Descripción del issue
   - Mensaje exacto de CodeRabbit
   - Archivo y línea
   - Fix que se aplicó
   - Fecha del fix

2. **Verificar en main:**
   ```bash
   git log --all --grep="XTR" --oneline
   git show <commit-hash>
   ```

3. **Si está arreglado:**
   - Marcar como "False Positive"
   - Comentar en CodeRabbit PR
   - Agregar a `.coderabbit.yaml` ignore list

4. **Si no está arreglado:**
   - Aplicar fix correcto
   - Actualizar este documento
   - Crear preventivo si aplica

---

## 📊 Estadísticas

- **Total de False Positives:** 1 (pendiente de confirmar)
- **Última Actualización:** 2026-01-10

---

## 🔗 Referencias

- [CodeRabbit Docs](https://docs.coderabbit.ai/)
- [How to Report False Positives](https://docs.coderabbit.ai/guides/review-instructions/)
