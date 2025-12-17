# 🔍 Comparación: prompt-kit vs shadcn/ui

**Fecha:** 2025-01-16  
**Propósito:** Identificar componentes únicos de prompt-kit que NO están en shadcn/ui

---

## 📊 Resumen Ejecutivo

**prompt-kit** es una extensión especializada de shadcn/ui para aplicaciones de IA. Todos sus componentes están construidos sobre los primitivos de shadcn/ui, pero agrega componentes especializados que NO existen en el repositorio oficial de shadcn/ui.

---

## ✅ Componentes ÚNICOS de prompt-kit (NO en shadcn/ui)

### 🎯 Componentes Especializados para IA

#### 1. **PromptInput** ⭐⭐⭐⭐⭐
**¿Qué es?** Input especializado para prompts de IA con textarea auto-resize y acciones integradas.

**Componentes:**
- `PromptInput` - Contenedor principal
- `PromptInputTextarea` - Textarea con auto-resize
- `PromptInputAction` - Botones de acción dentro del input
- `PromptInputActions` - Contenedor de acciones

**¿Por qué no está en shadcn/ui?**
- Especializado para casos de uso de IA
- Combina múltiples primitivos (textarea + buttons + form) en un componente optimizado
- shadcn/ui prefiere componentes atómicos

**Equivalente en shadcn/ui:** 
- ❌ No existe equivalente directo
- Podrías construir con: `Textarea` + `Button` + custom logic

---

#### 2. **ChatContainer** ⭐⭐⭐⭐
**¿Qué es?** Contenedor optimizado para mensajes de chat con scroll automático y manejo de estados.

**Características:**
- Scroll automático al final
- Manejo de estados vacíos
- Optimizado para streaming
- Auto-scroll cuando hay nuevos mensajes

**¿Por qué no está en shadcn/ui?**
- Caso de uso específico (chat)
- Lógica de scroll compleja
- shadcn/ui no tiene componentes de chat

**Equivalente en shadcn/ui:**
- ❌ No existe
- Podrías usar: `ScrollArea` + custom logic

---

#### 3. **Message** + **MessageContent** ⭐⭐⭐⭐
**¿Qué es?** Componente especializado para renderizar mensajes de chat con soporte para markdown, código, y estados.

**Características:**
- Renderizado de markdown
- Code blocks con syntax highlighting
- Estados (loading, error, streaming)
- Avatares y timestamps
- Acciones (copy, edit, delete)

**¿Por qué no está en shadcn/ui?**
- Especializado para chat
- Combina múltiples primitivos
- shadcn/ui no tiene componentes de mensajería

**Equivalente en shadcn/ui:**
- ❌ No existe
- Podrías construir con: `Card` + `Markdown` (custom) + `Avatar`

---

#### 4. **Markdown** ⭐⭐⭐⭐⭐
**¿Qué es?** Componente para renderizar markdown con syntax highlighting y estilos personalizados.

**Características:**
- Renderizado de markdown completo
- Syntax highlighting en code blocks
- Tablas, listas, enlaces
- Estilos personalizables
- Soporte para componentes React dentro de markdown

**¿Por qué no está en shadcn/ui?**
- shadcn/ui no incluye renderizado de markdown
- Requiere dependencias adicionales (react-markdown)
- shadcn/ui se enfoca en primitivos, no en renderizado de contenido

**Equivalente en shadcn/ui:**
- ❌ No existe
- Necesitarías: `react-markdown` + custom styling

---

#### 5. **CodeBlock** ⭐⭐⭐⭐
**¿Qué es?** Componente especializado para bloques de código con syntax highlighting y copy to clipboard.

**Características:**
- Syntax highlighting (múltiples lenguajes)
- Copy to clipboard
- Línea de números opcional
- Tema claro/oscuro
- Scroll horizontal para código largo

**¿Por qué no está en shadcn/ui?**
- Requiere dependencias pesadas (react-syntax-highlighter)
- Caso de uso específico
- shadcn/ui prefiere mantener dependencias mínimas

**Equivalente en shadcn/ui:**
- ❌ No existe
- Necesitarías: `react-syntax-highlighter` + custom component

---

#### 6. **Loader** (PromptLoader) ⭐⭐⭐
**¿Qué es?** Indicadores de carga especializados para streaming de IA.

**Variantes:**
- `pulse-dot` - Puntos pulsantes
- `spinner` - Spinner animado
- `skeleton` - Skeleton loading
- `typing` - Indicador de escritura

**¿Por qué no está en shadcn/ui?**
- shadcn/ui tiene `Skeleton` pero no variantes especializadas
- prompt-kit agrega variantes específicas para IA
- Animaciones optimizadas para streaming

**Equivalente en shadcn/ui:**
- ⚠️ Parcial: `Skeleton` existe pero sin variantes especializadas
- prompt-kit agrega más variantes y animaciones

---

