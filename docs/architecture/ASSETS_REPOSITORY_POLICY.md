# 🗂️ Política de Repositorio Único de Assets

**Fecha**: 2025-12-18  
**Estado**: ✅ ACTIVA  
**Objetivo**: Centralizar todos los assets (media/imágenes) en un único repositorio para evitar duplicados y preparar para CDN

---

## 🎯 **Principios Fundamentales**

### **1. Repositorio Único**
```
❌ NUNCA: Assets duplicados en múltiples ubicaciones
✅ SIEMPRE: Un solo lugar para todos los assets
```

### **2. Sin Duplicados**
```
❌ NUNCA: Misma imagen en dos lugares diferentes
✅ SIEMPRE: Referencia única a cada asset
```

### **3. Preparado para CDN**
```
✅ Estructura compatible con CDN futuro
✅ Nombres únicos y descriptivos
✅ Organización clara por categorías
```

### **4. Autonomía de Dashboards**
```
✅ dashboard-bundui y dashboard-vibethink comparten assets
✅ No duplicación entre sistemas
✅ Mismo repositorio para ambos
```

---

## 📁 **Estructura del Repositorio**

### **Ubicación Centralizada**

```
apps/dashboard/public/assets/
├── images/              # Imágenes (PNG, JPG, JPEG, WebP)
│   ├── avatars/        # Avatares de usuarios
│   ├── products/       # Imágenes de productos
│   ├── icons/          # Iconos de aplicación
│   ├── logos/          # Logos y branding
│   ├── backgrounds/    # Fondos y patterns
│   └── common/         # Imágenes comunes compartidas
│
├── media/              # Videos y animaciones
│   ├── videos/         # Archivos de video
│   └── animations/     # GIFs y animaciones
│
├── fonts/              # Fuentes personalizadas (si aplica)
│
└── docs/               # Documentación de assets
    └── ASSETS_CATALOG.md  # Catálogo de todos los assets
```

---

## 🚨 **Reglas Críticas**

### **✅ SIEMPRE**

1. **Usar la ubicación centralizada**
   ```typescript
   // ✅ CORRECTO
   <img src="/assets/images/avatars/01.png" />
   <Image src="/assets/images/products/01.jpeg" />
   ```

2. **Nombres únicos y descriptivos**
   ```typescript
   // ✅ CORRECTO
   user-avatar-default.png
   product-placeholder-image.jpg
   
   // ❌ INCORRECTO
   01.png
   img.jpg
   ```

3. **Organizar por categorías**
   ```
   ✅ images/avatars/user-avatar-default.png
   ✅ images/products/product-placeholder.jpg
   ✅ images/icons/icon-check.svg
   ```

4. **Referencias absolutas desde root**
   ```typescript
   // ✅ CORRECTO - Desde /assets/
   src="/assets/images/avatars/01.png"
   
   // ❌ INCORRECTO - Relativas
   src="../assets/avatars/01.png"
   src="./images/01.png"
   ```

### **❌ NUNCA**

1. **NO duplicar assets**
   ```
   ❌ assets/images/avatars/01.png
   ❌ components/user/assets/01.png  (DUPLICADO)
   ```

2. **NO usar rutas relativas**
   ```typescript
   ❌ src="../assets/image.png"
   ❌ src="./image.png"
   ```

3. **NO almacenar en componentes**
   ```
   ❌ components/user/avatar.png
   ❌ dashboard-bundui/images/...
   ❌ dashboard-vibethink/images/...
   ```

4. **NO usar nombres genéricos**
   ```
   ❌ 01.png, 02.png, img.jpg
   ✅ user-avatar-default.png, product-placeholder.jpg
   ```

---

## 🔄 **Migración de Assets Existentes**

### **Estado Actual**

Los assets actualmente están en:
```
apps/dashboard/public/images/
├── avatars/
├── products/
└── [varios archivos]
```

### **Plan de Migración**

**Fase 1: Reorganizar estructura existente**
```
apps/dashboard/public/images/  →  apps/dashboard/public/assets/images/
```

**Fase 2: Actualizar referencias**
```typescript
// Antes
src="/images/avatars/01.png"

// Después
src="/assets/images/avatars/01.png"
```

**Fase 3: Validar sin duplicados**
- Script de validación
- Reporte de duplicados
- Eliminación de duplicados

**Fase 4: Documentar catálogo**
- Lista completa de assets
- Metadatos (tamaño, formato, uso)
- Referencias en código

---

## 📋 **Workflow de Nuevos Assets**

### **Cuando agregas un nuevo asset:**

1. **Verificar si ya existe**
   ```bash
   # Buscar si ya existe un asset similar
   find apps/dashboard/public/assets -name "*avatar*"
   ```

2. **Usar asset existente si aplica**
   ```typescript
   // ✅ Si existe asset similar, reutilizar
   // ❌ NO crear nuevo si hay equivalente
   ```

3. **Si no existe, agregar al repositorio central**
   ```bash
   # Copiar al lugar correcto
   cp new-asset.png apps/dashboard/public/assets/images/[categoria]/
   ```

4. **Nombrar descriptivamente**
   ```bash
   # ✅ Buen nombre
   user-avatar-admin-male.png
   
   # ❌ Mal nombre
   avatar1.png
   ```

