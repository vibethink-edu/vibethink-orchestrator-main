# 📚 Plan de Documentación y Estructura - VibeThink Orchestrator v1.0

## 🎯 Propósito
- Dejar constancia de la estrategia de documentación, estructura de carpetas y decisiones clave para que cualquier miembro del equipo (o IA) pueda retomar el trabajo sin ambigüedad.

---

## 🗂️ Estructura de Carpetas Validada

```
src/
├── apps/                    # Aplicaciones productivas
├── shared/                  # Componentes, hooks, utils, servicios, tipos reutilizables
├── integrations/            # Integraciones externas desacopladas
├── modules/                 # Módulos de negocio y lógica interna
├── common/                  # Constantes, enums, patrones globales
├── tools/                   # Scripts, portes, utilidades de desarrollo
├── config/                  # Configuración de entornos y settings
├── emails/                  # Plantillas de email
├── locales/                 # Archivos de i18n
├── memory-bank/             # Decisiones, convenciones, memoria institucional
└── ...

tests/                       # Tests unitarios, integración, E2E, performance

docs/                        # Documentación oficial, arquitectura, decisiones, guías
└── docusaurus/              # Documentación viva centralizada (Docusaurus)

public/                      # Recursos estáticos
```

---

## 🧩 Extensiones y herramientas
- **Extensiones de Chrome u otras:**
  - Ubicar en `src/extensions/<nombre-extension>/`
  - Ejemplo: `src/extensions/chrome/`

---

## 📚 Estrategia de Documentación
- **Docusaurus** será la fuente única de la verdad para:
  - Arquitectura
  - Guías de uso
  - Onboarding
  - Decisiones técnicas
  - Roadmaps y changelogs
- Documentos Markdown legacy se migrarán progresivamente a Docusaurus.
- Cada carpeta clave debe tener un README.md explicativo.
- El registro de componentes, módulos y convenciones debe mantenerse actualizado en `docs/` o en Docusaurus.

---

## 🚦 Principios clave
- **Fuente única de la verdad:** Todo debe estar documentado en un solo lugar, sin duplicidad.
- **Ubicación adecuada:** Antes de mover/eliminar, validar la ubicación según la convención.
- **Política de deprecación:** Marcar y eliminar lo obsoleto para evitar confusión.
- **Alias de imports:** Usar rutas absolutas desde la raíz para imports.
- **Testing y CI/CD:** Validar estructura y convenciones en el pipeline.

---

## 📝 Notas finales
- Si el cursor/IDE se cierra, retoma siempre desde este archivo y la estructura aquí definida.
- Cualquier cambio mayor en la arquitectura o documentación debe quedar registrado aquí y en Docusaurus. 

---

## 🧹 Limpieza de Legacy: Eliminación de Vite

> **Nota:**
> El proyecto originalmente consideró Vite como posible bundler, pero tras la consolidación del stack en Next.js, **todas las trazas de Vite han sido eliminadas** (variables, scripts, tipos, dependencias y documentación).
>
> **Convención:**
> - Variables de entorno frontend: `NEXT_PUBLIC_*`
> - No debe haber archivos, scripts ni dependencias de Vite en el monorepo.
> - Si se detecta alguna traza de Vite, debe eliminarse inmediatamente para evitar confusión.

--- 

## 🧹 Migración y Limpieza de Vite: Proceso Documentado

> **Decisión crítica:**
> Se ha realizado la migración y limpieza total de todas las trazas de Vite en el stack. Esto incluye:
> - Migración de todas las variables de entorno `VITE_*` a `NEXT_PUBLIC_*` en scripts, tests, configuraciones y documentación.
> - Eliminación de dependencias, plugins, scripts y archivos exclusivos de Vite.
> - Actualización de ejemplos, comentarios y documentación para reflejar el stack Next.js.
> - Cualquier referencia a Vite solo se mantiene en la sección histórica de arquitectura.
>
> **Importante:**
> Este proceso debe quedar documentado y no debe repetirse la discusión. Si en el futuro se detecta una traza de Vite, debe eliminarse y dejar constancia aquí.

--- 