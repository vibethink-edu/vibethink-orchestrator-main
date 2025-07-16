# FAQ: DNS Multi-Tenant y URLs Personalizadas

**Versión:** 1.0.0  
**Fecha:** 2025-01-22  
**Autor:** AI Pair Platform (asistente de Marcelo Escallón)  
**Categoría:** Infraestructura y Escalabilidad  
**Audiencia:** Clientes, Administradores, Desarrolladores  
**Etiquetas:** DNS, Multi-tenant, URLs, SSL, Dominios, Costos  

---

## Preguntas Frecuentes sobre DNS Multi-Tenant

### **🌐 Dominios y URLs**

#### **Q: ¿Qué opciones de URL tengo disponibles según mi plan?**

**A:** Las opciones varían según tu plan:

- **Plan Básico**: Subdominio automático (`tuempresa.ipair.com`)
- **Plan Pro**: Subdominio + 2 dominios personalizados
- **Plan Enterprise**: Subdominio + dominios personalizados ilimitados

#### **Q: ¿Cómo funciona el subdominio automático?**

**A:** Al registrarte, automáticamente obtienes un subdominio basado en el nombre de tu empresa:
- Se genera automáticamente: `tuempresa.ipair.com`
- SSL gratuito incluido
- Acceso inmediato sin configuración
- Sin costos adicionales

#### **Q: ¿Puedo cambiar mi subdominio después de crearlo?**

**A:** Sí, puedes solicitar un cambio de subdominio:
- Contacta a soporte
- Proporciona el nuevo nombre deseado
- Verificamos disponibilidad
- Cambio realizado en 24-48 horas

#### **Q: ¿Qué dominios personalizados puedo usar?**

**A:** Puedes usar cualquier dominio que poseas:
- `app.tuempresa.com`
- `dashboard.tuempresa.com`
- `ipair.tuempresa.com`
- Cualquier subdominio de tu dominio principal

### **🔒 SSL y Seguridad**

#### **Q: ¿Incluye certificados SSL?**

**A:** Sí, todos los planes incluyen SSL gratuito:
- **Let's Encrypt** automático
- Renovación automática
- Sin costos adicionales
- Compatible con todos los navegadores

#### **Q: ¿Qué tipo de SSL obtengo?**

