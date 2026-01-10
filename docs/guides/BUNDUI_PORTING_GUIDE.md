# 🔄 Guía de Porting: Bundui Premium a VibeThink

> **Objetivo:** Traer nuevas features de Bundui (inglés) al Monorepo VibeThink (multidioma), manteniendo la calidad y consistencia.

---

## 🏎️ Resumen del Proceso (The Fast Track)

1.  **DETECTAR**: Comparar referencia externa (`C:\IA Marcelo Labs\bundui\...`) vs Monorepo.
2.  **COPIAR**: Traer los archivos crudos a `apps/dashboard/app/dashboard-bundui/[modulo]`.
3.  **ADAPTAR**:
    *   Imports: Cambiar `@/components` -> `@vibethink/ui`.
    *   Client: Agregar `"use client"` si hay interactividad.
4.  **TRADUCIR (i18n)**:
    *   ❌ No dejar textos en inglés hardcoded.
    *   ✅ Crear keys en `src/locales/es/common.json` (y `en`).
    *   ✅ Usar `useTranslation()`.
5.  **REGISTRAR**: Agregar entrada en `module-registry.ts`.

---

##  paso 1: Detección de Cambios

¿Cómo saber si hay algo nuevo?

### Opción A: Git Diff (Recomendada)
Ejecuta esto en tu terminal PowerShell para ver qué ha cambiado en la referencia:
```powershell
cd "C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard"
git pull origin main
git diff HEAD@{1} --stat
```
*Si ves una carpeta nueva (ej. `apps/courses`), ¡bingo! Feature nueva.*

### Opción B: Exploración Visual
1. Corre el script de referencia: `.\scripts\start-bundui-reference.ps1`
2. Navega a `http://localhost:3050`
3. Compara visualmente con tu `http://localhost:3000`.

---

## Paso 2: Copiado Inteligente (Cherry-Pick)

Supongamos que detectamos `apps/courses`.

1.  **Crear destino:**
    ```powershell
    mkdir "apps/dashboard/app/dashboard-bundui/courses"
    ```
2.  **Copiar archivos:**
    Copia los `.tsx` de la referencia a esta nueva carpeta.
    *Nota: No sobrescribas `layout.tsx` si ya usas el de VibeThink.*

---

## Paso 3: Adaptación Técnica (The VibeThink Way)

### 3.1 Arreglar Imports
Bundui usa rutas relativas que rompen en el monorepo.
*   **Antes:** `import { Button } from "@/components/ui/button"`
*   **Ahora:** `import { Button } from "@vibethink/ui"`

### 3.2 Componentes de Layout
*   **Antes:** `<SiteHeader />` (local)
*   **Ahora:** `import { SiteHeader } from "@vibethink/ui"`

---

## Paso 4: Internacionalización (i18n) - OBLIGATORIO

El pecado capital es migrar código en inglés estático.

1.  **Identificar Texto:**
    ```tsx
    <h1>Welcome to Courses</h1> // ❌ Mal
    ```
2.  **Crear Keys JSON:**
    *   `locales/es/courses.json`: `{"welcome": "Bienvenido a Cursos"}`
    *   `locales/en/courses.json`: `{"welcome": "Welcome to Courses"}`
3.  **Implementar Hook:**
    ```tsx
    const { t } = useTranslation('courses');
    <h1>{t('welcome')}</h1> // ✅ Bien
    ```

---

## Paso 5: Registro y "Sello"

Para que CodeRabbit y los Agentes sepan que este módulo es ciudadano de primera clase:

1.  Abre `apps/dashboard/src/shared/data/module-registry.ts`
2.  Agrega el objeto:
    ```typescript
    {
      id: "courses",
      status: "complete", // o "partial"
      i18nCoverage: 100,
      stackCompatibility: { ... }
    }
    ```

---

## ✅ Checklist Final de Calidad

*   [ ] ¿Compila sin errores de TypeScript?
*   [ ] ¿Funciona en Español e Inglés?
*   [ ] ¿Usa componentes de `@vibethink/ui`?
*   [ ] ¿Está registrado en `module-registry`?

---
**Recuerda:** Bundui Original es solo lectura. VibeThink es donde ocurre la magia.
