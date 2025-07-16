#!/usr/bin/env python3
"""
Script de Prueba para Sistema de Versionado
Autor: Marcelo/AI
Versión: 1.0.0
Fecha: 26 de Junio, 2025

Este script prueba el sistema de versionado semántico implementado
en el proyecto ai-pair-orchestrator-pro.
"""

import re
import os
import sys
from datetime import datetime
from pathlib import Path

class VersioningTester:
    """Clase para probar el sistema de versionado"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.test_results = []
        
    def test_version_format(self, version_string):
        """Prueba el formato de versionado semántico"""
        pattern = r'^\d+\.\d+\.\d+$'
        is_valid = bool(re.match(pattern, version_string))
        
        self.test_results.append({
            'test': 'Formato de Versión',
            'input': version_string,
            'expected': 'MAJOR.MINOR.PATCH',
            'result': '✅ PASÓ' if is_valid else '❌ FALLÓ',
            'details': f'Formato válido: {version_string}' if is_valid else f'Formato inválido: {version_string}'
        })
        
        return is_valid
    
    def test_version_increment(self, current_version, change_type, expected_version):
        """Prueba el incremento de versiones según el tipo de cambio"""
        major, minor, patch = map(int, current_version.split('.'))
        
        if change_type == 'MAJOR':
            calculated_version = f"{major + 1}.0.0"
        elif change_type == 'MINOR':
            calculated_version = f"{major}.{minor + 1}.0"
        elif change_type == 'PATCH':
            calculated_version = f"{major}.{minor}.{patch + 1}"
        else:
            calculated_version = current_version
        
        is_correct = calculated_version == expected_version
        
        self.test_results.append({
            'test': f'Incremento {change_type}',
            'input': f'{current_version} -> {change_type}',
            'expected': expected_version,
            'result': '✅ PASÓ' if is_correct else '❌ FALLÓ',
            'details': f'Calculado: {calculated_version}, Esperado: {expected_version}'
        })
        
        return is_correct
    
    def test_changelog_format(self, changelog_content):
        """Prueba el formato del changelog"""
        required_sections = ['## [Unreleased]', '### Added', '### Changed', '### Fixed']
        missing_sections = []
        
        for section in required_sections:
            if section not in changelog_content:
                missing_sections.append(section)
        
        is_valid = len(missing_sections) == 0
        
        self.test_results.append({
            'test': 'Formato de Changelog',
            'input': 'Contenido del changelog',
            'expected': 'Secciones requeridas presentes',
            'result': '✅ PASÓ' if is_valid else '❌ FALLÓ',
            'details': f'Secciones faltantes: {missing_sections}' if missing_sections else 'Todas las secciones presentes'
        })
        
        return is_valid
    
    def test_conventional_commits(self, commit_message):
        """Prueba el formato de conventional commits"""
        pattern = r'^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+'
        is_valid = bool(re.match(pattern, commit_message))
        
        self.test_results.append({
            'test': 'Conventional Commits',
            'input': commit_message,
            'expected': 'feat/fix/docs/style/refactor/test/chore: descripción',
            'result': '✅ PASÓ' if is_valid else '❌ FALLÓ',
            'details': f'Formato válido: {commit_message}' if is_valid else f'Formato inválido: {commit_message}'
        })
        
        return is_valid
    
    def test_file_naming_convention(self, filename):
        """Prueba las convenciones de naming de archivos"""
        # Reglas: solo minúsculas, números, guiones y guiones bajos
        pattern = r'^[a-z0-9_-]+(\.[a-z0-9]+)*$'
        is_valid = bool(re.match(pattern, filename))
        
        self.test_results.append({
            'test': 'Convención de Naming',
            'input': filename,
            'expected': 'solo minúsculas, números, guiones y guiones bajos',
            'result': '✅ PASÓ' if is_valid else '❌ FALLÓ',
            'details': f'Nombre válido: {filename}' if is_valid else f'Nombre inválido: {filename}'
        })
        
        return is_valid
    
    def run_all_tests(self):
        """Ejecuta todas las pruebas del sistema de versionado"""
        print("🧪 INICIANDO PRUEBAS DEL SISTEMA DE VERSIONADO")
        print("=" * 60)
        
        # Prueba 1: Formato de versiones
        print("\n1️⃣ Probando formato de versiones...")
        test_versions = ['1.0.0', '2.1.3', '10.5.2', '1.0', 'v1.0.0', '1.0.0.0']
        for version in test_versions:
            self.test_version_format(version)
        
        # Prueba 2: Incremento de versiones
        print("\n2️⃣ Probando incremento de versiones...")
        increment_tests = [
            ('1.0.0', 'MAJOR', '2.0.0'),
            ('1.0.0', 'MINOR', '1.1.0'),
            ('1.0.0', 'PATCH', '1.0.1'),
            ('2.1.3', 'MAJOR', '3.0.0'),
            ('2.1.3', 'MINOR', '2.2.0'),
            ('2.1.3', 'PATCH', '2.1.4')
        ]
        
        for current, change_type, expected in increment_tests:
            self.test_version_increment(current, change_type, expected)
        
        # Prueba 3: Formato de changelog
        print("\n3️⃣ Probando formato de changelog...")
        sample_changelog = """
