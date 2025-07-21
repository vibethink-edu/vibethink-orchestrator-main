# 🏗️ REGLAS DE ARQUITECTURA - VThink 1.0

## 🎯 **ARQUITECTURA OBLIGATORIA - MONOREPO PURO**

### **✅ ESTRUCTURA CORRECTA (ÚNICA PERMITIDA)**

```
VibeThink-Orchestrator/
├── apps/                          # 🎯 APLICACIONES INDEPENDIENTES
│   ├── main-app/                  # Aplicación principal (Next.js)
│   │   ├── package.json
│   │   ├── app/                   # Next.js App Router
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── (auth)/            # Route groups
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/       # Route groups
│   │   │   │   ├── dashboard/
│   │   │   │   ├── admin/
│   │   │   │   └── helpdesk/
│   │   │   └── globals.css
│   │   └── .next/
│   ├── admin/                     # Panel de administración
│   │   ├── package.json
│   │   ├── app/
│   │   └── .next/
│   ├── login/                     # Autenticación independiente
│   │   ├── package.json
│   │   ├── app/
│   │   └── .next/
│   └── helpdesk/                  # Sistema de soporte
│       ├── package.json
│       ├── app/
│       └── .next/
├── src/                           # 🎯 CÓDIGO COMPARTIDO
│   ├── shared/                    # Componentes compartidos
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   ├── lib/                       # Utilidades
│   ├── integrations/              # Integraciones externas
│   │   ├── supabase/
│   │   ├── medusa/
│   │   └── strapi/
│   └── modules/                   # Módulos de negocio
├── docs/                          # Documentación
├── dev-tools/                     # Herramientas de desarrollo
└── [archivos de configuración]
```

## 🚨 **ESTRUCTURAS PROHIBIDAS**

### **❌ NUNCA PERMITIR:**

#### **1. src/app/ (Next.js App Router en src/)**
```
❌ INCORRECTO:
src/
├── app/                          # PROHIBIDO
│   ├── layout.tsx
│   ├── page.tsx
│   └── dashboard/
```

#### **2. src/apps/ (Aplicaciones conceptuales)**
```
❌ INCORRECTO:
src/
├── apps/                         # PROHIBIDO
│   ├── admin/
│   ├── dashboard/
│   └── login/
```

#### **3. Mezcla de arquitecturas**
```
❌ INCORRECTO:
├── src/app/                      # App Router
├── src/apps/                     # Apps conceptuales
└── apps/                         # Monorepo workspaces
```

## ✅ **REGLAS OBLIGATORIAS**

### **1. APLICACIONES INDEPENDIENTES (apps/)**
```typescript
// ✅ CORRECTO: Cada app es independiente
apps/main-app/
├── package.json                   # Dependencias propias
├── app/                          # Next.js App Router
├── components/                    # Componentes específicos
└── .next/                        # Build específico

apps/admin/
├── package.json                   # Dependencias propias
├── app/                          # Next.js App Router
├── components/                    # Componentes específicos
└── .next/                        # Build específico
```

### **2. CÓDIGO COMPARTIDO (src/)**
```typescript
// ✅ CORRECTO: Código reutilizable
src/shared/
├── components/                    # Componentes compartidos
├── hooks/                        # Hooks compartidos
├── utils/                        # Utilidades
└── types/                        # Tipos TypeScript

src/integrations/
├── supabase/                     # Integración Supabase
├── medusa/                       # Integración Medusa
└── strapi/                       # Integración Strapi
```

### **3. IMPORTACIÓN CORRECTA**
```typescript
// ✅ CORRECTO: Importar desde src/shared
import { Button } from '@/shared/components';
import { useAuth } from '@/shared/hooks';
import { apiClient } from '@/shared/utils';

// ❌ INCORRECTO: Importar desde apps
import { Button } from '@/apps/shared/components';
```

## 🔧 **MIGRACIÓN OBLIGATORIA**

