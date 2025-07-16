#!/usr/bin/env python3
"""
Script de Validación del Sistema de Límites y Salvaguardas de Etiqueta
Etiquette Limits & Safeguards Validation Script

Autor: Eulalia (EU-IA)
Fecha: 26/06/2025
Versión: 1.0
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict

@dataclass
class ValidationResult:
    """Resultado de validación"""
    success: bool
    score: float
    violations: List[str]
    corrections: List[str]
    recommendations: List[str]

@dataclass
class TestCase:
    """Caso de prueba para validación"""
    name: str
    input_message: str
    expected_formality: str
    expected_temperature: str
    expected_violations: List[str]
    company_type: str
    industry: str

class EtiquetteSafeguardsValidator:
    """Validador del sistema de límites y salvaguardas"""
    
    def __init__(self):
        self.limits = {
            'startup': {
                'formality': {'min': 'semi-formal', 'max': 'friendly'},
                'temperature': {'min': 'neutral', 'max': 'warm'},
                'emojis': {'max': 2},
                'exclamations': {'max': 1}
            },
            'sme': {
                'formality': {'min': 'semi-formal', 'max': 'professional'},
                'temperature': {'min': 'neutral', 'max': 'warm'},
                'emojis': {'max': 1},
                'exclamations': {'max': 1}
            },
            'enterprise': {
                'formality': {'min': 'formal', 'max': 'professional'},
                'temperature': {'min': 'neutral', 'max': 'warm'},
                'emojis': {'max': 0},
                'exclamations': {'max': 0}
            }
        }
        
        self.forbidden_words = [
            'amor', 'cariño', 'bebé', 'hermosa', 'hermoso', 'guapo', 'guapa',
            'te extraño', 'te quiero', 'mi vida', 'mi amor', 'corazón',
            'súper', 'genial', 'increíble', 'fantástico', 'maravilloso'
        ]
        
        self.inappropriate_topics = [
            'vida personal', 'relaciones', 'sentimientos', 'emociones',
            'familia', 'amigos', 'vacaciones personales', 'hobbies'
        ]
    
    def validate_message(self, message: str, company_type: str, industry: str) -> ValidationResult:
        """Validar mensaje contra límites y salvaguardas"""
        violations = []
        corrections = []
        recommendations = []
        
        # 1. Validar formalidad
        formality_violations = self._check_formality(message, company_type)
        violations.extend(formality_violations)
        
        # 2. Validar temperatura
        temperature_violations = self._check_temperature(message)
        violations.extend(temperature_violations)
        
        # 3. Validar contenido
        content_violations = self._check_content(message, company_type)
        violations.extend(content_violations)
        
        # 4. Validar emojis
        emoji_violations = self._check_emojis(message, company_type)
        violations.extend(emoji_violations)
        
        # 5. Validar signos de exclamación
        exclamation_violations = self._check_exclamations(message, company_type)
        violations.extend(exclamation_violations)
        
        # 6. Validar palabras prohibidas
        forbidden_violations = self._check_forbidden_words(message)
        violations.extend(forbidden_violations)
        
        # 7. Validar temas inapropiados
        topic_violations = self._check_inappropriate_topics(message)
        violations.extend(topic_violations)
        
        # Generar correcciones
        if violations:
            corrections = self._generate_corrections(violations, company_type)
            recommendations = self._generate_recommendations(violations, company_type)
        
        # Calcular score
        score = self._calculate_score(violations)
        
        return ValidationResult(
            success=len(violations) == 0,
            score=score,
            violations=violations,
            corrections=corrections,
            recommendations=recommendations
        )
    
    def _check_formality(self, message: str, company_type: str) -> List[str]:
        """Verificar límites de formalidad"""
        violations = []
        
        # Detectar informalidad excesiva
        informal_indicators = [
            'hey', 'hola', 'qué tal', 'cómo va', 'qué onda',
            'genial', 'súper', 'increíble', 'fantástico'
        ]
        
        informal_count = sum(1 for indicator in informal_indicators 
                           if indicator.lower() in message.lower())
        
        if company_type == 'enterprise' and informal_count > 1:
            violations.append('Demasiado informal para empresa enterprise')
        elif company_type == 'sme' and informal_count > 2:
            violations.append('Demasiado informal para empresa SME')
        
        return violations
    
    def _check_temperature(self, message: str) -> List[str]:
        """Verificar límites de temperatura"""
        violations = []
        
        # Detectar temperatura demasiado alta
        hot_indicators = [
            '😍', '💕', '🥰', '😘', '❤️', '💖', '💝',
            'te extraño', 'te quiero', 'mi amor', 'corazón'
        ]
        
        hot_count = sum(1 for indicator in hot_indicators 
                       if indicator in message)
        
        if hot_count > 0:
            violations.append('Temperatura demasiado alta - contenido inapropiado')
        
        return violations
    
    def _check_content(self, message: str, company_type: str) -> List[str]:
        """Verificar contenido general"""
        violations = []
        
        # Verificar longitud
        if len(message) > 500:
            violations.append('Mensaje demasiado largo')
        
        # Verificar mayúsculas excesivas
        uppercase_ratio = sum(1 for c in message if c.isupper()) / len(message)
        if uppercase_ratio > 0.3:
            violations.append('Demasiadas mayúsculas')
        
        return violations
    
    def _check_emojis(self, message: str, company_type: str) -> List[str]:
        """Verificar límites de emojis"""
        violations = []
        
        # Lista de emojis específicos a detectar
        emoji_list = ['😊', '😍', '💕', '🥰', '😘', '❤️', '💖', '💝', '🎉', '👍', '👎', '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠']
        
        emoji_count = sum(1 for emoji in emoji_list if emoji in message)
        
        max_emojis = self.limits[company_type]['emojis']['max']
        
        if emoji_count > max_emojis:
            violations.append(f'Demasiados emojis ({emoji_count}) - máximo {max_emojis} permitidos')
        
        return violations
    
    def _check_exclamations(self, message: str, company_type: str) -> List[str]:
        """Verificar límites de signos de exclamación"""
        violations = []
        
        exclamation_count = message.count('!')
        max_exclamations = self.limits[company_type]['exclamations']['max']
        
        if exclamation_count > max_exclamations:
            violations.append(f'Demasiados signos de exclamación ({exclamation_count}) - máximo {max_exclamations} permitidos')
        
        return violations
    
    def _check_forbidden_words(self, message: str) -> List[str]:
        """Verificar palabras prohibidas"""
        violations = []
        
        message_lower = message.lower()
        found_forbidden = [word for word in self.forbidden_words 
                          if word.lower() in message_lower]
        
        if found_forbidden:
            violations.append(f'Palabras prohibidas encontradas: {", ".join(found_forbidden)}')
        
        return violations
    
    def _check_inappropriate_topics(self, message: str) -> List[str]:
        """Verificar temas inapropiados"""
        violations = []
        
        message_lower = message.lower()
        found_topics = [topic for topic in self.inappropriate_topics 
                       if topic.lower() in message_lower]
        
        if found_topics:
            violations.append(f'Temas inapropiados detectados: {", ".join(found_topics)}')
        
        return violations
    
    def _generate_corrections(self, violations: List[str], company_type: str) -> List[str]:
        """Generar correcciones automáticas"""
        corrections = []
        
        for violation in violations:
            if 'Demasiado informal' in violation:
                corrections.append('Ajustar formalidad a nivel profesional')
            elif 'Temperatura demasiado alta' in violation:
                corrections.append('Reducir emotividad y mantener tono neutral')
            elif 'Demasiados emojis' in violation:
                corrections.append(f'Reducir emojis a máximo {self.limits[company_type]["emojis"]["max"]}')
            elif 'Demasiados signos de exclamación' in violation:
                corrections.append(f'Reducir signos de exclamación a máximo {self.limits[company_type]["exclamations"]["max"]}')
            elif 'Palabras prohibidas' in violation:
                corrections.append('Eliminar palabras inapropiadas')
            elif 'Temas inapropiados' in violation:
                corrections.append('Mantener enfoque en temas profesionales')
        
        return corrections
    
    def _generate_recommendations(self, violations: List[str], company_type: str) -> List[str]:
        """Generar recomendaciones"""
        recommendations = []
        
        if any('informal' in v for v in violations):
            recommendations.append(f'Usar tono {self.limits[company_type]["formality"]["min"]} para {company_type}')
        
        if any('emojis' in v for v in violations):
            recommendations.append('Limitar uso de emojis en comunicaciones profesionales')
        
        if any('exclamación' in v for v in violations):
            recommendations.append('Usar puntuación estándar en lugar de múltiples signos de exclamación')
        
        if any('prohibidas' in v for v in violations):
            recommendations.append('Mantener vocabulario profesional y apropiado')
        
        return recommendations
    
    def _calculate_score(self, violations: List[str]) -> float:
        """Calcular score de apropiación"""
        base_score = 100.0
        
        # Penalizar por cada tipo de violación
        penalty_per_violation = 15.0
        
        total_penalty = len(violations) * penalty_per_violation
        
        return max(0.0, base_score - total_penalty)

def run_validation_tests():
    """Ejecutar pruebas de validación"""
    validator = EtiquetteSafeguardsValidator()
    
    # Casos de prueba
    test_cases = [
        TestCase(
            name="Demasiado amigable para enterprise",
            input_message="¡Hola Juan! ¿Cómo va todo? ¡Me encantaría que revisemos la propuesta juntos! ¡Sería súper genial!",
            expected_formality="formal",
            expected_temperature="neutral",
            expected_violations=["Demasiado informal", "Demasiados signos de exclamación"],
            company_type="enterprise",
            industry="technology"
        ),
        TestCase(
            name="Contenido inapropiado",
            input_message="¡Hola! Te extraño mucho, ¿cuándo nos vemos? ¡Eres lo máximo!",
            expected_formality="semi-formal",
            expected_temperature="neutral",
            expected_violations=["Temperatura demasiado alta", "Palabras prohibidas", "Temas inapropiados"],
            company_type="startup",
            industry="technology"
        ),
        TestCase(
            name="Mensaje apropiado para SME",
            input_message="Hola María, ¿podríamos agendar una reunión para revisar la propuesta comercial?",
            expected_formality="semi-formal",
            expected_temperature="neutral",
            expected_violations=[],
            company_type="sme",
            industry="finance"
        ),
        TestCase(
            name="Enterprise formal apropiado",
            input_message="Estimado señor García, le agradezco su interés en nuestra propuesta. ¿Podríamos coordinar una reunión para discutir los detalles?",
            expected_formality="formal",
            expected_temperature="neutral",
            expected_violations=[],
            company_type="enterprise",
            industry="finance"
        )
    ]
    
    results = []
    
    print("🔍 **VALIDACIÓN DEL SISTEMA DE LÍMITES Y SALVAGUARDAS**")
    print("=" * 60)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📋 **Caso de Prueba {i}: {test_case.name}**")
        print(f"   Empresa: {test_case.company_type.upper()}")
        print(f"   Industria: {test_case.industry}")
        print(f"   Mensaje: {test_case.input_message}")
        
        # Validar
        result = validator.validate_message(
            test_case.input_message,
            test_case.company_type,
            test_case.industry
        )
        
        # Mostrar resultados
        print(f"\n   ✅ **Resultado:** {'APROBADO' if result.success else 'RECHAZADO'}")
        print(f"   📊 **Score:** {result.score:.1f}/100")
        
        if result.violations:
            print(f"   ❌ **Violaciones detectadas:**")
            for violation in result.violations:
                print(f"      - {violation}")
        
        if result.corrections:
            print(f"   🔧 **Correcciones sugeridas:**")
            for correction in result.corrections:
                print(f"      - {correction}")
        
        if result.recommendations:
            print(f"   💡 **Recomendaciones:**")
            for recommendation in result.recommendations:
                print(f"      - {recommendation}")
        
        results.append({
            'test_case': test_case.name,
            'company_type': test_case.company_type,
            'success': result.success,
            'score': result.score,
            'violations_count': len(result.violations),
            'corrections_count': len(result.corrections)
        })
    
    # Resumen final
    print("\n" + "=" * 60)
    print("📊 **RESUMEN DE VALIDACIÓN**")
    print("=" * 60)
    
    total_tests = len(results)
    passed_tests = sum(1 for r in results if r['success'])
    average_score = sum(r['score'] for r in results) / total_tests
    
    print(f"   Total de pruebas: {total_tests}")
    print(f"   Pruebas aprobadas: {passed_tests}")
    print(f"   Pruebas rechazadas: {total_tests - passed_tests}")
    print(f"   Score promedio: {average_score:.1f}/100")
    print(f"   Tasa de éxito: {(passed_tests/total_tests)*100:.1f}%")
    
    # Validación del sistema
    system_validation = {
        'timestamp': datetime.now().isoformat(),
        'validator': 'EtiquetteSafeguardsValidator',
        'version': '1.0',
        'total_tests': total_tests,
        'passed_tests': passed_tests,
        'failed_tests': total_tests - passed_tests,
        'success_rate': (passed_tests/total_tests)*100,
        'average_score': average_score,
        'system_status': 'VALIDATED' if passed_tests >= total_tests * 0.8 else 'NEEDS_IMPROVEMENT',
        'results': results
    }
    
    # Guardar resultados
    with open('reports/etiquette-safeguards-validation.json', 'w', encoding='utf-8') as f:
        json.dump(system_validation, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 **Resultados guardados en:** reports/etiquette-safeguards-validation.json")
    
    # Conclusión
    if system_validation['system_status'] == 'VALIDATED':
        print("\n✅ **SISTEMA VALIDADO EXITOSAMENTE**")
        print("   El sistema de límites y salvaguardas funciona correctamente.")
        print("   Las protecciones están activas y funcionando.")
    else:
        print("\n⚠️ **SISTEMA REQUIERE MEJORAS**")
        print("   Se detectaron problemas que requieren atención.")
        print("   Revisar violaciones y ajustar límites si es necesario.")
    
    return system_validation

if __name__ == "__main__":
    try:
        result = run_validation_tests()
        exit(0 if result['system_status'] == 'VALIDATED' else 1)
    except Exception as e:
        print(f"❌ **Error en validación:** {str(e)}")
        exit(1) 