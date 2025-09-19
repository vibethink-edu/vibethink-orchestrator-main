# 🌿 ESTADO DE RAMAS ACTIVAS

## 📊 RAMAS EN DESARROLLO

### **feat/website-cosmic-import** - Claude A - Puerto 3099
- **Estado:** Dashboard deployment y testing completado ✅
- **Última actualización:** 2025-09-19 22:50
- **Progreso:** 
  - ✅ Dashboard desplegado en puerto 3099
  - ✅ Errores de build corregidos (cn import)
  - ✅ GitHub actualizado con últimos cambios
  - ✅ Guía multi-rama creada
- **Archivos principales modificados:**
  - `src/shared/utils/index.ts` (fix cn import)
  - Documentación VHELP
  - Configuraciones dashboard
- **Puerto:** 3099 (testing)
- **URL:** http://localhost:3099

### **[Nueva rama]** - Claude B - Puerto [TBD]
- **Estado:** [Disponible para asignar]
- **Última actualización:** [Pendiente]
- **Progreso:** [Pendiente]
- **Archivos principales:** [Pendiente]
- **Puerto:** [Disponible: 3011, 3012, 3013]

---

## 🚨 CONFLICTOS POTENCIALES

### **Archivos de Alto Riesgo** (Coordinar antes de modificar):
- `src/shared/components/` - Componentes compartidos
- `src/shared/utils/` - Utilidades compartidas  
- `package.json` - Dependencias root
- `CLAUDE.md` - Documentación AI principal
- `AI_UNIVERSAL_STANDARDS.md` - Estándares universales

### **Archivos Seguros** (Modificar libremente):
- `apps/[app-específica]/` - Código específico por app
- `docs/development/` - Documentación de desarrollo
- `dev-tools/` - Herramientas nuevas
- Archivos específicos de rama

---

## 📋 COORDINACIÓN ENTRE IAs

### **Comunicación:**
- 📝 **Actualizar este archivo** después de cada sesión significativa
- 🔄 **Hacer push diario** para mantener sincronización
- ⚠️ **Avisar en este archivo** antes de modificar archivos compartidos

### **Protocolos:**
1. **Inicio de sesión:** `git fetch origin && git status`
2. **Fin de sesión:** `git push origin [rama] && actualizar BRANCH_STATUS.md`
3. **Cambios compartidos:** Documentar aquí antes de implementar

---

## 🎯 ASIGNACIÓN DE PUERTOS

### **Puertos Oficiales** (según VHELP):
- **3001:** Dashboard principal (`npm run dev:dashboard`)
- **3002:** Admin (`npm run dev:admin`)
- **3003:** Login (`npm run dev:login`) 
- **3004:** Helpdesk (`npm run dev:helpdesk`)
- **3005:** Website (`npm run dev:website`)
- **3099:** Testing (`npm run dev:test`) - **OCUPADO por Claude A**

### **Puertos Disponibles para Features:**
- **3011:** Disponible para nueva rama
- **3012:** Disponible para nueva rama
- **3013:** Disponible para nueva rama
- **3014:** Disponible para nueva rama

### **Comando de Verificación:**
```bash
npm run port-check  # Ver estado actual de puertos
```

---

## 🔄 SINCRONIZACIÓN RECOMENDADA

### **Sincronización Diaria** (Ambas ramas):
```bash
# Morning routine
git fetch origin
git status
git log --oneline -n 3

# Evening routine  
git add -A
git commit -m "feat: descripción del progreso diario"
git push origin [rama-actual]
# Actualizar BRANCH_STATUS.md
```

### **Sincronización Semanal** (Rebase con main):
```bash
git fetch origin
git rebase origin/main
# Resolver conflictos si existen
git push origin [rama] --force-with-lease
```

---

## 📈 MÉTRICAS DE PROGRESO

### **feat/website-cosmic-import:**
- **Commits esta semana:** 5
- **Archivos modificados:** 27
- **Features completadas:** Dashboard deployment, build fixes
- **Próximo objetivo:** Testing completo, preparar merge

### **[Nueva rama]:**
- **Commits esta semana:** [Pendiente]
- **Archivos modificados:** [Pendiente] 
- **Features completadas:** [Pendiente]
- **Próximo objetivo:** [Pendiente]

---

## 🎊 ESTADO GENERAL DEL PROYECTO

### **✅ Funcionando:**
- Dashboard en puerto 3099
- Todas las validaciones pasando
- GitHub sincronizado
- Workflow multi-rama documentado

### **🔄 En progreso:**
- Testing completo del dashboard
- Preparación para merge a main

### **⏳ Pendiente:**
- Asignación de segunda rama
- Coordinación para nuevas features

---

**📝 Última actualización:** 2025-09-19 22:50 por Claude A  
**🔄 Próxima actualización recomendada:** 2025-09-20 09:00