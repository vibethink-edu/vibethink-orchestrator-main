# Datos de Prueba Globales (Fixtures)

## Propósito

Esta carpeta contiene datos de prueba reutilizables por todo el monorepo (usuarios dummy, configuraciones base, seeds para E2E, etc.).

---

## Formato y organización

- Los datos pueden estar en JSON, YAML, CSV u otros formatos legibles.
- Cada archivo debe tener un nombre descriptivo (ej: `users.json`, `companies.yaml`).
- Documenta el propósito de cada archivo en este README o en comentarios dentro del archivo.

---

## Reglas clave

1. **No incluir datos reales ni sensibles.**
2. **Mantener los datos simples, representativos y seguros.**
3. **Versionar los cambios para trazabilidad y auditoría.**
4. **Actualizar este README ante cambios relevantes.**

---

## Ejemplo de uso

```js
// Ejemplo de importación en un test
const users = require('../fixtures/users.json');
```

---

> ⚠️ **Advertencia:** Los archivos de ejemplo (como `example-users.json`) son solo referencia de formato y estructura. No los uses como datos reales en tus pruebas. Crea tus propios fixtures según las necesidades de cada test o módulo.

---

## Referencias
- [Guía de datos de prueba y scripts de testing](../README.md) 