**A:** Depende de tu plan:
- **Básico/Pro**: SSL estándar (Let's Encrypt)
- **Enterprise**: SSL Wildcard (para todos los subdominios)

#### **Q: ¿Es seguro usar el SSL gratuito?**

**A:** Absolutamente. Let's Encrypt es:
- Certificado por las principales autoridades
- Utilizado por millones de sitios web
- Renovación automática
- Mismo nivel de seguridad que certificados pagos

### **💰 Costos y Facturación**

#### **Q: ¿Cuánto cuesta el subdominio?**

**A:** El subdominio es **completamente gratuito**:
- Sin costos de configuración
- Sin costos mensuales
- Sin costos de mantenimiento
- Incluido en todos los planes

#### **Q: ¿Cuánto cuestan los dominios personalizados?**

**A:** Los costos varían por plan:
- **Plan Básico**: No disponible
- **Plan Pro**: $5/mes por dominio personalizado
- **Plan Enterprise**: $15/mes por dominio personalizado

#### **Q: ¿Hay costos ocultos?**

**A:** No, todos los costos son transparentes:
- SSL gratuito incluido
- Gestión DNS automática
- Sin costos de configuración
- Sin costos de mantenimiento

#### **Q: ¿Puedo cancelar un dominio personalizado?**

**A:** Sí, puedes cancelar en cualquier momento:
- Sin penalizaciones
- Costos prorrateados
- Acceso al subdominio mantenido
- Proceso automático

### **⚙️ Configuración Técnica**

#### **Q: ¿Cómo configuro mi dominio personalizado?**

**A:** El proceso es simple:

1. **Solicita el dominio** en tu panel de administración
2. **Verifica propiedad** añadiendo un registro TXT
3. **Configura DNS** con el registro CNAME que te proporcionamos
4. **Espera activación** (5-10 minutos automático)

#### **Q: ¿Qué registro DNS necesito configurar?**

**A:** Solo necesitas un registro CNAME:
```
Tipo: CNAME
Nombre: app (o el subdominio que desees)
Valor: ipair.com
TTL: 3600 (o automático)
```

#### **Q: ¿Cuánto tiempo tarda en activarse?**

**A:** Los tiempos varían:
- **Subdominio**: Inmediato
- **Dominio personalizado**: 5-10 minutos
- **Propagación DNS**: Hasta 24 horas (normalmente 1-2 horas)

#### **Q: ¿Qué pasa si mi dominio no funciona?**

**A:** Verificamos automáticamente:
- Configuración DNS correcta
- Propagación de DNS
- Certificado SSL
- Si hay problemas, te notificamos con instrucciones específicas

### **🔄 Gestión y Mantenimiento**

#### **Q: ¿Quién gestiona la renovación de SSL?**

**A:** Nosotros gestionamos todo automáticamente:
- Renovación automática de Let's Encrypt
- Sin interrupciones de servicio
- Sin acción requerida de tu parte
- Notificaciones si hay problemas

#### **Q: ¿Puedo transferir mi dominio a otro proveedor?**

**A:** Sí, puedes transferir tu dominio:
- El dominio es tuyo, no nuestro
- Solo necesitas cambiar el registro CNAME
- No hay bloqueos ni restricciones
- Te ayudamos con la configuración

#### **Q: ¿Qué pasa si cambio de plan?**

**A:** Los cambios de plan afectan los dominios así:
- **Upgrade**: Mantienes dominios existentes + nuevos límites
- **Downgrade**: Dominios personalizados se desactivan (no se eliminan)
- **Subdominio**: Siempre disponible en todos los planes

#### **Q: ¿Puedo usar múltiples dominios para la misma cuenta?**

**A:** Sí, según tu plan:
- **Pro**: Hasta 2 dominios personalizados
- **Enterprise**: Dominios ilimitados
- Todos apuntan a la misma cuenta/empresa

### **🚀 Escalabilidad y Límites**

#### **Q: ¿Hay límites de tráfico por dominio?**

**A:** No hay límites específicos por dominio:
- Límites basados en tu plan general
- No límites adicionales por URL
- Escalabilidad automática

#### **Q: ¿Puedo usar dominios internacionales?**

**A:** Sí, soportamos:
- Dominios con caracteres especiales
- Dominios internacionales (.es, .mx, .ar, etc.)
- Dominios con acentos (con configuración especial)
- Cualquier TLD estándar

#### **Q: ¿Qué pasa si mi dominio expira?**

**A:** Si tu dominio expira:
- El subdominio sigue funcionando
- Los dominios personalizados se desactivan
- Te notificamos antes de la expiración
- Reactivación automática al renovar el dominio

#### **Q: ¿Puedo usar dominios con wildcards?**

**A:** Solo en Plan Enterprise:
- `*.tuempresa.com` funciona
- SSL wildcard incluido
- Configuración automática
- Sin costos adicionales

### **📞 Soporte y Ayuda**

#### **Q: ¿Qué soporte recibo para configuración DNS?**

**A:** Ofrecemos soporte completo:
- **Básico**: Documentación y guías
- **Pro**: Soporte por email + chat
- **Enterprise**: Soporte dedicado + configuración asistida

#### **Q: ¿Pueden configurar mi DNS por mí?**

**A:** En Plan Enterprise:
- Configuración DNS completa por nuestro equipo
- Gestión de registros DNS
- Configuración de SSL
- Monitoreo continuo

#### **Q: ¿Qué documentación está disponible?**

**A:** Proporcionamos:
- Guías paso a paso
- Videos tutoriales
- Documentación técnica
- Ejemplos de configuración
- FAQ actualizada

#### **Q: ¿Cómo reporto problemas con mi dominio?**

**A:** Puedes reportar problemas:
- Panel de administración
- Email de soporte
- Chat en vivo (Pro+)
- Teléfono (Enterprise)

### **🔮 Futuro y Mejoras**

#### **Q: ¿Planean añadir más opciones de dominio?**

**A:** Sí, estamos trabajando en:
- Dominios personalizados para Plan Básico
- Más opciones de SSL
- Integración con más proveedores DNS
- Configuración automática avanzada

#### **Q: ¿Habrá costos adicionales en el futuro?**

**A:** No planeamos cambios de costos:
- Precios actuales garantizados por 12 meses
- Notificación previa de cualquier cambio
- Opción de cancelación sin penalizaciones

#### **Q: ¿Puedo sugerir mejoras al sistema?**

**A:** Absolutamente:
- Portal de feedback
- Encuestas de satisfacción
- Programa beta para nuevas características
- Consideramos todas las sugerencias

---

## Conclusión

El sistema de DNS multi-tenant de iPair está diseñado para ser:
- **Simple**: Configuración automática donde sea posible
- **Económico**: Opciones gratuitas y costos transparentes
- **Escalable**: Crece con tu negocio
- **Seguro**: SSL automático y gestión profesional

**¿Tienes más preguntas?** Contacta a nuestro equipo de soporte.

---

## Historial de Cambios

- **2025-01-22** | AI Pair Platform (asistente de Marcelo Escallón) | Creación inicial de FAQs sobre DNS multi-tenant y URLs personalizadas 