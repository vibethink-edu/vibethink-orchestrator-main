# Regla de Oro de Documentación de Decisiones Técnicas

Toda decisión, evaluación y justificación sobre la selección, integración o modificación de componentes, librerías o patrones en el stack UI **debe quedar documentada de forma exhaustiva y clara en esta guía**. Esto garantiza:

- Trazabilidad total de cada elección técnica.
- Justificación explícita del "por qué" y "para qué" de cada decisión.
- Registro de alternativas consideradas y motivos de descarte.
- Accesibilidad y consulta sencilla para cualquier miembro del equipo.
- Evitar debates repetidos y pérdida de conocimiento institucional.

**Ninguna decisión técnica relevante debe quedar sin documentar en este archivo.**

# Resumen Ejecutivo

La evaluación exhaustiva de opciones para el stack UI concluye que **shadcn/ui** y su ecosistema de expansiones y bloques son la mejor opción para centralizar la interfaz de usuario del proyecto. Esta decisión se fundamenta en:

- Compatibilidad nativa con React, TypeScript y Tailwind CSS.
- Licencia MIT (open source), sin restricciones para SaaS multi-tenant.
- Altos estándares de accesibilidad (A11y) y experiencia de usuario.
- Ecosistema en rápida expansión, con recursos y componentes listos para la mayoría de necesidades (admin, landing, AI, etc.).
- Facilidad de integración, personalización y mantenibilidad.
- Comunidad activa y documentación clara.

**Política:** Solo se considerarán alternativas pagas si no existe una solución open source que cumpla los requisitos funcionales y de calidad.

Esta estrategia garantiza un stack UI moderno, sostenible, eficiente y alineado con los principios de calidad, seguridad y escalabilidad del proyecto.

# Lineamientos y Política de Selección de Componentes UI

Este documento es la referencia central ("Biblia") para la selección, uso y extensión del stack UI del proyecto. Aquí se documentan las decisiones, criterios y procesos para que cualquier developer pueda saber:
- Qué componentes y librerías están aprobados para cada tipo de UI.
- Cómo se evalúan y documentan nuevas necesidades.
- Cuándo y cómo se justifica el uso de componentes de costo.

## 1. Enfoque base
- **shadcn/ui** y sus expansiones son la base para toda la UI de la plataforma.
- Se prioriza la compatibilidad, mantenibilidad y experiencia de desarrollo.

## 2. Selección según tipo de UI
- **UI para data (dashboards, admin, tablas):** shadcn/ui, expansiones y bloques avanzados (ej: tablas, filtros, gráficos).
- **UI para sitios web/landings:** HeroUI es opción preferente por rapidez y atractivo visual, manteniendo coherencia de diseño.
- **UI para móvil:** Se evaluarán librerías compatibles (ej: React Native, ports de shadcn/ui) y se documentarán en esta guía.
- **UI para mapas, AI, chat, etc.:** Se documentarán componentes específicos evaluados y aprobados según necesidad.

## 3. Proceso para componentes adicionales
- Toda nueva necesidad de UI debe ser evaluada y documentada aquí antes de implementarse.
- Se priorizan soluciones open source y compatibles con el stack base.
- Si no existe alternativa gratuita adecuada, se justifica y documenta la elección de un componente de costo.

## 4. Política para componentes de costo
- Solo se aprueban si no hay alternativa open source que cumpla los requisitos.
- Debe documentarse la justificación, el costo y el impacto esperado.
- Se mantiene una lista de componentes de costo aprobados y su contexto de uso.

## 5. Ejemplo de extensión: Pruebas de APIs
- **Documentación:** Swagger será la referencia para la documentación de APIs.
- **Pruebas:** Se utilizarán sets de pruebas con Postman (o alternativa open source) para validar endpoints y flujos críticos.
- El proceso, herramientas y ejemplos de pruebas deben estar documentados en la sección correspondiente de la guía de developer.

