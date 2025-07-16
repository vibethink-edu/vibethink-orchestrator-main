#!/usr/bin/env python3
"""
Script para migrar firmas antiguas a placeholders en toda la documentación del proyecto AI Pair Orchestrator Pro.

Este script reemplaza las firmas antiguas con placeholders apropiados basados en el contenido del documento.

Uso:
    python scripts/migrate_old_signatures.py [--dry-run] [--file <archivo>]

Autor: Eulalia (EU-IA)
Fecha: 27/06/2025
"""

import os
import re
import argparse
import glob
import chardet
from pathlib import Path
from typing import Dict, List, Tuple

class SignatureMigrator:
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.stats = {
            "files_processed": 0,
            "files_updated": 0,
            "replacements_made": 0,
            "errors": []
        }
        
        # Mapeo de palabras clave a placeholders
        self.keyword_mapping = {
            # Arquitectura y diseño
            "arquitectura": "Documentado y validado por:
**EUPAIR_ARQ**
Arquitecto de Soluciones, Product Owner, Estratega de Negocio",
            "diseño": "Documentado y validado por:
**EUPAIR_ARQ**
Arquitecto de Soluciones, Product Owner, Estratega de Negocio",
            "blueprint": "Documentado y validado por:
**EUPAIR_ARQ**
Arquitecto de Soluciones, Product Owner, Estratega de Negocio",
            "especificación": "Documentado y validado por:
**EUPAIR_ARQ**
Arquitecto de Soluciones, Product Owner, Estratega de Negocio",
            
            # Desarrollo
            "desarrollado": "Desarrollado por:
**EUPAIR_DEV**
Full Stack Developer, Frontend, Backend, Mobile",
            "implementación": "Desarrollado por:
**EUPAIR_DEV**
Full Stack Developer, Frontend, Backend, Mobile",
            "código": "Desarrollado por:
**EUPAIR_DEV**
Full Stack Developer, Frontend, Backend, Mobile",
            "programación": "Desarrollado por:
**EUPAIR_DEV**
Full Stack Developer, Frontend, Backend, Mobile",
            
            # QA y Testing
            "validado": "Validado por:
**EUPAIR_QA**
QA Engineer, Test Automation, Performance, Security",
            "testing": "Validado por:
**EUPAIR_QA**
QA Engineer, Test Automation, Performance, Security",
            "pruebas": "Validado por:
**EUPAIR_QA**
QA Engineer, Test Automation, Performance, Security",
            "calidad": "Validado por:
**EUPAIR_QA**
QA Engineer, Test Automation, Performance, Security",
            
            # DevOps e Infraestructura
            "infraestructura": "Infraestructura y despliegue por:
**EUPAIR_DEVOPS**
DevOps Engineer, Infrastructure, SRE, Security",
            "despliegue": "Infraestructura y despliegue por:
**EUPAIR_DEVOPS**
DevOps Engineer, Infrastructure, SRE, Security",
            "devops": "Infraestructura y despliegue por:
**EUPAIR_DEVOPS**
DevOps Engineer, Infrastructure, SRE, Security",
            "configuración": "Infraestructura y despliegue por:
**EUPAIR_DEVOPS**
DevOps Engineer, Infrastructure, SRE, Security",
            
            # UI/UX
            "interfaz": "Dise√±ado por:
**EUPAIR_UX**
UI/UX Designer, Product Designer, Accessibility",
            "usuario": "Dise√±ado por:
**EUPAIR_UX**
UI/UX Designer, Product Designer, Accessibility",
            "experiencia": "Dise√±ado por:
**EUPAIR_UX**
UI/UX Designer, Product Designer, Accessibility",
            "diseño": "Dise√±ado por:
**EUPAIR_UX**
UI/UX Designer, Product Designer, Accessibility",
            
            # AI
            "inteligencia artificial": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
            "ai": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
            "machine learning": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
            "nlp": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
            
            # Datos
            "datos": "An√°lisis de datos por:
**EUPAIR_DATA**
Data Engineer, Data Analyst, BI, Data Governance",
            "analytics": "An√°lisis de datos por:
**EUPAIR_DATA**
Data Engineer, Data Analyst, BI, Data Governance",
            "business intelligence": "An√°lisis de datos por:
**EUPAIR_DATA**
Data Engineer, Data Analyst, BI, Data Governance",
            "bi": "An√°lisis de datos por:
**EUPAIR_DATA**
Data Engineer, Data Analyst, BI, Data Governance",
            
            # Seguridad
            "seguridad": "Auditor√≠a de seguridad por:
**EUPAIR_SEC**
Security Engineer, Penetration Testing, Compliance",
            "compliance": "Auditor√≠a de seguridad por:
**EUPAIR_SEC**
Security Engineer, Penetration Testing, Compliance",
            "auditoría": "Auditor√≠a de seguridad por:
**EUPAIR_SEC**
Security Engineer, Penetration Testing, Compliance",
            "vulnerabilidades": "Auditor√≠a de seguridad por:
**EUPAIR_SEC**
Security Engineer, Penetration Testing, Compliance",
            
            # Móvil
            "móvil": "Desarrollo m√≥vil por:
**EUPAIR_MOBILE**
Mobile Developer, React Native, iOS, Android",
            "mobile": "Desarrollo m√≥vil por:
**EUPAIR_MOBILE**
Mobile Developer, React Native, iOS, Android",
            "react native": "Desarrollo m√≥vil por:
**EUPAIR_MOBILE**
Mobile Developer, React Native, iOS, Android",
            "ios": "Desarrollo m√≥vil por:
**EUPAIR_MOBILE**
Mobile Developer, React Native, iOS, Android",
            "android": "Desarrollo m√≥vil por:
**EUPAIR_MOBILE**
Mobile Developer, React Native, iOS, Android",
            
            # Negocios
            "negocio": "An√°lisis de negocio por:
**EUPAIR_BIZ**
Business Analyst, Product Manager, Project Manager",
            "business": "An√°lisis de negocio por:
**EUPAIR_BIZ**
Business Analyst, Product Manager, Project Manager",
            "producto": "An√°lisis de negocio por:
**EUPAIR_BIZ**
Business Analyst, Product Manager, Project Manager",
            "proyecto": "An√°lisis de negocio por:
**EUPAIR_BIZ**
Business Analyst, Product Manager, Project Manager",
            
            # Documentación
            "documentación": "Documentaci√≥n por:
**EUPAIR_DOC**
Technical Writer, Content Creator, Knowledge Manager",
            "documentado": "Documentaci√≥n por:
**EUPAIR_DOC**
Technical Writer, Content Creator, Knowledge Manager",
            "manual": "Documentaci√≥n por:
**EUPAIR_DOC**
Technical Writer, Content Creator, Knowledge Manager",
            "guía": "Documentaci√≥n por:
**EUPAIR_DOC**
Technical Writer, Content Creator, Knowledge Manager",
            
            # Operaciones
            "operaciones": "Operaciones por:
**EUPAIR_OPS**
Operations Engineer, Support, Monitoring, Incident Management",
            "soporte": "Operaciones por:
**EUPAIR_OPS**
Operations Engineer, Support, Monitoring, Incident Management",
            "monitoreo": "Operaciones por:
**EUPAIR_OPS**
Operations Engineer, Support, Monitoring, Incident Management",
            "incidentes": "Operaciones por:
**EUPAIR_OPS**
Operations Engineer, Support, Monitoring, Incident Management",
        }
        
    def detect_encoding(self, file_path: Path) -> str:
        """Detecta la codificación de un archivo"""
        try:
            with open(file_path, 'rb') as f:
                raw_data = f.read(1024)
                result = chardet.detect(raw_data)
                return result['encoding'] or 'utf-8'
        except Exception:
            return 'utf-8'
    
    def read_file_safe(self, file_path: Path) -> str:
        """Lee un archivo de forma segura, manejando diferentes codificaciones"""
        encodings_to_try = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252', 'iso-8859-1']
        
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
    
    def determine_signature_type(self, content: str, context_lines: int = 10) -> str:
        """Determina el tipo de firma basado en el contexto del documento"""
        # Buscar palabras clave en el contenido
        content_lower = content.lower()
        
        # Contar ocurrencias de palabras clave
        keyword_counts = {}
        for keyword, placeholder in self.keyword_mapping.items():
            count = content_lower.count(keyword)
            if count > 0:
                keyword_counts[placeholder] = keyword_counts.get(placeholder, 0) + count
        
        # Si no se encontraron palabras clave específicas, usar firma general
        if not keyword_counts:
            return "Documentaci√≥n por:
