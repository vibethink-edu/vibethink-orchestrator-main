# Integración de shadcn/ui en el Dashboard de Pendientes

## Resumen
El Dashboard de Pendientes utiliza intensivamente la librería shadcn/ui para ofrecer una experiencia de usuario moderna, accesible y coherente con los estándares del proyecto.

---

## Componentes shadcn/ui utilizados
- **Input:** Búsqueda instantánea de pendientes por descripción.
- **Select:** Filtros avanzados por estado y responsable.
- **Table, TableHead, TableRow, TableCell:** Renderizado profesional de la tabla de pendientes.
- **Badge:** Visualización clara y semántica del estado de cada pendiente.
- **Tooltip, TooltipProvider:** Tooltips contextuales para explicar estados y mejorar la accesibilidad.
- **Card, CardContent:** Contenedores visuales para agrupar filtros y tabla.

## Patrones de Accesibilidad
- Uso de `aria-label` en campos de búsqueda y filtros.
- Tooltips accesibles con teclado y lectores de pantalla.
- Navegación por teclado soportada en todos los controles.

## Ventajas de shadcn/ui
- Consistencia visual y de interacción en toda la plataforma.
- Componentes altamente personalizables y orientados a buenas prácticas.
- Integración nativa con Tailwind CSS para estilos rápidos y responsivos.
- Facilita la extensión y el mantenimiento del dashboard.

## Recomendaciones para futuras extensiones
- Utilizar siempre componentes shadcn/ui para nuevas funcionalidades (ej: edición inline, modales, notificaciones).
- Mantener los patrones de accesibilidad y semántica en todos los controles.
- Documentar cualquier personalización relevante en este archivo.

## Ejemplo de flujo de usuario
1. El usuario accede al Dashboard de Pendientes desde el menú lateral.
2. Puede buscar pendientes por descripción, filtrar por estado o responsable.
3. Los estados se muestran con badges y tooltips explicativos.
4. Toda la interacción es accesible y responsiva.

---

**Última actualización:** 2025-06-24
Responsable: Marcelo Escallón (Product Owner) 