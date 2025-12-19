# 🐛 Guía para Reportar Issues - Testing

**Última actualización**: 2025-12-18

---

## 📋 Opción 1: Formato Rápido en Chat (RECOMENDADO)

Simplemente copia y pega esto en el chat:

```
🐛 ISSUE ENCONTRADO

URL: http://localhost:3005/dashboard-bundui/crm
Qué pasó: El sidebar no muestra los items correctos
Esperaba: Ver solo dashboards de bundui
Vi: Aparecen dashboards de vibethink también

Consola: [Si hay errores, copiarlos aquí]

Prioridad: Alta/Media/Baja
```

**Ejemplo Real**:
```
🐛 ISSUE ENCONTRADO

URL: http://localhost:3005/dashboard-vibethink/calendar
Qué pasó: Página en blanco
Esperaba: Ver el calendario
Vi: Pantalla blanca sin contenido

Consola: 
Error: Cannot find module '@vibethink/ui/calendar'
  at page.tsx:23

Prioridad: Alta
```

---

## 📋 Opción 2: Lista Simple

Si encuentras varios, mándamelos en lista:

```
Issues encontrados:

1. /dashboard-bundui/default - Sidebar tiene rutas incorrectas
2. /dashboard-vibethink/mail - Error 404
3. /dashboard-bundui/sales - Gráficos no cargan

¿Empiezo por cuál?
```

---

## 📋 Opción 3: Screenshot + Descripción

Si es visual:

```
🐛 ISSUE VISUAL

URL: http://localhost:3005/dashboard-bundui/crm
Qué pasa: El sidebar está roto visualmente
Screenshot: [Pegar imagen en el chat]

¿Es crítico o puedo seguir testeando?
```

---

## 📋 Opción 4: Errores de Consola

Si ves errores en DevTools:

```
🚨 ERROR DE CONSOLA

URL: http://localhost:3005/dashboard-vibethink/crypto

Error copiado de consola:
[Pegar aquí el error completo]
```

---

## 🎯 Lo Que MÁS Me Ayuda

### Para Corregir Rápido:

1. **URL exacta** donde ocurre
2. **Qué esperabas** ver
3. **Qué viste** en realidad
4. **Error de consola** (si hay)

### Ejemplo Perfecto:
```
URL: http://localhost:3005/dashboard-bundui/sales
Esperaba: Sidebar con 13 items de bundui
Vi: Sidebar con items mezclados (bundui + vibethink)
Consola: Sin errores
Prioridad: Alta (rompe independencia de sidebars)
```

---

## ⚡ Prioridades

**Alta (Arreglar YA)**:
- Sidebars mezclados
- Errores que bloquean navegación
- Páginas en blanco
- Errores de imports

**Media (Arreglar pronto)**:
- Estilos rotos
- Componentes que no se ven bien
- Links que no funcionan

**Baja (Anotar para después)**:
- Performance lenta
- Mejoras visuales
- Features faltantes

---

## 💡 Tips

### Cómo Abrir DevTools Console
```
F12 o Ctrl+Shift+I
→ Tab "Console"
→ Copiar errores rojos
```

### Cómo Tomar Screenshot en Windows
```
Win + Shift + S
→ Seleccionar área
→ Pegar en chat (Ctrl+V)
```

### Si Hay Muchos Errores
```
No copies todo, solo dime:

"Hay 10+ errores en /dashboard-bundui"
"La mayoría son del mismo tipo: Cannot find module"

Luego los revisamos juntos.
```

---

## 🚀 Workflow Ideal

### Durante el Testing:

1. **Probar URL**
   ```
   http://localhost:3005/dashboard-bundui/crm
   ```

2. **Si funciona**: ✅ Continuar al siguiente

3. **Si hay issue**: 
   ```
   🐛 Encontré algo en /dashboard-bundui/crm
   [Descripción breve]
   ¿Lo arreglo ahora o sigues testeando?
   ```

4. **Yo respondo**:
   - Si es crítico: "Voy a arreglarlo ahora"
   - Si es menor: "Anótalo, síguele al testing"

---

## 📝 Al Final del Testing

Resumen simple:

```
RESUMEN DE TESTING

✅ Funcionan bien:
- /dashboard-bundui/default
- /dashboard-bundui/crm
- /dashboard-vibethink/sales

⚠️ Con issues menores:
- /dashboard-bundui/analytics (gráfico lento)

❌ Con errores críticos:
- /dashboard-vibethink/calendar (404)

¿Qué arreglamos primero?
```

---

## ❓ Si No Estás Seguro

Simplemente pregunta:

```
"¿Es normal que el sidebar tarde 2 segundos en aparecer?"
"¿Debería ver este mensaje en consola: [mensaje]?"
"¿Este dashboard debería existir: /dashboard-bundui/kanban?"
```

**Siempre es mejor preguntar que asumir.**

---

## 🎯 Ejemplo de Sesión de Testing

```
Usuario: Empecé el testing

Usuario: ✅ /dashboard-bundui/default funciona bien

Usuario: 🐛 /dashboard-bundui/crm 
Sidebar muestra 20 items en lugar de 13
Hay items de vibethink mezclados

AI: Arreglando... [hace cambios]

Usuario: ✅ Ahora sí, solo 13 items

Usuario: Probé 5 más, todos funcionan

Usuario: ⚠️ /dashboard-vibethink/mail
Página carga pero gráfico no se ve
No hay errores en consola

AI: Ese es conocido, menor. ¿Sigues testeando?

Usuario: Sí, termino y te digo
```

---

**Última actualización**: 2025-12-18  
**Recuerda**: No hay preguntas tontas, mejor preguntar que asumir




