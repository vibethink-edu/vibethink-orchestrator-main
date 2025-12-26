# 📦 Workflow de Assets - Asegurar que Todo esté en el Repo

**Fecha**: 2025-12-18  
**Objetivo**: Garantizar que TODOS los assets estén siempre en el repositorio local para todos los desarrolladores

---

## 🎯 **Principio Fundamental**

**TODOS los assets DEBEN estar en el repositorio Git**

```
✅ SIEMPRE: Assets en Git
❌ NUNCA: Assets ignorados por .gitignore
❌ NUNCA: Assets solo locales
❌ NUNCA: Assets faltantes después de git clone
```

---

## 📁 **Ubicación de Assets en Repo**

**Todos los assets están en:**
```
apps/dashboard/public/assets/
```

**Este directorio DEBE estar en Git:**
```bash
# Verificar que NO está en .gitignore
git check-ignore apps/dashboard/public/assets/
# Debe retornar NADA (no ignorado)
```

---

## ✅ **Reglas para Asegurar Assets en Repo**

### **1. .gitignore NO debe ignorar assets/**

Verificar en `.gitignore`:
```
# ✅ CORRECTO - NO ignorar assets
# NO debe haber:
# /public/assets/
# apps/dashboard/public/assets/
# *.png
# *.jpg
# *.svg

# ❌ INCORRECTO - Ignorar assets
/public/assets/
*.png
*.jpg
```

**Excepción permitida:**
```
# ✅ OK ignorar directorio temporal/antiguo
/public/images/
```

---

### **2. Todos los Assets deben estar Trackeados**

**Verificar qué assets están en Git:**
```bash
# Ver assets en Git
git ls-files apps/dashboard/public/assets/

# Si falta alguno, agregarlo:
git add apps/dashboard/public/assets/[ruta]/[archivo]
```

---

### **3. No usar Assets Externos sin Agregar al Repo**

```typescript
// ❌ INCORRECTO - Asset externo no en repo
<img src="https://example.com/image.png" />

// ✅ CORRECTO - Asset en repo
<img src="/assets/images/avatars/user-default.png" />
```

**Si necesitas usar asset externo:**
1. Descargarlo
2. Agregarlo al repo (`apps/dashboard/public/assets/`)
3. Referenciarlo desde el repo

---

## 🔄 **Workflow para Nuevos Assets**

### **Paso 1: Agregar Asset al Repo**

```bash
# 1. Copiar asset a ubicación correcta
cp nuevo-asset.png apps/dashboard/public/assets/images/[categoria]/

# 2. Agregar a Git INMEDIATAMENTE
git add apps/dashboard/public/assets/images/[categoria]/nuevo-asset.png

# 3. Commit
git commit -m "feat: Agregar nuevo asset - nuevo-asset.png"
```

---

### **Paso 2: Usar Asset en Código**

```typescript
// Usar ruta absoluta desde /assets/
<img src="/assets/images/[categoria]/nuevo-asset.png" />
```

---

### **Paso 3: Verificar que Está en Git**

```bash
# Verificar que el archivo está trackeado
git ls-files | grep "nuevo-asset.png"

# Debe mostrar:
# apps/dashboard/public/assets/images/[categoria]/nuevo-asset.png
```

---

## 🚨 **Validación Pre-Commit**

### **Script de Validación**

**Ubicación**: `scripts/validate-assets-in-repo.js`

Este script verifica:
1. ✅ Todos los assets están en Git
2. ✅ No hay assets ignorados por .gitignore
3. ✅ Referencias apuntan a assets que existen en el repo

**Ejecutar antes de commit:**
```bash
node scripts/validate-assets-in-repo.js
```

---

### **Git Hook Pre-Commit (Opcional)**

Para automatizar la validación:

```bash
# .git/hooks/pre-commit
#!/bin/sh
node scripts/validate-assets-in-repo.js
if [ $? -ne 0 ]; then
  echo "❌ Validación de assets falló. Revisa los errores."
  exit 1
fi
```

---

## 📋 **Checklist Pre-Commit para Assets**

Antes de hacer commit:

- [ ] **Asset está en `apps/dashboard/public/assets/`**
  ```bash
  ls apps/dashboard/public/assets/images/[categoria]/[archivo]
  ```

- [ ] **Asset está agregado a Git**
  ```bash
  git status | grep "assets"
  # Debe mostrar el archivo como "new file" o "modified"
  ```

- [ ] **NO está en .gitignore**
  ```bash
  git check-ignore apps/dashboard/public/assets/[ruta]
  # Debe retornar NADA
  ```

- [ ] **Referencias usan ruta absoluta**
  ```typescript
  // ✅ CORRECTO
  src="/assets/images/..."
  
  // ❌ INCORRECTO
  src="https://external.com/..."
  src="../images/..."
  ```

- [ ] **Validación pasa**
  ```bash
  node scripts/validate-assets-in-repo.js
  ```

---

## 🔍 **Comandos Útiles**

### **Verificar Assets en Git**

```bash
# Listar todos los assets trackeados
git ls-files apps/dashboard/public/assets/

# Verificar si un asset específico está en Git
git ls-files apps/dashboard/public/assets/images/avatars/01.png

# Ver assets modificados
git status apps/dashboard/public/assets/
```

### **Agregar Assets Faltantes**

