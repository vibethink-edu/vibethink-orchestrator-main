# dev-dashboard

> La documentación principal de este portal se encuentra en [docs/projects/dev-dashboard.md](../docs/projects/dev-dashboard.md).

Este directorio contiene el código fuente del portal de desarrollo para el equipo técnico. 

---

## Ayuda dinámica para developers

Este dashboard integra un panel de ayuda dinámica que muestra comandos útiles y shortcuts extraídos automáticamente de los README principales del monorepo.

### ¿Cómo funciona?
1. **Actualiza la documentación:** Agrega o modifica comandos útiles en los README relevantes (por ejemplo, `README.md`, `docs/templates/README_CONNECTOR_TEMPLATE.md`).
2. **Ejecuta el script extractor:**
   ```bash
   node scripts/generate-dev-help.cjs
   ```
   Esto generará y copiará el archivo `devHelp.json` a `dev-dashboard/public/`.
3. **Recarga la ayuda en el dashboard:**
   - Pulsa el botón “🔄 Recargar ayuda” en el panel de ayuda del dashboard para ver los cambios reflejados al instante.

### Buenas prácticas
- Mantén los comandos clave y shortcuts actualizados en los README.
- Ejecuta el script extractor tras cada cambio relevante en la documentación.
- Si el flujo de trabajo evoluciona, actualiza tanto los README como el panel de ayuda.
- Si detectas comandos repetidos o desactualizados, límpialos para mantener la ayuda clara y útil.

### Visión evolutiva
- Se puede ampliar el extractor para incluir descripciones, ejemplos o enlaces directos a secciones de la documentación.
- Es posible integrar notificaciones automáticas o changelogs en el dashboard cuando se detecten cambios importantes en la ayuda.

--- 