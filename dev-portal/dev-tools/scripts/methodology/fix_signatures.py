#!/usr/bin/env python3
"""
Script para corregir las firmas que se aplicaron incorrectamente.
Este script restaura los placeholders correctos en lugar de las firmas completas.

Autor: Eulalia (EU-IA)
Fecha: 26/06/2025
"""

import re
from pathlib import Path

def fix_signatures():
    """Corrige las firmas incorrectas en los archivos"""
    
    # Archivos que necesitan correcci√≥n
    files_to_fix = [
        "docs/README_SIGNATURES.md",
        "docs/TEMPLATE_WITH_SIGNATURES.md",
        "docs/EXAMPLE_UPDATED_DOCUMENT.md",
        "docs/development/DRY_RUN_GUIDE.md",
        "docs/development/INTERNAL_SCRIPTS_CATALOG.md"
    ]
    
    # Mapeo de firmas incorrectas a placeholders correctos
    signature_fixes = {
        "Desarrollado y documentado por:\n**Eulalia (EU-IA)**\nAI Full Stack Developer, Arquitecta de Soluciones, QA, DevOps, UI/UX, AI Specialist": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "Documentado y validado por:\n**EUPAIR_ARQ**\nArquitecto de Soluciones, Product Owner, Estratega de Negocio": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "Desarrollado por:\n**EUPAIR_DEV**\nFull Stack Developer, Frontend, Backend, Mobile": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "Validado por:\n**EUPAIR_QA**\nQA Engineer, Test Automation, Performance, Security": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "Infraestructura y despliegue por:\n**EUPAIR_DEVOPS**\nDevOps Engineer, Infrastructure, SRE, Security": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "Dise√±ado por:\n**EUPAIR_UX**\nUI/UX Designer, Product Designer, Accessibility": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "Implementaci√≥n AI por:\n**EUPAIR_AI**\nAI Engineer, Machine Learning, Data Science, NLP": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "An√°lisis de datos por:\n**EUPAIR_DATA**\nData Engineer, Data Analyst, BI, Data Governance": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "Auditor√≠a de seguridad por:\n**EUPAIR_SEC**\nSecurity Engineer, Penetration Testing, Compliance": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "Desarrollo m√≥vil por:\n**EUPAIR_MOBILE**\nMobile Developer, React Native, iOS, Android": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "Desarrollo web por:\n**EUPAIR_WEB**\nFrontend, Backend, Full Stack, Performance, SEO": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "Documentado por:\n**EUPAIR_DOCS**\nTechnical Writer, API Documentation, UX Writing": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "Gesti√≥n de producto por:\n**EUPAIR_PRODUCT**\nProduct Manager, Product Owner, Business Analyst": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "Analytics implementado por:\n**EUPAIR_ANALYTICS**\nAnalytics Engineer, BI, Data Analysis, Growth": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP",
        "Herramientas desarrolladas por:\n**EUPAIR_TOOLS**\nTools Developer, Automation, Integration, Workflow": "Implementaci√≥n AI por:
**EUPAIR_AI**
AI Engineer, Machine Learning, Data Science, NLP"
    }
    
    files_fixed = 0
    total_replacements = 0
    
    for file_path in files_to_fix:
        path = Path(file_path)
        if not path.exists():
            print(f"‚ö†Ô∏è  Archivo no encontrado: {file_path}")
            continue
            
        try:
            # Leer contenido
            content = path.read_text(encoding='utf-8')
            original_content = content
            
            # Aplicar correcciones
            replacements_made = 0
            for incorrect_signature, correct_placeholder in signature_fixes.items():
                if incorrect_signature in content:
                    content = content.replace(incorrect_signature, correct_placeholder)
                    replacements_made += content.count(correct_placeholder)
            
            # Si se hicieron cambios, escribir el archivo
            if content != original_content:
                path.write_text(content, encoding='utf-8')
                files_fixed += 1
                total_replacements += replacements_made
                print(f"‚úÖ {file_path}: Corregidos {replacements_made} placeholders")
            else:
                print(f"‚ÑπÔ∏è  {file_path}: Sin cambios necesarios")
                
        except Exception as e:
            print(f"‚ùå Error procesando {file_path}: {e}")
    
    print(f"\nüìä CORRECCI√ìN COMPLETADA:")
    print(f"   Archivos corregidos: {files_fixed}")
    print(f"   Total de reemplazos: {total_replacements}")

if __name__ == "__main__":
    print("üîß Iniciando correcci√≥n de firmas...")
    fix_signatures()
    print("‚úÖ Correcci√≥n completada") 