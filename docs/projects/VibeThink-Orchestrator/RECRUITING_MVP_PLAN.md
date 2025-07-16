# Plan de Prototipo (MVP) - Módulo Agentic de Recruiting

> **ESTADO:** Definido

---

## 1. Objetivo del MVP

**Validar el core value proposition:** Demostrar que un sistema de agentes de IA puede automatizar eficazmente el proceso de búsqueda y contacto inicial de candidatos, ahorrando tiempo y mejorando la calidad de los perfiles para los equipos de RRHH.

---

## 2. Alcance y Características Clave

### **Funcionalidades INCLUIDAS en el MVP:**

- **Creación de Workflow Simplificada:**
    - Input manual de: Título del puesto, skills clave (5-10) y ubicación.
- **Agente de Búsqueda en LinkedIn:**
    - Un único agente que realiza búsquedas en LinkedIn basado en los criterios.
    - Extrae los primeros 10-20 perfiles (nombre, título actual, URL del perfil).
- **Dashboard de Candidatos:**
    - Una tabla simple que muestra los candidatos encontrados.
    - Columnas: Nombre, Título, Link al Perfil, Status (Encontrado, Contactado).
- **Outreach Manual Simplificado:**
    - Un botón "Contactar" por candidato.
    - Al hacer clic, se genera un borrador de email (usando una plantilla fija) en el cliente de correo local del usuario (`mailto:`).
- **Autenticación y Aislamiento Básico:**
    - Login de usuario simple.
    - Aislamiento a nivel de API para que un usuario solo vea sus workflows y candidatos.

### **Funcionalidades EXCLUIDAS del MVP (para versiones futuras):**

- **Múltiples Agentes Colaborativos (CrewAI):** Se usará un script de agente único.
- **Búsqueda en Múltiples Fuentes:** Solo LinkedIn. No se buscará en bases de datos internas ni otros portales.
- **Landing Pages Dinámicas:** No se generarán páginas de aplicación.
- **Outreach Automatizado:** El envío de correos no será automático.
- **Scoring y Evaluación de IA:** No habrá puntuación de candidatos.
- **Dashboard de Métricas Avanzado:** Solo se mostrará el número de candidatos.
- **Configuraciones Complejas por Empresa:** Se usarán valores predeterminados.

---

## 3. Stack Tecnológico del MVP

Se utilizará un subconjunto simplificado de nuestro stack final para acelerar el desarrollo.

- **Backend:** `FastAPI`, `Pydantic`.
- **Scraping:** `Playwright` (ejecutado como una tarea síncrona simple al inicio).
- **Base de Datos:** `PostgreSQL` (usando una única tabla para workflows y candidatos). Se omite Qdrant y Redis por ahora.
- **Frontend:** Un dashboard simple renderizado desde el backend con `Jinja2` para evitar la complejidad de un framework de JavaScript en esta etapa.
- **Despliegue:** `Docker Compose`.

---

## 4. Cronograma Estimado (2 Semanas)

### **Semana 1: Core Backend y Lógica del Agente**

- **Día 1-2: Setup y Modelos de Datos**
    - [ ] Configurar el proyecto FastAPI.
    - [ ] Definir los modelos Pydantic y las tablas de `PostgreSQL` para Workflows y Candidatos.
- **Día 3-4: Lógica del Agente de Scraping**
    - [ ] Desarrollar el script de `Playwright` para buscar en LinkedIn y extraer perfiles.
    - [ ] Crear el endpoint que recibe una solicitud de workflow y ejecuta el script de scraping.
- **Día 5: Almacenamiento y API**
    - [ ] Guardar los resultados del scraping en la base de datos.
    - [ ] Crear el endpoint API para obtener la lista de candidatos de un workflow.

### **Semana 2: Frontend, Autenticación y Despliegue**

- **Día 6-7: Interfaz de Usuario (UI)**
    - [ ] Crear la página de inicio para crear un nuevo workflow.
    - [ ] Crear la vista de tabla para mostrar los candidatos (usando `Jinja2`).
    - [ ] Implementar el botón "Contactar" con la funcionalidad `mailto:`.
- **Día 8: Autenticación**
    - [ ] Implementar un sistema de login simple con JWT.
    - [ ] Asegurar que los endpoints solo devuelvan datos pertenecientes al usuario autenticado.
- **Día 9-10: Dockerización y Despliegue**
    - [ ] Crear `Dockerfile` y `docker-compose.yml` para la aplicación y la base de datos.
    - [ ] Desplegar en un entorno de staging/demo.
- **Día 11-14: Pruebas y Ajustes**
    - [ ] Realizar pruebas manuales del flujo completo.
    - [ ] Corregir errores y realizar pequeños ajustes de usabilidad.
    - [ ] Preparar la demo para los stakeholders.

---

## 5. Criterios de Éxito del MVP

- Un usuario puede iniciar sesión.
- Un usuario puede crear un workflow de búsqueda definiendo un rol y skills.
- El sistema busca en LinkedIn y presenta una lista de al menos 10 candidatos relevantes.
- Un usuario puede hacer clic en un botón para iniciar el contacto con un candidato.
- El proceso completo (de creación a visualización de candidatos) no toma más de 5 minutos.

Este plan nos permite construir rápidamente una versión funcional que demuestra el valor central de nuestra idea, minimizando el riesgo y el tiempo de desarrollo inicial. 