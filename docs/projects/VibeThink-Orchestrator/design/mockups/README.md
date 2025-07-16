# 📁 Mockups e Imágenes de Referencia

## 🎯 Propósito
Este directorio contiene todos los mockups, wireframes e imágenes de referencia para el desarrollo de interfaces de usuario en la plataforma AI Pair.

## 📂 Estructura

```
mockups/
├── 📁 imagenes-de-referencia/     # Imágenes de interfaces y diseños
│   ├── 📄 crm-dashboard.png       # Dashboard principal del CRM
│   ├── 📄 crm-objects-editor.png  # Editor de objetos personalizables
│   ├── 📄 pqrs-form.png          # Formulario de PQRS
│   ├── 📄 customer-list.png      # Lista de clientes
│   └── 📄 ...                    # Otras interfaces
├── 📁 wireframes/                # Wireframes de baja fidelidad
├── 📁 components/                # Mockups de componentes específicos
└── 📄 README.md                  # Este archivo
```

## 🎨 Tipos de Archivos Aceptados
- **PNG** - Imágenes de alta calidad
- **JPG/JPEG** - Imágenes comprimidas
- **SVG** - Vectores escalables
- **PDF** - Documentos de diseño
- **Figma** - Archivos de Figma (si aplica)

## 📋 Convención de Nombres
- Usar **kebab-case** para nombres de archivos
- Incluir **tipo de componente** en el nombre
- Ejemplo: `crm-dashboard-overview.png`

## 🔗 Referencias en Código
Los mockups se referencian en el código usando rutas relativas:
```typescript
// Ejemplo de referencia en componente
const mockupPath = '/mockups/imagenes-de-referencia/crm-dashboard.png';
```

## 📝 Documentación
Cada mockup debe incluir:
- **Propósito** del componente
- **Estado** (borrador, final, en revisión)
- **Fecha** de creación
- **Autor** del diseño

---
*Última actualización: 22 de junio de 2025* 