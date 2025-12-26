# 🛡️ Estrategia de Backups - Bundui Monorepo

**Fecha:** 2025-12-18  
**Propósito:** Proteger el trabajo antes de cambios importantes

---

## 📋 Filosofía de Backups

**Regla de Oro:** 
> **NUNCA hacer cambios importantes sin backup previo**

**Definición de "cambio importante":**
- ✅ Migrar/copiar 3+ archivos
- ✅ Modificar estructura de directorios
- ✅ Actualizar componentes en `@vibethink/ui`
- ✅ Cambios que afectan múltiples apps
- ✅ Cualquier cambio que pueda romper algo

---

## 🛠️ Scripts de Backup

### **1. Crear Backup**

```bash
.\scripts\backup-bundui.ps1 -Description "Descripción del cambio"
```

**Ejemplo:**
```bash
.\scripts\backup-bundui.ps1 -Description "Antes de copiar Mail app desde VibeThink"
```

**Qué respalda:**
- ✅ `apps/dashboard/app/dashboard-bundui/` (todas las apps)
- ✅ `packages/ui/src/components/bundui/` (componentes custom)
- ✅ `packages/ui/src/index.ts` (exports)

**Output:**
- 📦 Crea directorio: `backups/bundui-backup_YYYY-MM-DD_HHMMSS/`
- 📄 Genera metadata: `BACKUP_INFO.txt`
- 📋 Actualiza índice: `BACKUP_INDEX.txt`

---

### **2. Listar Backups**

```bash
.\scripts\restore-bundui.ps1
```

**Output:**
```
📋 Backups disponibles:

   [1] bundui-backup_2025-12-18_215411
       📝 Backup inicial antes de Fase 1
       📊 1.46 MB
       ⏰ Hace 5 minutos

   [2] bundui-backup_2025-12-18_143022
       📝 Antes de arreglar products/orders
       📊 1.32 MB
       ⏰ Hace 2 horas
```

---

### **3. Restaurar Backup**

```bash
.\scripts\restore-bundui.ps1 -BackupName "bundui-backup_2025-12-18_215411"
```

**Proceso:**
1. ⚠️  Muestra información del backup
2. ⚠️  Pide confirmación (escribir "SI")
3. 🛑 Detiene servidor automáticamente
4. 📂 Restaura archivos
5. ✅ Confirma restauración

**⚠️ ADVERTENCIA:** Sobrescribe archivos actuales

---

## 📊 Estrategia de Backups por Fase

### **Fase 1: Verificación (Solo lectura - NO requiere backup)**

**Acciones:**
- ✅ Probar rutas en navegador
- ✅ Documentar errores
- ✅ No modificar archivos

**Backup:** ❌ NO necesario (solo lectura)

---

### **Fase 2: Clasificación (NO requiere backup)**

**Acciones:**
- ✅ Analizar errores
- ✅ Decidir estrategia
- ✅ Crear plan de acción

**Backup:** ❌ NO necesario (solo análisis)

---

### **Fase 3: Implementación (REQUIERE backups)**

#### **Antes de cada tipo de cambio:**

| Tipo de Cambio | Backup Necesario | Comando |
|----------------|------------------|---------|
| **Copiar app desde VibeThink** | ✅ SÍ | `.\scripts\backup-bundui.ps1 -Description "Antes de copiar [App] desde VibeThink"` |
| **Copiar componentes custom** | ✅ SÍ | `.\scripts\backup-bundui.ps1 -Description "Antes de copiar componente [Nombre]"` |
| **Arreglar imports (script)** | ✅ SÍ | `.\scripts\backup-bundui.ps1 -Description "Antes de arreglar imports en [Apps]"` |
| **Crear archivo data.json** | ❌ NO | (archivo individual, fácil revertir) |
| **Arreglar ruta en page.tsx** | ❌ NO | (cambio menor, fácil revertir) |

---

## 🎯 Workflow Recomendado

### **Antes de Implementar un Fix:**

```bash
# 1. Backup
.\scripts\backup-bundui.ps1 -Description "Antes de [descripción del cambio]"

# 2. Aplicar cambio
# ... hacer modificaciones ...

# 3. Verificar
npm run dev:dashboard
# Probar en navegador

# 4a. Si funciona → Commit
git add .
git commit -m "fix: [descripción]"

# 4b. Si falla → Restaurar backup
.\scripts\restore-bundui.ps1 -BackupName "bundui-backup_YYYY-MM-DD_HHMMSS"
```

