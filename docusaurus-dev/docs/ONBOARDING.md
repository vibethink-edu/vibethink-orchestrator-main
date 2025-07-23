# 🏁 Onboarding – Patrón de Gobernanza Documental

Bienvenido/a a VibeThink Orchestrator. Para mantener la calidad, trazabilidad y escalabilidad del proyecto, seguimos un patrón institucionalizado de gobernanza documental. Este documento te guía para que puedas contribuir y navegar la documentación de forma eficiente.

---

## 1. Estructura documental institucionalizada

Para cada área crítica (desarrollo, seguridad, compliance, calidad, datos, integración, etc.):

- **Visión y justificación estratégica:**
  - `/docs/PROJECT/<area>/` → ¿Por qué y cómo se gestiona el área?
- **Documentación técnica detallada:**
  - `/docs/<area>/` → Procedimientos, configuraciones, análisis, ejemplos.
- **Políticas y reglas transversales:**
  - `/docs/project/<area>-rules/` → Todas las políticas obligatorias y controles del área.

> Consulta siempre el README global y el de cada área para entender la estructura y las referencias cruzadas.

---

## 2. ¿Cómo contribuir o crear nueva documentación?

1. **Antes de crear un archivo nuevo:**
   - Revisa el README global y el de tu área para ubicar correctamente la documentación.
   - Si es una política transversal, créala en la carpeta centralizada de reglas.
   - Si es documentación técnica, ubícala en la carpeta técnica del área.
   - Si es visión o justificación, ubícala en `/docs/PROJECT/<area>/`.

2. **Sigue la guía rápida de tu área:**
   - Cada README de área incluye una guía rápida para saber dónde documentar y a quién consultar en caso de duda.

3. **No documentes por documentar:**
   - Solo crea documentación que aporte valor real al equipo y al proyecto.
   - Mantén los archivos vivos y actualizados.

---

## 3. Automatización y validación

- El proyecto cuenta con scripts y workflows de CI/CD que validan la centralización y estructura de las políticas y reglas.
- Si tu PR falla por validación documental, revisa la ubicación y el tipo de archivo.

---

## 4. Mejora continua

- El patrón se revisa y ajusta trimestralmente.
- Si tienes sugerencias de mejora, documenta la propuesta y compártela en la próxima retrospectiva o con el equipo de arquitectura/documentación.

---

¡Bienvenido/a a una cultura de documentación clara, útil y escalable! 