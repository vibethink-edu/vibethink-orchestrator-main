# FAQ: ¿Cómo integramos AI (OpenAI, Firecrawl) y gestionamos claves y privacidad?

## 🎯 Pregunta principal
**P:** ¿Cómo se gestiona la integración de modelos AI y la protección de claves y datos sensibles?

**A:** Todas las claves de API se almacenan en Supabase Vault, nunca en código. Se implementa control de acceso granular, logging de uso y monitoreo de costos. Los prompts y respuestas se auditan para evitar fugas de datos sensibles. Se cumple con GDPR/LGPD.

## 📋 Detalles técnicos
- Uso de Supabase Vault para gestión de secretos.
- Rate limiting y monitoreo de uso por usuario/empresa.
- Logs de acceso y uso para auditoría.
- Validación y sanitización de prompts/respuestas.
- Consentimiento explícito para uso de AI en datos sensibles.

## 🔄 Decisión tomada
- Fecha: 24/06/2025
- Responsables: Equipo AI y seguridad

## 🕒 Pendiente/Futuro
- Implementar dashboard de uso y costos AI.
- Revisar nuevas regulaciones de IA.

## 🔗 Relacionadas
- [FAQ: Consentimiento y privacidad en integraciones AI]
- [ADR: Arquitectura de integración AI] 