## 6. Mantenimiento y actualización
- Este documento debe actualizarse con cada nueva decisión, evaluación o cambio en el stack.
- Es responsabilidad de todos los developers mantenerlo actualizado y consultarlo antes de tomar decisiones de implementación.

# Lineamientos para Cuentas Oficiales de Integración y Pruebas de APIs

## 1. Microsoft 365 (Office 365)
- **Cuenta oficial:** mescallo@euphoria-net.com
- Usar esta cuenta para:
  - Registro de aplicaciones en Azure AD.
  - Pruebas de APIs de Microsoft (Graph, Outlook, Teams, OneDrive, etc.).
  - Gestión de permisos y consentimientos.
- Si se requieren permisos de administrador global, deben gestionarse desde esta cuenta o solicitarse a través de ella.
- Todas las credenciales, secretos y configuraciones asociadas deben almacenarse de forma segura (vault, gestor de secretos, etc.) y documentarse en la guía interna.

## 2. Google Workspace
- **Cuenta oficial:** (especificar aquí la cuenta oficial de Google Workspace para el proyecto, si aplica).
- Usar esta cuenta para:
  - Registro de aplicaciones en Google Cloud Console.
  - Pruebas de APIs de Google (Gmail, Drive, Calendar, etc.).
  - Gestión de credenciales OAuth y permisos.
- Las credenciales y secretos deben almacenarse y compartirse de forma segura.

## 3. Procedimiento general para registro y pruebas de APIs
1. Acceder al portal correspondiente (Azure Portal para Microsoft, Google Cloud Console para Google).
2. Registrar la aplicación usando la cuenta oficial.
3. Configurar los permisos necesarios (delegados o de aplicación).
4. Obtener los IDs, secretos y URIs de redirección requeridos.
5. Documentar la configuración y los pasos en la guía interna.
6. Usar herramientas como Postman, Graph Explorer (Microsoft) o Google API Explorer para pruebas.
7. Si se requieren permisos avanzados, coordinar con el administrador de la cuenta.

## 4. Recomendaciones de seguridad
- Nunca compartir secretos o credenciales por canales inseguros.
- Usar vaults o gestores de secretos para almacenar información sensible.
- Rotar credenciales periódicamente y revocar accesos no utilizados.
- Documentar el acceso y uso de las cuentas oficiales para trazabilidad.

## 5. Checklist de onboarding y colaboración
- [ ] Solicitar acceso a la cuenta oficial de Microsoft 365 (mescallo@euphoria-net.com) y/o Google Workspace.
- [ ] Seguir el procedimiento de registro de apps y pruebas documentado.
- [ ] Almacenar y compartir credenciales solo por canales seguros.
- [ ] Documentar cualquier cambio, integración o prueba relevante en la guía del proyecto.

# Ejemplos Prácticos: Registro de Aplicaciones y Flujos de Autenticación

## 1. Microsoft 365 (Azure AD)

### Registro de una aplicación en Azure AD
1. Ingresar a https://portal.azure.com/ con la cuenta oficial (mescallo@euphoria-net.com).
2. Ir a "Azure Active Directory" > "Registros de aplicaciones" > "Nuevo registro".
3. Completar nombre, tipo de cuenta y URI de redirección (si aplica).
4. Guardar el **Application (client) ID** y **Directory (tenant) ID**.
5. En "Certificados y secretos", generar un **Client Secret** y guardarlo de forma segura.
6. En "Permisos de API", agregar los permisos requeridos (ej: User.Read, Mail.Read, Files.ReadWrite).
7. Si se requieren permisos de aplicación o consentimientos globales, solicitar aprobación de administrador.

### Pruebas con Postman o Graph Explorer
- Usar el flujo OAuth 2.0 (Authorization Code o Client Credentials) para obtener tokens.
- Probar endpoints de Microsoft Graph en https://developer.microsoft.com/en-us/graph/graph-explorer o importar la colección oficial en Postman.
- Documentar los endpoints y resultados relevantes.

