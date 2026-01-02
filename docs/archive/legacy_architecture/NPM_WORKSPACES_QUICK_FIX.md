# npm Workspaces Quick Fix Guide

**🚨 PROBLEMA COMÚN:** Cannot find module 'autoprefixer' (o cualquier dependencia)

**⏱️ Tiempo de solución:** 2-3 minutos

## 🎯 Explicación Súper Simple

### ¿Qué pasó?

Tu proyecto le pidió a npm (el "instalador de programas") que instalara cosas, pero npm no entendió porque las instrucciones estaban en el "idioma" equivocado.

### Analogía con Spotify

Imagina esto:
1. Quieres crear una playlist en Spotify
2. Le das instrucciones, pero en el formato de Apple Music
3. Spotify dice: "¿Qué? No entiendo esto" 🤷‍♂️
4. No se crea la playlist
5. Cuando intentas reproducir música: "Error: playlist no encontrada"

**Eso es exactamente lo que pasó aquí:**
- npm = Spotify
- package.json = Tus instrucciones de playlist
- `workspace:*` = Instrucciones en formato Apple Music
- `^0.1.0` = Instrucciones en formato Spotify
- autoprefixer = La canción que no se puede reproducir

### La solución en 3 palabras

**Habla el idioma correcto.**

---

## Síntomas

```bash
Error: Cannot find module 'autoprefixer'
```

```bash
npm error code EUNSUPPORTEDPROTOCOL
npm error Unsupported URL Type "workspace:": workspace:*
```

## Causa

Sintaxis `workspace:*` en package.json (solo funciona con pnpm/yarn, NO con npm)

## Solución Rápida (3 pasos)

### 1. Buscar workspace: en package.json

```bash
grep -r "workspace:" packages/*/package.json apps/*/package.json
```

**O en PowerShell:**
```powershell
Select-String -Path packages\*/package.json,apps\*/package.json -Pattern "workspace:"
```

### 2. Reemplazar con versión específica

**Cambiar:**
```json
// ❌ INCORRECTO
{
  "dependencies": {
    "@vibethink/utils": "workspace:*"
  }
}
```

**Por:**
```json
// ✅ CORRECTO
{
  "dependencies": {
    "@vibethink/utils": "^0.1.0"
  }
}
```

### 3. Reinstalar desde raíz

```bash
cd C:\IA Marcelo Labs\vibethink-orchestrator-main
npm install
```

## Validación

```bash
# Verificar que instaló correctamente
npm ls autoprefixer

# Debería mostrar:
# └─┬ vibethink-orchestrator-dashboard@1.0.0
#   └── autoprefixer@10.4.23
```

## Prevención

**Ejecutar antes de cada commit:**

```bash
node scripts/validate-package-json-syntax.js
```

## Referencias Rápidas

| Problema | Solución |
|----------|----------|
| `EUNSUPPORTEDPROTOCOL` | Buscar y reemplazar `workspace:*` |
| Cannot find module X | Verificar npm install completó sin errores |
| Build fails | Validar package.json syntax |

## Documentación Completa

- **Troubleshooting:** `docs/TROUBLESHOOTING.md`
- **Guía completa:** `docs/architecture/PACKAGE_MANAGER_COMPATIBILITY.md`
- **Script validación:** `scripts/validate-package-json-syntax.js`

---

**Última actualización:** 2025-12-25
**Caso documentado:** autoprefixer missing error
