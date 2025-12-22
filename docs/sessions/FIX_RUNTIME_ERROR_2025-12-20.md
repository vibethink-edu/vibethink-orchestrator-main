# Fix: Runtime Error - Cannot find module './7496.js'

**Fecha:** 2025-12-20
**Error:** `Error: Cannot find module './7496.js'` en webpack-runtime.js

---

## 🔍 Problema Identificado

### Síntoma
- Error de runtime en Next.js
- Módulo `./7496.js` no encontrado
- Error en `webpack-runtime.js`

### Causa
- Caché corrupta de Next.js (`.next/`)
- Build parcial o incompleto
- Referencias rotas en webpack chunks

---

## ✅ Solución Aplicada

### Pasos Realizados

1. **Detener servidor:**
   - Detener todos los procesos Node.js relacionados con Next.js

2. **Limpiar caché:**
   - Eliminar `.next/` (build cache)
   - Eliminar `.turbo/` (turbo cache)
   - Eliminar `node_modules/.cache/` (cache de dependencias)

3. **Reiniciar servidor:**
   - Ejecutar `start-dashboard.ps1` con caché limpia
   - Next.js reconstruirá todo desde cero

---

## 🔧 Comandos de Limpieza

```powershell
# Detener servidor
Get-Process -Name "node" | Where-Object { $_.CommandLine -like "*next*" } | Stop-Process -Force

# Limpiar caché
cd apps/dashboard
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force .turbo
Remove-Item -Recurse -Force node_modules/.cache

# Reiniciar
cd ../..
.\scripts\start-dashboard.ps1
```

---

## 📝 Notas

- **Error de build conocido:** El error en `/dashboard-bundui/chat` es conocido y no bloquea desarrollo
- **Solo afecta prerendering:** Los errores de build no afectan el modo desarrollo
- **Caché limpia:** Después de limpiar, Next.js reconstruye todo automáticamente

---

**Última actualización:** 2025-12-20
**Estado:** ✅ Caché limpiada, servidor reiniciando


