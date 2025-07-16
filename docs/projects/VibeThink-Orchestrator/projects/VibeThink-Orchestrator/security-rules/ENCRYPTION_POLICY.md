# 🔒 Política de Cifrado – VibeThink Orchestrator

---

## 1. Alcance

Esta política aplica a todos los datos en tránsito y en reposo gestionados por VibeThink Orchestrator.

---

## 2. Principios
- Cifrado obligatorio de datos sensibles en tránsito y en reposo
- Uso de algoritmos y protocolos reconocidos internacionalmente
- Gestión segura de claves y certificados

---

## 3. Reglas y estándares
- Todo tráfico entre servicios debe usar TLS 1.2+ (HTTPS, WSS)
- Los datos en reposo deben cifrarse con AES-256 o superior
- Las claves de cifrado deben almacenarse en sistemas seguros (ej. AWS KMS, Azure Key Vault)
- El acceso a claves está restringido y auditado
- Se prohíbe el uso de algoritmos obsoletos (ej. MD5, SHA1)

---

## 4. Responsables
- El equipo de seguridad es responsable de la implementación y revisión de los mecanismos de cifrado.
- Toda excepción debe documentarse y ser aprobada por un OWNER. 