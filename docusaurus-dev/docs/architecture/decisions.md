---
id: decisions
title: 📋 Decisiones Arquitectónicas
sidebar_label: Decisiones
description: ADRs y decisiones técnicas documentadas
---

# 📋 **Decisiones Arquitectónicas (ADRs)**

## 🎯 **ADR-001: Multi-tenant con Supabase**

**Estado**: Aceptado  
**Fecha**: Julio 2025

### **Contexto**
Necesitábamos una solución multi-tenant escalable con autenticación robusta.

### **Decisión**
Usar Supabase como backend principal con:
- PostgreSQL para datos
- Auth integrado
- Real-time subscriptions
- RLS policies para aislamiento

### **Consecuencias**
✅ **Pros**: Desarrollo rápido, escalabilidad, seguridad  
❌ **Contras**: Vendor lock-in, costos a escala 