### Buenas prácticas
- No compartir client secrets por canales inseguros.
- Rotar secretos periódicamente.
- Documentar los permisos y consentimientos otorgados.

---

## 2. Google Workspace

### Registro de una aplicación en Google Cloud Console
1. Ingresar a https://console.cloud.google.com/ con la cuenta oficial.
2. Crear un nuevo proyecto o seleccionar uno existente.
3. Ir a "APIs y servicios" > "Pantalla de consentimiento OAuth" y configurar la información básica.
4. Ir a "Credenciales" > "Crear credencial" > "ID de cliente de OAuth".
5. Seleccionar tipo de aplicación y definir URIs de redirección.
6. Guardar el **Client ID** y **Client Secret** de forma segura.
7. Habilitar las APIs necesarias (Gmail, Drive, Calendar, etc.) y configurar los scopes requeridos.

### Pruebas con Postman o Google API Explorer
- Usar el flujo OAuth 2.0 para obtener tokens de acceso.
- Probar endpoints en https://developers.google.com/oauthplayground o importar la colección de Google en Postman.
- Documentar los endpoints y resultados relevantes.

### Buenas prácticas
- No compartir client secrets por canales inseguros.
- Rotar secretos periódicamente.
- Documentar los permisos y scopes otorgados.

---

# Evaluación de Calidad y Decisión: Stack UI centrado en shadcn/ui

## 1. Resumen Ejecutivo

La estrategia de UI para el stack se centra en **shadcn/ui** y su ecosistema de expansiones y bloques, por su compatibilidad nativa con Tailwind, licencia MIT, flexibilidad, comunidad creciente y facilidad de personalización. Solo se considerarán alternativas pagas si no existe una solución open source que cumpla los requisitos funcionales y de calidad.

---

## 2. Criterios de Evaluación

- Compatibilidad con React + TypeScript (strict mode)
- Integración nativa con Tailwind CSS
- Accesibilidad (A11y) y cumplimiento ARIA
- Mobile-first y responsive design
- Soporte para dark mode y theming avanzado
- Bundle size y performance
- Componentización y posibilidad de composición
- Facilidad de testing
- Licencia compatible (MIT)
- Buenas prácticas de seguridad
- Documentación clara y comunidad activa
- Roadmap y mantenimiento activo
- Facilidad de migración y personalización
- Consistencia visual y facilidad de customización
- Soporte para animaciones y feedback visual
- Costos y modelo de licenciamiento

---

## 3. Recursos y Componentes Evaluados