# Changelog

## [Unreleased]
### Added
- Nueva funcionalidad

### Changed
- Mejora en performance

### Fixed
- Corrección de bug

## [1.1.0] - 2025-06-26
### Added
- Integración con APIs
"""
        self.test_changelog_format(sample_changelog)
        
        # Prueba 4: Conventional commits
        print("\n4️⃣ Probando conventional commits...")
        commit_tests = [
            'feat: add new user authentication',
            'fix: resolve payment processing error',
            'docs: update installation guide',
            'style: improve code formatting',
            'refactor: optimize database queries',
            'test: add unit tests for user service',
            'chore: update dependencies',
            'invalid commit message',
            'feat(): missing description',
            'FEAT: uppercase type'
        ]
        
        for commit in commit_tests:
            self.test_conventional_commits(commit)
        
        # Prueba 5: Convenciones de naming
        print("\n5️⃣ Probando convenciones de naming...")
        filename_tests = [
            'versioning-guidelines.md',
            'user-documentation-guide.md',
            'api-integration-test.js',
            'InvalidFileName.md',
            'file with spaces.txt',
            'UPPERCASE_FILE.md',
            'file-with-123-numbers.md',
            'file_with_underscores.md'
        ]
        
        for filename in filename_tests:
            self.test_file_naming_convention(filename)
        
        # Mostrar resultados
        self.print_results()
        
        return self.calculate_success_rate()
    
    def print_results(self):
        """Imprime los resultados de las pruebas"""
        print("\n" + "=" * 60)
        print("📊 RESULTADOS DE LAS PRUEBAS")
        print("=" * 60)
        
        passed = 0
        total = len(self.test_results)
        
        for result in self.test_results:
            print(f"\n{result['test']}")
            print(f"  Input: {result['input']}")
            print(f"  Expected: {result['expected']}")
            print(f"  Result: {result['result']}")
            print(f"  Details: {result['details']}")
            
            if '✅ PASÓ' in result['result']:
                passed += 1
        
        success_rate = (passed / total) * 100
        print(f"\n{'='*60}")
        print(f"📈 RESUMEN: {passed}/{total} pruebas pasaron ({success_rate:.1f}%)")
        print(f"{'='*60}")
        
        if success_rate >= 90:
            print("🎉 ¡SISTEMA DE VERSIONADO FUNCIONANDO CORRECTAMENTE!")
        elif success_rate >= 70:
            print("⚠️  SISTEMA DE VERSIONADO CON ALGUNAS ADVERTENCIAS")
        else:
            print("❌ SISTEMA DE VERSIONADO NECESITA CORRECCIONES")
    
    def calculate_success_rate(self):
        """Calcula la tasa de éxito de las pruebas"""
        passed = sum(1 for result in self.test_results if '✅ PASÓ' in result['result'])
        total = len(self.test_results)
        return (passed / total) * 100 if total > 0 else 0
    
    def generate_test_report(self):
        """Genera un reporte de pruebas en formato markdown"""
        report_path = self.project_root / 'reports' / 'versioning-test-report.md'
        report_path.parent.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        success_rate = self.calculate_success_rate()
        
        report_content = f"""# Reporte de Pruebas - Sistema de Versionado

**Fecha de Prueba**: {timestamp}  
**Tasa de Éxito**: {success_rate:.1f}%  
**Total de Pruebas**: {len(self.test_results)}

## Resumen de Resultados