```bash
# Agregar un asset específico
git add apps/dashboard/public/assets/images/[categoria]/[archivo]

# Agregar todos los assets nuevos
git add apps/dashboard/public/assets/

# Ver qué se agregó
git status
```

### **Verificar .gitignore**

```bash
# Ver si un path está ignorado
git check-ignore -v apps/dashboard/public/assets/images/test.png

# Ver todo .gitignore que afecta assets
git check-ignore -v apps/dashboard/public/assets/**/*
```

---

## 🚨 **Problemas Comunes**

### **Problema 1: Asset no aparece después de git clone**

**Síntoma:**
```
Error: Cannot find module '/assets/images/avatar.png'
```

**Solución:**
```bash
# 1. Verificar que el asset está en Git
git ls-files | grep "avatar.png"

# 2. Si NO está, alguien olvidó agregarlo
# Pedirle que haga:
git add apps/dashboard/public/assets/images/avatars/avatar.png
git commit -m "fix: Agregar asset faltante - avatar.png"
git push

# 3. Hacer pull
git pull
```

---

### **Problema 2: Asset está en .gitignore**

**Síntoma:**
```bash
git add apps/dashboard/public/assets/images/test.png
# No pasa nada, no se agrega
```

**Solución:**
```bash
# 1. Verificar .gitignore
git check-ignore -v apps/dashboard/public/assets/images/test.png

# 2. Ver qué regla lo está ignorando
# Ejemplo output: .gitignore:45:*.png    apps/dashboard/public/assets/images/test.png

# 3. Ajustar .gitignore para NO ignorar assets/
# NO debe haber:
# *.png
# /public/assets/
# apps/dashboard/public/assets/
```

---

### **Problema 3: Asset existe pero no está trackeado**

**Síntoma:**
```bash
ls apps/dashboard/public/assets/images/avatar.png  # ✅ Existe
git ls-files | grep "avatar.png"  # ❌ No está en Git
```

**Solución:**
```bash
# Agregar al repo
git add apps/dashboard/public/assets/images/avatar.png
git commit -m "fix: Trackear asset - avatar.png"
```

---

## 📝 **Ejemplo de Workflow Completo**

### **Agregar un Nuevo Avatar**

```bash
# 1. Descargar/crear imagen
# ... obtener user-avatar-new.png ...

# 2. Copiar a repo
cp user-avatar-new.png apps/dashboard/public/assets/images/avatars/user-avatar-new.png

# 3. Agregar a Git INMEDIATAMENTE
git add apps/dashboard/public/assets/images/avatars/user-avatar-new.png

# 4. Verificar que está agregado
git status
# Debe mostrar: new file: apps/dashboard/public/assets/images/avatars/user-avatar-new.png

# 5. Validar
node scripts/validate-assets-in-repo.js

# 6. Commit
git commit -m "feat: Agregar nuevo avatar - user-avatar-new.png"

# 7. Push
git push
```

### **Usar en Código**

```typescript
// components/UserAvatar.tsx
<Avatar>
  <AvatarImage src="/assets/images/avatars/user-avatar-new.png" />
</Avatar>
```

---

## 🔧 **Scripts de Validación**

### **1. Validar Assets en Repo**

```bash
node scripts/validate-assets-in-repo.js
```

**Qué verifica:**
- ✅ Todos los assets están en Git
- ✅ No hay assets ignorados
- ✅ Referencias apuntan a assets que existen

---

### **2. Auditoría Completa**

```bash
node scripts/audit-assets.js
```

**Qué verifica:**
- ✅ Assets existentes
- ✅ Referencias en código
- ✅ Assets sin usar
- ✅ Referencias rotas

---

### **3. Validar Duplicados**

```bash
node scripts/validate-assets-duplicates.js
```

**Qué verifica:**
- ✅ No hay duplicados de assets

---

## 📚 **Reglas de Oro**

1. **✅ SIEMPRE agregar assets a Git inmediatamente**
   ```bash
   # Después de copiar asset
   git add apps/dashboard/public/assets/[ruta]/[archivo]
   ```

2. **✅ NUNCA usar assets externos sin agregarlos al repo**
   ```typescript
   // ❌ NO
   src="https://external.com/image.png"
   
   // ✅ SÍ
   src="/assets/images/..."
   ```

3. **✅ SIEMPRE verificar antes de commit**
   ```bash
   node scripts/validate-assets-in-repo.js
   ```

4. **✅ NUNCA ignorar directorio assets/ en .gitignore**
   ```
   # ❌ NO hacer esto
   /public/assets/
   *.png
   ```

5. **✅ SIEMPRE usar rutas absolutas desde /assets/**
   ```typescript
   // ✅ CORRECTO
   src="/assets/images/avatars/01.png"
   
   // ❌ INCORRECTO
   src="../images/avatars/01.png"
   ```

---

## 🎯 **Objetivo Final**

**Garantizar que:**
- ✅ Todos los assets están en el repositorio Git
- ✅ Después de `git clone`, todos los assets están disponibles
- ✅ No hay dependencias externas de assets
- ✅ El proyecto funciona completamente sin conexión a internet (para assets)

---

**Última actualización**: 2025-12-18  
**Estado**: ✅ DOCUMENTO ACTIVO  
**Próximo paso**: Ejecutar validación y corregir cualquier issue











