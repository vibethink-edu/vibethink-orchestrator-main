# Changelog

Este archivo documenta los cambios relevantes en la documentación y la estructura del proyecto. Cada entrada debe incluir fecha, responsable y descripción del cambio. 

## [2025-12-25] - Merge & Recuperación de Incidente

**Author:** VibeThink System / Marcelo
**Type:** Infrastructure / Fix / Feature

**Cambios Principales:**
- **Merge Crítico:** Fusión de `main-developer` -> `main` tras recuperación de incidente de rebase interactivo estancado.
- **Versión Bump (0.5.1):** Actualización a `0.5.1` para reflejar el parche de seguridad y estabilidad de React 19 (Overrides).
- **Protocolo de Seguridad:** Se implementó y documentó el procedimiento "Safety First" para recuperar archivos untracked durante un rebase fallido (ver `docs/TROUBLESHOOTING.md`).
- **I18n & Crypto:** Integración completa de funcionalidades de internacionalización en tablas y módulos de cripto (v2).
- **Documentación:** Actualización de guías de troubleshooting y lecciones aprendidas de Git.

**Notas para el Equipo:**
- Se requiere `npm install` al actualizar.
- Revisar `docs/TROUBLESHOOTING.md` sección "Git & Version Control" para referencia futura.
