# 📋 GIT DAILY CHECKLIST

### 🌅 INICIO (Rito de Entrada)
- [ ] `git status` -> Confirmar árbol limpio y sin `.lock`.
- [ ] `git pull --rebase` -> Sincronizar historial lineal.
- [ ] Verificar **Untracked** -> ¿Deben ignorarse o borrarse?

### 🛠️ DURANTE (Higiene)
- [ ] **Indexación Granular** -> `git add <file>` tras cada unidad de trabajo.
- [ ] **Cero Limbo** -> Decidir destino de archivos nuevos al momento.
- [ ] **Validación** -> `git status` antes de comandos pesados.

### 🌇 CIERRE (Rito de Salida)
- [ ] `git status` -> Revisión final de cambios.
- [ ] `git add` -> Asegurar que todo lo necesario está en stage.
- [ ] `git commit -m "[contexto]: [acción]"` -> Persistencia atómica.
- [ ] Verificar salida -> Confirmar que el commit no quedó colgado.

---
**REGLA DE ORO:** Si `git status` tiene más de 5 archivos o scroll, **HAZ COMMIT YA.**
