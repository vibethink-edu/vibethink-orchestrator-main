#!/usr/bin/env python3
"""
Script para actualizar firmas en toda la documentaci√≥n del proyecto AI Pair Orchestrator Pro.

Este script reemplaza placeholders como Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP por las firmas correspondientes
definidas en docs/TEAM_PROFILES.md.

Uso:
    python scripts/update_signatures.py [--dry-run] [--file <archivo>]

Autor: Eulalia (EU-IA)
Fecha: 26/06/2025
"""

import os
import re
import argparse
import glob
import chardet
from pathlib import Path
from typing import Dict, List, Tuple

class SignatureUpdater:
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.profiles_file = self.project_root / "docs" / "TEAM_PROFILES.md"
        self.signatures: Dict[str, str] = {}
        self.stats = {
            "files_processed": 0,
            "files_updated": 0,
            "replacements_made": 0,
            "errors": []
        }
        
    def detect_encoding(self, file_path: Path) -> str:
        """Detecta la codificaci√≥n de un archivo"""
        try:
            with open(file_path, 'rb') as f:
                raw_data = f.read(1024)  # Leer solo los primeros 1024 bytes
                result = chardet.detect(raw_data)
                return result['encoding'] or 'utf-8'
        except Exception:
            return 'utf-8'
    
    def read_file_safe(self, file_path: Path) -> str:
        """Lee un archivo de forma segura, manejando diferentes codificaciones"""
        encodings_to_try = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252', 'iso-8859-1']
        
        # Primero intentar detectar la codificaci√≥n
        detected_encoding = self.detect_encoding(file_path)
        if detected_encoding:
            encodings_to_try.insert(0, detected_encoding)
        
        for encoding in encodings_to_try:
            try:
                return file_path.read_text(encoding=encoding)
            except UnicodeDecodeError:
                continue
            except Exception as e:
                raise e
        
        # Si ninguna codificaci√≥n funciona, intentar con 'ignore'
        try:
            return file_path.read_text(encoding='utf-8', errors='ignore')
        except Exception as e:
            raise e
    
    def write_file_safe(self, file_path: Path, content: str) -> bool:
        """Escribe un archivo de forma segura"""
        try:
            file_path.write_text(content, encoding='utf-8')
            return True
        except Exception as e:
            self.stats["errors"].append(f"Error escribiendo {file_path}: {e}")
            return False
        
    def load_signatures(self) -> bool:
        """Carga las firmas desde TEAM_PROFILES.md"""
        try:
            if not self.profiles_file.exists():
                print(f"❌ Error: No se encontró {self.profiles_file}")
                return False
                
            content = self.read_file_safe(self.profiles_file)
            
            # Buscar secciones de perfiles
            section_pattern = r'## [^\n]+\n\n.*?### \*\*Placeholder:\*\* `(\{\{FIRMA_[^}]+\}\})`'
            sections = re.findall(section_pattern, content, re.DOTALL)
            
            # Para cada placeholder encontrado, buscar su firma correspondiente
            for placeholder in sections:
                # Buscar la sección completa que contiene este placeholder
                section_start = content.find(f"### **Placeholder:** `{placeholder}`")
                if section_start == -1:
                    continue
                    
                # Buscar hacia atrás para encontrar el inicio de la sección
                section_start = content.rfind("## ", 0, section_start)
                if section_start == -1:
                    continue
                    
                # Buscar hacia adelante para encontrar el final de la sección
                section_end = content.find("## ", section_start + 1)
                if section_end == -1:
                    section_end = len(content)
                    
                section = content[section_start:section_end]
                
                # Buscar la firma en la sección (entre ```)
                signature_match = re.search(r'```\n(.*?)\n```', section, re.DOTALL)
                if signature_match:
                    signature = signature_match.group(1).strip()
                    self.signatures[placeholder] = signature
                    print(f"✅ Cargada firma para {placeholder}")
            
            print(f"📊 Cargadas {len(self.signatures)} firmas")
            return True
            
        except Exception as e:
            print(f"❌ Error cargando firmas: {e}")
            self.stats["errors"].append(f"Error cargando firmas: {e}")
            return False
    
    def get_files_to_process(self, specific_file: str = None) -> List[Path]:
        """Obtiene la lista de archivos a procesar"""
        if specific_file:
            file_path = Path(specific_file)
            if file_path.exists():
                return [file_path]
            else:
                print(f"❌ Archivo no encontrado: {specific_file}")
                return []
        
        # Archivos a procesar - solo archivos de texto
        patterns = [
            "**/*.md",
            "**/*.ts",
            "**/*.tsx", 
            "**/*.js",
            "**/*.jsx",
            "**/*.py",
            "**/*.txt",
            "**/*.json"
        ]
        
        files = []
        for pattern in patterns:
            files.extend(self.project_root.glob(pattern))
        
        # Filtrar archivos que no queremos procesar
        exclude_dirs = {
            "node_modules", ".git", "dist", "build", 
            "coverage", ".next", ".cache", "backups",
            ".cursor", "supabase", "knotie-checkup", "v2.8.5"
        }
        
        exclude_files = {
            "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
            "*.min.js", "*.min.css", "*.map", "TEAM_PROFILES.md"
        }
        
        filtered_files = []
        for file in files:
            # Verificar que no est√© en directorios excluidos
            if any(exclude_dir in str(file) for exclude_dir in exclude_dirs):
                continue
                
            # Verificar que no sea un archivo excluido
            if any(file.name.endswith(ext) for ext in [".min.js", ".min.css", ".map"]):
                continue
                
            # Verificar que sea un archivo de texto legible
            if file.stat().st_size > 1024 * 1024:  # Archivos mayores a 1MB
                continue
                
            filtered_files.append(file)
        
        return filtered_files
    
    def process_file(self, file_path: Path, dry_run: bool = False) -> bool:
        """Procesa un archivo individual"""
        try:
            # Leer contenido
            content = self.read_file_safe(file_path)
            original_content = content
            
            # Contar placeholders encontrados
            placeholders_found = []
            replacements_made = 0
            
            # Reemplazar cada placeholder
            for placeholder, signature in self.signatures.items():
                if placeholder in content:
                    placeholders_found.append(placeholder)
                    if not dry_run:
                        content = content.replace(placeholder, signature)
                    replacements_made += content.count(placeholder)
            
            # Si se encontraron placeholders
            if placeholders_found:
                self.stats["files_processed"] += 1
                
                if dry_run:
                    print(f"📊 Cargados {len(placeholders_found)} placeholders")
                    for placeholder in placeholders_found:
                        print(f"   - {placeholder}")
                else:
                    # Escribir contenido actualizado
                    if self.write_file_safe(file_path, content):
                        self.stats["files_updated"] += 1
                        self.stats["replacements_made"] += replacements_made
                        print(f"✅ {file_path}: Actualizados {len(placeholders_found)} placeholders")
                
                return True
            
            return False
            
        except Exception as e:
            error_msg = f"Error procesando {file_path}: {e}"
            print(f"❌ {error_msg}")
            self.stats["errors"].append(error_msg)
            return False
    
    def run(self, dry_run: bool = False, specific_file: str = None) -> bool:
        """Ejecuta la actualizaci√≥n de firmas"""
        print("📊 Iniciando actualizaci√≥n de firmas...")
        print(f"📊 Directorio ra√≠z: {self.project_root}")
        print(f"📊 Modo: {'DRY RUN' if dry_run else 'ACTUALIZACI√ìN'}")
        print()
        
        # Cargar firmas
        if not self.load_signatures():
            return False
        
        # Obtener archivos a procesar
        files = self.get_files_to_process(specific_file)
        if not files:
            print("❌ No se encontraron archivos para procesar")
            return False
        
        print(f"📊 Procesando {len(files)} archivos...")
        print()
        
        # Procesar archivos
        files_with_placeholders = 0
        for file_path in files:
            if self.process_file(file_path, dry_run):
                files_with_placeholders += 1
        
        # Mostrar estad√≠sticas
        print()
        print("📊 ESTAD√çSTICAS:")
        print(f"   Archivos procesados: {self.stats['files_processed']}")
        print(f"   Archivos actualizados: {self.stats['files_updated']}")
        print(f"   Reemplazos realizados: {self.stats['replacements_made']}")
        print(f"   Errores: {len(self.stats['errors'])}")
        
        if self.stats["errors"]:
            print()
            print("❌ ERRORES:")
            for error in self.stats["errors"][:10]:  # Mostrar solo los primeros 10 errores
                print(f"   - {error}")
            if len(self.stats["errors"]) > 10:
                print(f"   ... y {len(self.stats['errors']) - 10} errores m√°s")
        
        if dry_run:
            print()
            print("📊 DRY RUN COMPLETADO")
            print("Para aplicar los cambios, ejecuta sin --dry-run")
        else:
            print()
            print("✅ ACTUALIZACI√ìN COMPLETADA")
        
        return len(self.stats["errors"]) == 0

def main():
    parser = argparse.ArgumentParser(
        description="Actualizar firmas en documentaci√≥n del proyecto AI Pair Orchestrator Pro"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Mostrar qu√© se har√≠a sin hacer cambios"
    )
    parser.add_argument(
        "--file",
        type=str,
        help="Procesar solo un archivo espec√≠fico"
    )
    parser.add_argument(
        "--project-root",
        type=str,
        default=".",
        help="Directorio ra√≠z del proyecto"
    )
    
    args = parser.parse_args()
    
    # Crear y ejecutar actualizador
    updater = SignatureUpdater(args.project_root)
    success = updater.run(args.dry_run, args.file)
    
    exit(0 if success else 1)

if __name__ == "__main__":
    main() 