**EUPAIR_DOC**
Technical Writer, Content Creator, Knowledge Manager"
        
        # Retornar el placeholder con más ocurrencias
        return max(keyword_counts.items(), key=lambda x: x[1])[0]
    
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
            # Verificar que no esté en directorios excluidos
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
            
            # Patrón más flexible para encontrar firmas antiguas
            old_signature_patterns = [
                r'Desarrollado y documentado por:\s*\n\*\*Eulalia \(EU-IA\)\*\*\s*\nAI Full Stack Developer, Arquitecta de Soluciones, QA, DevOps, UI/UX, AI Specialist',
                r'Desarrollado y documentado por:\s*\*\*Eulalia \(EU-IA\)\*\*\s*AI Full Stack Developer, Arquitecta de Soluciones, QA, DevOps, UI/UX, AI Specialist',
                r'Desarrollado y documentado por:\s*\n\*\*Eulalia \(EU-IA\)\*\*',
                r'Desarrollado y documentado por:\s*\*\*Eulalia \(EU-IA\)\*\*'
            ]
            
            # Buscar todas las ocurrencias con cualquier patrón
            all_matches = []
            for pattern in old_signature_patterns:
                matches = list(re.finditer(pattern, content, re.MULTILINE))
                all_matches.extend(matches)
            
            if not all_matches:
                return False
            
            self.stats["files_processed"] += 1
            replacements_made = 0
            
            if dry_run:
                print(f"📄 {file_path}: Encontradas {len(all_matches)} firmas antiguas")
                for match in all_matches:
                    # Determinar el tipo de firma basado en el contexto
                    start = max(0, match.start() - 500)
                    end = min(len(content), match.end() + 500)
                    context = content[start:end]
                    signature_type = self.determine_signature_type(context)
                    print(f"   - Reemplazaría con: {signature_type}")
            else:
                # Reemplazar de atrás hacia adelante para mantener las posiciones
                for match in reversed(all_matches):
                    # Determinar el tipo de firma basado en el contexto
                    start = max(0, match.start() - 500)
                    end = min(len(content), match.end() + 500)
                    context = content[start:end]
                    signature_type = self.determine_signature_type(context)
                    
                    # Reemplazar
                    content = content[:match.start()] + signature_type + content[match.end():]
                    replacements_made += 1
                
                # Escribir contenido actualizado
                if self.write_file_safe(file_path, content):
                    self.stats["files_updated"] += 1
                    self.stats["replacements_made"] += replacements_made
                    print(f"✅ {file_path}: Migradas {replacements_made} firmas antiguas")
            
            return True
            
        except Exception as e:
            error_msg = f"Error procesando {file_path}: {e}"
            print(f"❌ {error_msg}")
            self.stats["errors"].append(error_msg)
            return False
    
    def run(self, dry_run: bool = False, specific_file: str = None) -> bool:
        """Ejecuta la migración de firmas"""
        print("🔄 Iniciando migración de firmas antiguas...")
        print(f"📁 Directorio raíz: {self.project_root}")
        print(f"🔍 Modo: {'DRY RUN' if dry_run else 'MIGRACIÓN'}")
        print()
        
        # Obtener archivos a procesar
        files = self.get_files_to_process(specific_file)
        if not files:
            print("❌ No se encontraron archivos para procesar")
            return False
        
        print(f"📊 Procesando {len(files)} archivos...")
        print()
        
        # Procesar archivos
        files_with_signatures = 0
        for file_path in files:
            if self.process_file(file_path, dry_run):
                files_with_signatures += 1
        
        # Mostrar estadísticas
        print()
        print("📊 ESTADÍSTICAS:")
        print(f"   Archivos procesados: {self.stats['files_processed']}")
        print(f"   Archivos actualizados: {self.stats['files_updated']}")
        print(f"   Reemplazos realizados: {self.stats['replacements_made']}")
        print(f"   Errores: {len(self.stats['errors'])}")
        
        if self.stats["errors"]:
            print()
            print("❌ ERRORES:")
            for error in self.stats["errors"][:10]:
                print(f"   - {error}")
            if len(self.stats["errors"]) > 10:
                print(f"   ... y {len(self.stats['errors']) - 10} errores más")
        
        if dry_run:
            print()
            print("🔍 DRY RUN COMPLETADO")
            print("Para aplicar los cambios, ejecuta sin --dry-run")
        else:
            print()
            print("✅ MIGRACIÓN COMPLETADA")
        
        return len(self.stats["errors"]) == 0

def main():
    parser = argparse.ArgumentParser(
        description="Migrar firmas antiguas a placeholders en documentación del proyecto AI Pair Orchestrator Pro"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Mostrar qué se haría sin hacer cambios"
    )
    parser.add_argument(
        "--file",
        type=str,
        help="Procesar solo un archivo específico"
    )
    parser.add_argument(
        "--project-root",
        type=str,
        default=".",
        help="Directorio raíz del proyecto"
    )
    
    args = parser.parse_args()
    
    # Crear y ejecutar migrador
    migrator = SignatureMigrator(args.project_root)
    success = migrator.run(args.dry_run, args.file)
    
    exit(0 if success else 1)

if __name__ == "__main__":
    main() 