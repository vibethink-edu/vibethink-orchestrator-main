# 🚀 Comandos Rápidos y Atajos - AI Pair Orchestrator Pro

## 📊 Estado Actual del Proyecto
- **✅ Backup creado**: `ai-pair-orchestrator-backup-20250619-215124.zip` (63.9 MB)
- **✅ Dependencias**: Reinstaladas correctamente
- **✅ Vite**: Funcionando (v6.3.5)
- **✅ Servidor**: Ejecutándose en background
- **🎯 Próximo**: Mejoras de UX/UI del landing

## 🛠️ Comandos de Desarrollo

### **Servidor de Desarrollo**
```bash
npm run dev          # Inicia servidor en puerto 8080
npm run build        # Build de producción
npm run preview      # Preview del build
```

### **Testing**
```bash
npm run test         # Tests unitarios
npm run test:e2e     # Tests end-to-end
npm run test:ui      # Tests de UI
```

### **Linting y Formato**
```bash
npm run lint         # ESLint
npm run lint:fix     # Auto-fix linting
npm run format       # Prettier
```

## 🎨 Sistema de Temas

### **Componentes de Tema**
- `ModeToggle` - Selector de tema (claro/oscuro/sistema)
- `ThemeSwitcher` - Selector avanzado con preview
- `useDaylightTheme` - Hook para tema automático según hora

### **URLs de Testing**
- `http://localhost:8080/` - Landing principal
- `http://localhost:8080/theme-test` - Página de prueba de temas
- `http://localhost:8080/mockup-demo` - Demo del mockup

## 🤖 Universal Assistant

### **Componentes Principales**
- `UniversalAssistant` - Componente principal
- `AssistantChat` - Interfaz de chat
- `useAssistantProfile` - Hook de perfil
- `useAssistantState` - Hook de estado
- `useAssistantCommands` - Hook de comandos

### **Características Implementadas**
- ✅ Perfiles personalizados por rol
- ✅ Chat inteligente con contexto
- ✅ Documentación automática
- ✅ Aprendizaje continuo
- ✅ Coordinación entre assistants

## 📋 Comandos CMMI

### **Documentación**
```bash
# Actualizar documentación CMMI
npm run docs:update

# Generar reportes de calidad
npm run quality:report

# Validar procesos CMMI
npm run cmmi:validate
```

### **Backup y Versionado**
```bash
# Backup automático
npm run backup:create

# Restaurar desde backup
npm run backup:restore

# Listar backups disponibles
npm run backup:list
```

## 🔧 Comandos de Mantenimiento

### **Dependencias**
```bash
npm install          # Instalar dependencias
npm update           # Actualizar dependencias
npm audit            # Verificar vulnerabilidades
npm audit fix        # Auto-fix vulnerabilidades
```

### **Base de Datos**
```bash
npm run db:migrate   # Ejecutar migraciones
npm run db:seed      # Poblar datos de prueba
npm run db:reset     # Resetear base de datos
```

## 🎯 Tips de Desarrollo Rápido

### **Componentes Nuevos**
1. Crear en `src/components/`
2. Usar shadcn/ui como base
3. Implementar TypeScript estricto
4. Agregar tests unitarios
5. Documentar en `DEVELOPMENT_PATTERNS.md`

### **Páginas Nuevas**
1. Crear en `src/pages/`
2. Usar `DashboardLayout` para páginas internas
3. Implementar rutas en `App.tsx`
4. Agregar a navegación si es necesario

### **Hooks Personalizados**
1. Crear en `src/hooks/`
2. Usar prefijo `use` + nombre descriptivo
3. Implementar TypeScript estricto
4. Agregar JSDoc para documentación

## 🚨 Comandos de Emergencia

### **Reset Completo**
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Resetear cache de npm
npm cache clean --force
```

### **Backup de Emergencia**
```bash
# Backup rápido antes de cambios críticos
npm run backup:quick

# Restaurar último backup
npm run backup:restore:latest
```

## 📱 URLs Importantes

### **Desarrollo Local**
- `http://localhost:8080/` - Landing principal
- `http://localhost:8080/auth` - Autenticación
- `http://localhost:8080/dashboard` - Dashboard principal
- `http://localhost:8080/admin` - Panel de administración

### **Testing**
- `http://localhost:8080/theme-test` - Pruebas de tema
- `http://localhost:8080/mockup-demo` - Demo mockup
- `http://localhost:8080/testing/role-testing` - Tests de roles

### **Documentación**
- `http://localhost:8080/documentation` - Documentación técnica
- `http://localhost:8080/docs/user-documentation/` - Docs de usuario

## 🎨 Comandos de UI/UX

### **Tema y Estilos**
```bash
npm run theme:build    # Compilar temas
npm run theme:test     # Testear temas
npm run ui:storybook   # Storybook para componentes
```

### **Optimización**
```bash
npm run optimize:images    # Optimizar imágenes
npm run optimize:fonts     # Optimizar fuentes
npm run analyze:bundle     # Analizar bundle
```

## 🔍 Debugging

### **Logs y Monitoreo**
```bash
npm run logs:dev      # Ver logs de desarrollo
npm run logs:error    # Ver solo errores
npm run monitor:perf  # Monitorear rendimiento
```

### **Testing de Rendimiento**
```bash
npm run perf:test     # Tests de rendimiento
npm run perf:audit    # Auditoría de rendimiento
npm run perf:report   # Reporte de rendimiento
```

---

## 📝 Notas Importantes

### **CMMI Nivel 3**
- ✅ Procesos documentados
- ✅ Calidad automatizada
- ✅ Backups regulares
- ✅ Testing comprehensivo

### **Próximos Pasos**
1. **UX/UI Landing**: Mejorar conversión y experiencia
2. **Base de Datos**: Configurar Supabase
3. **Universal Assistant**: Implementar funcionalidades avanzadas
4. **Testing**: Completar suite de tests

### **Backup Actual**
- **Archivo**: `ai-pair-orchestrator-backup-20250619-215124.zip`
- **Ubicación**: `C:\Backups\`
- **Estado**: ✅ Completado y verificado

---

**Última actualización**: 19/06/2025 21:52
**Versión del proyecto**: v1.0.0
**Estado**: 🟢 Desarrollo activo 