#### 7. **ScrollButton** (PromptScrollButton) ⭐⭐⭐
**¿Qué es?** Botón de scroll que aparece/desaparece automáticamente.

**Características:**
- Auto-hide/show basado en posición
- Scroll suave al final
- Indicador de nuevos mensajes
- Posicionamiento fijo

**¿Por qué no está en shadcn/ui?**
- Caso de uso específico (chat)
- Lógica de detección de scroll
- shadcn/ui no tiene componentes de navegación de scroll

**Equivalente en shadcn/ui:**
- ❌ No existe
- Podrías construir con: `Button` + custom scroll logic

---

#### 8. **PromptSuggestion** (Suggestion) ⭐⭐⭐
**¿Qué es?** Componente para mostrar sugerencias de prompts como chips clickeables.

**Características:**
- Chips clickeables
- Grid/lista de sugerencias
- Personalizables
- Animaciones

**¿Por qué no está en shadcn/ui?**
- Caso de uso específico (IA)
- shadcn/ui tiene `Badge` pero no como sugerencias interactivas
- Lógica de selección y acción

**Equivalente en shadcn/ui:**
- ⚠️ Parcial: `Badge` existe pero sin lógica de sugerencias
- prompt-kit agrega interactividad y casos de uso

---

#### 9. **FileUpload** ⭐⭐⭐
**¿Qué es?** Componente especializado para upload de archivos con drag & drop y preview.

**Características:**
- Drag & drop
- Preview de archivos
- Múltiples archivos
- Progress indicators
- Validación de tipos

**¿Por qué no está en shadcn/ui?**
- shadcn/ui tiene `Input` pero no file upload especializado
- Requiere lógica compleja de drag & drop
- shadcn/ui prefiere primitivos simples

**Equivalente en shadcn/ui:**
- ⚠️ Parcial: `Input type="file"` existe pero sin features avanzadas
- prompt-kit agrega drag & drop, preview, y mejor UX

---

#### 10. **Chain of Thought** ⭐⭐
**¿Qué es?** Visualización de razonamiento paso a paso del agente de IA.

**Características:**
- Árbol de pensamiento
- Pasos conectados
- Estados de cada paso
- Visualización jerárquica

**¿Por qué no está en shadcn/ui?**
- Caso de uso muy específico (IA avanzada)
- Visualización compleja
- No es un componente UI genérico

**Equivalente en shadcn/ui:**
- ❌ No existe
- Necesitarías construir completamente custom

---

#### 11. **Reasoning** ⭐⭐
**¿Qué es?** Componente para mostrar el proceso de razonamiento del agente.

**Características:**
- Explicación paso a paso
- Visualización de proceso
- Estados intermedios
- Árbol de decisiones

**¿Por qué no está en shadcn/ui?**
- Caso de uso muy específico
- Visualización compleja
- No es un componente UI genérico

**Equivalente en shadcn/ui:**
- ❌ No existe
- Necesitarías construir completamente custom

---

#### 12. **Steps** ⭐⭐⭐
**¿Qué es?** Componente para mostrar pasos de un proceso con indicadores de progreso.

**Características:**
- Indicadores de pasos
- Estados (active, completed, pending)
- Conectores entre pasos
- Personalizables

**¿Por qué no está en shadcn/ui?**
- shadcn/ui no tiene componente de steps
- Caso de uso común pero no incluido
- prompt-kit lo agrega como utilidad

**Equivalente en shadcn/ui:**
- ❌ No existe
- Podrías construir con: `div` + custom logic

---

#### 13. **Source** ⭐⭐
**¿Qué es?** Componente para mostrar fuentes de información, citas y referencias.

**Características:**
- Citas y referencias
- Links a documentos
- Metadata
- Preview de fuentes

**¿Por qué no está en shadcn/ui?**
- Caso de uso específico (RAG, citas)
- No es un componente UI genérico
- Especializado para IA con fuentes

**Equivalente en shadcn/ui:**
- ❌ No existe
- Podrías construir con: `Card` + `Link` + custom

---

#### 14. **SystemMessage** ⭐⭐
**¿Qué es?** Componente para mensajes del sistema (notificaciones, alertas del sistema).

**Características:**
- Mensajes del sistema
- Notificaciones
- Alertas
- Estados especiales

**¿Por qué no está en shadcn/ui?**
- shadcn/ui tiene `Alert` pero no especializado para sistema
- prompt-kit agrega variantes específicas

**Equivalente en shadcn/ui:**
- ⚠️ Parcial: `Alert` existe pero sin variantes de sistema
- prompt-kit agrega casos de uso específicos

---

#### 15. **Tool** ⭐⭐
**¿Qué es?** Visualización de herramientas usadas por el agente de IA.

**Características:**
- Lista de herramientas
- Estados de ejecución
- Resultados
- Metadata

**¿Por qué no está en shadcn/ui?**
- Caso de uso muy específico (function calling)
- Visualización especializada
- No es un componente UI genérico

