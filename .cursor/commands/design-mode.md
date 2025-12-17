# /design-mode - Activate Design Mode

Activa el Modo Diseño Seguro para experimentar con UI sin riesgo.

## Prompt Completo

Copia y pega este prompt para activar Design Mode:

```
Actúa en MODO DISEÑO SEGURO:

REGLAS ESTRICTAS:
1. Solo modifica archivos de UI (src/components/, src/assets/)
2. NO toques backend (server/, src/services/)
3. NO modifiques lógica de negocio o estado
4. Usa datos MOCK (falsos) en constantes locales
5. Enfócate SOLO en estilos, layout y UX

STACK PERMITIDO:
- React components (JSX/TSX)
- Tailwind CSS
- CSS modules
- Framer Motion (animaciones)
- Imágenes y assets

EJEMPLO DE DATOS MOCK:
```typescript
// ✅ CORRECTO en Design Mode
const MOCK_USER = {
  name: "Demo User",
  avatar: "/placeholder.jpg",
  messages: [
    { text: "Hola Andrés!", timestamp: "10:30 AM" },
    { text: "¿Cómo estás?", timestamp: "10:31 AM" }
  ]
};
```

PROHIBIDO:
```typescript
// ❌ INCORRECTO en Design Mode
const user = await fetchUserFromDB();
const messages = await voiceService.getHistory();
```

OBJETIVO: Iterar rápidamente en diseño sin romper nada.
```

## Qué Esperar

Después de activar Design Mode:
- ✅ Solo se modificarán archivos de UI
- ✅ Se usarán datos MOCK para ejemplos
- ✅ No se tocará backend ni servicios
- ✅ Iteraciones rápidas de diseño

## Ejemplos de Uso

**Cambiar colores:**
```
[Design Mode activado]

Cambia el ChatColumn a tema oscuro con colores azules
```

**Agregar animaciones:**
```
[Design Mode activado]

Agrega fade-in animations a los mensajes nuevos
```

**Responsive design:**
```
[Design Mode activado]

Haz el HeroSection responsive para mobile
```

## Salir de Design Mode

Para salir de Design Mode:
1. Cierra el chat actual
2. Abre chat nuevo
3. Trabaja normalmente (sin Design Mode)

## Verificación

Después de cambios en Design Mode, verificar:
```bash
npm run dev
```

Checklist:
- [ ] Los cambios visuales se ven bien
- [ ] No hay errores en consola
- [ ] El backend sigue funcionando
- [ ] Los servicios de voz funcionan

## Documentación Completa

Ver `AGENTS.md` sección "Design Mode" para guía completa.
