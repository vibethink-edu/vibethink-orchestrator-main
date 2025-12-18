# External References Directory

> **⚠️ DEPRECATED:** Este directorio ya no se usa para referencias externas.
> 
> Las referencias ahora están ubicadas en directorios vendor separados fuera del monorepo.

---

## 📍 Nueva Ubicación de Referencias

```
C:\IA Marcelo Labs\
├── bundui\
│   └── shadcn-ui-kit-dashboard\    # Dashboard Kit Premium
│
└── shadcn-ui\
    └── ui\                         # Componentes Shadcn Oficial
```

---

## 🚀 Comandos (desde vibethink-orchestrator-main)

```powershell
# Bundui Reference (Dashboard Kit)
.\scripts\start-bundui-reference.ps1    # Inicia en puerto 3006
.\scripts\stop-bundui-reference.ps1     # Detiene el servidor

# Shadcn UI Reference (Componentes oficiales)
.\scripts\start-shadcn-reference.ps1    # Inicia en puerto 3007
.\scripts\stop-shadcn-reference.ps1     # Detiene el servidor
```

---

## 📚 Documentación

Ver: `docs/references/REFERENCE_ARCHITECTURE.md`

---

## 🗑️ Limpieza

Este directorio puede contener archivos residuales de la migración.
Se puede eliminar de forma segura si está vacío.

---

**Migrado:** 2024-12-17
