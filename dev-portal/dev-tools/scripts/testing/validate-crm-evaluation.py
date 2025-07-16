#!/usr/bin/env python3
"""
Script de Validación Automática para Evaluación de Twenty CRM
Autor: Eulalia (EU-IA)
Fecha: 26/06/2025
"""

import json
import re
import os
from datetime import datetime
from typing import Dict, List, Any, Tuple

class CRMEvaluationValidator:
    """Validador automático para evaluaciones de CRM siguiendo nuestro marco unificado."""
    
    def __init__(self, evaluation_file: str):
        self.evaluation_file = evaluation_file
        self.evaluation_data = {}
        self.validation_results = {
            "passed": True,
            "errors": [],
            "warnings": [],
            "score": 0.0,
            "recommendation": ""
        }
        
    def load_evaluation(self) -> bool:
        """Carga y parsea el archivo de evaluación."""
        try:
            with open(self.evaluation_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extraer datos usando regex mejoradas
            self.evaluation_data = self._parse_markdown_evaluation(content)
            return True
        except Exception as e:
            self.validation_results["errors"].append(f"Error cargando evaluación: {e}")
            self.validation_results["passed"] = False
            return False
    
    def _parse_markdown_evaluation(self, content: str) -> Dict[str, Any]:
        """Parsea el contenido markdown para extraer datos estructurados."""
        data = {}
        
        # Extraer información básica
        basic_info = re.search(r'## 📋 \*\*Información de Evaluación\*\*\n(.*?)\n---', content, re.DOTALL)
        if basic_info:
            lines = basic_info.group(1).strip().split('\n')
            for line in lines:
                if ':' in line and line.strip():
                    parts = line.split(':', 1)
                    if len(parts) == 2:
                        key = parts[0].strip().replace('**', '').replace('-', '').strip()
                        value = parts[1].strip()
                        data[key] = value
        
        # Extraer casos de uso
        use_cases_section = re.search(r'## 🎯 \*\*Casos de Uso.*?\*\*\n(.*?)(?=## |$)', content, re.DOTALL)
        if use_cases_section:
            use_cases_content = use_cases_section.group(1)
            use_cases = re.findall(r'### \*\*Caso de Uso \d+: (.*?)\*\*\n(.*?)(?=### \*\*Caso de Uso|\n---|$)', use_cases_content, re.DOTALL)
            data['use_cases'] = []
            for title, description in use_cases:
                data['use_cases'].append({
                    'title': title,
                    'description': description.strip()
                })
        
        # Extraer score final - buscar en múltiples formatos
        score_patterns = [
            r'Score Final:\s*(\d+\.?\d*)/10',
            r'finalScore.*?=\s*(\d+\.?\d*)/10',
            r'Score:\s*(\d+\.?\d*)/10',
            r'(\d+\.?\d*)/10.*?Score'
        ]
        
        for pattern in score_patterns:
            score_match = re.search(pattern, content, re.IGNORECASE)
            if score_match:
                try:
                    data['final_score'] = float(score_match.group(1))
                    break
                except ValueError:
                    continue
        
        # Extraer recomendación - buscar en múltiples formatos
        recommendation_patterns = [
            r'Recomendación Final:\s*(.*?)\n',
            r'Nivel de Aceptación:\s*(.*?)\n',
            r'Recomendación:\s*(.*?)\n',
            r'Estado:\s*(.*?)\n'
        ]
        
        for pattern in recommendation_patterns:
            recommendation_match = re.search(pattern, content, re.IGNORECASE)
            if recommendation_match:
                data['recommendation'] = recommendation_match.group(1).strip()
                break
        
        # Extraer secciones obligatorias
        sections = {
            'busqueda_exhaustiva': r'## 🔍 \*\*Búsqueda Exhaustiva',
            'compatibilidad': r'## 🏗️ \*\*Compatibilidad Hacia Atrás',
            'riesgos': r'## 🛡️ \*\*Análisis de Riesgos',
            'suposiciones': r'## ✅ \*\*Validación de Suposiciones'
        }
        
        for section_name, pattern in sections.items():
            if re.search(pattern, content, re.IGNORECASE):
                data[section_name] = True
            else:
                data[section_name] = False
        
        # Extraer principios constitucionales
        principles = ['multi-tenant', 'seguridad', 'escalabilidad', 'open source', 'comunidad']
        content_lower = content.lower()
        data['principles_found'] = [p for p in principles if p in content_lower]
        
        return data
    
    def validate_obligatory_criteria(self) -> bool:
        """Valida criterios obligatorios del marco de evaluación."""
        passed = True
        
        # 1. Casos de uso (mínimo 3)
        use_cases = self.evaluation_data.get('use_cases', [])
        if len(use_cases) < 3:
            self.validation_results["errors"].append("❌ Mínimo 3 casos de uso requeridos")
            passed = False
        else:
            self.validation_results["warnings"].append(f"✅ {len(use_cases)} casos de uso documentados")
        
        # 2. Búsqueda exhaustiva (mínimo 7 fuentes)
        if not self.evaluation_data.get('busqueda_exhaustiva', False):
            self.validation_results["errors"].append("❌ Sección de búsqueda exhaustiva requerida")
            passed = False
        else:
            self.validation_results["warnings"].append("✅ Búsqueda exhaustiva documentada")
        
        # 3. Compatibilidad hacia atrás
        if not self.evaluation_data.get('compatibilidad', False):
            self.validation_results["errors"].append("❌ Análisis de compatibilidad hacia atrás requerido")
            passed = False
        else:
            self.validation_results["warnings"].append("✅ Compatibilidad hacia atrás analizada")
        
        # 4. Análisis de riesgos
        if not self.evaluation_data.get('riesgos', False):
            self.validation_results["errors"].append("❌ Análisis de riesgos requerido")
            passed = False
        else:
            self.validation_results["warnings"].append("✅ Análisis de riesgos documentado")
        
        # 5. Validación de suposiciones
        if not self.evaluation_data.get('suposiciones', False):
            self.validation_results["errors"].append("❌ Validación de suposiciones requerida")
            passed = False
        else:
            self.validation_results["warnings"].append("✅ Validación de suposiciones documentada")
        
        return passed
    
    def validate_score_threshold(self) -> bool:
        """Valida que el score cumpla con el umbral mínimo."""
        score = self.evaluation_data.get('final_score', 0)
        
        if score >= 7.5:
            self.validation_results["score"] = score
            self.validation_results["warnings"].append(f"✅ Score {score}/10 cumple umbral mínimo (7.5)")
            return True
        else:
            self.validation_results["errors"].append(f"❌ Score {score}/10 no cumple umbral mínimo (7.5)")
            self.validation_results["passed"] = False
            return False
    
    def validate_recommendation_format(self) -> bool:
        """Valida formato de recomendación."""
        recommendation = self.evaluation_data.get('recommendation', '')
        
        valid_recommendations = ['APROBADO', 'CONSIDERABLE', 'RECHAZADO', 'FUTURO', 'EN EVALUACIÓN']
        if any(rec in recommendation.upper() for rec in valid_recommendations):
            self.validation_results["recommendation"] = recommendation
            self.validation_results["warnings"].append(f"✅ Recomendación válida: {recommendation}")
            return True
        else:
            self.validation_results["errors"].append(f"❌ Recomendación inválida: {recommendation}")
            return False
    
    def validate_compliance_constitutional(self) -> bool:
        """Valida compliance constitucional del proyecto."""
        # Verificar principios fundamentales
        principles = [
            "multi-tenant",
            "seguridad",
            "escalabilidad",
            "open source",
            "comunidad"
        ]
        
        found_principles = self.evaluation_data.get('principles_found', [])
        missing_principles = [p for p in principles if p not in found_principles]
        
        if missing_principles:
            self.validation_results["errors"].append(f"❌ Principios constitucionales faltantes: {', '.join(missing_principles)}")
            return False
        else:
            self.validation_results["warnings"].append("✅ Compliance constitucional validado")
            return True
    
    def calculate_final_score(self) -> float:
        """Calcula score final basado en criterios cumplidos."""
        total_criteria = 7  # Total de criterios obligatorios
        passed_criteria = 0
        
        # Contar criterios cumplidos
        if len(self.evaluation_data.get('use_cases', [])) >= 3:
            passed_criteria += 1
        
        if self.evaluation_data.get('busqueda_exhaustiva', False):
            passed_criteria += 1
        
        if self.evaluation_data.get('compatibilidad', False):
            passed_criteria += 1
        
        if self.evaluation_data.get('riesgos', False):
            passed_criteria += 1
        
        if self.evaluation_data.get('suposiciones', False):
            passed_criteria += 1
        
        if self.evaluation_data.get('final_score', 0) >= 7.5:
            passed_criteria += 1
        
        if self.validate_recommendation_format():
            passed_criteria += 1
        
        return (passed_criteria / total_criteria) * 10
    
    def validate(self) -> Dict[str, Any]:
        """Ejecuta validación completa."""
        print(f"🔍 Validando evaluación: {self.evaluation_file}")
        
        # Cargar evaluación
        if not self.load_evaluation():
            return self.validation_results
        
        # Validar criterios obligatorios
        if not self.validate_obligatory_criteria():
            self.validation_results["passed"] = False
        
        # Validar score
        if not self.validate_score_threshold():
            self.validation_results["passed"] = False
        
        # Validar recomendación
        if not self.validate_recommendation_format():
            self.validation_results["passed"] = False
        
        # Validar compliance constitucional
        if not self.validate_compliance_constitutional():
            self.validation_results["passed"] = False
        
        # Calcular score final
        final_score = self.calculate_final_score()
        self.validation_results["final_validation_score"] = final_score
        
        return self.validation_results
    
    def generate_report(self) -> str:
        """Genera reporte de validación."""
        report = f"""
# Reporte de Validación - Evaluación Twenty CRM
**Fecha**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Archivo**: {self.evaluation_file}

## 📊 Resultados de Validación

### Estado General: {'✅ APROBADO' if self.validation_results['passed'] else '❌ RECHAZADO'}

### Score de Validación: {self.validation_results.get('final_validation_score', 0):.1f}/10

### Score de Evaluación: {self.validation_results.get('score', 0):.1f}/10

### Recomendación: {self.validation_results.get('recommendation', 'N/A')}

## ✅ Criterios Cumplidos
"""
        
        for warning in self.validation_results.get('warnings', []):
            report += f"- {warning}\n"
        
        if self.validation_results.get('errors'):
            report += "\n## ❌ Errores Encontrados\n"
            for error in self.validation_results['errors']:
                report += f"- {error}\n"
        
        report += f"""
## 📋 Resumen de Evaluación

### Casos de Uso: {len(self.evaluation_data.get('use_cases', []))}/3 mínimo
### Score Final: {self.evaluation_data.get('final_score', 0):.1f}/10
### Recomendación: {self.evaluation_data.get('recommendation', 'N/A')}

### Secciones Obligatorias:
- Búsqueda Exhaustiva: {'✅' if self.evaluation_data.get('busqueda_exhaustiva') else '❌'}
- Compatibilidad: {'✅' if self.evaluation_data.get('compatibilidad') else '❌'}
- Riesgos: {'✅' if self.evaluation_data.get('riesgos') else '❌'}
- Suposiciones: {'✅' if self.evaluation_data.get('suposiciones') else '❌'}

### Principios Constitucionales Encontrados: {', '.join(self.evaluation_data.get('principles_found', []))}

## 🎯 Decisión Final

"""
        
        if self.validation_results['passed']:
            report += "**✅ EVALUACIÓN APROBADA**\n\n"
            report += "La evaluación de Twenty CRM cumple con todos los criterios obligatorios del marco de evaluación unificado.\n\n"
            report += "**Próximos pasos:**\n"
            report += "1. Proceder con POC de Twenty CRM\n"
            report += "2. Realizar auditoría de seguridad\n"
            report += "3. Validar integración con stack actual\n"
            report += "4. Presentar recomendación al equipo\n"
        else:
            report += "**❌ EVALUACIÓN RECHAZADA**\n\n"
            report += "La evaluación no cumple con los criterios obligatorios. Se requiere revisión antes de proceder.\n\n"
            report += "**Acciones requeridas:**\n"
            for error in self.validation_results.get('errors', []):
                report += f"- {error}\n"
        
        return report

def main():
    """Función principal del script."""
    evaluation_file = "docs/evaluations/TWENTY_CRM_EVALUATION.md"
    
    if not os.path.exists(evaluation_file):
        print(f"❌ Archivo de evaluación no encontrado: {evaluation_file}")
        return
    
    # Crear validador
    validator = CRMEvaluationValidator(evaluation_file)
    
    # Ejecutar validación
    results = validator.validate()
    
    # Generar reporte
    report = validator.generate_report()
    
    # Guardar reporte
    report_file = f"reports/twenty-crm-validation-{datetime.now().strftime('%Y%m%d-%H%M%S')}.md"
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