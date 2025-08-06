# 🛡️ Guía para Mantener Next.js Estable

## Comandos Recomendados para Iniciar el Dashboard

### Opción 1: Script Batch (Recomendado)
```batch
start-dashboard.bat
```

### Opción 2: PowerShell Script
```powershell
# Inicio normal
.\Start-VThinkDashboard.ps1

# Con limpieza completa
.\Start-VThinkDashboard.ps1 -Clean

# Forzar reinstalación
.\Start-VThinkDashboard.ps1 -Install

# Puerto customizado
.\Start-VThinkDashboard.ps1 -Port 3002
```

### Opción 3: Comando directo
```bash
cd apps/dashboard && npx next dev -p 3001
```

## 🚨 Problemas Comunes y Soluciones

### 1. "next is not recognized"
**Causa**: Next.js no está instalado
**Solución**:
```bash
cd apps/dashboard
pnpm install
```

### 2. "Port 3001 is already in use"
**Causa**: Otro proceso está usando el puerto
**Solución Windows**:
```batch
# Ver qué está usando el puerto
netstat -ano | findstr :3001

# Matar el proceso (reemplaza PID con el número)
taskkill /PID [PID] /F
```

### 3. "Module not found"
**Causa**: Dependencias corruptas
**Solución**:
```bash
cd apps/dashboard
rm -rf node_modules .next
pnpm install
```

### 4. Conflictos de Lock Files
**Causa**: Múltiples gestores de paquetes
**Solución**:
```bash
# Eliminar todos los lock files
rm package-lock.json yarn.lock pnpm-lock.yaml

# Usar solo UN gestor (recomendado: pnpm)
pnpm install
```

## 🔧 Configuración Permanente del Puerto

El puerto está configurado en 3 lugares:

1. **package.json** (apps/dashboard/package.json):
```json
"scripts": {
  "dev": "next dev -p 3001"
}
```

2. **.env.local** (apps/dashboard/.env.local):
```env
PORT=3001
```

3. **Scripts de inicio** (start-dashboard.bat y Start-VThinkDashboard.ps1)

## 📌 Mejores Prácticas

### ✅ HACER:
- Usar siempre el mismo gestor de paquetes (pnpm)
- Ejecutar `pnpm install` después de cada pull de git
- Usar los scripts de inicio proporcionados
- Mantener Node.js actualizado (>=18.0.0)
- Hacer commit del archivo pnpm-lock.yaml

### ❌ NO HACER:
- Mezclar npm, yarn y pnpm
- Instalar paquetes globalmente con diferentes gestores
- Ignorar warnings de versiones incompatibles
- Ejecutar como administrador (salvo necesario)
- Eliminar .next mientras el servidor está corriendo

## 🆘 Reseteo Completo (Último Recurso)

Si todo falla:
```powershell
# 1. Detener todos los procesos Node
taskkill /F /IM node.exe

# 2. Limpiar caché global
npm cache clean --force

# 3. Eliminar node_modules global de pnpm
pnpm store prune

# 4. Reinstalar desde cero
cd apps/dashboard
rm -rf node_modules .next pnpm-lock.yaml
pnpm install

# 5. Iniciar con el script
..\..\Start-VThinkDashboard.ps1
```

## 📊 Monitoreo de Salud

Para verificar que todo está bien:
```bash
# Verificar versiones
node --version  # Debe ser >=18.0.0
pnpm --version  # Cualquier versión reciente

# Verificar dependencias
cd apps/dashboard
pnpm list next react react-dom

# Verificar puerto
netstat -ano | findstr :3001
```

---

💡 **TIP**: Guarda esta guía y úsala cada vez que Next.js presente problemas. Los scripts automatizados resolverán el 90% de los casos.