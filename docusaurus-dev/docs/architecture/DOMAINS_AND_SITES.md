---
id: domains-and-sites
title: Dominios y Sitios — Website vs Aplicación
sidebar_label: Dominios y Sitios
---

# Website vs Aplicación

## Distinción
- Website (marketing): `apps/website` → `www.vibethink.co`
- Aplicación (SaaS): `apps/*` (dashboard, admin, helpdesk) → `*.vibethink.ai`

## Reglas clave
- Website está exento de multi-tenant/RLS; no persiste sesión ni usa Supabase.
- Website hereda reglas mínimas del monorepo: dependencias en root, versiones exactas, build por script root.
- Autenticación solo en dominio `.ai`. El website redirige.

## Docusaurus
- Documentación y blog en `docusaurus-docs` → `docs.vibethink.co`.
- Este documento es canónico y prevalece ante referencias contradictorias.