### shadcn/ui (core)
- [Sitio oficial](https://ui.shadcn.com/)

### shadcn/ui Expansions
- [Demo y documentación](https://shadcnui-expansions.typeart.cc/)
- [GitHub](https://github.com/hsuanyi-chou/shadcn-ui-expansions)

### Recursos adicionales
- [shadcnblocks.com](https://www.shadcnblocks.com/)
- [Medium: shadcn/ui additional components and resources](https://jidefr.medium.com/shadcn-ui-add-components-and-resources-0846b0f57596)
- [Awesome shadcn/ui](https://github.com/birobirobiro/awesome-shadcn-ui)
- [Figma Design System](https://www.figma.com/community/file/1272214369114645484)

#### Ejemplos de componentes destacados:
- Autosize Textarea, Blockquote, Floating Label, Infinite Scroll, Loading Button, Multiple Selector, Datetime Picker, Spinner, Dual Range Slider, Progress With Value, Responsive Modal, Typewriter, Fancy Multi Select, Fancy Box, Fancy Area, Advanced Data Table, Shadcn View Table, Emblor (tag input), Plate Rich Text Editor, Minimal Tiptap Editor, Gradient Picker, AutoForm, Credenza Modal, Address Autocomplete, Phone Input, Enhanced Button, Date Range Picker, shadcn-cal-com, Chat UI, langui (AI UI), Sortable, Planner, Query Builder visual, Customizer (temas), Next.js 14 Admin Dashboard Starter, Veryfront pre-made UI components, 10000+ Themes for shadcn/ui, VSCode Extension, VSCode UI Snippets Extension.

---

## 4. Análisis de Calidad

### a. Calidad del código y arquitectura
- Estructura modular y reutilizable, siguiendo patrones modernos de React.
- TypeScript estricto, sin uso de any.
- Integración nativa con Tailwind.
- Uso de Radix UI como base para accesibilidad real.

### b. Experiencia de desarrollo
- Documentación clara, ejemplos prácticos y playgrounds.
- Facilidad de integración (copia/pega, sin dependencias ocultas).
- Ecosistema en crecimiento, con muchas expansiones y recursos listos.

### c. Performance
- Componentes livianos, sin dependencias pesadas.
- Lazy loading y composición para optimizar carga.

### d. Mantenibilidad y escalabilidad
- Código limpio y bien documentado.
- Releases regulares y mejoras continuas.
- Licencia MIT, ideal para SaaS multi-tenant.

### e. Comunidad y soporte
- Comunidad activa, issues y PRs atendidos rápidamente.
- Gran cantidad de bloques, plantillas, temas y herramientas de terceros.
- Adopción creciente en la industria.

### f. Experiencia de usuario final
- UI moderna, atractiva y profesional.
- Accesibilidad real (teclado, screen readers, alto contraste).
- Animaciones y feedback visual suaves y configurables.

---

## 5. Conclusión y Decisión

**shadcn/ui y sus expansiones ofrecen una calidad sobresaliente para proyectos modernos, especialmente en SaaS, con una curva de aprendizaje baja, excelente mantenibilidad y una experiencia de usuario y desarrollo de primer nivel.**

Se centraliza la UI en este stack y solo se recomienda buscar alternativas pagas si existe una necesidad muy específica que no pueda cubrirse con el ecosistema actual.

---

## 6. Referencias

- [shadcn/ui](https://ui.shadcn.com/)
- [shadcn/ui Expansions](https://shadcnui-expansions.typeart.cc/)
- [GitHub: shadcn-ui-expansions](https://github.com/hsuanyi-chou/shadcn-ui-expansions)
- [shadcnblocks.com](https://www.shadcnblocks.com/)
- [Medium: shadcn/ui additional components and resources](https://jidefr.medium.com/shadcn-ui-add-components-and-resources-0846b0f57596)
- [Awesome shadcn/ui](https://github.com/birobirobiro/awesome-shadcn-ui)
- [Figma Design System](https://www.figma.com/community/file/1272214369114645484)

# Política de Selección y Uso de Temas de Color

- Solo se permiten los temas/paletas de color predefinidos que ofrece shadcn/ui, tal como se muestra en el [ejemplo oficial de dashboard](https://ui.shadcn.com/examples/dashboard).
- El usuario podrá seleccionar entre estas opciones mediante un dropdown, pero **no podrá personalizar ni crear nuevos colores**.
- El selector de tema estará ubicado en un solo lugar, preferiblemente en las preferencias o configuración de usuario, para mantener la experiencia simple y coherente.
- Esta política garantiza:
  - Consistencia visual en toda la plataforma.
  - Compatibilidad total con dark mode, daylight y otras variantes.
  - Accesibilidad y contraste óptimos.
  - Facilidad de mantenimiento y soporte.
- No se ofrecerán opciones avanzadas de customización de color como en otras suites.

**Referencia visual:**
![Ejemplo de selector de tema en shadcn/ui](https://ui.shadcn.com/examples/dashboard)

# Reglas de Programación para el Almacenamiento de Preferencias de Usuario

Toda preferencia de usuario relevante para la experiencia (por ejemplo, tema de color) debe seguir estas reglas:

1. **Persistencia dual:**
   - Almacenar la preferencia en la base de datos del backend (perfil de usuario) para portabilidad entre dispositivos y sesiones.
   - Guardar la preferencia en localStorage (o equivalente) en el frontend para carga instantánea y experiencia fluida.

2. **Sincronización eficiente:**
   - Al iniciar la app, aplicar primero la preferencia de localStorage.
   - Si el usuario está autenticado, sincronizar con la preferencia del backend (la del backend tiene prioridad).
   - Al cambiar la preferencia, actualizar ambos (localStorage y backend si aplica).

3. **Uso de caché:**
   - Evitar consultas repetidas a la base de datos usando caché de sesión o incluyendo la preferencia en el payload del usuario.
   - Actualizar la base de datos solo cuando la preferencia cambie realmente.

4. **Validación y seguridad:**
   - Validar siempre el valor de la preferencia antes de aplicarlo.
   - No almacenar información sensible en localStorage.
   - Proteger contra manipulación maliciosa (ej: inyección de valores no permitidos).

5. **UX y fallback:**
   - Aplicar el tema/preferencia lo antes posible para evitar flashes visuales.
   - Si no hay preferencia guardada, usar el valor por defecto o detectar el modo del sistema operativo.
   - Permitir restablecer la preferencia a valores por defecto.

Estas reglas son obligatorias para todo el equipo y deben ser consultadas y aplicadas en cada desarrollo relacionado con preferencias de usuario.

# Robustez y Buenas Prácticas en la Gestión de Preferencias de Usuario

Para asegurar la calidad, trazabilidad y escalabilidad en la gestión de preferencias de usuario, el equipo debe cumplir con los siguientes lineamientos y acciones inmediatas:

1. **Auditoría y trazabilidad de cambios**
   - Registrar en logs backend cada vez que un usuario cambie una preferencia crítica (tema, idioma, accesibilidad).
   - Documentar en la guía que los cambios deben quedar registrados para soporte y seguridad.

2. **Internacionalización (i18n)**
   - Almacenar la preferencia de idioma igual que el tema (backend + localStorage).
   - Documentar que todas las preferencias de i18n siguen este patrón.

3. **Accesibilidad avanzada**
   - Añadir opciones de accesibilidad (tamaño de fuente, alto contraste, reducción de animaciones) en preferencias.
   - Persistirlas igual que el tema y documentar el flujo.

4. **Sincronización multi-dispositivo**
   - Al cambiar una preferencia, actualizar backend y notificar a otros dispositivos activos (WebSockets, refetch en login, etc.).
   - Documentar el flujo recomendado.

5. **Pruebas automatizadas**
   - Añadir tests unitarios e integración para verificar la correcta aplicación de preferencias en todos los flujos.
   - Documentar la obligatoriedad de tests en la guía de desarrollo.

6. **Política de expiración y limpieza**
   - Limpiar preferencias de localStorage al hacer logout o cambiar de usuario.
   - Documentar la política de expiración/limpieza.

7. **Fallback para usuarios anónimos**
   - Permitir guardar preferencias en localStorage para usuarios no logueados.
   - Al registrarse/iniciar sesión, migrar la preferencia al backend.
   - Documentar este flujo.

8. **Documentación de edge cases**
   - Documentar qué ocurre si hay conflicto entre localStorage y backend (el backend tiene prioridad).
   - Documentar el manejo de valores inválidos o corruptos.

9. **Soporte para futuras extensiones**
   - Diseñar el sistema de preferencias como un objeto extensible (ej: `preferences: { theme, language, accessibility, ... }`).
   - Documentar que nuevas preferencias deben seguir el mismo patrón de persistencia y validación.

**Estas prácticas y acciones son obligatorias para todo el equipo y deben ser revisadas y aplicadas en cada desarrollo o extensión relacionada con preferencias de usuario.**

# Estructura de Accesos Rápidos y Pantalla de Configuración (Settings)

## Accesos rápidos en la interfaz

- **Campanita de notificaciones:**
  - Ubicación: parte superior derecha del header/topbar.
  - Función: acceso rápido a notificaciones, mensajes y alertas.
  - Comportamiento: badge con contador de no leídos, dropdown con lista de notificaciones recientes.

- **Avatar/usuario:**
  - Ubicación: junto a la campanita, en la parte superior derecha.
  - Función: acceso rápido al menú de usuario (perfil, preferencias, logout, etc.).
  - Comportamiento: menú desplegable con opciones rápidas (ver perfil, cambiar tema, ir a settings, cerrar sesión).

## Pantalla completa de selección de settings

- **Acceso:** desde el menú de usuario (avatar), opción "Configuración" o "Settings".
- **Estructura:**
  - Página completa dedicada a settings.
  - Menú de anclas (anchor menu) en la parte superior o lateral para saltar a secciones: General, Notificaciones, Seguridad, Integraciones, Accesibilidad, etc.
  - Contenido de cada sección en scroll vertical, agrupando opciones relacionadas.
- **UX:**
  - No sobrecargar con demasiadas opciones visibles a la vez.
  - Agrupar lógicamente y usar títulos claros.
  - Permitir búsqueda rápida si hay muchas opciones.
  - Guardar automáticamente o con botón "Guardar cambios".

**Todas las preferencias de usuario deben centralizarse en esta pantalla, siguiendo el patrón de extensibilidad y agrupación lógica.**

# Metodología de Pruebas Marcelo XTP (Desarrollo con IA)

Como parte de la filosofía de desarrollo Marcelo XTP y la integración de IA, el equipo debe seguir la siguiente metodología de pruebas para asegurar calidad, performance y robustez en el stack:

## 1. Pruebas de APIs
- **Herramientas:** Postman, Swagger/OpenAPI, Supertest/Jest, Newman.
- **Flujo:**
  - Preparar colecciones de endpoints y casos de prueba en Postman.
  - Automatizar pruebas críticas con Newman/Supertest en CI/CD.
  - Documentar resultados y edge cases en la guía de testing.

## 2. Pruebas de interfaces gráficas (UI)
- **Herramienta principal:** Playwright (E2E, cross-browser, automatización robusta).
- **Alternativa:** Cypress.
- **Flujo:**
  - Escribir scripts E2E para flujos críticos (login, navegación, preferencias, etc.).
  - Ejecutar en diferentes navegadores y automatizar en CI/CD.
  - Documentar scripts y flujos cubiertos.

## 3. Pruebas de carga y estrés
- **Herramienta principal:** k6 (por robustez, scripting moderno y comunidad).
- **Alternativas:** JMeter, Artillery.
- **Flujo:**
  - Definir escenarios de carga (usuarios concurrentes, ramp-up, endpoints críticos).
  - Escribir scripts de carga en k6 y ejecutarlos en staging.
  - Analizar resultados y documentar umbrales aceptables.

## 4. Pruebas de concurrencia y sesiones
- Simular múltiples sesiones de usuario con scripts de carga y validación de manejo de sesiones.

## 5. Integración con CI/CD
- Todos los scripts y colecciones deben estar versionados en `/tests/`.
- Automatizar la ejecución de pruebas en pipelines de CI/CD.
- Reportar resultados y alertar sobre regresiones.

## 6. Buenas prácticas
- Documentar herramientas, comandos y flujos en la guía de testing.
- Mantener scripts y colecciones actualizados.
- Revisar y mejorar los umbrales de performance y cobertura periódicamente.

**Esta metodología es obligatoria para todo el equipo y debe ser consultada y aplicada en cada desarrollo, asegurando calidad y trazabilidad en el ciclo de vida del software.**

# Uso de Scripts Genéricos para Pruebas Automatizadas (k6 y Playwright)

## 1. Pruebas de carga con k6
- Ubicación: `tests/performance/k6-generic-template.js`
- **¿Para qué sirve?** Simula usuarios concurrentes sobre cualquier endpoint de API.
- **¿Cómo adaptarlo?**
  - Cambia `BASE_URL` y `ENDPOINT` según tu API.
  - Ajusta los `stages` para simular diferentes escenarios de carga.
- **¿Cómo ejecutarlo?**
  ```bash
  k6 run k6-generic-template.js --env BASE_URL=https://api.tu-proyecto.com
  ```
- **Buenas prácticas:**
  - Versiona los scripts en `/tests/performance/`.
  - Documenta los escenarios y resultados en la guía de performance.

## 2. Pruebas E2E de UI con Playwright
- Ubicación: `tests/e2e/playwright-generic-template.spec.ts`
- **¿Para qué sirve?** Prueba flujos críticos de UI: login, navegación, settings, cambio de tema.
- **¿Cómo adaptarlo?**
  - Modifica rutas y selectores según tu app.
  - Agrega o ajusta pasos para cubrir tus flujos.
- **¿Cómo ejecutarlo?**
  ```bash
  npx playwright test tests/e2e/playwright-generic-template.spec.ts
  ```
- **Buenas prácticas:**
  - Versiona los scripts en `/tests/e2e/`.
  - Automatiza la ejecución en CI/CD.
  - Documenta los flujos cubiertos y pendientes.

---

## FAQs sobre pruebas automatizadas y metodología

**¿Por qué usar scripts genéricos?**
- Permiten reutilización, onboarding rápido y adaptación a cualquier proyecto.
- Facilitan la estandarización y la calidad en equipos grandes o multi-proyecto.

**¿Cuándo crear scripts particulares?**
- Cuando una funcionalidad, endpoint o flujo es específico de un proyecto o módulo.
- Ubica los scripts particulares en subcarpetas o archivos separados para mantener lo genérico limpio.

**¿Cómo integro las pruebas en CI/CD?**
- Agrega pasos en tu pipeline para ejecutar los scripts de k6 y Playwright tras cada build/deploy.
- Falla el pipeline si las pruebas no pasan, para asegurar calidad continua.

**¿Qué hago si un script genérico no cubre mi caso?**
- Usa el genérico como plantilla y extiéndelo en un archivo nuevo.
- Documenta el caso particular y su razón en la guía de testing.

**¿Dónde reporto resultados y mejoras?**
- Documenta resultados, umbrales y mejoras en la guía de performance o en issues del repositorio.

---

# Manejo de Cookies: Buenas Prácticas y Cumplimiento Legal

## 1. Casos de uso recomendados
- **Autenticación y sesión:**
  - Usar cookies seguras (HttpOnly, Secure, SameSite) para tokens de sesión o refresh tokens.
- **Preferencias de usuario:**
  - Preferir localStorage para preferencias no críticas, pero usar cookies si se requiere sincronización cross-domain o SSR.
- **Consentimiento:**
  - Implementar banner de consentimiento si se usan cookies no esenciales (analytics, marketing, etc.).
- **Integraciones de terceros:**
  - Documentar cualquier cookie agregada por servicios externos (analytics, chatbots, etc.).

## 2. Buenas prácticas
- No almacenar información sensible en cookies accesibles por JavaScript.
- Configurar expiración adecuada según el uso (sesión, persistente, etc.).
- Documentar todas las cookies utilizadas en la política de privacidad y en la guía técnica.
- Permitir al usuario gestionar su consentimiento y borrar cookies no esenciales.

## 3. Cumplimiento legal
- Cumplir con GDPR, CCPA y otras normativas según el mercado objetivo.
- Mostrar banner de consentimiento y registrar la preferencia del usuario.
- Mantener registro de consentimiento y permitir su revocación.

## 4. Ejemplo de uso seguro de cookies
```js
// Ejemplo de seteo de cookie segura en backend (Node.js/Express)
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
});
```

---

## FAQs sobre cookies y cumplimiento legal

**¿Puedo guardar preferencias de usuario en cookies?**
- Sí, pero prefiere localStorage para preferencias no críticas. Usa cookies solo si es necesario para SSR o sincronización cross-domain.

**¿Qué cookies requieren consentimiento explícito?**
- Todas las cookies no esenciales (analytics, marketing, tracking) requieren consentimiento explícito del usuario.

**¿Qué pasa si no cumplo con GDPR/CCPA?**
- Puedes enfrentar sanciones legales y pérdida de confianza de los usuarios. El cumplimiento es obligatorio.

**¿Dónde documento las cookies usadas?**
- En la política de privacidad y en la guía técnica del proyecto.

**¿Qué debe hacer un developer si integra un nuevo servicio que usa cookies?**
- Documentar el uso, actualizar la política de privacidad y asegurarse de que el consentimiento esté implementado.

---

**Todos los desarrolladores deben seguir estos lineamientos y resaltar la importancia del cumplimiento legal en el manejo de cookies y datos de usuario.**

---

# Patrones de Diseño: Normas de Programación y Casos de Uso

Como parte de las normas de programación y desarrollo, **el uso de patrones de diseño es obligatorio y debe estar alineado con los casos de uso y retos reales del stack**. Esta sección es viva y debe ampliarse con nuevos patrones o ejemplos según evolucione el proyecto.

## Tabla inicial de patrones recomendados y casos de uso

| Patrón         | ¿Cuándo usarlo? | Ejemplo en el stack | Beneficio principal |
|----------------|-----------------|--------------------|---------------------|
| **Facade**     | Simplificar una API compleja o integrar varios módulos bajo una interfaz simple. | Unificar servicios de notificaciones (email, push, SMS) bajo `sendNotification()`. | Reduce acoplamiento, facilita uso y testing. |
| **Singleton**  | Necesidad de una única instancia global (configuración, logger, cache). | Gestor de temas de UI, instancia de logger. | Control de recursos, estado global controlado. |
| **Factory**    | Crear objetos de diferentes tipos según contexto, sin acoplarse a clases concretas. | Instanciar componentes UI según tipo de usuario o plan. | Flexibilidad, desacoplamiento. |
| **Observer**   | Varios componentes deben reaccionar a cambios de estado (eventos, notificaciones). | Actualizar la UI cuando cambian preferencias del usuario. | Desacopla emisores y receptores de eventos. |
| **Decorator**  | Añadir funcionalidades a objetos de forma dinámica y flexible. | Añadir logging, métricas o permisos a servicios sin modificar su código base. | Extensibilidad sin modificar código existente. |
| **Strategy**   | Varias formas de realizar una operación y quieres intercambiarlas fácilmente. | Diferentes algoritmos de autenticación o validación de datos. | Flexibilidad, código más limpio. |

## Buenas prácticas y proceso de mejora
- Esta sección debe revisarse y ampliarse en cada retrospectiva o cuando surja un problema de arquitectura, lentitud o error atribuible a la elección (o ausencia) de un patrón.
- Cualquier developer puede proponer la inclusión de un nuevo patrón o caso de uso, documentando el problema y la solución.
- Si un patrón resulta inadecuado, debe documentarse el motivo y la alternativa elegida.
- Referencia obligatoria: [Catálogo de patrones de diseño](https://refactoring.guru/es/design-patterns/catalog)

**El objetivo es asegurar una arquitectura limpia, mantenible y alineada con los retos reales del proyecto, facilitando la discusión y mejora continua.**

# Referencia obligatoria: Ejemplos prácticos de patrones de diseño

Para facilitar la aplicación correcta de los patrones de diseño en el stack, consulta y adapta los ejemplos prácticos disponibles en:

**[docs/features/PATTERNS_EXAMPLES.md](./PATTERNS_EXAMPLES.md)**

> ⚠️ **Todos los desarrolladores deben revisar y adaptar estos ejemplos antes de implementar soluciones arquitectónicas basadas en patrones.**

--- 