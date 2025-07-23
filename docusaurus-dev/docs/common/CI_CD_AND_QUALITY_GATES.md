# 🚀 Onboarding DevOps: CI/CD & Quality Gates

## 📋 Resumen del Flujo de Validación Automática

Este proyecto implementa un flujo DevOps moderno y automatizado para garantizar calidad, seguridad y trazabilidad, tanto para desarrolladores humanos como para agentes AI.

---

## 1. Pre-commit Hooks (Husky + lint-staged)
- **Fail-fast:** Si falla una validación (lint, type-check, test, audit), el commit se aborta y se muestra el error en consola.
- **Validaciones incluidas:**
  - Linting estricto (ESLint)
  - Validación de tipos (TypeScript)
  - Tests unitarios automáticos (Vitest)
  - Validación de hardcoding multi-tenant
  - Auditoría de seguridad básica (`npm audit`)
- **¿Cómo funciona?**
  - El hook aborta en el primer error.
  - El desarrollador debe corregir antes de poder hacer commit.

---

## 2. Pipeline CI/CD (GitHub Actions)
- **Validaciones automáticas en cada push/pull request:**
  - Lint
  - Type-check
  - Tests unitarios
  - Auditoría de seguridad
  - Validación de hardcoding
- **Ejecución:** Todos los jobs se ejecutan y reportan, aunque uno falle.
- **Notificaciones:**
  - Bloques para Slack y Mattermost documentados y comentados en `.github/workflows/quality-gate.yml`.
  - Mensaje estándar con toda la información relevante para que cualquier humano o AI pueda atender el incidente.
  - Para activar, solo descomenta el bloque y configura el webhook.

---

## 3. Mensaje Estándar de Notificación (Slack/Mattermost)
```
:rotating_light: *Build ${{ job.status }}*
*Repo:* ${{ github.repository }}
*Branch:* ${{ github.ref }}
*Commit:* ${{ github.sha }}
*Autor:* ${{ github.actor }}
*Workflow:* ${{ github.workflow }}
*Job:* ${{ github.job }}
*Duración:* ${{ job.took }}
*Mensaje:* Revisa los logs y corrige los errores reportados. Si eres AI, consulta la documentación de CI/CD y los criterios de aceptación.
```
- **Referencia:** Ver `.github/workflows/quality-gate.yml` para detalles y enlaces a la documentación oficial de cada integración.

---

## 4. Checklist para Nuevos Desarrolladores (Humano o AI)
- [ ] Leer este documento y entender el flujo
- [ ] Validar que los hooks pre-commit funcionan localmente
- [ ] Revisar los jobs de CI/CD en cada PR
- [ ] Consultar los logs de errores y corregir antes de mergear
- [ ] Activar notificaciones si es necesario (ver instrucciones en el workflow)
- [ ] Consultar la documentación de criterios de aceptación y troubleshooting

---

## 5. Troubleshooting y Soporte
- **Errores en pre-commit:** Corrige el error reportado y vuelve a intentar el commit.
- **Errores en CI/CD:** Consulta los logs en GitHub Actions y sigue el mensaje estándar.
- **Notificaciones:** Si necesitas activar Slack/Mattermost, sigue las instrucciones comentadas en el workflow.
- **Soporte:** Si eres AI, consulta la documentación interna. Si eres humano, contacta al responsable DevOps o revisa la wiki.

---

## 6. Referencias
- [Documentación Husky](https://typicode.github.io/husky/#/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [ESLint](https://eslint.org/docs/latest/)
- [Vitest](https://vitest.dev/)
- [Slack Action](https://github.com/8398a7/action-slack)
- [Mattermost Action](https://github.com/mattermost/action-mattermost-notify)

---

> **Este flujo está diseñado para que cualquier desarrollador humano o AI pueda integrarse, mantener y escalar el proyecto con calidad y seguridad desde el primer día.** 