# 🚦 Integración de Validación Metodológica en CI/CD

## ¿Qué es CI/CD?
**CI/CD** (Integración Continua y Entrega/Despliegue Continuo) es una práctica DevOps que automatiza la construcción, validación, pruebas y despliegue de software en cada cambio del código.

---

## 🎯 Casos de Uso para este Proyecto
- **Validación automática de cumplimiento metodológico** (VTK 1.0, CMMI) en cada push o pull request.
- **Evaluación de la colaboración humano-IA** mediante indicadores VibeThink (no como metodología).
- **Evidencia automática para auditoría**: cada ejecución genera un reporte trazable.
- **Prevención de errores metodológicos**: bloquea merges si la alineación baja de cierto umbral.
- **Automatización de generación de evidencias y métricas**.
- **Despliegue seguro**: solo se despliega si la validación es exitosa.
- **Onboarding rápido**: nuevos miembros pueden validar su trabajo automáticamente.
- **Mejora continua**: permite identificar y corregir gaps de cumplimiento de forma proactiva.

---

## 🏛️ Metodologías validadas (Vigentes)
- **VTK 1.0 (VibeThink Knowledge)**
- **CMMI v3 (Capability Maturity Model Integration)**

## 🤖 Paradigma de Colaboración Evaluado
- **VibeThink (Human-AI Pairing):**
  - Se evalúa como **paradigma de colaboración humano-IA**.
  - Sus métricas reflejan el nivel de integración, eficiencia y trazabilidad, pero **no se considera una metodología ni parte del score de cumplimiento**.

---

## 🚦 ¿Qué se valida y reporta?
- **Score de cumplimiento:** Solo VTK 1.0 y CMMI.
- **Indicadores de colaboración:** Métricas de handoff, balance humano-IA, eficiencia, etc. (VibeThink).

---

## 📊 Ejemplo de reporte

```yaml
cumplimiento_metodologico:
  vtk10: "9/9"
  cmmi: "9/9"
  score_total: "18/18"
  nivel: "EXCELENTE"

indicadores_colaboracion_VibeThink:
  handoff_efficiency: 4.5 # minutos
  balance_humano_ia: 60/40
  productividad_mejorada: 55%
```

---

## 🛠️ ¿Qué pasa si falla el pipeline o se cae la conexión?
- **Fallo de validación (score bajo):**
  - El pipeline se detiene y marca el build como fallido.
  - Nadie puede mergear cambios hasta corregir los gaps.
  - El reporte indica exactamente qué falta o está mal.
- **Fallo de infraestructura (conexión, runner, GitHub caído):**
  - El pipeline se reintenta automáticamente (según configuración de la plataforma).
  - Los cambios no se pierden; simplemente el build queda en estado "fallido" o "pendiente".
  - Puedes re-lanzar el pipeline manualmente cuando se restablezca la conexión.
  - **No afecta el código fuente ni la historia del repositorio.**
- **Buenas prácticas ante caídas:**
  - Habilita notificaciones para saber cuándo un build falla por causas externas.
  - Documenta en el README cómo reintentar builds y qué hacer ante fallos de infraestructura.
  - Mantén los scripts idempotentes (pueden ejecutarse varias veces sin efectos adversos).

---

## 📋 Ejemplo de Workflow (GitHub Actions)

```yaml
name: Validación Metodológica

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  validate-methodology:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout código
        uses: actions/checkout@v3

      - name: Instalar Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Ejecutar validación metodológica
        run: python scripts/validate-methodology-alignment.py

      - name: Subir reporte como artefacto
        uses: actions/upload-artifact@v3
        with:
          name: validation-report
          path: validation-report.json
```

---

## 📈 Mejores Prácticas
- **Mantén el script de validación actualizado** según evolucione la metodología.
- **Incluye la validación en todos los entornos** (dev, staging, prod si aplica).
- **Documenta el proceso en el README y la wiki**.
- **Automatiza la generación de evidencias y métricas**.
- **Revisa los reportes periódicamente** y comparte hallazgos con el equipo.
- **Integra notificaciones** (Slack, email) para builds fallidos.
- **Haz que el pipeline sea obligatorio** para merges a ramas protegidas.

---

## ❓ FAQs por Categoría

### Metodologías (VTK 1.0, CMMI)
- **¿Qué se valida como cumplimiento metodológico?**
  - Solo VTK 1.0 y CMMI. Se revisan prácticas, evidencias, roles y procesos.
- **¿Puedo personalizar los umbrales de score?**
  - Sí, ajusta el script según tus necesidades.

### Paradigma de Colaboración (VibeThink)
- **¿VibeThink es una metodología?**
  - No, es un paradigma de colaboración humano-IA. Sus métricas son indicadores, no requisitos de compliance.
- **¿Por qué medir VibeThink?**
  - Para mejorar la eficiencia, trazabilidad y balance humano-IA, pero no como criterio de aprobación.

### CI/CD y Automatización
- **¿Qué pasa si el pipeline falla por score bajo?**
  - El merge se bloquea hasta corregir los gaps metodológicos.
- **¿Qué ocurre si GitHub Actions o la conexión fallan?**
  - El pipeline puede reintentarse y no afecta el código fuente.
- **¿Puedo ejecutar la validación manualmente?**
  - Sí, con `python scripts/validate-methodology-alignment.py`.

### Troubleshooting
- **El pipeline falla pero el código está bien, ¿qué hago?**
  - Revisa el reporte generado, corrige los gaps o reintenta el build si fue un fallo de infraestructura.
- **¿Cómo agrego nuevas áreas o métricas?**
  - Edita el script y la estructura de carpetas según las nuevas necesidades.

---

## 📚 Recursos y Referencias
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CI/CD Best Practices](https://www.atlassian.com/continuous-delivery/ci-vs-ci-vs-cd)
- [DevOps y Auditoría Continua](https://martinfowler.com/bliki/ContinuousDelivery.html)

---

*Documentación generada automáticamente para AI Pair Orchestrator Pro - Junio 2025* 