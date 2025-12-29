# WORKTREES

## Politica
- Un worktree representa una rama unica.
- En un worktree no se cambia de rama. El worktree ES la rama.
- Cada tarea nueva crea su propio worktree.
- Al terminar, se elimina el worktree y la rama si ya fue mergeada.

## Comandos base
Crear worktree desde origin/main:

```
git fetch --prune origin
git worktree add -b docs/foundation-canon ../worktrees/docs-foundation-canon origin/main
```

Listar worktrees:

```
git worktree list
```

Eliminar worktree:

```
git worktree remove ../worktrees/docs-foundation-canon
git branch -d docs/foundation-canon
```

## Regla critica
No reutilizar worktrees para otra rama.
