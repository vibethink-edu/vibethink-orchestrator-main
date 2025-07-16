# Editor de Temas (`theme-editor/`)

## 🎯 **Propósito**

Editor visual de temas compatible con Shadcn/ui y librerías como [TweakCN](https://github.com/jnsahaj/tweakcn). Permite personalización visual completa de componentes UI sin necesidad de código.

## 📁 **Estructura**

```
theme-editor/
├── ThemeEditor.tsx           # Editor principal
├── ColorPicker.tsx           # Selector de colores
├── TypographyEditor.tsx      # Editor de tipografía
├── SpacingEditor.tsx         # Editor de espaciado
├── ComponentPreview.tsx      # Vista previa de componentes
├── ThemePresets.tsx          # Presets predefinidos
├── ThemeExporter.tsx         # Exportación
└── ThemeImporter.tsx         # Importación
```

## 🎨 **Características Principales**

### **Editor Visual Drag & Drop:**
- **Color Picker**: Selector de colores con paleta visual
- **Typography Editor**: Personalización de fuentes y tamaños
- **Spacing Editor**: Ajuste de márgenes y padding
- **Component Preview**: Vista previa en tiempo real
- **Live Updates**: Cambios instantáneos en la UI

### **Compatibilidad Total:**
- **Shadcn/ui**: Componentes nativos
- **Tailwind CSS v4**: Soporte completo
- **TweakCN**: Integración directa
- **CSS Variables**: Variables dinámicas

### **Funcionalidades Avanzadas:**
- **Export/Import**: Temas portables
- **Presets**: Temas predefinidos
- **Multi-tenant**: Temas por empresa
- **Version Control**: Control de versiones de temas

## 🔧 **Implementación**

### **Editor Principal:**
```typescript
// ✅ Editor transversal disponible en todas las apps
import { ThemeEditor } from '@/shared/components/theme-editor/ThemeEditor';
import { useThemeEditor } from '@/shared/hooks/useThemeEditor';

const AdminThemePanel = () => {
  const { 
    currentTheme, 
    updateTheme, 
    exportTheme,
    importTheme 
  } = useThemeEditor();
  
  return (
    <div className="p-6">
      <ThemeEditor 
        theme={currentTheme}
        onUpdate={updateTheme}
        onExport={exportTheme}
        onImport={importTheme}
        presets={themePresets}
        previewMode="live"
      />
    </div>
  );
};
```

### **Color Picker:**
```typescript
// ✅ Selector de colores avanzado
export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onColorChange,
  palette = defaultPalette
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-8 gap-2">
        {palette.map((colorOption) => (
          <button
            key={colorOption}
            className="w-8 h-8 rounded border-2"
            style={{ backgroundColor: colorOption }}
            onClick={() => onColorChange(colorOption)}
          />
        ))}
      </div>
      <input
        type="color"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
        className="w-full h-10 rounded"
      />
    </div>
  );
};
```

### **Typography Editor:**
```typescript
// ✅ Editor de tipografía
export const TypographyEditor: React.FC<TypographyEditorProps> = ({
  typography,
  onTypographyChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label>Font Family</label>
        <select 
          value={typography.fontFamily}
          onChange={(e) => onTypographyChange({
            ...typography,
            fontFamily: e.target.value
          })}
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
        </select>
      </div>
      <div>
        <label>Font Size</label>
        <input
          type="range"
          min="12"
          max="48"
          value={typography.fontSize}
          onChange={(e) => onTypographyChange({
            ...typography,
            fontSize: parseInt(e.target.value)
          })}
        />
      </div>
    </div>
  );
};
```

## 🎯 **Integración con TweakCN**

### **Compatibilidad Directa:**
```typescript
// ✅ Integración con TweakCN
import { TweakCNIntegration } from '@/integrations/tweakcn';

export const useTweakCNTheme = () => {
  const tweakcn = new TweakCNIntegration();
  
  const importTweakCNTheme = async (themeId: string) => {
    const theme = await tweakcn.getTheme(themeId);
    return parseTweakCNTheme(theme);
  };
  
  const exportToTweakCN = async (theme: Theme) => {
    const tweakcnTheme = convertToTweakCNFormat(theme);
    return await tweakcn.exportTheme(tweakcnTheme);
  };
  
  return {
    importTweakCNTheme,
    exportToTweakCN
  };
};
```

## 🎨 **Presets Predefinidos**

### **Temas Corporativos:**
- **Light Corporate**: Tema claro profesional
- **Dark Corporate**: Tema oscuro empresarial
- **Modern Corporate**: Tema moderno minimalista

### **Temas Especializados:**
- **Healthcare**: Colores médicos y confianza
- **Finance**: Colores financieros y seguridad
- **Education**: Colores educativos y aprendizaje
- **E-commerce**: Colores comerciales y ventas

### **Temas de Accesibilidad:**
- **High Contrast**: Alto contraste para accesibilidad
- **Color Blind Friendly**: Amigable para daltonismo
- **Large Text**: Texto grande para legibilidad

## 🔄 **Flujo de Trabajo**

### **1. Selección de Preset:**
```typescript
const preset = await selectThemePreset('corporate-light');
applyTheme(preset);
```

### **2. Personalización Visual:**
```typescript
const customTheme = await customizeTheme(preset, {
  primaryColor: '#2563eb',
  borderRadius: 'lg',
  spacing: 'comfortable'
});
```

### **3. Vista Previa:**
```typescript
const preview = await generateThemePreview(customTheme);
displayPreview(preview);
```

### **4. Exportación:**
```typescript
const exportedTheme = await exportTheme(customTheme, 'json');
downloadTheme(exportedTheme);
```

## 🛡️ **Seguridad Multi-tenant**

### **Aislamiento de Temas:**
```typescript
// ✅ Temas por empresa
const companyTheme = await getCompanyTheme(companyId);
const userTheme = await getUserTheme(userId, companyId);

// Validar que el usuario pertenece a la empresa
if (userTheme.companyId !== companyId) {
  throw new Error('Access denied');
}
```

### **Validación de Temas:**
```typescript
// ✅ Validación de temas
const validateTheme = (theme: Theme) => {
  const schema = themeValidationSchema;
  return schema.validate(theme);
};
```

## 🧪 **Testing Strategy**

### **Editor Testing:**
```typescript
describe('ThemeEditor', () => {
  it('should update colors correctly', () => {
    const { getByTestId } = render(<ThemeEditor />);
    const colorPicker = getByTestId('color-picker');
    
    fireEvent.change(colorPicker, { target: { value: '#ff0000' } });
    
    expect(getByTestId('preview')).toHaveStyle({
      '--primary-color': '#ff0000'
    });
  });
});
```

## 📊 **Métricas de Calidad**

### **Performance:**
- **Load Time**: <1s para cargar editor
- **Update Time**: <100ms para cambios
- **Preview Time**: <200ms para vista previa

### **Usabilidad:**
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: Mobile-first design
- **Intuitive**: UX optimizado

---

**El editor de temas sigue los principios de VThink 1.0, asegurando compatibilidad total con Shadcn/ui y librerías como TweakCN.** 