5. **Actualizar catálogo**
   ```markdown
   # docs/assets/ASSETS_CATALOG.md
   - user-avatar-admin-male.png
     - Categoría: avatars
     - Uso: Avatar de usuario administrador masculino
     - Tamaño: 128x128px
   ```

---

## 🔍 **Validación y Auditoría**

### **Scripts de Validación**

**1. Detectar Duplicados**
```bash
node scripts/validate-assets-duplicates.js
```

**2. Verificar Referencias**
```bash
node scripts/validate-assets-references.js
```

**3. Auditoría Completa**
```bash
node scripts/audit-assets.js
```

### **Checklist Pre-Commit**

Antes de commit, verificar:
- [ ] Asset está en `/assets/` (no duplicado)
- [ ] Nombre es descriptivo (no genérico)
- [ ] Referencia usa ruta absoluta `/assets/...`
- [ ] No hay assets sin usar
- [ ] Catálogo actualizado (si es nuevo asset)

---

## 🌐 **Preparación para CDN**

### **Estructura Compatible con CDN**

Cuando se implemente CDN, la estructura permite:

```typescript
// Desarrollo local
const CDN_BASE = process.env.NEXT_PUBLIC_CDN_URL || '';
const imageUrl = `${CDN_BASE}/assets/images/avatars/01.png`;

// Producción con CDN
// CDN_BASE = 'https://cdn.vibethink.com'
// imageUrl = 'https://cdn.vibethink.com/assets/images/avatars/01.png'
```

### **Configuración Futura**

```typescript
// lib/assets.ts
export const ASSETS_BASE = process.env.NEXT_PUBLIC_CDN_URL || '/assets';

export function getAssetUrl(path: string): string {
  return `${ASSETS_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

// Uso
import { getAssetUrl } from '@/lib/assets';
<img src={getAssetUrl('/images/avatars/01.png')} />
```

---

## 📊 **Organización por Sistema**

### **Assets Compartidos**

```
assets/images/common/
├── logo.svg              # Logo de la plataforma
├── placeholder.jpg       # Placeholder genérico
└── ...
```

### **Assets por Dashboard (si es necesario)**

```
assets/images/dashboards/
├── bundui/
│   └── [assets específicos de Bundui]
└── vibethink/
    └── [assets específicos de VibeThink]
```

**Nota**: Preferir assets compartidos. Solo usar assets específicos si son realmente exclusivos de un dashboard.

---

## 🚨 **Prohibiciones Estrictas**

### **NO Hacer:**

1. ❌ **Crear directorios de assets dentro de componentes**
   ```
   ❌ components/user/assets/
   ❌ dashboard-bundui/components/avatar/images/
   ```

2. ❌ **Duplicar assets entre dashboards**
   ```
   ❌ dashboard-bundui/public/images/avatar.png
   ❌ dashboard-vibethink/public/images/avatar.png
   ✅ assets/images/avatars/avatar.png (único)
   ```

3. ❌ **Usar rutas relativas**
   ```typescript
   ❌ src="../images/avatar.png"
   ❌ src="./avatar.png"
   ✅ src="/assets/images/avatars/avatar.png"
   ```

4. ❌ **Referencias hardcodeadas a ubicaciones externas**
   ```typescript
   ❌ src="https://example.com/image.png" (a menos que sea necesario)
   ✅ src="/assets/images/..." (preferir local)
   ```

---

## ✅ **Ejemplos Correctos**

### **Avatar de Usuario**
```typescript
// ✅ CORRECTO
<Avatar>
  <AvatarImage src="/assets/images/avatars/user-default.png" />
</Avatar>
```

### **Imagen de Producto**
```typescript
// ✅ CORRECTO
<Image 
  src="/assets/images/products/product-placeholder.jpg"
  alt="Product placeholder"
  width={300}
  height={300}
/>
```

### **Logo de la Plataforma**
```typescript
// ✅ CORRECTO
<Image 
  src="/assets/images/logos/vibethink-logo.svg"
  alt="VibeThink Logo"
  width={120}
  height={40}
/>
```

---

## 📝 **Catálogo de Assets**

### **Ubicación**: `docs/assets/ASSETS_CATALOG.md`

El catálogo debe incluir:
- Lista completa de assets
- Categoría
- Uso/Descripción
- Tamaño
- Formato
- Dónde se usa (referencias)

**Ver**: `docs/assets/ASSETS_CATALOG.md`

---

## 🔧 **Scripts de Mantenimiento**

### **1. Validar Duplicados**
```bash
node scripts/validate-assets-duplicates.js
```

### **2. Auditoría Completa**
```bash
node scripts/audit-assets.js
```

### **3. Generar Catálogo**
```bash
node scripts/generate-assets-catalog.js
```

### **4. Migrar Assets Antiguos**
```bash
node scripts/migrate-assets-to-central.js
```

---

## 📚 **Referencias**

- Next.js Public Folder: https://nextjs.org/docs/app/building-your-application/optimizing/static-assets
- CDN Integration: (Documentación futura)

---

**Última actualización**: 2025-12-18  
**Próximos pasos**: 
1. ✅ Migrar estructura existente
2. ⏸️ Actualizar referencias
3. ⏸️ Validar duplicados
4. ⏸️ Preparar para CDN

