# Flujo de Uso de Componentes Compartidos

## Propósito

Este documento describe el flujo recomendado para el consumo, integración y extensión de componentes compartidos dentro del monorepo VibeThink Orchestrator, asegurando trazabilidad, mantenibilidad y cumplimiento de las convenciones de gobernanza.

---

## 📦 Ubicación de componentes compartidos

Todos los componentes, hooks, utilidades y tipos compartidos deben residir en:

```
src/shared/
├── components/   # Componentes React reutilizables
├── hooks/        # Custom hooks
├── utils/        # Funciones utilitarias
├── types/        # Tipos y contratos globales
├── services/     # Servicios compartidos
```

---

## 🔄 Flujo de uso e integración

1. **Importación estándar:**
   - Utiliza siempre imports con alias (ejemplo: `@/shared/components`) para mantener independencia de rutas relativas.
   - Ejemplo:
     ```typescript
     import { Button } from '@/shared/components';
     import { useAuth } from '@/shared/hooks';
     ```

2. **Extensión de componentes:**
   - Si necesitas extender un componente, crea un nuevo archivo en el proyecto consumidor y documenta la razón en el README del módulo.
   - No modifiques directamente el componente compartido salvo que el cambio sea globalmente necesario.

3. **Propuesta de mejora o refactor:**
   - Si un cambio beneficia a varios proyectos, propón un PR sobre `src/shared/` y documenta la decisión en el log correspondiente.

4. **Testing:**
   - Todo componente compartido debe tener pruebas unitarias en la misma carpeta o en `src/shared/tests/`.

5. **Documentación:**
   - Cada componente debe tener comentarios JSDoc/TSDoc y, si es complejo, un README propio en su carpeta.

---

## 🚦 Buenas prácticas

- No dupliques componentes en apps o módulos; centraliza en `shared`.
- Documenta cualquier excepción o extensión local en el README del consumidor.
- Mantén la compatibilidad y evita dependencias circulares.
- Usa tipado estricto y patrones de composición.
- Revisa y actualiza los tests al modificar componentes compartidos.

---

## 📝 Ejemplo de flujo de consumo

```typescript
// En un módulo de negocio
import { Card, Button } from '@/shared/components';
import { useFeatureFlag } from '@/shared/hooks';

export const MyFeature = () => {
  const enabled = useFeatureFlag('nueva-funcionalidad');
  return (
    <Card>
      <Button disabled={!enabled}>Acción</Button>
    </Card>
  );
};
```

---

## 📚 Referencias
- [Estructura general del monorepo](./STRUCTURE_OVERVIEW.md)
- [Guía de contribución](../CONTRIBUTING.md)
- [Log de decisiones](./DECISION_LOG.md) 