# AI Chat Dashboard - Pendientes de Implementación

## 📅 Fecha: 2025-08-03
## 👤 Creado por: Claude + Usuario
## 🎯 Estado: Layout y UI Completados ✅

---

## ✅ Completado

### 1. Layout y UI
- [x] Integración con `BunduiCompleteLayout` genérico
- [x] Sidebar con colapso funcional y rotación de botón
- [x] Submenús expandibles en modo colapsado con solo iconos
- [x] Tooltips en todas las subopciones
- [x] Ancho fijo del sidebar (4rem) cuando está colapsado
- [x] Header responsivo que se ajusta al estado del sidebar
- [x] Compatibilidad mobile/tablet
- [x] Theme customizer integrado
- [x] Importaciones correctas usando path aliases del monorepo

### 2. Estándares del Monorepo
- [x] Estructura de archivos correcta en `apps/dashboard/app/ai-chat/`
- [x] Uso de componentes compartidos desde `src/shared/`
- [x] DOI Principle aplicado (Bundui visual + Shadcn técnico)
- [x] Colores en formato HSL, no OKLCH
- [x] TypeScript compatible con configuración actual

---

## 🚧 Pendientes de Implementación

### 1. Seguridad Multi-tenant (CRÍTICO) 🔴
```typescript
// TODO: Cuando se active Supabase real, SIEMPRE filtrar por company_id
const { data: chats } = await supabase
  .from('ai_chats')
  .select('*')
  .eq('company_id', user.company_id); // OBLIGATORIO

// TODO: Implementar RLS policies en Supabase
CREATE POLICY "Company isolation" ON ai_chats 
  FOR ALL USING (company_id = auth.jwt() ->> 'company_id');
```

### 2. Control de Acceso por Roles 🟡
```typescript
// TODO: Implementar verificación de permisos
import { hasPermission } from '@/shared/utils/permissions';

// En el componente:
if (!hasPermission(user.role, 'AI_CHAT_ACCESS')) {
  return <AccessDenied />;
}

// TODO: Usar FeatureGate component
<FeatureGate permission="AI_CHAT_ADMIN">
  <ChatSettings />
</FeatureGate>
```

### 3. Integración Real con Supabase 🟡
- [ ] Cambiar de mock a cliente real en `src/integrations/supabase/client.ts`
- [ ] Crear esquema de base de datos para AI chats
- [ ] Implementar CRUD operations con company_id
- [ ] Configurar real-time subscriptions

### 4. Funcionalidad del Chat 🟢
- [ ] Integrar con API de AI (OpenAI, Anthropic, etc.)
- [ ] Implementar streaming de respuestas
- [ ] Sistema de archivos adjuntos
- [ ] Historial de conversaciones persistente
- [ ] Exportación de chats

### 5. Testing 🟢
```typescript
// TODO: Tests unitarios
describe('AI Chat Security', () => {
  it('should filter chats by company_id', async () => {
    // Test multi-tenant isolation
  });
  
  it('should respect role permissions', () => {
    // Test role-based access
  });
});

// TODO: Tests E2E con Playwright
test('AI Chat workflow', async ({ page }) => {
  // Test flujo completo
});
```

### 6. Validaciones del Sistema 🟢
```bash
# TODO: Ejecutar antes de cada deploy
npm run validate:organization
npm run validate:architecture  
npm run validate:security
npm run type-check # desde apps/dashboard
npm run test:e2e
```

### 7. Configuración de Producción 🟡
- [ ] Variables de entorno para API keys
- [ ] Rate limiting para llamadas a AI
- [ ] Caché de respuestas frecuentes
- [ ] Monitoreo y logging
- [ ] Límites de uso por company/plan

---

## 📝 Notas Importantes

1. **NUNCA** hacer queries sin filtrar por `company_id`
2. **SIEMPRE** verificar permisos antes de operaciones sensibles
3. **VALIDAR** todos los inputs del usuario
4. **ENCRIPTAR** información sensible en la base de datos
5. **MONITOREAR** uso de API para evitar costos excesivos

---

## 🔗 Referencias

- [CLAUDE.md](../../../../CLAUDE.md) - Guía principal del proyecto
- [Multi-tenant Security](../../../../docs/architecture/MULTI_TENANT_SECURITY.md)
- [VThink 1.0 Standards](../../../../docs/methodologies/vthink-1.0/)
- [Bundui Decoupling Guide](../../../../docs/development/BUNDUI_DECOUPLING_GUIDE.md)

---

## ⚡ Quick Start para Implementación

1. Activar Supabase real (descomentar línea 17 en `supabase/client.ts`)
2. Crear migraciones de base de datos
3. Implementar hooks con company_id filtering
4. Agregar tests de seguridad
5. Validar con todos los scripts antes de merge

---

**Última actualización:** 2025-08-03
**Próxima revisión:** Antes de implementar funcionalidad real