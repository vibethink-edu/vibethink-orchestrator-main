# Claude Code Instructions - VibeThink Orchestrator 1.0

> **This file is read automatically by Claude Code**

## 🔥 Quick Operations

**Use these commands - NEVER guess:**

| Action | Command | Port |
|--------|---------|------|
| **Start** | `.\scripts\start-dashboard.ps1` | 3005 |
| **Stop** | `.\scripts\stop-dashboard.ps1` | - |
| **Build** | `pnpm run build:dashboard` | - |
| **Dev** | `pnpm run dev:dashboard` | 3000 |

## 📋 Inherit From

- Read `AGENTS.md` for complete project rules
- Read `_vibethink-dev-kit/knowledge/ai-agents/AGENTS_UNIVERSAL.md` for universal rules

## 🛠️ Tech Stack

- Next.js 15.3.4 (App Router)
- React 19.0.0
- TypeScript 5.9.2
- Shadcn UI via `@vibethink/ui`

## ❌ Never Do

- Install Express 5
- Install Vite (this is Next.js)
- Use `@vibethink/bundui-ui` in production
- Run npm in `apps/` directories
- Guess ports without checking scripts

## ✅ Always Do

- Use `@vibethink/ui` for UI components
- Run commands from monorepo root
- Check `scripts/*.ps1` for operations
- Read `AGENTS.md` before major changes

