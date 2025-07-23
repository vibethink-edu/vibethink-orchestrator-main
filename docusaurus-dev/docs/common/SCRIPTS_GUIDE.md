# Guía General de Scripts - AI Pair Orchestrator Pro

## 📋 Overview

Esta guía define los patrones y estándares para scripts en todo el repositorio, aplicable tanto a `src/` como a `dev-tools/`.

**Aplica a**: Todo el repositorio  
**Última actualización**: 7 de enero, 2025

---

## 🔧 Tipos de Scripts

### Scripts de Aplicación (`src/`)
- **package.json scripts**: Scripts para desarrollo, build, test de la aplicación
- **Configuración**: Solo lo necesario para la aplicación

### Scripts de Herramientas (`dev-tools/`)
- **Automatización**: Scripts para el equipo de desarrollo
- **Mantenimiento**: Scripts de limpieza, validación, deployment

## 📝 Convenciones Generales

### Naming Pattern
```bash
# Para scripts bash
script-name.sh           # kebab-case
verify-naming.sh         # descriptivo del propósito
emergency-cleanup.sh     # acción clara

# Para scripts npm
"script:action"          # namespace:action
"test:watch"            # tipo:modo
"build:production"      # acción:entorno
```

### Estructura de Script
```bash
#!/bin/bash
# script-name.sh - Descripción breve del propósito

echo "🎯 ACCIÓN: Descripción de lo que hace..."

# Variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Funciones
function verify_dependencies() {
    # Verificar dependencias necesarias
}

function main() {
    # Lógica principal
}

# Ejecutar
main "$@"
```

## 🚀 Scripts Comunes

### Verificación y Limpieza
```bash
# Verificar convenciones de nombres
bash dev-tools/scripts/verify-naming-conventions.sh

# Limpieza de emergencia
bash dev-tools/scripts/emergency-cleanup.sh

# Verificar salud del repositorio
bash dev-tools/scripts/check-repository-health.sh
```

### Build y Testing
```bash
# En src/ - Scripts de aplicación
npm run dev              # Desarrollo
npm run build           # Build de producción
npm run test            # Tests de aplicación

# En dev-tools/ - Scripts de herramientas
npm run validate-tools  # Validar herramientas
npm run test           # Tests de herramientas
```

## 🔍 Scripts de Verificación

### Detectar Directorios No Autorizados
```bash
#!/bin/bash
# detect-unauthorized-directories.sh - Detectar directorios que no deberían estar en root

echo "🔍 Buscando directorios no autorizados en root..."

# Directorios autorizados
AUTHORIZED_DIRS=("src" "dev-tools" "docs" ".github" "supabase" "node_modules" ".git")

# Buscar todos los directorios en root
for dir in */; do
    dir_name=$(basename "$dir")
    
    # Verificar si está en la lista autorizada
    authorized=false
    for auth_dir in "${AUTHORIZED_DIRS[@]}"; do
        if [[ "$dir_name" == "$auth_dir" ]]; then
            authorized=true
            break
        fi
    done
    
    if [[ "$authorized" == false ]]; then
        echo "⚠️  Directorio no autorizado encontrado: $dir_name"
        echo "   Contenido:"
        ls -la "$dir" | head -5
        echo "   ..."
        echo ""
        echo "   💡 Acciones sugeridas:"
        echo "   - Si es código de app: mv $dir_name/* src/"
        echo "   - Si son herramientas: mv $dir_name/* dev-tools/"
        echo "   - Si es basura: rm -rf $dir_name"
        echo ""
    fi
done

echo "✅ Verificación completada"
```

### Limpiar Directorios No Autorizados
```bash
#!/bin/bash
# cleanup-unauthorized-directories.sh - Limpiar directorios no autorizados

echo "🧹 Limpiando directorios no autorizados..."

# Función para mover contenido según tipo
function classify_and_move() {
    local source_dir="$1"
    
    echo "📁 Analizando: $source_dir"
    
    # Buscar archivos de código
    code_files=$(find "$source_dir" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | wc -l)
    
    # Buscar scripts
    script_files=$(find "$source_dir" -name "*.sh" -o -name "*.bat" -o -name "*.ps1" | wc -l)
    
    # Buscar documentación
    doc_files=$(find "$source_dir" -name "*.md" | wc -l)
    
    if [[ $code_files -gt 0 ]]; then
        echo "   🚀 Contiene código de aplicación → moviendo a src/"
        mkdir -p src/
        mv "$source_dir"/* src/ 2>/dev/null
    elif [[ $script_files -gt 0 ]]; then
        echo "   🛠️  Contiene scripts → moviendo a dev-tools/"
        mkdir -p dev-tools/scripts/
        mv "$source_dir"/* dev-tools/scripts/ 2>/dev/null
    elif [[ $doc_files -gt 0 ]]; then
        echo "   📚 Contiene documentación → moviendo a docs/"
        mkdir -p docs/
        mv "$source_dir"/* docs/ 2>/dev/null
    else
        echo "   🗑️  Parece basura o vacío → marcando para eliminación"
        echo "   ⚠️  Revisar manualmente: $source_dir"
        return
    fi
    
    # Eliminar directorio vacío
    rmdir "$source_dir" 2>/dev/null && echo "   ✅ Directorio $source_dir eliminado"
}

# Buscar y clasificar directorios no autorizados
for dir in */; do
    dir_name=$(basename "$dir")
    
    case "$dir_name" in
        "src"|"dev-tools"|"docs"|".github"|"supabase"|"node_modules"|".git")
            # Directorios autorizados, omitir
            ;;
        *)
            # Directorio no autorizado, clasificar y mover
            classify_and_move "$dir_name"
            ;;
    esac
done

echo "✅ Limpieza completada"
```

## 📊 Estándares de Salida

### Formato de Mensajes
```bash
echo "✅ Éxito: Acción completada correctamente"
echo "⚠️  Advertencia: Algo necesita atención"
echo "❌ Error: Algo falló"
echo "🔍 Info: Información general"
echo "📋 Estado: Estado actual"
```

### Códigos de Salida
```bash
exit 0    # Éxito
exit 1    # Error general
exit 2    # Error de uso/sintaxis
exit 3    # Error de dependencias
```

---

**Referencias**:
- [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md) - Convenciones de nombres
- [REPOSITORY_ORGANIZATION.md](REPOSITORY_ORGANIZATION.md) - Organización del repositorio

**Mantenido por**: Equipo AI Pair  
**Revisión**: Mensual
