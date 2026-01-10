# 🏗️ Bundui Integration & Technical Reference

> **Documento para Desarrolladores**  
> **Tema:** Cómo se integró Bundui Premium y qué debes saber para mantenerlo.

---

## 1. Historia de la Integración (Origin Story)

### 1.1 Fuente Original
*   **Producto:** Shadcn UI Kit Dashboard (Premium).
*   **Versión Inicial:** v1.2.0.
*   **Fecha de Inclusión:** Diciembre 2024.
*   **Método:** Copia directa de archivos (Mirroring).

### 1.2 Estrategia de Inclusión
En lugar de "mezclar" el código de Bundui con nuestra aplicación principal (`dashboard-vibethink`), decidimos mantenerlo **aislado pero integrado**:

1.  **Ruta de Espejo (`/dashboard-bundui`)**:
    *   Creamos un árbol de rutas paralelo.
    *   **Objetivo:** Permitir comparar "Apple-to-Apple" la implementación original vs nuestra versión mejorada.
    *   **Ubicación:** `apps/dashboard/app/dashboard-bundui/`.

2.  **Componentes Compartidos**:
    *   Inicialmente copiamos su carpeta `components` a `apps/dashboard/src/shared/components/bundui-premium`.
    *   ⚠️ **Estado Actual:** Esa carpeta es LEGACY. Los componentes "buenos" se movieron a `@vibethink/ui`.

---

## 2. Consideraciones Técnicas (The "Gotchas")

Si vas a tocar el código heredado de Bundui, lee esto primero.

### 2.1 "Use Client" y Renderizado
El template original de Bundui asume mucho renderizado de cliente (CSR), mientras que nosotros usamos Next.js App Router (RSC) de forma estricta.
*   **El Problema:** Al copiar páginas, a menudo explotan con errores de hidratación o hooks en el servidor.
*   **La Solución:** Hemos tenido que agregar `"use client";` manualmente en muchos componentes de página (`page.tsx`) que importan interactividad.
*   **Regla:** Si ves un error `createContext only works in Client Components`, te falta el `"use client"`.

### 2.2 Dependencias "Ocultas"
Bundui asume ciertas librerías que no siempre son obvias:
*   **`recharts`**: Modificamos la configuración para evitar conflictos de tipos.
*   **`react-day-picker`**: Hubo conflictos de versión con Shadcn. Usamos la versión compatible con nuestras definiciones de estilo.
*   **Iconos**: Usa `lucide-react` nativamente, pero algunos componentes viejos buscaban `@radix-ui/react-icons`. Hemos estandarizado todo a `lucide-react`.

### 2.3 Estilos y Tailwind
*   **Configuración Fusionada:** No usamos el `tailwind.config.js` de Bundui por separado. Lo fusionamos en nuestro preset global.
*   **Conflicto de CSS Variables:** Bundui define colores (ej. `--primary`) que coinciden con los nuestros.
    *   *Nota:* Hemos alineado nuestros tokens para que sean compatibles. Si un botón de Bundui se ve "raro", revisa `apps/dashboard/src/styles/globals.css`.

### 2.4 El Problema de la Navegación (Sidebar)
*   En el original, la navegación está hardcodeada en un archivo `data` dentro de cada dashboard.
*   **En VibeThink:** Centralizamos TODO en `apps/dashboard/src/shared/data/bundui-nav-items.ts`.
    *   ⚠️ **Advertencia:** Si cambias un ítem de menú, hazlo ahí. No busques en `layout.tsx`.

---

## 3. Estado de los Componentes (Legacy vs Modern)

Para evitar confusión al leer el código:

| Ubicación | Estado | Descripción |
| :--- | :--- | :--- |
| `packages/ui/src/components/...` | ✅ **MODERNO** | Componentes finales, refactorizados y tipados. ÚSALOS. |
| `apps/dashboard/src/shared/components/bundui-premium/` | ⚠️ **LEGACY** | Restos de la copia inicial. Solo existen para compatibilidad. NO USAR para código nuevo. |
| `C:\IA Marcelo Labs\bundui\...` | 🔒 **REFERENCIA** | Código fuente original externo. Solo lectura. |

---

## 4. Guía para Futuros Desarrolladores

1.  **¿Quieres arreglar un bug en una página de Bundui?**
    *   Edita `apps/dashboard/app/dashboard-bundui/...`.
    *   No toques la referencia externa.

2.  **¿Quieres usar un Sidebar de Bundui en una app nueva?**
    *   Importa `AppSidebar` de `@vibethink/ui`.
    *   No copies el código de `bundui-premium`.

3.  **¿La página parpadea o hay errores de estilo?**
    *   Verifica si falta un `HydrationBoundary` (aunque tratamos de no usarlos si no es necesario).
    *   Revisa si hay clases de Tailwind v3 incompatibles con v4 (el linter debería avisarte).

---
**Mantenimiento:** Este documento debe actualizarse si cambiamos drásticamente la estrategia de integración (ej. si eliminamos la carpeta legacy).
