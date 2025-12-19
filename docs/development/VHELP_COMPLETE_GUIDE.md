# 📚 VHELP COMPLETE GUIDE - Documentación Completa del Sistema

## 🎯 ¿QUÉ ES VHELP?

VHELP (VThink Helper) es el **Centro de Comandos Interactivo** del proyecto VibeThink Orchestrator. Es una herramienta de documentación automática que lee, clasifica y presenta todos los comandos disponibles en el proyecto con información de seguridad integrada.

---

## 📋 TABLA DE CONTENIDOS

1. [Sistema de Puertos](#sistema-de-puertos)
2. [Comandos de Desarrollo](#comandos-de-desarrollo)
3. [Comandos de Validación](#comandos-de-validación)
4. [Comandos de Limpieza](#comandos-de-limpieza)
5. [Port Manager Detallado](#port-manager-detallado)
6. [Workflows Completos](#workflows-completos)
7. [Troubleshooting](#troubleshooting)

---

## 🌐 SISTEMA DE PUERTOS

### **Arquitectura de Puertos Fijos**

El proyecto usa un sistema de puertos fijos para evitar conflictos y facilitar el desarrollo:

```
┌─────────────────┬────────┬─────────────────────────────────────┐
│ APLICACIÓN      │ PUERTO │ DESCRIPCIÓN                         │
├─────────────────┼────────┼─────────────────────────────────────┤
│ Dashboard       │ 3001   │ Aplicación principal del sistema    │
│ Admin           │ 3002   │ Panel de administración empresarial │
│ Login           │ 3003   │ Sistema de autenticación            │
│ Helpdesk        │ 3004   │ Sistema de soporte técnico          │
│ Website         │ 3005   │ Sitio web de marketing              │
│ Test Port       │ 3099   │ Puerto reservado para pruebas       │
└─────────────────┴────────┴─────────────────────────────────────┘
```

### **¿Por qué puertos fijos?**
- **Predictibilidad**: Siempre sabes dónde está cada aplicación
- **No más conflictos**: Cada app tiene su puerto dedicado
- **Fácil debugging**: URLs consistentes para desarrollo
- **Test aislado**: Puerto 3099 siempre libre para pruebas

---

## 🚀 COMANDOS DE DESARROLLO

### **1. INICIAR APLICACIONES INDIVIDUALES**

#### `npm run dev`
**Puerto:** 3001  
**Descripción:** Inicia el dashboard principal con detección automática de puerto  
**Proceso interno:**
1. Verifica si puerto 3001 está libre
2. Si está ocupado, pregunta si deseas liberarlo
3. Inicia el servidor de desarrollo de Next.js
4. Abre automáticamente en http://localhost:3001

#### `npm run dev:admin`
**Puerto:** 3002  
**Descripción:** Inicia el panel de administración  
**Uso típico:** Gestión de usuarios, roles, permisos empresariales  
**Features:** Multi-tenant, RLS policies, RBAC de 5 niveles

#### `npm run dev:login`
**Puerto:** 3003  
**Descripción:** Sistema de autenticación standalone  
**Características:**
- Integración con Supabase Auth
- Magic links
- OAuth providers
- Session management

#### `npm run dev:helpdesk`
**Puerto:** 3004  
**Descripción:** Sistema de tickets y soporte  
**Módulos:** Tickets, FAQ, Chat en vivo, Knowledge base

#### `npm run dev:website`
**Puerto:** 3005  
**Descripción:** Sitio web de marketing (Next.js)  
**Stack:** React 19, Tailwind, Framer Motion  
**Sin autenticación:** Público, no requiere login

#### `npm run dev:test` 🧪
**Puerto:** 3099  
**Descripción:** Puerto especial para pruebas aisladas  
**Ventajas:**
- Siempre disponible
- No interfiere con otros servicios
- Ideal para pruebas de integración
- Debugging aislado

### **2. COMANDOS MASIVOS**

#### `npm run dev:all`
**Puertos:** 3001-3004  
**Descripción:** Inicia TODAS las aplicaciones core simultáneamente  
**Usa:** Concurrently para ejecución paralela  
**RAM requerida:** ~4GB mínimo recomendado

#### `npm run dev:status` 🔍
**Descripción:** Muestra qué puertos están ocupados y por qué proceso  
**Output ejemplo:**
```
🚀 ESTADO DE PUERTOS DEL SISTEMA
============================================================
✅ DASHBOARD    Puerto 3001 - LIBRE
⚠️  ADMIN        Puerto 3002 - OCUPADO (node.exe PID: 12345)
✅ LOGIN        Puerto 3003 - LIBRE
✅ HELPDESK     Puerto 3004 - LIBRE
✅ WEBSITE      Puerto 3005 - LIBRE
✅ TEST         Puerto 3099 - LIBRE
============================================================
📋 5 puertos libres | 1 puerto ocupado
```

---

## ✅ COMANDOS DE VALIDACIÓN

### **Sistema de 4 Niveles Jerárquicos**

#### **NIVEL 1: `npm run validate:quick`** 🟢
**Tiempo:** 2-5 segundos  
**Cuándo usar:** Antes de empezar a trabajar  
**Qué valida:**
- Estructura básica del proyecto
- Archivos prohibidos en root
- Apps requeridas presentes
- Sintaxis básica

#### **NIVEL 2: `npm run validate:universal`** 🟡
**Tiempo:** 10-30 segundos  
**Cuándo usar:** Antes de hacer commit  
**Qué valida:**
- Todo lo de Nivel 1
- Arquitectura completa
- Cross-app compatibility
- Dependencias correctas
- Imports válidos

#### **NIVEL 3: `npm run validate:guard`** 🔴
**Tiempo:** 5-10 segundos  
**Cuándo usar:** Cuando algo se rompe  
**Qué hace:**
- Modo emergencia
- Detecta violaciones críticas
- Sugiere soluciones
- Rollback automático si es posible

#### **NIVEL 4: `npm run validate:full`** 🚀
**Tiempo:** 1-3 minutos  
**Cuándo usar:** Antes de deploy o merge a main  
**Qué valida:**
- TODO el ecosistema
- Performance metrics
- Security compliance
- Bundle sizes
- Lighthouse scores
- Accessibility

### **Validaciones Especializadas**

#### `npm run validate:security`
**Verifica:**
- Filtrado por company_id en todas las queries
- RLS policies activas
- No hay secrets en código
- Dependencies vulnerabilities
- OWASP compliance básico

#### `npm run validate:arch`
**Analiza:**
- Estructura monorepo correcta
- No hay código Next.js en root
- Imports entre apps prohibidos
- Shared components usage
- Circular dependencies

#### `npm run validate:perf`
**Métricas:**
- Bundle size < 500KB inicial
- First paint < 2s
- Time to interactive < 3s
- Core Web Vitals passing

---

## 🧹 COMANDOS DE LIMPIEZA

### **`npm run clean`** 🧹
**Nivel de riesgo:** 🔴 PELIGROSO  
**Qué elimina:**
```
- /node_modules (root)
- /apps/*/node_modules (todas las apps)
- /.next (root si existe)
- /apps/*/.next (builds de todas las apps)
```
**Tiempo de recuperación:** 3-5 minutos (npm install)  
**Cuándo usar:** Dependencias corruptas, errores extraños

### **`npm run clean:force`** 💀
**Nivel de riesgo:** 🔴 MUY PELIGROSO  
**Proceso:**
1. Mata TODOS los procesos Node.js (`taskkill /F /IM node.exe`)
2. Espera 2 segundos
3. Ejecuta limpieza completa
4. Libera todos los puertos

**Cuándo usar:** Último recurso, procesos colgados

---

## 🎮 PORT MANAGER DETALLADO

### **Arquitectura del Sistema**

```javascript
Port Manager
├── Detección de Puertos
│   ├── Windows: netstat -ano
│   └── Unix/Mac: lsof -ti
├── Gestión de Procesos
│   ├── Identificación por PID
│   └── Kill selectivo o masivo
├── Asignación Inteligente
│   ├── Puertos fijos por app
│   └── Detección de conflictos
└── Comandos CLI
    ├── status - Ver estado
    ├── start - Iniciar con detección
    ├── kill - Liberar puerto
    └── emergency - Limpieza total
```

### **COMANDOS DEL PORT MANAGER**

#### `npm run port-check` 🔍
**Función:** Escanea todos los puertos del proyecto  
**Output detallado:**
- Qué proceso está usando cada puerto
- PID del proceso
- Tiempo que lleva ejecutándose
- Sugerencias de acción

#### `npm run kill-ports` 🚨
**Función:** Libera TODOS los puertos del proyecto  
**Proceso:**
1. Escanea puertos 3001-3099
2. Identifica procesos
3. Mata procesos de forma segura
4. Verifica liberación
5. Reporta resultado

#### `npm run quick-start` ⚡
**Función:** Start inteligente con auto-detección  
**Lógica:**
```
1. Ejecuta port-check
2. Si hay conflictos → pregunta qué hacer
3. Libera puertos necesarios
4. Inicia aplicación principal
5. Abre navegador automáticamente
```

#### `npm run emergency` 🚨
**Función:** Recuperación total del sistema  
**Secuencia:**
1. Mata todos los procesos Node
2. Libera todos los puertos
3. Limpia archivos temporales
4. Ejecuta validate:guard
5. Reporta estado del sistema

---

## 📊 WORKFLOWS COMPLETOS

### **WORKFLOW DIARIO DE DESARROLLO**

```bash
# 1. INICIO DEL DÍA
npm run status              # Ver estado general
npm run validate:quick      # Validación rápida
npm run port-check         # Verificar puertos

# 2. DESARROLLO
npm run dev                # Dashboard principal
# O para pruebas aisladas:
npm run dev:test           # Puerto 3099

# 3. MIENTRAS DESARROLLAS
npm run validate          # Validación combinada
npm run lint              # Verificar código
npm run test              # Ejecutar tests

# 4. ANTES DE COMMIT
npm run validate:universal # Validación completa
npm run ai:commit         # Commit con mensaje automático

# 5. FIN DEL DÍA
npm run status            # Estado final
git push                  # Subir cambios
```

### **WORKFLOW DE DEBUGGING**

```bash
# 1. ALGO NO FUNCIONA
npm run validate:guard     # Detectar problema

# 2. PUERTOS BLOQUEADOS
npm run port-check        # Ver qué está ocupado
npm run kill-ports        # Liberar todo

# 3. DEPENDENCIAS CORRUPTAS
npm run clean             # Limpiar proyecto
npm run install:all       # Reinstalar todo

# 4. ÚLTIMO RECURSO
npm run emergency         # Recuperación total
```

### **WORKFLOW DE TESTING**

```bash
# 1. PREPARAR AMBIENTE
npm run dev:test          # Puerto 3099 aislado
npm run validate:quick    # Estado base

# 2. EJECUTAR TESTS
npm run test              # Tests unitarios
npm run test:all          # Todos los tests
npm run lint              # Linting
npm run type-check        # TypeScript

# 3. VALIDAR RESULTADO
npm run validate:perf     # Performance
npm run validate:security # Seguridad
```

---

## 🔧 TROUBLESHOOTING

### **PROBLEMA: "Puerto 3001 ocupado"**
```bash
# Solución rápida:
npm run port-check        # Ver qué lo está usando
npm run kill-ports        # Liberar todos

# O específico:
node dev-tools/utilities/port-manager.cjs kill 3001
```

### **PROBLEMA: "Cannot find module"**
```bash
# Solución:
npm run clean            # Limpiar node_modules
npm run install:all      # Reinstalar todo
npm run validate:quick   # Verificar
```

### **PROBLEMA: "Servidor no responde"**
```bash
# Diagnóstico:
npm run dev:status       # Ver estado de puertos
npm run emergency        # Recuperación completa
npm run dev:test         # Probar en puerto 3099
```

### **PROBLEMA: "Build falla"**
```bash
# Proceso de debugging:
npm run validate:arch    # Verificar arquitectura
npm run validate:universal # Validación completa
npm run clean:force      # Limpieza forzada
npm run setup           # Setup completo nuevo
```

---

## 💡 TIPS Y MEJORES PRÁCTICAS

### **Para Desarrollo Rápido:**
1. Usa `npm run dev:test` (puerto 3099) para pruebas aisladas
2. Mantén `npm run port-check` en una terminal separada
3. Usa `npm run quick-start` para inicio rápido
4. Alias recomendados en `.bashrc` o `.zshrc`:
   ```bash
   alias vhelp="npm run vhelp"
   alias vcheck="npm run port-check"
   alias vdev="npm run dev"
   alias vtest="npm run dev:test"
   ```

### **Para Debugging:**
1. Siempre empieza con `npm run validate:guard`
2. Usa `npm run emergency` solo como último recurso
3. Guarda logs con: `npm run validate:full > validation.log`
4. Mantén SESSION_SUMMARY.md actualizado

### **Para CI/CD:**
1. Usa `npm run validate:full` en pipelines
2. Configura timeouts apropiados (5 min mínimo)
3. Cache node_modules entre builds
4. Usa `npm run build:all` para producción

---

## 📚 REFERENCIAS ADICIONALES

### **Archivos de Configuración:**
- `package.json` - Todos los scripts npm
- `dev-tools/utilities/vhelp-enhanced.cjs` - Sistema VHELP
- `dev-tools/utilities/port-manager.cjs` - Gestión de puertos
- `dev-tools/utilities/vhelp-security-config.js` - Clasificación de riesgo

### **Documentación Relacionada:**
- `AI_UNIVERSAL_STANDARDS.md` - Estándares para todas las IAs
- `CLAUDE.md` - Guía específica para Claude Code
- `docs/development/VHELP_SECURITY_SYSTEM.md` - Sistema de seguridad
- `ARCHITECTURE_RULES.md` - Reglas de arquitectura

### **Comandos de Ayuda:**
```bash
npm run vhelp           # Centro de comandos interactivo
npm run vhelp:help      # Ayuda básica de VHELP
cat VHELP_COMPLETE_GUIDE.md  # Esta documentación completa
```

---

## 🎯 RESUMEN EJECUTIVO

**VHELP + Port Manager** te dan control total sobre:
- **38 comandos** organizados y clasificados
- **6 puertos fijos** sin conflictos
- **4 niveles de validación** jerárquicos
- **Sistema de seguridad** con 3 niveles de riesgo
- **Recuperación automática** ante problemas

**Comandos más importantes para recordar:**
1. `npm run vhelp` - Ver todos los comandos
2. `npm run port-check` - Estado de puertos
3. `npm run dev:test` - Puerto 3099 para pruebas
4. `npm run emergency` - Recuperación total
5. `npm run validate` - Validación rápida + completa

---

*Última actualización: 2025-08-13*  
*Versión: 2.0 - Sistema Simplificado*  
*Comandos totales: 38 (reducido de 81)*