---

## 📁 Estructura de Backups

```
backups/
├── bundui-backup_2025-12-18_215411/
│   ├── BACKUP_INFO.txt              ← Metadata
│   ├── apps/
│   │   └── dashboard/
│   │       └── app/
│   │           └── dashboard-bundui/  ← Todas las apps
│   ├── packages/
│   │   └── ui/
│   │       └── src/
│   │           ├── components/
│   │           │   └── bundui/      ← Componentes custom
│   │           └── index.ts         ← Exports
│   └── ...
├── bundui-backup_2025-12-18_143022/
├── BACKUP_INDEX.txt                 ← Índice de todos los backups
└── ...
```

---

## 🧹 Limpieza de Backups

### **Política de Retención:**

**Mantener:**
- ✅ Backups de las últimas 24 horas (todos)
- ✅ Backups semanales (últimos 4)
- ✅ Backups mensuales (últimos 3)

**Eliminar:**
- ❌ Backups >30 días (excepto marcados como "importantes")

### **Script de Limpieza (futuro):**

```bash
.\scripts\cleanup-old-backups.ps1 -KeepDays 30
```

---

## 📊 Estado Actual

### **Backup Inicial Creado:**

```
✅ Backup: bundui-backup_2025-12-18_215411
   Descripción: Backup inicial antes de Fase 1
   Archivos:    317
   Tamaño:      1.46 MB
   Status:      Listo para Fase 1
```

---

## 🎯 Backups Planeados para Fase 3

**Según resultados de Fase 1, planear backups antes de:**

1. **Copiar Mail app** (si falla y existe en VibeThink)
   ```bash
   .\scripts\backup-bundui.ps1 -Description "Antes de copiar Mail desde VibeThink"
   ```

2. **Copiar Calendar app** (si falla y existe en VibeThink)
   ```bash
   .\scripts\backup-bundui.ps1 -Description "Antes de copiar Calendar desde VibeThink"
   ```

3. **Crear componentes custom en @vibethink/ui** (si es necesario)
   ```bash
   .\scripts\backup-bundui.ps1 -Description "Antes de agregar componentes custom a @vibethink/ui"
   ```

---

## ⚡ Quick Reference

```bash
# Crear backup
.\scripts\backup-bundui.ps1 -Description "Tu descripción"

# Listar backups
.\scripts\restore-bundui.ps1

# Restaurar
.\scripts\restore-bundui.ps1 -BackupName "bundui-backup_YYYY-MM-DD_HHMMSS"

# Ver backup más reciente
Get-ChildItem backups\ | Sort-Object LastWriteTime -Descending | Select-Object -First 1
```

---

## ✅ Checklist de Seguridad

Antes de CUALQUIER cambio importante:

- [ ] ¿Tengo backup reciente? (Verificar: `.\scripts\restore-bundui.ps1`)
- [ ] ¿El backup se creó exitosamente? (Ver output del script)
- [ ] ¿Sé cómo restaurar? (Comando anotado)
- [ ] ¿Servidor está corriendo? (Para probar después)
- [ ] ¿Tengo commit reciente en git? (Segundo nivel de respaldo)

**Si todas las respuestas son SÍ → Proceder con cambio** ✅

---

## 🆘 Recuperación de Emergencia

### **Si algo sale mal:**

1. **DETENER servidor inmediatamente**
   ```bash
   .\scripts\stop-dashboard.ps1
   ```

2. **Listar backups disponibles**
   ```bash
   .\scripts\restore-bundui.ps1
   ```

3. **Restaurar backup más reciente**
   ```bash
   .\scripts\restore-bundui.ps1 -BackupName "bundui-backup_[TIMESTAMP]"
   ```

4. **Reiniciar servidor**
   ```bash
   .\scripts\start-dashboard.ps1
   ```

5. **Verificar que funciona**
   - Probar rutas que funcionaban antes

6. **Investigar qué salió mal**
   - Comparar backup vs estado actual
   - Ajustar estrategia

---

**🛡️ Con backups, podemos experimentar sin miedo** ✅













