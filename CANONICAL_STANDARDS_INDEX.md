# 📚 Índice Canónico de Estándares — VibeThink Orchestrator

## 1) Stack aprobado (versiones exactas)
- Next.js: 15.3.4
- React / ReactDOM: 18.3.1
- TypeScript: 5.9.2
- TailwindCSS: 4.1.11
- ESLint: >= 8.57 (alineado con eslint-config-next 15.3.x)
- Radix UI: usar paquetes requeridos por los componentes compartidos
- recharts: 3.1.2

## 2) Gestor de paquetes
- ÚNICO permitido: NPM
- Prohibido: pnpm, yarn, bun
- Lockfiles: mantener solo package-lock.json (eliminar otros)

## 3) Reglas Monorepo
- Dependencias solo en root; apps sin node_modules
- Workspaces: `apps/*` (apps), `src/shared` (código común)
- Alias `@` → `src`
- `next.config.js` siempre dentro de cada app; nunca en root

## 4) Versionado
- Versiones exactas (sin ^, ~, ni "latest")
- No actualizar si funciona; estabilidad > novedad

## 5) Seguridad Multi-tenant
- Filtrar SIEMPRE por `company_id`
- Verificar RLS y permisos por rol antes de acceder a datos

## 6) Flujo de validación (obligatorio)
- Antes de cambios: `npm run validate:quick`, `npm run validate:architecture`
- Después de cambios: `npm run validate:universal`
- Pre-commit: hooks ejecutan validadores universales

## 7) Branding
- VThink = Metodología; VibeThink Orchestrator = Software

## 8) Resolución de conflictos documentales
- Si un documento contradice otro, manda este Índice Canónico
- Luego `.cursorrules` → AI_UNIVERSAL_STANDARDS.md → ARCHITECTURE_PROTECTION_RULES.md → PACKAGE_MANAGER_STANDARD.md

## 9) Qué hacer / Qué no hacer
- Hacer: NPM-only, exact versions, deps en root, alias `@`, validadores
- No hacer: instalar en apps, usar carets/tilde/latest, mezclar gestores, crear artefactos Next en root

---
Este índice es la fuente de verdad para cualquier IA y desarrollador. Si hay dudas, sigue este documento.
