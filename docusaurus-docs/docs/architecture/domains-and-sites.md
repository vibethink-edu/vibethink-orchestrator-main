---
id: domains-and-sites
title: Domains & Sites — Website vs App
sidebar_label: Domains & Sites
---

# Domains & Sites

## Scope
Define la separación entre website (marketing) y aplicación (SaaS) para evitar interferencias.

## Domains
- `www.vibethink.co` → Website (`apps/website`)
- `docs.vibethink.co` → Docusaurus (`docusaurus-docs`)
- `app.vibethink.ai`, `admin.vibethink.ai`, `help.vibethink.ai` → Apps (`apps/*`)

## Policies
- Website: sin multi-tenant, sin RLS, sin sesión. Solo redirecciones a `app.vibethink.ai`.
- Monorepo: dependencias exactas en root, build via script root.
- Supabase redirects: incluir `.ai` y `.co`.


