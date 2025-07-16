# Scripts de Actualización Segura - AI Pair Orchestrator Pro

## 🛡️ **Sistema de Actualización con Rollback Automático**

Este directorio contiene scripts para actualizar dependencias de forma segura, con la capacidad de revertir cambios automáticamente si algo sale mal.

## 📁 **Scripts Disponibles**

### 1. **backup-simple.ps1** - Crear Backup (Recomendado)
```powershell
.\scripts\backup-simple.ps1
```
- ✅ **FUNCIONA CORRECTAMENTE** - Sin caracteres Unicode problemáticos
- Crea copias de seguridad de archivos críticos
- Documenta el estado actual del proyecto
- Genera archivo de estado con timestamp

### 2. **rollback-simple.ps1** - Restaurar Estado Anterior (Recomendado)
```powershell
.\scripts\rollback-simple.ps1
```
- ✅ **FUNCIONA CORRECTAMENTE** - Sin caracteres Unicode problemáticos
- Restaura archivos desde los backups
- Reinstala dependencias originales
- Verifica que todo funcione correctamente

### 3. **safe-update.ps1** - Actualización Segura
```powershell
# Actualizar React a v19
.\scripts\safe-update.ps1 -UpdateType react19

# Actualizar TypeScript
.\scripts\safe-update.ps1 -UpdateType typescript

# Actualizar Vite
.\scripts\safe-update.ps1 -UpdateType vite

# Actualizar Tailwind CSS
.\scripts\safe-update.ps1 -UpdateType tailwind

# Actualizar todo
.\scripts\safe-update.ps1 -UpdateType all

# Omitir backup (no recomendado)
.\scripts\safe-update.ps1 -UpdateType react19 -SkipBackup

# Forzar actualización sin rollback automático
.\scripts\safe-update.ps1 -UpdateType react19 -Force
```

## 🎯 **Tipos de Actualización Disponibles**

| Tipo | Descripción | Riesgo | Beneficio |
|------|-------------|--------|-----------|
| `react19` | React 19 RC | 🟡 Medio | 🟢 Alto |
| `typescript` | TypeScript Latest | 🟢 Bajo | 🟢 Alto |
| `vite` | Vite Latest | 🟡 Medio | 🟢 Alto |
| `tailwind` | Tailwind CSS v4 | 🔴 Alto | 🟡 Medio |
| `all` | Todas las actualizaciones | 🔴 Alto | 🟢 Alto |

## 🔄 **Flujo de Trabajo Recomendado**

### **Paso 1: Crear Backup**
```powershell
.\scripts\backup-simple.ps1
```

### **Paso 2: Actualizar Incrementalmente**
```powershell
# Empezar con TypeScript (más seguro)
.\scripts\safe-update.ps1 -UpdateType typescript

# Luego React 19
.\scripts\safe-update.ps1 -UpdateType react19

# Finalmente Vite
.\scripts\safe-update.ps1 -UpdateType vite
```

### **Paso 3: Verificar Funcionalidad**
- Navegar a `http://localhost:8081/dashboard`
- Verificar que el layout funciona
- Comprobar que no hay errores en consola

### **Paso 4: Rollback si es Necesario**
```powershell
.\scripts\rollback-simple.ps1
```

## 🚨 **Señales de Alerta**

Si ves alguno de estos problemas, ejecuta rollback inmediatamente:

- ❌ Errores de TypeScript
- ❌ Build falla
- ❌ Layout se rompe
- ❌ Autenticación no funciona
- ❌ Performance degradada significativamente
- ❌ Errores en consola del navegador

## 📋 **Archivos de Backup Creados**

Los scripts crean los siguientes archivos de backup:

- `package.json.backup`
- `package-lock.json.backup`
- `tsconfig.json.backup`
- `tailwind.config.js.backup` (si existe)
- `src/index.css.backup` (si existe)
- `backup-state-YYYYMMDD-HHMMSS.json`

## 🔧 **Comandos de Verificación Manual**

```powershell
# Verificar TypeScript
npm run type-check

# Verificar build
npm run build

# Verificar desarrollo
npm run dev

# Verificar que no hay errores
npm run lint
```

## 📝 **Logs y Debugging**

Los scripts generan logs detallados con colores:

- 🟢 **Verde**: Operación exitosa
- 🟡 **Amarillo**: Advertencia o información
- 🔴 **Rojo**: Error crítico
- 🔵 **Azul**: Información importante

## 🎯 **Ejemplos de Uso**

### **Actualización Gradual (Recomendado)**
```powershell
# 1. Backup
.\scripts\backup-simple.ps1

# 2. TypeScript (más seguro)
.\scripts\safe-update.ps1 -UpdateType typescript

# 3. Verificar
npm run dev

# 4. Si todo está bien, continuar con React
.\scripts\safe-update.ps1 -UpdateType react19
```

### **Actualización Completa (Riesgoso)**
```powershell
# Backup automático incluido
.\scripts\safe-update.ps1 -UpdateType all
```

### **Rollback de Emergencia**
```powershell
# Si algo sale mal
.\scripts\rollback-simple.ps1
```

## ⚠️ **Precauciones**

1. **Siempre crear backup** antes de actualizar
2. **Actualizar incrementalmente** en lugar de todo de una vez
3. **Verificar funcionalidad** después de cada actualización
4. **Tener rollback listo** en caso de problemas
5. **Documentar cambios** para referencia futura

## 🆘 **Solución de Problemas**

### **Error: "No se encontró package.json"**
- Asegúrate de estar en el directorio raíz del proyecto
- Verifica que el archivo `package.json` existe

### **Error: "Backup falló"**
- Verifica permisos de escritura en el directorio
- Asegúrate de que hay espacio en disco

### **Error: "Rollback falló"**
- Verifica que existen los archivos de backup
- Ejecuta `.\scripts\backup-simple.ps1` primero

### **Error: "TypeScript check falló"**
- Revisa los errores específicos de TypeScript
- Considera hacer rollback si hay muchos errores

### **Error con caracteres Unicode**
- Usa los scripts `-simple.ps1` que no tienen caracteres Unicode
- Los scripts originales pueden tener problemas en algunos sistemas

## 🔄 **Scripts Alternativos**

Si los scripts principales no funcionan, usa estos:

```powershell
# Backup simplificado (sin Unicode)
.\scripts\backup-simple.ps1

# Rollback simplificado (sin Unicode)
.\scripts\rollback-simple.ps1
```

## 📊 **Estado de los Scripts**

| Script | Estado | Problema |
|--------|--------|----------|
| `backup.ps1` | ❌ Error | Caracteres Unicode |
| `rollback.ps1` | ❌ Error | Caracteres Unicode |
| `backup-simple.ps1` | ✅ Funciona | Sin problemas |
| `rollback-simple.ps1` | ✅ Funciona | Sin problemas |
| `safe-update.ps1` | ⚠️ Pendiente | Necesita testing |

---

**Principio Fundamental**: Nunca comprometer la estabilidad del proyecto. Si hay cualquier duda, mantener la versión actual.

**Última Actualización**: Diciembre 2024  
**Estado**: ✅ Sistema de backup/rollback funcionando  
**Recomendación**: Usar scripts `-simple.ps1` para máxima compatibilidad 