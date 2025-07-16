# 🎯 Centro de Comandos - AI Pair Orchestrator Pro

## 📅 **Fecha:** 19 Junio 2025
## 🎯 **Objetivo:** Centralizar todos los comandos importantes del proyecto para fácil acceso y consistencia.
## 👥 **Audiencia:** Equipo de Desarrollo

---

## 🚀 **COMANDOS ESENCIALES**

### **⚡ Desarrollo Diario**
```bash
# Inicia el servidor de desarrollo en http://localhost:8080
npm run dev
```

### **⚙️ Configuración Rápida**
```bash
# Configura el .env y verifica la conexión con Supabase. ¡Ideal para empezar!
npm run setup:quick
```

### **🧪 Ejecutar Tests**
```bash
# Ejecuta todos los tests unitarios y de integración una vez
npm run test

# Ejecuta los tests en modo "watch" para desarrollo
npm run test:watch

# Abre la UI de Vitest para una vista interactiva de los tests
npm run test:ui
```

### **💅 Formateo y Calidad de Código**
```bash
# Formatea todo el código del proyecto con Prettier
npm run format

# Revisa si hay errores de linting en el proyecto
npm run lint

# Verifica los tipos de TypeScript sin generar build
npm run type-check
```

---

## 📦 **BUILD Y DEPLOYMENT**

### **🏗️ Build de Producción**
```bash
# Genera la build de producción en la carpeta /dist
npm run build
```

### **🌐 Despliegue (Supabase)**
```bash
# Despliega las Edge Functions a Supabase
npm run deploy:functions
```

### **📊 Analizar Bundle**
```bash
# Crea un reporte visual del tamaño del bundle de producción
npm run analyze
```

---

## 🧪 **TESTING AVANZADO**

### **🎭 End-to-End (E2E) con Playwright**
```bash
# Ejecuta todos los tests E2E en modo headless
npm run test:e2e

# Abre la UI de Playwright para ver los tests E2E paso a paso
npm run test:e2e:ui

# Ejecuta los tests E2E mostrando el navegador
npm run test:e2e:headed
```

### **📈 Performance con k6**
```bash
# Ejecuta los tests de carga definidos para k6
npm run test:performance
```

### **🛡️ Seguridad**
```bash
# Ejecuta tests de seguridad básicos
npm run test:security

# Audita las dependencias buscando vulnerabilidades
npm run test:security:audit

# Escanea el proyecto con Snyk (si está configurado)
npm run test:security:scan
```

### **✅ Cobertura de Tests**
```bash
# Ejecuta los tests y genera un reporte de cobertura
npm run test:coverage
```

### **🔄 CI (Integración Continua)**
```bash
# Comando optimizado para correr en el pipeline de CI
npm run test:ci
```

---

## 🐘 **BASE DE DATOS (SUPABASE)**

### **🔄 Migraciones**
```bash
# Aplica las migraciones pendientes a tu base de datos local
npm run migrate

# Crea un nuevo archivo de migración (requiere CLI de Supabase)
# supabase migration new <nombre_migracion>
```

### **📋 Tipos de la Base de Datos**
```bash
# Genera los tipos de TypeScript a partir del esquema de la base de datos
npm run db:types
```

### **🔄 Resetear Base de Datos**
```bash
# ¡CUIDADO! Resetea la base de datos local a su estado inicial
npm run db:reset
```

### **🛠️ Setup de Base de Datos para Tests**
```bash
# Prepara la base de datos de test con datos semilla
npm run test:db:setup

# Limpia la base de datos de test después de ejecutar las pruebas
npm run test:db:cleanup
```

---

## 🛠️ **SCRIPTS DE UTILIDAD Y MANTENIMIENTO**

### **🛡️ Backup Seguro**
```bash
# Crea un backup comprimido del estado actual del proyecto
npm run backup
```
*Nota: Este script usa `scripts/create-backup.js`. Asegúrate de que esté configurado.*

### **🔗 Test de Conexión a Supabase**
```bash
# Verifica la conexión con todos los servicios de Supabase (DB, Auth, Storage)
npm run test:supabase
```

### **📋 Chequeos Rápidos**
```bash
# Obtiene información de la instancia de Supabase
npm run supabase:info

# Revisa si la estructura de la BD coincide con las expectativas
npm run db:check

# Revisa los usuarios en el servicio de Auth
npm run auth:check
```

---

**🔄 Última actualización:** 19 Junio 2025  
**📝 Próxima revisión:** Al añadir nuevos scripts  
**👥 Responsable:** Equipo de Desarrollo 