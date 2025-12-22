# Guía del Personalizador de Temas

## 📋 Resumen

El personalizador de temas tiene **dos niveles de configuración**:

1. **Configuración Básica** (siempre visible): Lo esencial para personalizar el aspecto
2. **Configuración Avanzada** (colapsable): Opciones adicionales para usuarios avanzados

---

## 🎨 Configuración Básica

### 1. **Aspecto (Color Mode)**
- **Light**: Tema claro
- **Dark**: Tema oscuro  
- **System**: Sigue la preferencia del sistema operativo

**¿Qué hace?** Cambia entre modo claro y oscuro de toda la aplicación.

---

### 2. **Tema de Color (Theme Preset)**
- **Sunset Glow**: Tema naranja cálido
- **Ocean Breeze**: Tema azul océano
- **Lavender Dream**: Tema púrpura suave
- **Rose Garden**: Tema rosa elegante
- **Forest Whisper**: Tema verde bosque
- **Lake View**: Tema azul turquesa
- **Underground**: Tema verde esmeralda
- **Default**: Tema neutro por defecto

**¿Qué hace?** Cambia los **colores principales** del tema (botones, enlaces, acentos). Es la opción más importante para personalizar el aspecto visual.

---

## ⚙️ Configuración Avanzada

### 3. **Base Color** (Opcional)
- **Opciones**: neutral, slate, gray, zinc, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose

**¿Qué hace?** Define la **paleta de colores base** (grises y neutros). Solo tiene efecto si no hay un **Theme Preset** activo, o para ajustar los tonos base del preset seleccionado.

**Ejemplo**: Si seleccionas "Sunset Glow" (naranja), el Base Color ajusta los tonos de gris que acompañan al naranja.

---

### 4. **Sidebar / Menú**

#### **Menu Color** (Color del menú)
- **Default**: Color por defecto del sidebar
- **Muted**: Sidebar con color apagado/suave
- **Accent**: Sidebar con color de acento (más vibrante)

**¿Qué hace?** Cambia el **color de fondo del menú lateral** (sidebar).

#### **Menu Accent** (Acento del menú)
- **Subtle**: Acento sutil (por defecto)
- **Moderate**: Acento moderado
- **Bold**: Acento fuerte (usa el color primario)

**¿Qué hace?** Controla qué tan **intenso** es el color de acento en los elementos del menú (hover, selección, etc.).

---

### 5. **Tamaño y Forma**

#### **Escala (Scale)**
- **—** (None): Tamaño normal
- **XS**: Tamaño extra pequeño
- **LG**: Tamaño grande

**¿Qué hace?** Ajusta el **tamaño general** de los componentes (botones, inputs, etc.).

#### **Radio (Radius)**
- **—** (None): Sin bordes redondeados
- **SM**: Bordes ligeramente redondeados
- **MD**: Bordes moderadamente redondeados (por defecto)
- **LG**: Bordes muy redondeados
- **XL**: Bordes extremadamente redondeados

**¿Qué hace?** Controla qué tan **redondeados** son los bordes de los componentes.

---

### 6. **Layout**

#### **Content Layout** (Layout del contenido)
- **Full**: Contenido a ancho completo
- **Centered**: Contenido centrado con ancho máximo

**¿Qué hace?** Controla si el contenido ocupa todo el ancho o está centrado con un máximo.

#### **Sidebar Mode** (Modo del sidebar)
- **Default**: Sidebar completo con texto
- **Icon**: Sidebar solo con íconos (colapsado)

**¿Qué hace?** Cambia el modo del menú lateral entre expandido (con texto) y colapsado (solo íconos).

---

## 🎯 Flujo Recomendado

### Para la mayoría de usuarios:
1. Selecciona **Aspecto** (Light/Dark)
2. Selecciona **Tema de Color** (Sunset Glow, Ocean Breeze, etc.)
3. ¡Listo! Ya tienes un tema personalizado

### Para usuarios avanzados:
1. Configura Aspecto y Tema de Color
2. Abre **Personalización Avanzada**
3. Ajusta **Base Color** si quieres cambiar los tonos base
4. Personaliza **Sidebar/Menú** si quieres cambiar el aspecto del menú lateral
5. Ajusta **Tamaño y Forma** según tus preferencias
6. Configura **Layout** según cómo quieras ver el contenido

---

## 🔍 Diferencias Clave

### **Theme Preset vs Base Color**
- **Theme Preset**: Cambia los **colores principales** (botones, enlaces, acentos) - **Más importante**
- **Base Color**: Cambia los **tonos base** (grises, neutros) - **Menos visible**

### **Menu Color vs Menu Accent**
- **Menu Color**: El **color de fondo** del sidebar
- **Menu Accent**: La **intensidad** del acento en elementos del menú

---

## 💡 Consejos

1. **Empieza simple**: Usa solo Aspecto + Tema de Color para la mayoría de casos
2. **Experimenta**: Abre "Personalización Avanzada" y prueba diferentes combinaciones
3. **Base Color es sutil**: Solo notarás cambios si prestas atención a los tonos grises
4. **Menu Color/Accent**: Útiles si quieres un sidebar con un aspecto muy específico

---

## 📝 Notas Técnicas

- Todas las configuraciones se guardan en **cookies** y **localStorage**
- Los cambios se aplican **inmediatamente** sin recargar la página
- Las configuraciones persisten entre sesiones
- Compatible con **Next.js SSR** (Server-Side Rendering)






