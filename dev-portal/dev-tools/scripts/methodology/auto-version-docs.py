#!/usr/bin/env python3
"""
Script de Automatización de Versionado de Documentos
Autor: Marcelo/AI
Versión: 1.0.0
Fecha: 26 de Junio, 2025

Este script automatiza el proceso de versionado de documentos
según las reglas establecidas en el proyecto.
"""

import re
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

class DocumentVersioner:
    """Clase para automatizar el versionado de documentos"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.docs_path = self.project_root / 'docs'
        self.version_pattern = r'(\*\*Versión\*\*|VERSIÓN)\s*[:|]\s*(\d+\.\d+\.\d+)(?:\s*-\s*(.+))?'
        self.date_pattern = r'(\*\*Fecha\*\*|FECHA)\s*[:|]\s*(.+)'
        
    def find_documents_with_versions(self) -> List[Path]:
        """Encuentra todos los documentos que tienen versionado"""
        documents = []
        
        for file_path in self.docs_path.rglob('*.md'):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if re.search(self.version_pattern, content, re.IGNORECASE):
                        documents.append(file_path)
            except Exception as e:
                print(f"⚠️  Error leyendo {file_path}: {e}")
        
        return documents
    
    def extract_current_version(self, content: str) -> Tuple[str, str, str]:
        """Extrae la versión actual del documento"""
        match = re.search(self.version_pattern, content, re.IGNORECASE)
        if match:
            version = match.group(2)
            description = match.group(3) if match.group(3) else ""
            return version, description, match.group(0)
        return "1.0.0", "", ""
    
    def extract_date(self, content: str) -> str:
        """Extrae la fecha del documento"""
        match = re.search(self.date_pattern, content, re.IGNORECASE)
        if match:
            return match.group(2).strip()
        return datetime.now().strftime('%d de %B, %Y')
    
    def determine_version_increment(self, change_type: str, current_version: str) -> str:
        """Determina la nueva versión según el tipo de cambio"""
        major, minor, patch = map(int, current_version.split('.'))
        
        if change_type == 'MAJOR':
            return f"{major + 1}.0.0"
        elif change_type == 'MINOR':
            return f"{major}.{minor + 1}.0"
        elif change_type == 'PATCH':
            return f"{major}.{minor}.{patch + 1}"
        else:
            return current_version
    
    def update_document_version(self, file_path: Path, change_type: str, description: str = "") -> bool:
        """Actualiza la versión de un documento"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            current_version, current_desc, full_match = self.extract_current_version(content)
            new_version = self.determine_version_increment(change_type, current_version)
            current_date = self.extract_date(content)
            
            # Crear nueva descripción
            if description:
                new_description = f" - {description}"
            else:
                # Mantener descripción existente o crear una por defecto
                if current_desc:
                    new_description = f" - {current_desc}"
                else:
                    change_descriptions = {
                        'MAJOR': 'Cambios Mayores',
                        'MINOR': 'Nuevas Funcionalidades',
                        'PATCH': 'Correcciones Menores'
                    }
                    new_description = f" - {change_descriptions.get(change_type, 'Actualización')}"
            
            # Actualizar versión en el contenido
            new_version_line = f"**Versión** | {new_version}{new_description}"
            updated_content = re.sub(self.version_pattern, new_version_line, content, flags=re.IGNORECASE)
            
            # Actualizar fecha
            new_date = datetime.now().strftime('%d de %B, %Y')
            updated_content = re.sub(self.date_pattern, f"**Fecha** | {new_date}", updated_content, flags=re.IGNORECASE)
            
            # Actualizar línea final si existe
            final_version_pattern = r'(\*\*VERSIÓN\*\*)\s*[:|]\s*(\d+\.\d+\.\d+)(?:\s*-\s*(.+))?'
            final_version_line = f"**VERSIÓN**: {new_version}{new_description}"
            updated_content = re.sub(final_version_pattern, final_version_line, updated_content, flags=re.IGNORECASE)
            
            # Guardar cambios
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            
            print(f"✅ {file_path.name}: {current_version} → {new_version}")
            return True
            
        except Exception as e:
            print(f"❌ Error actualizando {file_path}: {e}")
            return False
    
    def create_changelog_entry(self, file_path: Path, change_type: str, description: str) -> str:
        """Crea una entrada para el changelog"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        entry = f"""
## [{self.determine_version_increment(change_type, self.extract_current_version(open(file_path, 'r', encoding='utf-8').read())[0])}] - {timestamp}

### {change_type.capitalize()}
- {description}

**Archivo**: {file_path.relative_to(self.project_root)}
**Responsable**: Marcelo/AI
"""
        return entry
    
    def update_project_changelog(self, entries: List[str]):
        """Actualiza el changelog principal del proyecto"""
        changelog_path = self.project_root / 'CHANGELOG.md'
        
        try:
            if changelog_path.exists():
                with open(changelog_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            else:
                content = """# Changelog

## [Unreleased]
### Added
- Nuevas funcionalidades en desarrollo

### Changed
- Cambios en funcionalidades existentes

### Fixed
- Correcciones de bugs

