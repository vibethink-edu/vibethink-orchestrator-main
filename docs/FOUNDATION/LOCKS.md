# LOCKS

Tabla unica de locks para evitar colisiones en rutas criticas.

Reglas:
- ACTIVE = nadie mas toca ese scope.
- TTL 48h. Renovar antes de vencer.
- Al cerrar el PR, liberar el lock.

| Lock ID | Scope | Owner | Branch | Status | Started | Notes | PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| - | - | - | - | - | - | - | - |
