# ADR-005: API Gateway Strategy

---

## 📋 AVISO DE CONFIDENCIALIDAD

**PROPIEDAD DE EUPHORIANET**  
**© 2025 Euphorianet. Todos los derechos reservados.**

**Autor:** Marcelo Escallón, CEO de Euphorianet  
**Fecha:** 22 de junio de 2025  
**Sesión:** Consolidación de Arquitectura AI Pair OS  

**CONFIDENCIAL** - Este documento contiene información propietaria y estratégica de Euphorianet. Su distribución, reproducción o uso sin autorización expresa está prohibida. Este documento forma parte del Sistema de Conocimiento de Producto de Euphorianet y está protegido por derechos de autor.

---


## Status
Accepted

## Context
Necesitamos definir una estrategia de API Gateway que permita desarrollo local simple en laptops mientras prepara el terreno para una migración futura a Kubernetes. El desarrollo debe ser desacoplado y no requerir infraestructura compleja.

## Decision
Implementar una estrategia de **API Gateway híbrida**:

### Desarrollo Local
- **Traefik** como Ingress Controller en Docker Compose
- Configuración simple sin orquestación compleja
- Dashboard disponible en `http://localhost:8080`
- Auto-descubrimiento de servicios Docker

### Staging/Producción
- **Kong** como API Gateway completo
- Gestión avanzada de endpoints de terceros
- Rate limiting, circuit breaking, transformations
- Monitoreo y analytics integrados

### Migración Futura
- Traefik se mantiene como Ingress Controller en Kubernetes
- Kong se despliega como API Gateway dentro del cluster
- Transición gradual sin cambios en código de aplicación

## Consequences

### Positivas
- Desarrollo local simple y rápido
- Escalabilidad gradual según necesidades
- Preparación para Kubernetes
- Separación clara entre desarrollo y producción

### Negativas
- Configuración dual (Traefik + Kong)
- Curva de aprendizaje para Kong
- Overhead de mantenimiento de dos sistemas

## Implementation

### Docker Compose para Desarrollo
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  traefik:
    image: traefik:v2.10
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"

  api-gateway:
    image: kong:3.4
    environment:
      KONG_DATABASE: "off"
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 0.0.0.0:8001
      KONG_ADMIN_GUI_URL: http://localhost:8002
    ports:
      - "8000:8000"
      - "8001:8001"
      - "8002:8002"
    depends_on:
      - traefik
```

### Configuración de Servicios
```yaml
# Ejemplo de servicio con labels para Traefik
services:
  recruiting-service:
    image: recruiting-service:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.recruiting.rule=Host(`recruiting.localhost`)"
      - "traefik.http.services.recruiting.loadbalancer.server.port=8000"
```

## References
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Kong Documentation](https://docs.konghq.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/) 