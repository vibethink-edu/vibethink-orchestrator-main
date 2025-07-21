---
id: patterns
title: 🎨 Patrones de Diseño
sidebar_label: Patrones
description: Patrones implementados en el proyecto
---

# 🎨 **Patrones de Diseño - VibeThink**

## 🏗️ **Patrones Arquitectónicos**

### **Multi-tenant Pattern**
- **Aislamiento por empresa** - company_id en todas las tablas
- **Shared database** - Una base de datos para todos los tenants
- **Row-level security** - Filtrado automático por empresa

### **Repository Pattern**
- **Data access layer** - Abstracción de la base de datos
- **Business logic separation** - Lógica de negocio independiente
- **Testing friendly** - Fácil mockeo para tests

## 🎯 **Patrones de Frontend**

### **Component Composition**
- **Reusable components** - Componentes modulares
- **Props drilling** - Evitar con Context API
- **Custom hooks** - Lógica reutilizable

### **State Management**
- **Zustand** - Estado global simple
- **React Query** - Cache y sincronización
- **Local state** - useState para estado local 