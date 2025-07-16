# 📋 Convenciones Globales - Todos los Proyectos

Este documento establece las convenciones obligatorias que deben seguir **todos los proyectos** del monorepo, garantizando consistencia, calidad y cumplimiento con VThink 1.0 y CMMI-ML3.

## 🚦 Convenciones Obligatorias

### Nomenclatura de Archivos y Carpetas

#### Proyectos
- **Formato**: `kebab-case` (ej: `vibethink-orchestrator`)
- **Incluir versión** si aplica (ej: `project-name-v2`)
- **Descriptivo** y relacionado con el propósito

#### Archivos de Documentación
- **README.md**: Siempre en mayúsculas, extensión `.md`
- **Decisiones**: `DECISION_LOG.md`, `CHANGELOG.md`, `ROADMAP.md`
- **Específicos**: `[AREA]_[DESCRIPTION].md` (ej: `API_DOCUMENTATION.md`)

#### Código Fuente
- **Archivos**: `camelCase` para JavaScript/TypeScript
- **Componentes**: `PascalCase` para React/Vue
- **Constantes**: `UPPER_SNAKE_CASE` para valores constantes
- **Interfaces**: `PascalCase` con prefijo `I` (ej: `IUserProps`)

### Estructura de Documentación

#### Estructura Mínima Obligatoria
```plaintext
[NombreProyecto]/
├── README.md                    # Descripción, propósito, estado
├── DECISION_LOG.md              # Registro de decisiones
├── CHANGELOG.md                 # Historial de cambios
├── ROADMAP.md                   # Planificación
├── architecture/                # Decisiones arquitectónicas
├── api/                        # Documentación de APIs
├── setup/                      # Guías de configuración
├── development/                # Patrones de desarrollo
├── testing/                    # Estrategias de testing
├── operations/                 # Procedimientos operativos
├── compliance/                 # Evidencia de cumplimiento
├── templates/                  # Plantillas específicas
└── reports/                    # Reportes y métricas
```

#### Archivos Obligatorios
- **README.md**: Siempre presente con estructura estándar
- **DECISION_LOG.md**: Para proyectos con decisiones arquitectónicas
- **CHANGELOG.md**: Para proyectos con versionado
- **ROADMAP.md**: Para proyectos en desarrollo activo

### Convenciones de Documentación

#### Formato de Headers
```markdown
# Título Principal (H1)
## Sección Principal (H2)
### Subsección (H3)
#### Detalle (H4)
```

#### Emojis y Iconografía
- **📋**: Propósito y descripción
- **🎯**: Objetivos y metas
- **🏗️**: Arquitectura y estructura
- **🚀**: Estado y progreso
- **👥**: Equipo y roles
- **📚**: Documentación
- **🔧**: Configuración y setup
- **🧪**: Testing y calidad
- **📊**: Métricas y reportes
- **🔒**: Seguridad y compliance
- **📈**: Roadmap y planificación
- **🤝**: Contribución y colaboración
- **📞**: Contacto y comunicación

#### Enlaces Internos
- **Relativos**: `./archivo.md` para archivos en la misma carpeta
- **Absolutos**: `/docs/projects/proyecto/archivo.md` para archivos en otras carpetas
- **Anclas**: `#seccion` para enlaces dentro del mismo archivo

### Convenciones de Commits

#### Formato Conventional Commits
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Tipos de Commits
- **feat**: Nueva funcionalidad
- **fix**: Corrección de bugs
- **docs**: Cambios en documentación
- **style**: Cambios de formato (no afectan funcionalidad)
- **refactor**: Refactorización de código
- **test**: Agregar o modificar tests
- **chore**: Cambios en build, configuraciones, etc.

#### Ejemplos
```bash
feat(auth): add JWT authentication system
fix(api): resolve CORS issue in user endpoints
docs(readme): update installation instructions
refactor(components): extract reusable Button component
```

### Convenciones de Código

#### TypeScript/JavaScript
- **Tipado estricto**: Evitar `any`, usar tipos específicos
- **Interfaces**: Definir interfaces para props y datos
- **Imports**: Usar alias cuando sea posible (`@/components`)
- **Exports**: Usar named exports por defecto

#### React/Vue
- **Componentes**: Funcionales con hooks
- **Props**: Tipadas con interfaces
- **Estado**: Usar hooks de estado apropiados
- **Efectos**: Documentar dependencias claramente

#### CSS/SCSS
- **Clases**: Usar BEM o similar para naming
- **Variables**: Definir en archivo de variables
- **Responsive**: Mobile-first approach
- **Accesibilidad**: Incluir focus states y contrastes

### Convenciones de Testing

#### Estructura de Tests
```plaintext
tests/
├── unit/                       # Tests unitarios
├── integration/                # Tests de integración
├── e2e/                       # Tests end-to-end
├── fixtures/                  # Datos de prueba
└── mocks/                     # Mocks y stubs
```

#### Nomenclatura de Tests
- **Archivos**: `[component].test.ts` o `[component].spec.ts`
- **Describe**: `describe('[Component]', () => {})`
- **Tests**: `it('should [expected behavior]', () => {})`

### Convenciones de Seguridad

#### Autenticación
- **JWT**: Usar tokens con expiración
- **Passwords**: Hash con bcrypt o similar
- **Sessions**: Implementar logout automático

#### Autorización
- **Roles**: Definir roles claros (USER, ADMIN, etc.)
- **Permissions**: Implementar sistema de permisos
- **RLS**: Row Level Security en base de datos

#### Validación
- **Input**: Validar todos los inputs del usuario
- **Sanitización**: Limpiar datos antes de procesar
- **Output**: Escapar datos en output

### Convenciones de Performance

#### Métricas Mínimas
- **Load Time**: < 3 segundos
- **API Response**: < 500ms
- **Bundle Size**: < 2MB
- **Memory Usage**: < 100MB

#### Optimizaciones
- **Lazy Loading**: Para componentes grandes
- **Code Splitting**: Por rutas o features
- **Caching**: Implementar estrategias de cache
- **CDN**: Usar CDN para assets estáticos

## 📊 Validación de Cumplimiento

### Checklist Obligatorio
- [ ] Nomenclatura sigue convenciones
- [ ] Estructura de carpetas correcta
- [ ] Archivos obligatorios presentes
- [ ] Documentación actualizada
- [ ] Tests con cobertura mínima
- [ ] Seguridad implementada
- [ ] Performance dentro de límites

### Proceso de Revisión
1. **Automático**: Scripts de validación en CI/CD
2. **Manual**: Code review obligatorio
3. **Periódico**: Auditoría mensual
4. **Continuo**: Monitoreo en tiempo real

## 🔄 Actualización de Convenciones

### Proceso de Cambio
1. **Proponer** cambio con justificación
2. **Revisar** impacto en proyectos existentes
3. **Aprobar** por equipo técnico
4. **Comunicar** cambio al equipo
5. **Implementar** gradualmente
6. **Validar** adopción

### Responsabilidades
- **Mantenimiento**: Tech Leads
- **Validación**: Equipo de Calidad
- **Comunicación**: Product Owners
- **Implementación**: Desarrolladores

---

**Última actualización**: 05-07-2025  
**Responsable**: Equipo Técnico  
**Cumplimiento**: VThink 1.0, CMMI-ML3  
**Revisión**: Mensual 