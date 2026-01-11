# 🔍 CHECKLIST DE VERIFICACIÓN VISUAL - Dashboard Bundui

**Fecha**: 2026-01-10 23:32  
**Propósito**: Identificar exactamente qué está mal visualmente

---

## ✅ VERIFICACIONES TÉCNICAS COMPLETADAS

1. ✅ Import CSS correcto: `import "@vibethink/ui/globals.css"`
2. ✅ Archivo existe: `packages/ui/src/globals.css`
3. ✅ Export correcto en package.json
4. ✅ 0 errores TypeScript en dashboard-bundui

---

## 🎯 CHECKLIST VISUAL (Para Marcelo)

### **Al abrir http://localhost:3005/dashboard-bundui/projects-v2**

#### **1. Colores y Tema**
- [ ] ¿Los colores se ven correctos?
- [ ] ¿El tema claro/oscuro funciona?
- [ ] ¿Los botones tienen los colores correctos?
- [ ] ¿Las tarjetas tienen el fondo correcto?

#### **2. Tipografía**
- [ ] ¿El texto se ve con la fuente correcta?
- [ ] ¿Los tamaños de fuente son correctos?
- [ ] ¿Los pesos de fuente (bold, normal) son correctos?

#### **3. Espaciado y Layout**
- [ ] ¿Los márgenes y padding se ven bien?
- [ ] ¿El sidebar tiene el ancho correcto?
- [ ] ¿El header tiene la altura correcta?
- [ ] ¿Los componentes están alineados?

#### **4. Componentes**
- [ ] ¿Los botones se ven bien?
- [ ] ¿Las tarjetas tienen bordes y sombras?
- [ ] ¿Los inputs tienen estilos?
- [ ] ¿Los iconos se muestran?

#### **5. Scrollbars**
- [ ] ¿Los scrollbars tienen estilo personalizado?
- [ ] ¿Son delgados y con el color correcto?

---

## 🐛 PROBLEMAS ESPECÍFICOS

### **Describe exactamente qué ves mal:**

**Ejemplo de descripción útil:**
- ❌ "Los botones no tienen color de fondo"
- ❌ "El texto está en Times New Roman en lugar de Inter"
- ❌ "No hay espaciado entre los componentes"
- ❌ "Los iconos no se muestran"
- ❌ "Todo se ve sin estilos (como HTML plano)"

**Por favor describe aquí:**
```
[Marcelo: Escribe aquí exactamente qué ves mal]




```

---

## 🔧 POSIBLES CAUSAS Y SOLUCIONES

### **Si TODO se ve sin estilos (HTML plano)**
**Causa**: CSS no se está cargando
**Solución**: 
1. Verificar que el servidor se reinició después del cambio
2. Limpiar cache del browser (Ctrl+Shift+R)
3. Verificar consola del browser por errores

### **Si algunos componentes se ven mal**
**Causa**: Imports de componentes incorrectos
**Solución**: Verificar que todos usan `@vibethink/ui/components/*`

### **Si los colores están mal**
**Causa**: Theme tokens no se están aplicando
**Solución**: Verificar que `theme-tokens.css` está incluido

### **Si los iconos no se muestran**
**Causa**: Imports de iconos incorrectos
**Solución**: Verificar que todos usan `@vibethink/ui/icons`

---

## 🚀 PASOS PARA REINICIAR LIMPIO

```powershell
# 1. Detener servidor actual
.\scripts\stop-dashboard-bundui.ps1

# 2. Limpiar cache de Next.js
Remove-Item -Recurse -Force apps\dashboard\.next -ErrorAction SilentlyContinue

# 3. Reiniciar servidor
.\scripts\start-dashboard-bundui.ps1

# 4. Esperar a que compile completamente

# 5. Abrir browser en modo incógnito
# Ctrl+Shift+N (Chrome) o Ctrl+Shift+P (Firefox)

# 6. Ir a http://localhost:3005/dashboard-bundui/projects-v2

# 7. Abrir DevTools (F12) y verificar:
#    - Console (errores)
#    - Network (que globals.css se cargue)
#    - Elements (que los estilos se apliquen)
```

---

## 📸 INFORMACIÓN ÚTIL PARA DIAGNOSTICAR

### **En el browser, presiona F12 y verifica:**

1. **Console Tab**:
   - ¿Hay errores en rojo?
   - ¿Qué dicen los errores?

2. **Network Tab**:
   - Busca "globals.css"
   - ¿Se carga? (status 200)
   - ¿Cuál es la URL completa?

3. **Elements Tab**:
   - Inspecciona un botón
   - ¿Tiene clases CSS aplicadas?
   - ¿Los estilos se muestran en el panel derecho?

---

**IMPORTANTE**: Necesito saber exactamente qué ves para poder ayudarte correctamente.

Por favor describe:
1. ¿Qué ves mal específicamente?
2. ¿Hay errores en la consola del browser?
3. ¿El servidor está corriendo sin errores?
