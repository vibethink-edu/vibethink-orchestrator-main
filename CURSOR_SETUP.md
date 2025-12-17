# 📚 CURSOR SETUP - Configuración de Documentación

**Versión:** 1.0.0  
**Última actualización:** 2025-12-12

---

## 🎯 Propósito

Los modelos de IA (Gemini, Claude, GPT-4) tienen conocimiento desactualizado (6+ meses). Para proyectos que usan tecnologías recientes (React 19, Vite 6, Next.js 15), es **CRÍTICO** indexar la documentación oficial en Cursor.

**Sin esto:** La IA alucinará código obsoleto y APIs deprecadas.

---

## ⚙️ Configuración en Cursor

**Ruta:** `Settings > Features > Docs > Add Docs`

**Proceso:**
1. Abrir Settings (Ctrl+,)
2. Ir a Features > Docs
3. Click en "Add Docs"
4. Pegar URL de documentación oficial
5. Esperar indexación (1-2 minutos)

---

## 📖 URLs de Documentación Oficial

### **Frontend Core**

```
React 19 (Latest)
https://react.dev

Vite 6 (Latest)
https://vitejs.dev

TypeScript (Latest)
https://www.typescriptlang.org/docs
```

### **Backend**

```
Express.js
https://expressjs.com

Node.js (Latest LTS)
https://nodejs.org/docs/latest/api
```

### **Voice APIs (VibeThink Specific)**

```
Google Gemini Multimodal Live API
https://ai.google.dev/gemini-api/docs/multimodal-live

ElevenLabs API
https://elevenlabs.io/docs/api-reference

Cartesia API
https://docs.cartesia.ai

Ultravox API
https://docs.ultravox.ai
```

### **UI/UX**

```
Tailwind CSS
https://tailwindcss.com/docs

Shadcn UI
https://ui.shadcn.com

Framer Motion
https://www.framer.com/motion
```

### **Database (Para Proyectos Futuros)**

```
Supabase
https://supabase.com/docs

Prisma ORM
https://www.prisma.io/docs

Drizzle ORM
https://orm.drizzle.team/docs

PostgreSQL
https://www.postgresql.org/docs
```

### **Next.js (Para Proyectos Orchestrator/Ovi)**

```
Next.js 15
https://nextjs.org/docs

Next.js App Router
https://nextjs.org/docs/app
```

### **State Management**

```
Zustand
https://docs.pmnd.rs/zustand

React Query (TanStack Query)
https://tanstack.com/query/latest/docs/react
```

### **Validation**

```
Zod
https://zod.dev

React Hook Form
https://react-hook-form.com/docs
```

---

## 🎯 URLs por Proyecto

### **Voice Agent (v3-andres-cantor)**

**Mínimo requerido:**
- React 19
- Vite 6
- TypeScript
- Express.js
- Gemini API
- ElevenLabs API
- Cartesia API
- Tailwind CSS

### **Ovi Portal (V4-ovi-Portal)**

**Mínimo requerido:**
- Next.js 15
- React 19
- TypeScript
- PayloadCMS
- Tailwind CSS
- Shadcn UI

### **Orchestrator (vibethink-orchestrator-main)**

**Mínimo requerido:**
- Next.js 15
- React 19
- TypeScript
- Supabase
- Zustand
- Zod
- Tailwind CSS

### **VozFood Agent**

**Mínimo requerido:**
- React 19
- Vite 6
- TypeScript
- Express.js
- Gemini API
- ElevenLabs API

---

## ✅ Verificación

**Después de agregar docs, verifica:**

1. **Test de conocimiento actualizado:**
```
Prompt: "¿Cuál es la sintaxis de React 19 para Server Components?"
```

2. **Test de API específica:**
```
Prompt: "Muéstrame cómo usar Gemini Multimodal Live API para streaming de audio"
```

Si la IA responde con información actualizada y específica, ✅ la indexación funcionó.

---

## 🔄 Mantenimiento

**Frecuencia:** Cada 3 meses o cuando actualices versiones mayores

**Proceso:**
1. Revisar versiones de dependencias (`package.json`)
2. Actualizar URLs si hay versiones nuevas
3. Re-indexar en Cursor
4. Verificar con prompts de test

---

## 💡 Tips

### **Prioriza calidad sobre cantidad**
- ❌ No agregues 50 URLs
- ✅ Agrega solo las 10-15 que usas diariamente

### **Documentación oficial > Tutoriales**
- ✅ Docs oficiales (react.dev)
- ❌ Blogs personales o Medium

### **Versiones específicas**
- ✅ Next.js 15 docs
- ❌ Next.js docs genéricos (pueden ser v13)

---

## 🚨 Problemas Comunes

### **"La IA sigue usando código viejo"**

**Solución:**
1. Verificar que la URL se indexó correctamente
2. Reiniciar Cursor
3. Iniciar chat nuevo (el contexto viejo persiste)

### **"La indexación falla"**

**Solución:**
1. Verificar que la URL sea accesible
2. Usar URLs de docs oficiales (no blogs)
3. Esperar 5 minutos (indexación puede tardar)

---

## 📊 Impacto Esperado

**Antes de indexar docs:**
- ❌ Código obsoleto (React 17 syntax)
- ❌ APIs deprecadas
- ❌ Patrones antiguos

**Después de indexar docs:**
- ✅ Código actualizado (React 19 syntax)
- ✅ APIs actuales
- ✅ Best practices modernas

---

## 🔗 Referencias

- **Cursor Docs:** https://docs.cursor.com
- **Video de Rob (Switch Dimension):** Análisis de Cursor 2.0
- **Best Practice:** Actualizar docs cada vez que actualices dependencias

---

**Última actualización:** 2025-12-12  
**Mantenido por:** VibeThink Team