**Equivalente en shadcn/ui:**
- ❌ No existe
- Necesitarías construir completamente custom

---

#### 16. **TextShimmer** (nuevo) ⭐⭐⭐
**¿Qué es?** Efecto shimmer para loading states y placeholders.

**Características:**
- Animación shimmer
- Placeholders
- Loading states
- Personalizable

**¿Por qué no está en shadcn/ui?**
- shadcn/ui tiene `Skeleton` pero no shimmer
- Animación específica
- prompt-kit agrega más opciones de loading

**Equivalente en shadcn/ui:**
- ⚠️ Parcial: `Skeleton` existe pero sin efecto shimmer
- prompt-kit agrega animación shimmer

---

#### 17. **ThinkingBar** (nuevo) ⭐⭐
**¿Qué es?** Barra de pensamiento que muestra que el agente está procesando.

**Características:**
- Indicador de procesamiento
- Animaciones
- Estados de pensamiento
- Personalizable

**¿Por qué no está en shadcn/ui?**
- Caso de uso específico (IA)
- Animación especializada
- No es un componente UI genérico

**Equivalente en shadcn/ui:**
- ❌ No existe
- Necesitarías construir completamente custom

---

#### 18. **FeedbackBar** (nuevo) ⭐⭐
**¿Qué es?** Barra de feedback para likes/dislikes y ratings.

**Características:**
- Likes/dislikes
- Ratings
- Feedback visual
- Acciones rápidas

**¿Por qué no está en shadcn/ui?**
- Caso de uso específico (feedback de IA)
- shadcn/ui no tiene componentes de rating
- prompt-kit agrega casos de uso específicos

**Equivalente en shadcn/ui:**
- ❌ No existe
- Podrías construir con: `Button` + custom logic

---

## 📋 Tabla Comparativa

| Componente prompt-kit | ¿Existe en shadcn/ui? | Equivalente Parcial | Notas |
|----------------------|----------------------|---------------------|-------|
| **PromptInput** | ❌ No | `Textarea` + `Button` | Combinación especializada |
| **ChatContainer** | ❌ No | `ScrollArea` | Lógica de scroll optimizada |
| **Message** | ❌ No | `Card` + custom | Especializado para chat |
| **Markdown** | ❌ No | N/A | Requiere react-markdown |
| **CodeBlock** | ❌ No | N/A | Requiere syntax highlighter |
| **Loader** | ⚠️ Parcial | `Skeleton` | Más variantes en prompt-kit |
| **ScrollButton** | ❌ No | `Button` | Lógica de scroll automática |
| **PromptSuggestion** | ⚠️ Parcial | `Badge` | Interactividad agregada |
| **FileUpload** | ⚠️ Parcial | `Input type="file"` | Drag & drop + preview |
| **Chain of Thought** | ❌ No | N/A | Muy específico para IA |
| **Reasoning** | ❌ No | N/A | Muy específico para IA |
| **Steps** | ❌ No | N/A | No está en shadcn/ui |
| **Source** | ❌ No | `Card` + `Link` | Especializado para citas |
| **SystemMessage** | ⚠️ Parcial | `Alert` | Variantes específicas |
| **Tool** | ❌ No | N/A | Muy específico para IA |
| **TextShimmer** | ⚠️ Parcial | `Skeleton` | Animación shimmer |
| **ThinkingBar** | ❌ No | N/A | Muy específico para IA |
| **FeedbackBar** | ❌ No | `Button` | Rating/feedback |

---

## 🎯 Conclusión

### Componentes ÚNICOS de prompt-kit (NO en shadcn/ui):

**Total: 18 componentes**

**Categorías:**

1. **Componentes Críticos para IA (8):**
   - PromptInput
   - ChatContainer
   - Message
   - Markdown
   - CodeBlock
   - Loader (variantes)
   - ScrollButton
   - PromptSuggestion

2. **Componentes Especializados (6):**
   - Chain of Thought
   - Reasoning
   - Steps
   - Source
   - Tool
   - ThinkingBar

3. **Componentes de Soporte (4):**
   - FileUpload (mejorado)
   - SystemMessage (variantes)
   - TextShimmer
   - FeedbackBar

### Por qué prompt-kit es valioso:

1. **Especialización:** Componentes diseñados específicamente para IA
2. **Optimización:** Optimizados para streaming y casos de uso de IA
3. **Completitud:** Soluciones completas, no solo primitivos
4. **UX:** Mejor experiencia de usuario para aplicaciones de IA
5. **Mantenibilidad:** Menos código custom que mantener

### Recomendación:

**prompt-kit agrega valor significativo** porque:
- ✅ 18 componentes que NO están en shadcn/ui
- ✅ Especializados para casos de uso de IA
- ✅ Construidos sobre shadcn/ui (compatible)
- ✅ Reducen código custom significativamente
- ✅ Mejoran UX para aplicaciones de IA

---

**Última actualización:** 2025-01-16

