# Referencia de Herramientas Disponibles para Desarrollo

> **Propósito:** Este documento cataloga y explica todas las herramientas disponibles para el desarrollo en la plataforma, incluyendo su uso, ejemplos y mejores prácticas. Sirve como referencia interna para desarrolladores y para optimizar el flujo de trabajo.

---

## 🛠️ Herramientas Disponibles

### 1. `codebase_search`
**Descripción:** Búsqueda semántica en el código base que encuentra fragmentos relevantes basándose en el significado, no solo en texto exacto.

**Uso:**
```typescript
// Buscar componentes relacionados con helpdesk
codebase_search("helpdesk ticket management")

// Buscar en directorios específicos
codebase_search("user authentication", ["src/auth/", "src/components/auth/"])

// Buscar patrones de implementación
codebase_search("React hooks custom implementation")
```

**Mejores prácticas:**
- Usar términos descriptivos y específicos
- Especificar directorios cuando sea relevante
- Combinar con `grep_search` para búsquedas más precisas

**Casos de uso:**
- Encontrar implementaciones existentes
- Identificar patrones de código
- Localizar componentes relacionados
- Descubrir funcionalidades ya implementadas

---

### 2. `read_file`
**Descripción:** Lee el contenido de archivos específicos, permitiendo ver líneas específicas o archivos completos.

**Uso:**
```typescript
// Leer archivo completo
read_file("src/components/Helpdesk/TicketForm.tsx", true)

// Leer líneas específicas
read_file("src/hooks/useAuth.ts", false, 1, 50)

// Leer sección específica
read_file("docs/features/HELPDESK_PQRS_BEST_PRACTICES.md", false, 100, 200)
```

**Parámetros:**
- `target_file`: Ruta del archivo
- `should_read_entire_file`: Boolean para leer todo o no
- `start_line_one_indexed`: Línea inicial (opcional)
- `end_line_one_indexed_inclusive`: Línea final (opcional)

**Mejores prácticas:**
- Especificar líneas cuando sea posible para eficiencia
- Usar para revisar código antes de modificarlo
- Combinar con `grep_search` para encontrar secciones específicas

---

### 3. `run_terminal_cmd`
**Descripción:** Ejecuta comandos en la terminal del sistema.

**Uso:**
```bash
# Instalar dependencias
run_terminal_cmd("npm install", false)

# Ejecutar tests
run_terminal_cmd("npm test", false)

# Comando en background
run_terminal_cmd("npm run dev", true)

# Comando con pipe
run_terminal_cmd("git log --oneline | head -10", false)
```

**Parámetros:**
- `command`: Comando a ejecutar
- `is_background`: Boolean para ejecutar en background

**Mejores prácticas:**
- Usar `is_background: true` para servidores de desarrollo
- Agregar `| cat` para comandos que usan pager
- Verificar el estado del directorio antes de ejecutar comandos

---

### 4. `list_dir`
**Descripción:** Lista el contenido de directorios para explorar la estructura del proyecto.

**Uso:**
```typescript
// Listar directorio raíz
list_dir(".")

// Listar directorio específico
list_dir("src/components")

// Explorar estructura de documentación
list_dir("docs/features")
```

**Mejores prácticas:**
- Usar para explorar estructura antes de buscar archivos
- Combinar con `file_search` para encontrar archivos específicos
- Útil para entender la organización del proyecto

---

### 5. `grep_search`
**Descripción:** Búsqueda de texto exacto usando expresiones regulares.

**Uso:**
```typescript
// Buscar función específica
grep_search("function useAuth")

// Buscar con regex
grep_search("export.*interface.*Props")

// Buscar en archivos específicos
grep_search("TODO", "*.tsx")

// Excluir directorios
grep_search("console.log", "*.ts", "node_modules/")
```

**Parámetros:**
- `query`: Patrón de búsqueda
- `include_pattern`: Patrón de archivos (opcional)
- `exclude_pattern`: Patrón de exclusión (opcional)
- `case_sensitive`: Boolean para case sensitive (opcional)

**Mejores prácticas:**
- Usar para encontrar referencias exactas
- Combinar con `codebase_search` para búsquedas más amplias
- Usar patrones de archivo para limitar el scope

---

### 6. `edit_file`
**Descripción:** Crea o modifica archivos en el proyecto.

**Uso:**
```typescript
// Crear nuevo archivo
edit_file("src/components/NewComponent.tsx", "Crear componente React", code)

// Modificar archivo existente
edit_file("src/hooks/useAuth.ts", "Agregar nueva función", updatedCode)

// Agregar sección a documentación
edit_file("docs/README.md", "Agregar nueva sección", newSection)
```

**Parámetros:**
- `target_file`: Ruta del archivo
- `instructions`: Descripción de los cambios
- `code_edit`: Contenido a escribir

**Mejores prácticas:**
- Leer el archivo antes de editarlo
- Usar instrucciones claras y específicas
- Mantener el formato y estilo existente
- Usar `// ... existing code ...` para preservar código no modificado

---

### 7. `file_search`
**Descripción:** Búsqueda de archivos por nombre usando coincidencia difusa.

**Uso:**
```typescript
// Buscar archivo por nombre
file_search("helpdesk")

// Buscar archivo específico
file_search("TicketForm.tsx")

// Buscar archivos de configuración
file_search("config")
```

**Mejores prácticas:**
- Usar para encontrar archivos cuando no se conoce la ruta exacta
- Combinar con `list_dir` para explorar estructura
- Útil para encontrar archivos de configuración o componentes

---

### 8. `delete_file`
**Descripción:** Elimina archivos del proyecto.

**Uso:**
```typescript
// Eliminar archivo
delete_file("src/components/OldComponent.tsx")

// Eliminar archivo de backup
delete_file("backup/old-version.md")
```

**Mejores prácticas:**
- Verificar que el archivo existe antes de eliminarlo
- Usar con precaución en archivos importantes
- Considerar hacer backup antes de eliminar

---

## 🔄 Flujos de Trabajo Recomendados

### Para Explorar el Proyecto
1. `list_dir` para entender la estructura
2. `file_search` para encontrar archivos específicos
3. `read_file` para revisar contenido
4. `codebase_search` para entender patrones

### Para Implementar Nuevas Funcionalidades
1. `codebase_search` para encontrar implementaciones similares
2. `read_file` para revisar código existente
3. `edit_file` para crear/modificar archivos
4. `run_terminal_cmd` para tests y build

### Para Debugging
1. `grep_search` para encontrar referencias exactas
2. `read_file` para revisar código problemático
3. `edit_file` para aplicar fixes
4. `run_terminal_cmd` para verificar cambios

---

## ⚠️ Limitaciones y Consideraciones

### Herramientas NO Disponibles
- `update_memory`: Para guardar información entre sesiones
- Herramientas de diseño visual (Figma, etc.)
- Herramientas de análisis de código estático
- Herramientas de testing automatizado

### Mejores Prácticas Generales
- Siempre leer archivos antes de editarlos
- Usar búsquedas semánticas antes que exactas
- Verificar el estado del proyecto antes de ejecutar comandos
- Documentar cambios importantes
- Mantener consistencia en el código

---

## 📚 Referencias y Recursos

- [Documentación de React](https://react.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)

---

> **Nota:** Esta referencia se actualiza conforme se descubren nuevas herramientas o mejores prácticas. Mantener actualizada es responsabilidad del equipo de desarrollo. 