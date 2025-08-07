# 📦 REGLAS DE DEPENDENCIAS - MONOREPO CENTRALIZADO

## 🎯 **REGLAS OBLIGATORIAS**

### **✅ DEPENDENCIAS EN ROOT ÚNICAMENTE:**
```bash
# ✅ CORRECTO - Instalar en root
npm install react@19.1.1 next@15.4.6

# ❌ INCORRECTO - Instalar en apps
cd apps/dashboard && npm install react
```

### **✅ APPS SOLO CONFIGURACIÓN ESPECÍFICA:**
```json
// ✅ apps/dashboard/package.json - SOLO esto
{
  "scripts": {
    "dev": "next dev -p 3001"
  },
  "devDependencies": {
    "tailwindcss": "^4.1.11",
    "postcss": "^8.4.31"
  }
}
```

### **✅ VERSIONES ÚNICAS:**
```json
// ✅ root/package.json - VERSIONES ÚNICAS
{
  "dependencies": {
    "react": "^19.1.1",        // ✅ ÚNICA versión
    "next": "^15.4.6",         // ✅ ÚNICA versión
    "clsx": "^2.1.1"           // ✅ ÚNICA versión
  }
}
```

## 🔧 **VALIDACIÓN AUTOMÁTICA**

### **SCRIPT DE VALIDACIÓN:**
```bash
npm run validate:dependencies
```

### **CHECKLIST OBLIGATORIO:**
- [ ] ✅ No hay dependencias duplicadas
- [ ] ✅ Todas las versiones son únicas
- [ ] ✅ Apps solo tienen configuración específica
- [ ] ✅ Root tiene todas las dependencias compartidas

## 🚨 **VIOLACIONES PROHIBIDAS**

### **❌ NUNCA PERMITIR:**
```bash
# ❌ Instalar en apps
cd apps/dashboard && npm install react

# ❌ Versiones diferentes
root: "react": "^18"
dashboard: "react": "^19"

# ❌ Dependencias duplicadas
root: "clsx": "^2.1.1"
dashboard: "clsx": "^2.1.1"
```

## 📋 **PROCEDIMIENTO DE INSTALACIÓN**

### **1. PARA DEPENDENCIAS COMPARTIDAS:**
```bash
# ✅ Desde root
npm install nueva-dependencia
```

### **2. PARA CONFIGURACIÓN ESPECÍFICA:**
```bash
# ✅ Solo en apps específicas
cd apps/dashboard && npm install -D tailwindcss
```

### **3. PARA ACTUALIZAR TODO:**
```bash
# ✅ Script centralizado
npm run install:all
```

## 🎯 **GARANTÍA DE RESPETO**

### **VALIDACIÓN PRE-COMMIT:**
```bash
npm run validate:dependencies  # ✅ SIEMPRE ejecutar
```

### **SCRIPT DE LIMPIEZA:**
```bash
npm run clean:dependencies    # ✅ Limpiar duplicados
```

### **DOCUMENTACIÓN OBLIGATORIA:**
- ✅ Registrar cada nueva dependencia
- ✅ Justificar por qué va en root vs app
- ✅ Documentar versiones únicas

---

**⚠️ IMPORTANTE: Estas reglas son OBLIGATORIAS y NO NEGOCIABLES** 