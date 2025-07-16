# Guía de Datos de Prueba y Scripts de Testing

## Propósito

Esta carpeta centraliza los datos de prueba (fixtures), scripts de llenado/vaciado (seed/clean) y las mejores prácticas para pruebas reproducibles, seguras y auditables en el monorepo.

---

## 📦 Estructura recomendada

```plaintext
tests/
├── fixtures/         # Datos de prueba globales (JSON, YAML, CSV, etc.)
├── scripts/          # Seeders y cleaners globales (llenado/vaciado de datos)
├── e2e/              # Pruebas end-to-end
├── unit/             # Pruebas unitarias globales
└── ...
```

- Cada módulo/app puede tener su propio `tests/fixtures/` bajo su carpeta.
- Los scripts de seed/clean deben ser idempotentes y seguros.

---

## 🚦 Buenas prácticas y reglas

1. **Nunca uses datos reales ni sensibles en pruebas.**
2. **Versiona los datos de prueba y scripts.**
3. **Documenta el propósito y formato de cada set de datos en un README dentro de `fixtures/`.**
4. **Automatiza el llenado y vaciado con scripts ejecutables antes/después de los tests.**
5. **Para E2E, separa los datos de test de los de desarrollo.**
6. **Incluye tests que validen el propio proceso de seed/clean.**
7. **Integra el seed/clean en los pipelines de CI/CD.**
8. **No mezcles datos de test con datos de desarrollo.**

---

## 📚 Referencias
- [Estructura general del monorepo](../docs/STRUCTURE_OVERVIEW.md)
- [Log de decisiones](../docs/DECISION_LOG.md) 