# FAQ: ¿Por qué reimplementamos Postiz en vez de forkarlo?

## 🎯 Pregunta principal
**P:** ¿Por qué el equipo decidió reimplementar la funcionalidad de Postiz en vez de forkar el código original?

**A:** Por razones legales (licencia AGPL-3.0 incompatible con SaaS cerrado), de control técnico y de alineación estratégica. Analizamos la arquitectura y patrones de Postiz, pero todo el código core y APIs se reescriben desde cero para evitar riesgos legales y asegurar integración nativa con nuestro stack.

## 📋 Detalles técnicos
- AGPL-3.0 obliga a liberar todo el código SaaS si se usa/forkea.
- Reimplementación permite adaptar la arquitectura a NextJS/NestJS/Prisma y a nuestro modelo multi-tenant.
- Se pueden adaptar ideas de UI e infraestructura, pero nunca copiar código fuente.
- Permite agregar features propios (ej: Marketing Assistant AI) sin restricciones.

## 🔄 Decisión tomada
- Fecha: 24/06/2025
- Responsables: Equipo de arquitectura y legal
- Alternativas: Fork con refactor, wrapper, integración por API → todas descartadas por riesgo legal.

## 🕒 Pendiente/Futuro
- Documentar diferencias funcionales y técnicas entre Postiz y nuestra versión.
- Revisar licencias de futuras integraciones open source.

## 🔗 Relacionadas
- [FAQ: Integración legal de software open source]
- [ADR: Decisión de arquitectura de integración Postiz] 