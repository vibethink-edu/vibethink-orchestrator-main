---
complexity: 1
tokens_estimated: 200
dependencies: []
last_updated: "2024-12-18"
relevant_for: ["all"]
load_priority: "always"
---

# AI Pair Orchestrator Pro - Quick Context

## 🎯 Project Essence (30-second read)

**What**: Enterprise SaaS platform for AI-powered development collaboration  
**Tech Stack**: React + TypeScript + Supabase + OpenAI  
**Architecture**: Multi-tenant with row-level security  
**Status**: ✅ **READY FOR PRODUCTION**

## 🏢 Multi-tenant Foundation

**6-Role Hierarchy**: SUPER_ADMIN → SUPPORT → OWNER → ADMIN → MANAGER → EMPLOYEE  
**Security**: RLS policies enforce company_id isolation  
**Critical Rule**: ALWAYS filter queries by `user.company_id`

## 🤖 AI Features

**Primary**: Meeting audio → transcription → structured minutes  
**Rate Limits**: Per-company monthly quotas (100-10K requests)  
**Providers**: OpenAI (Whisper + GPT), Firecrawl (web scraping)

## 🔒 Security Essentials

**Vulnerabilities**: ✅ All resolved (no hardcoded secrets)  
**SUPPORT Role**: Limited cross-company access with audit logging  
**Authentication**: Supabase Auth with JWT + RLS

## 📊 Current State

**Build**: ✅ Compiles successfully  
**Tests**: ✅ Enterprise testing infrastructure (Vitest, Playwright, k6)  
**Documentation**: ✅ 42 files, ~280 pages, 100% coverage  
**Dependencies**: ✅ All updated and functional

## 🚀 Deployment Ready

**Environment**: `npm run dev` on port 8080  
**Database**: Supabase Cloud (pikywaoqlekupfynnclg)  
**Required ENV**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## ⚡ Quick Actions

**Bug Fix**: Load only this file + error context  
**Feature Work**: + `common/architecture/system-overview.md`  
**Security Work**: + `specialized/security-deep/`  
**Architecture**: + Full context loading

---
**🔄 Last Major Update**: Pre-production cleanup completed  
**📋 Next Focus**: Production deployment preparation 