### **Paso 1: Crear estructura correcta**
```bash
# ✅ Crear aplicaciones independientes
mkdir -p apps/main-app/app
mkdir -p apps/admin/app
mkdir -p apps/login/app
mkdir -p apps/helpdesk/app

# ✅ Crear código compartido
mkdir -p src/shared/components
mkdir -p src/shared/hooks
mkdir -p src/shared/utils
mkdir -p src/shared/types
```

### **Paso 2: Migrar desde src/app/**
```bash
# ✅ Migrar a apps/main-app/
Move-Item -Path "src/app/*" -Destination "apps/main-app/app/" -Force
```

### **Paso 3: Migrar desde src/apps/**
```bash
# ✅ Migrar componentes a src/shared/
Move-Item -Path "src/apps/*/components" -Destination "src/shared/components/" -Force
```

### **Paso 4: Limpiar estructuras prohibidas**
```bash
# ✅ Eliminar src/app/ (prohibido)
Remove-Item -Path "src/app" -Recurse -Force

# ✅ Eliminar src/apps/ (prohibido)
Remove-Item -Path "src/apps" -Recurse -Force
```

## 📋 **VALIDACIÓN AUTOMÁTICA**

### **Script de Validación de Arquitectura**
```javascript
// validate-architecture.js
const architectureRules = {
  // ✅ Estructuras permitidas
  allowed: [
    'apps/main-app/',
    'apps/admin/',
    'apps/login/',
    'apps/helpdesk/',
    'src/shared/',
    'src/lib/',
    'src/integrations/',
    'src/modules/'
  ],
  
  // ❌ Estructuras prohibidas
  prohibited: [
    'src/app/',
    'src/apps/',
    'apps/shared/',
    'apps/lib/'
  ]
};
```

### **Checklist de Validación**
- [ ] No existe `src/app/`
- [ ] No existe `src/apps/`
- [ ] Existe `apps/main-app/`
- [ ] Existe `src/shared/`
- [ ] Aplicaciones son independientes
- [ ] Código compartido en `src/`

## 🎯 **JUSTIFICACIÓN DE LA ARQUITECTURA**

### **¿Por qué Monorepo Puro?**

#### **1. Separación de Responsabilidades**
- **apps/**: Aplicaciones independientes con su propio ciclo de vida
- **src/**: Código compartido reutilizable
- **docs/**: Documentación centralizada
- **dev-tools/**: Herramientas de desarrollo

#### **2. Escalabilidad**
- Cada app puede desplegarse independientemente
- Código compartido se mantiene actualizado
- Nuevas apps se crean fácilmente

#### **3. Mantenimiento**
- Estructura clara y predecible
- Fácil navegación y búsqueda
- Testing independiente por app

#### **4. VThink 1.0 Compliance**
- Multi-tenant architecture
- Role-based access control
- Modular design
- CMMI-ML3 standards

## 🚨 **VIOLACIONES CRÍTICAS**

### **NUNCA PERMITIR:**
- Aplicaciones en `src/`
- Código compartido en `apps/`
- Mezcla de arquitecturas
- Duplicación de funcionalidad

### **SIEMPRE VERIFICAR:**
- Estructura de carpetas
- Importaciones correctas
- Separación de responsabilidades
- Independencia de aplicaciones

## 📊 **BENEFICIOS DE LA ESTANDARIZACIÓN**

### **Performance de Prompting:**
- **Navegación rápida**: Estructura predecible
- **Contexto reducido**: Solo categorías relevantes
- **Búsqueda eficiente**: Ubicaciones estandarizadas
- **Respuestas más rápidas**: Menos exploración necesaria

### **Desarrollo:**
- **Onboarding rápido**: Estructura clara
- **Debugging fácil**: Separación de responsabilidades
- **Testing independiente**: Por aplicación
- **Deployment flexible**: Por aplicación

---

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

Antes de cada commit:

- [ ] No existe `src/app/`
- [ ] No existe `src/apps/`
- [ ] Aplicaciones en `apps/`
- [ ] Código compartido en `src/`
- [ ] Importaciones correctas
- [ ] Estructura validada
- [ ] Documentación actualizada

---

**⚠️ IMPORTANTE: Esta arquitectura es OBLIGATORIA y NO NEGOCIABLE** 