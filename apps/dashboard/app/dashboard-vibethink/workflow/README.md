# Workflow Dashboard

Editor visual de workflows usando React Flow (@xyflow/react).

## 🎯 Características

- ✅ **Editor Visual**: Canvas interactivo con drag & drop
- ✅ **Tipos de Nodos**: Inicio, Proceso, Decisión, Acción, Fin
- ✅ **Estados de Nodos**: Idle, Running, Completed, Error, Paused
- ✅ **Conexiones**: Conectar nodos arrastrando desde los handles
- ✅ **Panel de Propiedades**: Editar nodos seleccionados
- ✅ **Toolbar**: Agregar nodos, ejecutar, guardar, exportar
- ✅ **Minimapa**: Navegación rápida del canvas
- ✅ **Datos Mock**: Workflow de ejemplo para empezar

## 📁 Estructura

```
workflow/
├── page.tsx                 # Página principal
├── types.ts                 # Definiciones TypeScript
├── components/
│   ├── workflow-canvas.tsx  # Canvas principal con React Flow
│   ├── custom-node.tsx      # Nodo personalizado
│   ├── workflow-toolbar.tsx # Barra de herramientas
│   ├── workflow-sidebar.tsx # Panel de propiedades
│   └── index.ts            # Barrel exports
├── hooks/
│   └── use-workflow.ts     # Hook para gestión de estado
└── lib/
    └── mock-data.ts        # Datos de ejemplo
```

## 🚀 Uso

### Acceder al Dashboard

Navega a: `/dashboard-vibethink/workflow`

### Agregar Nodos

1. Usa el toolbar superior
2. Haz clic en "Inicio", "Proceso" o "Decisión"
3. El nodo aparecerá en el canvas

### Conectar Nodos

1. Haz clic y arrastra desde el handle derecho (●) de un nodo
2. Suelta sobre el handle izquierdo (●) de otro nodo
3. Se creará una conexión automáticamente

### Editar Nodos

1. Haz clic en un nodo para seleccionarlo
2. El panel lateral mostrará las propiedades
3. Edita la etiqueta y descripción

### Ejecutar Workflow

1. Haz clic en "Ejecutar" en el toolbar
2. Los nodos cambiarán a estado "running"
3. Después de 2 segundos, cambiarán a "completed"

## 🏗️ Arquitectura

### Componentes

- **WorkflowCanvas**: Componente principal que renderiza React Flow
- **CustomNode**: Nodo personalizado con estilos Shadcn UI
- **WorkflowToolbar**: Barra de herramientas con acciones
- **WorkflowSidebar**: Panel de propiedades del nodo seleccionado

### Hooks

- **useWorkflow**: Hook personalizado que gestiona:
  - Estado del workflow (nodes, edges, config)
  - Acciones (add, update, delete nodes)
  - Ejecución del workflow
  - Guardado/exportación

### Tipos

Todos los tipos están definidos en `types.ts`:
- `WorkflowNode`: Nodo con datos personalizados
- `WorkflowEdge`: Conexión entre nodos
- `WorkflowState`: Estado completo del workflow
- `NodeType`: Tipos de nodos disponibles
- `NodeStatus`: Estados posibles de un nodo

## 🎨 Estilos

- Usa componentes de Shadcn UI (`@vibethink/ui`)
- Colores por tipo de nodo:
  - Inicio: Verde (`#10b981`)
  - Proceso: Azul (`#3b82f6`)
  - Decisión: Amarillo (`#f59e0b`)
  - Acción: Púrpura (`#8b5cf6`)
  - Fin: Rojo (`#ef4444`)

## 🔄 Próximos Pasos

### Funcionalidades Pendientes

- [ ] Guardado real en base de datos
- [ ] Importación de workflows desde JSON
- [ ] Validación de workflows (nodos desconectados, ciclos, etc.)
- [ ] Ejecución real de workflows (no mock)
- [ ] Historial de ejecuciones
- [ ] Templates de workflows predefinidos
- [ ] Colaboración en tiempo real
- [ ] Exportar a imagen (PNG/SVG)

### Mejoras Técnicas

- [ ] Optimización de rendimiento con React.memo
- [ ] Virtualización para workflows grandes
- [ ] Undo/Redo
- [ ] Zoom a selección
- [ ] Alineación automática de nodos
- [ ] Snap to grid

## 📚 Referencias

- [React Flow Docs](https://reactflow.dev/)
- [@xyflow/react](https://www.npmjs.com/package/@xyflow/react)
- [Shadcn UI](https://ui.shadcn.com/)

## 🐛 Troubleshooting

### El canvas no se renderiza

- Verifica que `@xyflow/react` esté instalado
- Verifica que el CSS de React Flow esté importado: `@xyflow/react/dist/style.css`

### Los nodos no se pueden arrastrar

- Verifica que `useNodesState` y `useEdgesState` estén configurados correctamente
- Verifica que los handlers `onNodesChange` y `onEdgesChange` estén conectados

### El sidebar no aparece

- Verifica que un nodo esté seleccionado (`selectedNodeId` no sea `undefined`)
- Verifica que el componente `WorkflowSidebar` esté renderizado dentro de un `Panel`

---

**Creado**: 2025-01-18  
**Versión**: 1.0.0 (Mock)  
**Estado**: 🟢 Funcional (versión inicial con datos mock)

