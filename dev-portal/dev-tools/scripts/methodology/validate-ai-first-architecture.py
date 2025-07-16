#!/usr/bin/env python3
"""
Script de Validación para Arquitectura AI First CRM
Autor: Eulalia (EU-IA)
Fecha: 26/06/2025
"""

import json
import re
import os
from datetime import datetime
from typing import Dict, List, Any, Tuple

class AIFirstArchitectureValidator:
    """Validador para propuestas de arquitectura AI First."""
    
    def __init__(self, architecture_file: str):
        self.architecture_file = architecture_file
        self.architecture_data = {}
        self.validation_results = {
            "passed": True,
            "errors": [],
            "warnings": [],
            "score": 0.0,
            "recommendation": ""
        }
        
    def load_architecture(self) -> bool:
        """Carga y parsea el archivo de arquitectura."""
        try:
            with open(self.architecture_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            self.architecture_data = self._parse_architecture_content(content)
            return True
        except Exception as e:
            self.validation_results["errors"].append(f"Error cargando arquitectura: {e}")
            self.validation_results["passed"] = False
            return False
    
    def _parse_architecture_content(self, content: str) -> Dict[str, Any]:
        """Parsea el contenido de la propuesta de arquitectura."""
        data = {}
        
        # Extraer información básica
        basic_info = re.search(r'### 📋 \*\*Información del Proyecto\*\*\n(.*?)\n---', content, re.DOTALL)
        if basic_info:
            lines = basic_info.group(1).strip().split('\n')
            for line in lines:
                if ':' in line and line.strip():
                    parts = line.split(':', 1)
                    if len(parts) == 2:
                        key = parts[0].strip().replace('**', '').replace('-', '').strip()
                        value = parts[1].strip()
                        data[key] = value
        
        # Extraer componentes AI - buscar en sección específica
        ai_components_section = re.search(r'## 🧠 \*\*Componentes AI First\*\*\n(.*?)(?=## |$)', content, re.DOTALL)
        if ai_components_section:
            components_content = ai_components_section.group(1)
            components = re.findall(r'### \*\*\d+\. (.*?)\*\*\n(.*?)(?=### \*\*\d+\.|\n---|$)', components_content, re.DOTALL)
            data['ai_components'] = []
            for title, description in components:
                data['ai_components'].append({
                    'title': title,
                    'description': description.strip()
                })
        
        # Extraer integraciones - buscar en sección específica
        integrations_section = re.search(r'## 🔧 \*\*Integración con Stack Existente\*\*\n(.*?)(?=## |$)', content, re.DOTALL)
        if integrations_section:
            integrations_content = integrations_section.group(1)
            integrations = re.findall(r'### \*\*\d+\. Integración con (.*?)\*\*\n(.*?)(?=### \*\*\d+\.|\n---|$)', integrations_content, re.DOTALL)
            data['integrations'] = []
            for platform, description in integrations:
                data['integrations'].append({
                    'platform': platform,
                    'description': description.strip()
                })
        
        # Extraer roadmap - buscar en sección específica
        roadmap_section = re.search(r'## 🚀 \*\*Roadmap de Implementación\*\*\n(.*?)(?=## |$)', content, re.DOTALL)
        if roadmap_section:
            roadmap_content = roadmap_section.group(1)
            phases = re.findall(r'### \*\*(.*?)\*\*\n(.*?)(?=### \*\*|\n---|$)', roadmap_content, re.DOTALL)
            data['roadmap'] = []
            for phase_title, phase_content in phases:
                data['roadmap'].append({
                    'title': phase_title,
                    'content': phase_content.strip()
                })
        
        # Extraer métricas de beneficios - buscar en sección específica
        benefits_section = re.search(r'## 💰 \*\*ROI y Beneficios\*\*\n(.*?)(?=## |$)', content, re.DOTALL)
        if benefits_section:
            benefits_content = benefits_section.group(1)
            data['benefits'] = {
                'quantifiable': [],
                'qualitative': []
            }
            
            # Extraer beneficios cuantificables
            quantifiable = re.findall(r'- \*\*(.*?)\*\*: (.*?)\n', benefits_content)
            for benefit, value in quantifiable:
                data['benefits']['quantifiable'].append({
                    'benefit': benefit,
                    'value': value
                })
        
        # Extraer stack tecnológico
        stack_section = re.search(r'### \*\*Stack Tecnológico Integrado\*\*\n(.*?)(?=### \*\*|\n---|$)', content, re.DOTALL)
        if stack_section:
            stack_content = stack_section.group(1)
            data['stack_technologies'] = stack_content
        
        return data
    
    def validate_ai_first_principles(self) -> bool:
        """Valida que la arquitectura siga principios AI First."""
        passed = True
        content_lower = str(self.architecture_data).lower()
        
        # Principios AI First obligatorios
        ai_first_principles = [
            'ai context provider',
            'ai assistant',
            'ai slots',
            'ai insights',
            'ai automation',
            'ai suggestions',
            'ai workflow'
        ]
        
        missing_principles = []
        for principle in ai_first_principles:
            if principle not in content_lower:
                missing_principles.append(principle)
        
        if missing_principles:
            self.validation_results["errors"].append(f"❌ Principios AI First faltantes: {', '.join(missing_principles)}")
            passed = False
        else:
            self.validation_results["warnings"].append("✅ Principios AI First validados")
        
        return passed
    
    def validate_stack_integration(self) -> bool:
        """Valida integración con stack existente."""
        passed = True
        content_lower = str(self.architecture_data).lower()
        
        # Stack existente que debe estar integrado
        existing_stack = [
            'react',
            'typescript',
            'fastapi',
            'postgresql',
            'supabase',
            'agno',
            'tailwind',
            'zustand'
        ]
        
        missing_stack = []
        for tech in existing_stack:
            if tech not in content_lower:
                missing_stack.append(tech)
        
        if missing_stack:
            self.validation_results["errors"].append(f"❌ Integración con stack faltante: {', '.join(missing_stack)}")
            passed = False
        else:
            self.validation_results["warnings"].append("✅ Integración con stack existente validada")
        
        return passed
    
    def validate_multi_tenant_support(self) -> bool:
        """Valida soporte multi-tenant."""
        passed = True
        content_lower = str(self.architecture_data).lower()
        
        multi_tenant_requirements = [
            'multi-tenant',
            'workspace',
            'permissions',
            'isolation',
            'rls'
        ]
        
        missing_requirements = []
        for req in multi_tenant_requirements:
            if req not in content_lower:
                missing_requirements.append(req)
        
        if missing_requirements:
            self.validation_results["errors"].append(f"❌ Requisitos multi-tenant faltantes: {', '.join(missing_requirements)}")
            passed = False
        else:
            self.validation_results["warnings"].append("✅ Soporte multi-tenant validado")
        
        return passed
    
    def validate_scalability(self) -> bool:
        """Valida escalabilidad de la arquitectura."""
        passed = True
        content_lower = str(self.architecture_data).lower()
        
        scalability_indicators = [
            'modular',
            'extensible',
            'evolution',
            'performance',
            'optimization',
            'scalable'
        ]
        
        found_indicators = [ind for ind in scalability_indicators if ind in content_lower]
        
        if len(found_indicators) < 3:
            self.validation_results["errors"].append(f"❌ Indicadores de escalabilidad insuficientes: {len(found_indicators)}/6")
            passed = False
        else:
            self.validation_results["warnings"].append(f"✅ Escalabilidad validada: {len(found_indicators)}/6 indicadores")
        
        return passed
    
    def validate_roadmap(self) -> bool:
        """Valida que exista un roadmap de implementación."""
        roadmap = self.architecture_data.get('roadmap', [])
        
        if len(roadmap) < 3:
            self.validation_results["errors"].append(f"❌ Roadmap insuficiente: {len(roadmap)} fases")
            return False
        else:
            self.validation_results["warnings"].append(f"✅ Roadmap validado: {len(roadmap)} fases")
            return True
    
    def validate_benefits(self) -> bool:
        """Valida que se documenten beneficios cuantificables."""
        benefits = self.architecture_data.get('benefits', {})
        quantifiable = benefits.get('quantifiable', [])
        
        if len(quantifiable) < 2:
            self.validation_results["errors"].append(f"❌ Beneficios cuantificables insuficientes: {len(quantifiable)}")
            return False
        else:
            self.validation_results["warnings"].append(f"✅ Beneficios validados: {len(quantifiable)} métricas")
            return True
    
    def calculate_final_score(self) -> float:
        """Calcula score final basado en criterios cumplidos."""
        total_criteria = 6
        passed_criteria = 0
        
        # Contar criterios cumplidos
        if self.validate_ai_first_principles():
            passed_criteria += 1
        
        if self.validate_stack_integration():
            passed_criteria += 1
        
        if self.validate_multi_tenant_support():
            passed_criteria += 1
        
        if self.validate_scalability():
            passed_criteria += 1
        
        if self.validate_roadmap():
            passed_criteria += 1
        
        if self.validate_benefits():
            passed_criteria += 1
        
        return (passed_criteria / total_criteria) * 10
    
    def validate(self) -> Dict[str, Any]:
        """Ejecuta validación completa."""
        print(f"🔍 Validando arquitectura AI First: {self.architecture_file}")
        
        # Cargar arquitectura
        if not self.load_architecture():
            return self.validation_results
        
        # Validar criterios
        if not self.validate_ai_first_principles():
            self.validation_results["passed"] = False
        
        if not self.validate_stack_integration():
            self.validation_results["passed"] = False
        
        if not self.validate_multi_tenant_support():
            self.validation_results["passed"] = False
        
        if not self.validate_scalability():
            self.validation_results["passed"] = False
        
        if not self.validate_roadmap():
            self.validation_results["passed"] = False
        
        if not self.validate_benefits():
            self.validation_results["passed"] = False
        
        # Calcular score final
        final_score = self.calculate_final_score()
        self.validation_results["final_validation_score"] = final_score
        
        return self.validation_results
    
    def generate_report(self) -> str:
        """Genera reporte de validación."""
        report = f"""
# Reporte de Validación - Arquitectura AI First CRM
**Fecha**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Archivo**: {self.architecture_file}

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
## 📋 Resumen de Arquitectura

### Componentes AI: {len(self.architecture_data.get('ai_components', []))}
### Integraciones: {len(self.architecture_data.get('integrations', []))}
### Fases del Roadmap: {len(self.architecture_data.get('roadmap', []))}
### Beneficios Cuantificables: {len(self.architecture_data.get('benefits', {}).get('quantifiable', []))}

## 🎯 Decisión Final

"""
        
        if self.validation_results['passed']:
            report += "**✅ ARQUITECTURA APROBADA**\n\n"
            report += "La propuesta de arquitectura AI First CRM cumple con todos los criterios de validación.\n\n"
            report += "**Próximos pasos:**\n"
            report += "1. Revisar y aprobar con el equipo de arquitectura\n"
            report += "2. Iniciar implementación según roadmap\n"
            report += "3. Configurar métricas y monitoreo\n"
            report += "4. Comenzar desarrollo iterativo\n"
        else:
            report += "**❌ ARQUITECTURA RECHAZADA**\n\n"
            report += "La propuesta no cumple con los criterios obligatorios. Se requiere revisión.\n\n"
            report += "**Acciones requeridas:**\n"
            for error in self.validation_results.get('errors', []):
                report += f"- {error}\n"
        
        return report

def main():
    """Función principal del script."""
    architecture_file = "docs/architecture/AI_FIRST_CRM_ARCHITECTURE_PROPOSAL.md"
    
    if not os.path.exists(architecture_file):
        print(f"❌ Archivo de arquitectura no encontrado: {architecture_file}")
        return
    
    # Crear validador
    validator = AIFirstArchitectureValidator(architecture_file)
    
    # Ejecutar validación
    results = validator.validate()
    
    # Generar reporte
    report = validator.generate_report()
    
    # Guardar reporte
    report_file = f"reports/ai-first-architecture-validation-{datetime.now().strftime('%Y%m%d-%H%M%S')}.md"
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