# 🚨 PROBLEMA - API Key de Anthropic Inválida

**Fecha:** 2025-12-26
**Estado:** Scripts funcionando, API key expirada/inválida

---

## ❌ Problema Detectado

La API key de Anthropic que agregaste está **expirada o es inválida**.

**Error:**
```
❌ Authentication failed - Invalid API key
401 {"error":{"message":"token expired or incorrect","type":"401"}}
```

**API key en .env (línea 12):**
```
ANTHROPIC_API_KEY=[REDACTED]
```

---

## ✅ Solución

### Paso 1: Obtener Nueva API Key

1. **Ir a:** https://console.anthropic.com/settings/keys
2. **Iniciar sesión** o crear cuenta
3. **Click en "Create Key"**
4. **Copiar la nueva key** (empieza con `sk-ant-api03-`)
5. **Reemplazar en .env línea 12**

### Paso 2: Ejecutar Traducciones

Después de actualizar la API key:

```bash
# Ejecutar script de traducción
node scripts/translate-all.js
```

**Duración:** 20-30 minutos
**Costo:** ~$1-2 USD
**Resultado:** 2,556 keys traducidos en 32 archivos

### Paso 3: Verificar

```bash
# Auditar que todo esté completo
node scripts/audit-missing-translations-projects-v2.js

# Resultado esperado: "Total Missing Keys: 0"
```

---

## 📊 Qué se Va a Traducir

- **4 namespaces:** projects, default, common, navigation
- **8 idiomas:** es, ar, zh, fr, pt, de, it, ko
- **32 archivos** JSON totales
- **2,556 keys** faltantes

### Desglose:
- Español: 41 keys faltantes
- Árabe: 246 keys faltantes
- Chino: 320 keys faltantes
- Francés: 332 keys faltantes
- Portugués: 328 keys faltantes
- Alemán: 331 keys faltantes
- Italiano: 479 keys faltantes (0% completo)
- Coreano: 479 keys faltantes (0% completo)

---

## 🔍 Scripts ya Creados (Listos para Usar)

1. **`scripts/audit-missing-translations-projects-v2.js`** - Auditar traducciones
2. **`scripts/translate-namespace.js`** - Traducir un namespace específico
3. **`scripts/translate-all.js`** - Traducir todos (batch)
4. **`scripts/test-api-key.js`** - Verificar API key

---

## 📝 Documentación Disponible

1. **`INSTRUCCIONES_TRADUCCION_2025-12-26.md`** - Guía paso a paso
2. **`TRABAJO_COMPLETADO_2025-12-26.md`** - Resumen técnico
3. **`docs/testing/translation-audit-report.json`** - Reporte de auditoría

---

**Creado por:** Claude Sonnet 4.5
**Para:** Marcelo
