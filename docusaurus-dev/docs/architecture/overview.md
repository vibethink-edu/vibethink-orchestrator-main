---
id: overview
title: 🏗️ Arquitectura General
sidebar_label: Overview
description: Vista general de la arquitectura del sistema
---

# 🏗️ **Arquitectura General - VibeThink**

## 🎯 **Arquitectura Multi-tenant SaaS**

### **🏢 Estructura General**
- **Frontend**: React + TypeScript + Next.js
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**: Docker + Kubernetes
- **Monitoring**: Prometheus + Grafana

### **🔐 Seguridad Multi-tenant**
- **Aislamiento por empresa** - company_id en todas las tablas
- **RLS Policies** - Row Level Security en Supabase
- **JWT Tokens** - Autenticación por empresa
- **Role-based Access** - 5 niveles de permisos

### **📊 Componentes Principales**
- **Dashboard** - Vista principal de métricas
- **Admin Panel** - Gestión de usuarios y configuraciones
- **API Gateway** - Endpoints REST y GraphQL
- **Real-time** - WebSockets para live updates 