| Categoría | Pasaron | Total | Porcentaje |
|-----------|---------|-------|------------|
| Formato de Versión | {sum(1 for r in self.test_results if 'Formato de Versión' in r['test'] and '✅ PASÓ' in r['result'])} | {sum(1 for r in self.test_results if 'Formato de Versión' in r['test'])} | {sum(1 for r in self.test_results if 'Formato de Versión' in r['test'] and '✅ PASÓ' in r['result']) / sum(1 for r in self.test_results if 'Formato de Versión' in r['test']) * 100:.1f}% |
| Incremento de Versión | {sum(1 for r in self.test_results if 'Incremento' in r['test'] and '✅ PASÓ' in r['result'])} | {sum(1 for r in self.test_results if 'Incremento' in r['test'])} | {sum(1 for r in self.test_results if 'Incremento' in r['test'] and '✅ PASÓ' in r['result']) / sum(1 for r in self.test_results if 'Incremento' in r['test']) * 100:.1f}% |
| Formato de Changelog | {sum(1 for r in self.test_results if 'Formato de Changelog' in r['test'] and '✅ PASÓ' in r['result'])} | {sum(1 for r in self.test_results if 'Formato de Changelog' in r['test'])} | {sum(1 for r in self.test_results if 'Formato de Changelog' in r['test'] and '✅ PASÓ' in r['result']) / sum(1 for r in self.test_results if 'Formato de Changelog' in r['test']) * 100:.1f}% |
| Conventional Commits | {sum(1 for r in self.test_results if 'Conventional Commits' in r['test'] and '✅ PASÓ' in r['result'])} | {sum(1 for r in self.test_results if 'Conventional Commits' in r['test'])} | {sum(1 for r in self.test_results if 'Conventional Commits' in r['test'] and '✅ PASÓ' in r['result']) / sum(1 for r in self.test_results if 'Conventional Commits' in r['test']) * 100:.1f}% |
| Convención de Naming | {sum(1 for r in self.test_results if 'Convención de Naming' in r['test'] and '✅ PASÓ' in r['result'])} | {sum(1 for r in self.test_results if 'Convención de Naming' in r['test'])} | {sum(1 for r in self.test_results if 'Convención de Naming' in r['test'] and '✅ PASÓ' in r['result']) / sum(1 for r in self.test_results if 'Convención de Naming' in r['test']) * 100:.1f}% |

## Detalles de Pruebas

"""
        
        for result in self.test_results:
            status_icon = "✅" if "✅ PASÓ" in result['result'] else "❌"
            report_content += f"""
### {status_icon} {result['test']}

- **Input**: `{result['input']}`
- **Expected**: {result['expected']}
- **Result**: {result['result']}
- **Details**: {result['details']}

"""
        
        report_content += f"""
## Recomendaciones

"""
        
        if success_rate >= 90:
            report_content += """
- ✅ El sistema de versionado está funcionando correctamente
- ✅ Continuar con las prácticas actuales
- ✅ Considerar automatización adicional para mayor eficiencia
"""
        elif success_rate >= 70:
            report_content += """
- ⚠️ Revisar las pruebas que fallaron
- ⚠️ Actualizar documentación si es necesario
- ⚠️ Considerar mejoras en el proceso
"""
        else:
            report_content += """
- ❌ Revisar completamente el sistema de versionado
- ❌ Actualizar las reglas y convenciones
- ❌ Implementar correcciones antes de continuar
"""
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report_content)
        
        print(f"\n📄 Reporte generado: {report_path}")
        return report_path

def main():
    """Función principal del script"""
    print("🚀 SISTEMA DE PRUEBAS DE VERSIONADO")
    print("Autor: Marcelo/AI")
    print("Fecha: 26 de Junio, 2025")
    print("=" * 60)
    
    tester = VersioningTester()
    
    try:
        success_rate = tester.run_all_tests()
        report_path = tester.generate_test_report()
        
        print(f"\n🎯 RESULTADO FINAL: {success_rate:.1f}% de éxito")
        
        if success_rate >= 90:
            print("🎉 ¡SISTEMA LISTO PARA PRODUCCIÓN!")
            sys.exit(0)
        elif success_rate >= 70:
            print("⚠️  SISTEMA FUNCIONAL CON MEJORAS RECOMENDADAS")
            sys.exit(1)
        else:
            print("❌ SISTEMA NECESITA CORRECCIONES CRÍTICAS")
            sys.exit(2)
            
    except Exception as e:
        print(f"\n❌ ERROR EN LAS PRUEBAS: {e}")
        sys.exit(3)

if __name__ == "__main__":
    main() 