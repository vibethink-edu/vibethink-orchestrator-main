# MANUAL_REQUIRED Strategy (Quarantine Backlog)

**Objective**: Systematically eliminate the 113 files currently quarantined in `docs/ai-coordination/MERGE_MARKERS_MANUAL_REQUIRED_*.txt`.

## 1. Governance Rule
Each file in the quarantine list contains complex merge conflicts (`<<<<<<<`, `=======`, `>>>>>>>`) that **failed mechanical auto-cleaning**. 
- They require **HUMAN** semantic decision making.
- They cannot be fixed by a simple scripts.

## 2. Planning Strategy
We will treat this backlog as planned work, not technical debt chaos.

| Priority | Scope | Rationale |
| :--- | :--- | :--- |
| **P0** | `common.json`, `navigation.json` | Global impact. Breaks app-wide text. |
| **P1** | `auth.json`, `dashboard.json` | High visibility features. |
| **P2** | `settings.json`, specific modules | Lower user traffic. |

## 3. Workflow Per File (1:1 Rule)
To avoid "big bang" PRs that are impossible to review:

1.  **Pick ONE file** from the list.
2.  **Create Branch**: `feat/fix-i18n-<filename>`
3.  **Resolve Manually**:
    - Open file.
    - Search for markers.
    - DECIDE: Keep "Current Change" or "Incoming Change"?
    - Validate semantic correctness (is the sentence complete?).
    - **Best Practice**: Al guardar, ordena las keys alfabéticamente (reduce futuros conflictos).
4.  **Validate**: `JSON.parse` check + `npm run lint:hygiene`.
5.  **Commit**: `fix(i18n): resolve conflicts in <filename>`
6.  **PR**: Link to this strategy doc.

## 4. Definition of Done
- File removed from `MANUAL_REQUIRED` list (update the list!).
- File has valid JSON.
- No markers remaining.
- Changes merged to main.

## 5. Commit & PR
- Use conventional commits: `fix(i18n): resolve conflicts in <filename>`
- PR Title: `fix(i18n): <filename> conflict resolution`
- Link to this strategy doc.

## 6. Cadencia de Saneamiento (Ritual Ligero)
Para garantizar el progreso sin detener el desarrollo:
- **Frecuencia:** Revisión Mensual (o Trimestral).
- **Objetivo:** Abordar un bloque de archivos P1/P2.
- **Regla:** No urgencia. Si no hay ancho de banda, se pospone. Lo crítico (P0) se atiende inmediato.

## Current Quarantine List Location
`docs/ai-coordination/MERGE_MARKERS_MANUAL_REQUIRED_20251231.txt`
