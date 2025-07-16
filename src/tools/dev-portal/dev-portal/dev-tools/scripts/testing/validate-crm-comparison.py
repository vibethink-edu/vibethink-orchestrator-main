#!/usr/bin/env python3
"""
Script de Validación para Comparación Final de CRM
Autor: Eulalia (EU-IA)
Fecha: 26/06/2025
"""

import json
import re
import os
from datetime import datetime
from typing import Dict, List, Any, Tuple

class CRMComparisonValidator:
    """Validador para comparación final de alternativas CRM."""
    
    def __init__(self, comparison_file: str):
        self.comparison_file = comparison_file
        self.comparison_data = {}
        self.validation_results = {
            "passed": True,
            "errors": [],
            "warnings": [],
            "score": 0.0,
            "recommendation": ""
        }
        
    def load_comparison(self) -> bool:
        """Carga y parsea el archivo de comparación."""
        try:
            with open(self.comparison_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            self.comparison_data = self._parse_comparison_content(content)
            return True
        except Exception as e:
            self.validation_results["errors"].append(f"Error cargando comparación: {e}")
            self.validation_results["passed"] = False
            return False
    
    def _parse_comparison_content(self, content: str) -> Dict[str, Any]:
        """Parsea el contenido de la comparación."""
        data = {}
        
        # Extraer información básica
        basic_info = re.search(r'### 📋 \*\*Información del Análisis\*\*\n(.*?)\n---', content, re.DOTALL)
        if basic_info:
            lines = basic_info.group(1).strip().split('\n')
            for line in lines:
                if ':' in line and line.strip():
                    parts = line.split(':', 1)
                    if len(parts) == 2:
                        key = parts[0].strip().replace('**', '').replace('-', '').strip()
                        value = parts[1].strip()
                        data[key] = value
        
        # Extraer alternativas evaluadas
        alternatives_section = re.search(r'## 🎯 \*\*Resumen Ejecutivo de las Tres Alternativas\*\*\n(.*?)(?=## |$)', content, re.DOTALL)
        if alternatives_section:
            alternatives_content = alternatives_section.group(1)
            alternatives = re.findall(r'### \*\*\d+\. (.*?): (.*?)\*\*\n(.*?)(?=### \*\*\d+\.|\n---|$)', alternatives_content, re.DOTALL)
            data['alternatives'] = []
            for title, subtitle, description in alternatives:
                data['alternatives'].append({
                    'title': title,
                    'subtitle': subtitle,
                    'description': description.strip()
                })
        
        # Extraer recomendación final
        recommendation_section = re.search(r'## 🎯 \*\*Recomendación Estratégica Final\*\*\n(.*?)(?=## |$)', content, re.DOTALL)
        if recommendation_section:
            data['recommendation'] = recommendation_section.group(1).strip()
        
        # Extraer roadmap
        roadmap_section = re.search(r'## 🚀 \*\*Roadmap de Implementación Final\*\*\n(.*?)(?=## |$)', content, re.DOTALL)
        if roadmap_section:
            roadmap_content = roadmap_section.group(1)
            phases = re.findall(r'### \*\*(.*?)\*\*\n(.*?)(?=### \*\*|\n---|$)', roadmap_content, re.DOTALL)
            data['roadmap'] = []
            for phase_title, phase_content in phases:
                data['roadmap'].append({
                    'title': phase_title,
                    'content': phase_content.strip()
                })
        
        # Extraer análisis financiero
        financial_section = re.search(r'## 💰 \*\*Análisis Financiero Final\*\*\n(.*?)(?=## |$)', content, re.DOTALL)
        if financial_section:
            data['financial_analysis'] = financial_section.group(1).strip()
        
        return data
    
    def validate_alternatives_coverage(self) -> bool:
        """Valida que se cubran las tres alternativas principales."""
        alternatives = self.comparison_data.get('alternatives', [])
        
        expected_alternatives = ['Attio', 'Twenty CRM', 'Monica PRM']
        found_alternatives = [alt['title'] for alt in alternatives]
        
        missing_alternatives = [alt for alt in expected_alternatives if alt not in found_alternatives]
        
        if missing_alternatives:
            self.validation_results["errors"].append(f"❌ Alternativas faltantes: {', '.join(missing_alternatives)}")
            return False
        else:
            self.validation_results["warnings"].append(f"✅ Todas las alternativas cubiertas: {', '.join(found_alternatives)}")
            return True
    
    def validate_comparison_matrix(self) -> bool:
        """Valida que exista matriz comparativa."""
        content_lower = str(self.comparison_data).lower()
        
        matrix_indicators = [
            'matriz comparativa',
            'criterio',
            'attio',
            'twenty',
            'monica',
            'ganador'
        ]
        
        found_indicators = [ind for ind in matrix_indicators if ind in content_lower]
        
        if len(found_indicators) >= 4:
            self.validation_results["warnings"].append("✅ Matriz comparativa encontrada")
            return True
        else:
            self.validation_results["errors"].append("❌ Matriz comparativa insuficiente")
            return False
    
    def validate_ai_analysis(self) -> bool:
        """Valida análisis AI First."""
        content_lower = str(self.comparison_data).lower()
        
        ai_indicators = [
            'ai first',
            'ai integration',
            'agno',
            'ai context',
            'ai assistant'
        ]
        
        found_indicators = [ind for ind in ai_indicators if ind in content_lower]
        
        if len(found_indicators) >= 3:
            self.validation_results["warnings"].append("✅ Análisis AI First encontrado")
            return True
        else:
            self.validation_results["errors"].append("❌ Análisis AI First insuficiente")
            return False
    
    def validate_strategic_recommendation(self) -> bool:
        """Valida que exista recomendación estratégica."""
        recommendation = self.comparison_data.get('recommendation', '')
        
        if len(recommendation) > 100:
            self.validation_results["warnings"].append("✅ Recomendación estratégica encontrada")
            return True
        else:
            self.validation_results["errors"].append("❌ Recomendación estratégica insuficiente")
            return False
    
    def validate_roadmap(self) -> bool:
        """Valida que exista roadmap de implementación."""
        roadmap = self.comparison_data.get('roadmap', [])
        
        if len(roadmap) >= 2:
            self.validation_results["warnings"].append(f"✅ Roadmap encontrado: {len(roadmap)} fases")
            return True
        else:
            self.validation_results["errors"].append("❌ Roadmap insuficiente")
            return False
    
    def validate_financial_analysis(self) -> bool:
        """Valida que exista análisis financiero."""
        financial = self.comparison_data.get('financial_analysis', '')
        
        if len(financial) > 50:
            self.validation_results["warnings"].append("✅ Análisis financiero encontrado")
            return True
        else:
            self.validation_results["errors"].append("❌ Análisis financiero insuficiente")
            return False
    
    def calculate_final_score(self) -> float:
        """Calcula score final basado en criterios cumplidos."""
        total_criteria = 6
        passed_criteria = 0
        
        # Contar criterios cumplidos
        if self.validate_alternatives_coverage():
            passed_criteria += 1
        
        if self.validate_comparison_matrix():
            passed_criteria += 1
        
        if self.validate_ai_analysis():
            passed_criteria += 1
        
        if self.validate_strategic_recommendation():
            passed_criteria += 1
        
        if self.validate_roadmap():
            passed_criteria += 1
        
        if self.validate_financial_analysis():
            passed_criteria += 1
        
        return (passed_criteria / total_criteria) * 10
    
    def validate(self) -> Dict[str, Any]:
        """Ejecuta validación completa."""
        print(f"🔍 Validando comparación CRM: {self.comparison_file}")
        
        # Cargar comparación
        if not self.load_comparison():
            return self.validation_results
        
        # Validar criterios
        if not self.validate_alternatives_coverage():
            self.validation_results["passed"] = False
        
        if not self.validate_comparison_matrix():
            self.validation_results["passed"] = False
        
        if not self.validate_ai_analysis():
            self.validation_results["passed"] = False
        
        if not self.validate_strategic_recommendation():
            self.validation_results["passed"] = False
        
        if not self.validate_roadmap():
            self.validation_results["passed"] = False
        
        if not self.validate_financial_analysis():
            self.validation_results["passed"] = False
        
        # Calcular score final
        final_score = self.calculate_final_score()
        self.validation_results["final_validation_score"] = final_score
        
        return self.validation_results
    
    def generate_report(self) -> str:
        """Genera reporte de validación."""
        report = f"""
# Reporte de Validación - Comparación Final CRM
**Fecha**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Archivo**: {self.comparison_file}

## 📊 Resultados de Validación

### Estado General: {'✅ APROBADO' if self.validation_results['passed'] else '❌ RECHAZADO'}

### Score de Validación: {self.validation_results.get('final_validation_score', 0):.1f}/10

## ✅ Criterios Cumplidos
"""
        
        for warning in self.validation_results.get('warnings', []):
            report += f"- {warning}\n"
        
        if self.validation_results.get('errors'):
            report += "\n## ❌ Errores Encontrados\n"
            for error in self.validation_results['errors']:
                report += f"- {error}\n"
        
        report += f"""
## 📋 Resumen de Comparación

### Alternativas Evaluadas: {len(self.comparison_data.get('alternatives', []))}
### Fases del Roadmap: {len(self.comparison_data.get('roadmap', []))}
### Análisis Financiero: {'✅ Presente' if self.comparison_data.get('financial_analysis') else '❌ Faltante'}

## 🎯 Decisión Final

"""
        
        if self.validation_results['passed']:
            report += "**✅ COMPARACIÓN APROBADA**\n\n"
            report += "La comparación de alternativas CRM cumple con todos los criterios de validación.\n\n"
            report += "**Próximos pasos:**\n"
            report += "1. Revisar y aprobar recomendación estratégica\n"
            report += "2. Iniciar implementación según roadmap\n"
            report += "3. Configurar métricas y monitoreo\n"
            report += "4. Comenzar desarrollo iterativo\n"
        else:
            report += "**❌ COMPARACIÓN RECHAZADA**\n\n"
            report += "La comparación no cumple con los criterios obligatorios. Se requiere revisión.\n\n"
            report += "**Acciones requeridas:**\n"
            for error in self.validation_results.get('errors', []):
                report += f"- {error}\n"
        
        return report

def main():
    """Función principal del script."""
    comparison_file = "docs/evaluations/CRM_ALTERNATIVES_FINAL_COMPARISON.md"
    
    if not os.path.exists(comparison_file):
        print(f"❌ Archivo de comparación no encontrado: {comparison_file}")
        return
    
    # Crear validador
    validator = CRMComparisonValidator(comparison_file)
    
    # Ejecutar validación
    results = validator.validate()
    
    # Generar reporte
    report = validator.generate_report()
    
    # Guardar reporte
    report_file = f"reports/crm-comparison-validation-{datetime.now().strftime('%Y%m%d-%H%M%S')}.md"
    os.makedirs("reports", exist_ok=True)
    
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    # Mostrar resultados
    print(report)
    print(f"\n📄 Reporte guardado en: {report_file}")
    
    # Guardar resultados JSON
    json_file = report_file.replace('.md', '.json')
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"📊 Datos JSON guardados en: {json_file}")
    
    # Exit code
    exit(0 if results['passed'] else 1)

if __name__ == "__main__":
    main() 