"""
            
            # Insertar nuevas entradas después de [Unreleased]
            unreleased_pos = content.find('## [Unreleased]')
            if unreleased_pos != -1:
                # Encontrar el final de la sección [Unreleased]
                next_section_pos = content.find('## [', unreleased_pos + 1)
                if next_section_pos == -1:
                    next_section_pos = len(content)
                
                # Insertar nuevas entradas
                new_entries = '\n'.join(entries)
                content = content[:next_section_pos] + new_entries + '\n' + content[next_section_pos:]
            
            with open(changelog_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ Changelog actualizado: {changelog_path}")
            
        except Exception as e:
            print(f"❌ Error actualizando changelog: {e}")
    
    def interactive_version_update(self):
        """Interfaz interactiva para actualizar versiones"""
        documents = self.find_documents_with_versions()
        
        if not documents:
            print("❌ No se encontraron documentos con versionado")
            return
        
        print(f"📄 Encontrados {len(documents)} documentos con versionado:")
        for i, doc in enumerate(documents, 1):
            try:
                with open(doc, 'r', encoding='utf-8') as f:
                    content = f.read()
                    version, desc, _ = self.extract_current_version(content)
                    print(f"  {i}. {doc.name} (v{version})")
            except:
                print(f"  {i}. {doc.name} (error leyendo versión)")
        
        print("\n🎯 Selecciona el documento a actualizar:")
        try:
            choice = int(input("Número del documento (0 para salir): ")) - 1
            if choice < 0 or choice >= len(documents):
                print("👋 Saliendo...")
                return
            
            selected_doc = documents[choice]
            
            print(f"\n📝 Documento seleccionado: {selected_doc.name}")
            
            # Mostrar versión actual
            with open(selected_doc, 'r', encoding='utf-8') as f:
                content = f.read()
                current_version, desc, _ = self.extract_current_version(content)
                print(f"Versión actual: {current_version}")
                if desc:
                    print(f"Descripción: {desc}")
            
            # Seleccionar tipo de cambio
            print("\n🔄 Tipo de cambio:")
            print("  1. MAJOR - Cambios incompatibles")
            print("  2. MINOR - Nuevas funcionalidades")
            print("  3. PATCH - Correcciones menores")
            
            change_choice = input("Selecciona el tipo (1-3): ")
            change_types = {'1': 'MAJOR', '2': 'MINOR', '3': 'PATCH'}
            change_type = change_types.get(change_choice, 'PATCH')
            
            # Descripción del cambio
            description = input("Descripción del cambio: ").strip()
            
            # Confirmar
            new_version = self.determine_version_increment(change_type, current_version)
            print(f"\n📋 Resumen:")
            print(f"  Documento: {selected_doc.name}")
            print(f"  Versión actual: {current_version}")
            print(f"  Nueva versión: {new_version}")
            print(f"  Tipo de cambio: {change_type}")
            print(f"  Descripción: {description}")
            
            confirm = input("\n¿Confirmar actualización? (s/N): ").lower()
            if confirm == 's':
                success = self.update_document_version(selected_doc, change_type, description)
                if success:
                    # Crear entrada de changelog
                    entry = self.create_changelog_entry(selected_doc, change_type, description)
                    self.update_project_changelog([entry])
                    print("🎉 ¡Versión actualizada exitosamente!")
                else:
                    print("❌ Error actualizando la versión")
            else:
                print("❌ Actualización cancelada")
                
        except (ValueError, KeyboardInterrupt):
            print("\n👋 Saliendo...")
    
    def batch_version_update(self, change_type: str, description: str, file_pattern: str = None):
        """Actualización en lote de versiones"""
        documents = self.find_documents_with_versions()
        
        if file_pattern:
            documents = [doc for doc in documents if file_pattern.lower() in doc.name.lower()]
        
        if not documents:
            print(f"❌ No se encontraron documentos que coincidan con '{file_pattern}'")
            return
        
        print(f"🔄 Actualizando {len(documents)} documentos...")
        
        updated_count = 0
        changelog_entries = []
        
        for doc in documents:
            success = self.update_document_version(doc, change_type, description)
            if success:
                updated_count += 1
                entry = self.create_changelog_entry(doc, change_type, description)
                changelog_entries.append(entry)
        
        if changelog_entries:
            self.update_project_changelog(changelog_entries)
        
        print(f"✅ {updated_count}/{len(documents)} documentos actualizados")

def main():
    """Función principal del script"""
    print("🚀 AUTOMATIZADOR DE VERSIONADO DE DOCUMENTOS")
    print("Autor: Marcelo/AI")
    print("Fecha: 26 de Junio, 2025")
    print("=" * 60)
    
    versioner = DocumentVersioner()
    
    if len(sys.argv) > 1:
        # Modo batch
        if len(sys.argv) < 4:
            print("Uso: python auto-version-docs.py <MAJOR|MINOR|PATCH> <descripción> [patrón_archivo]")
            sys.exit(1)
        
        change_type = sys.argv[1].upper()
        description = sys.argv[2]
        file_pattern = sys.argv[3] if len(sys.argv) > 3 else None
        
        if change_type not in ['MAJOR', 'MINOR', 'PATCH']:
            print("❌ Tipo de cambio debe ser MAJOR, MINOR o PATCH")
            sys.exit(1)
        
        versioner.batch_version_update(change_type, description, file_pattern)
        
    else:
        # Modo interactivo
        versioner.interactive_version_update()

if __name__ == "__main__":
    main() 