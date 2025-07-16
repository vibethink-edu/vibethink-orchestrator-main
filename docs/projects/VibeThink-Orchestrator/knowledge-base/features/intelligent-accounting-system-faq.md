# FAQ: Sistema de Contabilidad Inteligente

## 📋 **INFORMACIÓN GENERAL**

### **¿Qué es el Sistema de Contabilidad Inteligente?**
El Sistema de Contabilidad Inteligente es una plataforma que automatiza el procesamiento, clasificación y contabilización de documentos contables para empresas colombianas. Integra IA avanzada con software contable existente para optimizar los procesos contables.

### **¿Con qué software contable es compatible?**
Es **universal** y compatible con TODOS los software contables colombianos:
- **Cloud**: Siigo, Alegra, ContaMatic, Siesa
- **On-Premise**: Helisa, SAP Business One, Tally ERP, ContaPyme
- **Híbrido**: Quickbooks, Xero
- **Especializado**: Facturación Electrónica DIAN

### **¿Qué nivel de automatización ofrece?**
Ofrece **4 niveles de integración** según las capacidades del software:
1. **API Directa** (máxima automatización)
2. **Importación/Exportación** (automatización media)
3. **Extensión Navegador** (autocompletado)
4. **Manual Asistido** (guías y validación)

---

## 🤖 **ASISTENTE IA**

### **¿Cómo funciona el Asistente IA?**
El Asistente IA es un chat inteligente especializado en contabilidad que:
- **Analiza documentos** en tiempo real
- **Sugiere cuentas contables** automáticamente
- **Valida datos** extraídos
- **Responde consultas** contables específicas
- **Genera reportes** personalizados

### **¿Qué comandos puedo usar con el Asistente?**
Comandos principales:
- `"Analiza documento"` - Revisa documento seleccionado
- `"Sugiere cuentas"` - Propone contabilización
- `"Valida datos"` - Verifica información extraída
- `"Busca facturas de [proveedor]"` - Filtra por proveedor
- `"Genera reporte"` - Crea reporte personalizado

### **¿Qué tan precisa es la IA?**
La precisión promedio es del **85-95%** dependiendo del tipo de documento:
- **Facturas electrónicas**: 95% precisión
- **Documentos escaneados**: 85-90% precisión
- **Formularios complejos**: 80-85% precisión

---

## 📧 **PROCESAMIENTO DE DOCUMENTOS**

### **¿Cómo recibe los documentos el sistema?**
El sistema recibe documentos automáticamente por:
- **Email corporativo** configurado
- **Carpeta compartida** en Google Drive
- **API de proveedores** (si está disponible)
- **Carga manual** desde la interfaz

### **¿Qué tipos de documentos procesa?**
- **Facturas electrónicas** (XML, PDF)
- **Recibos de caja** (PDF, imágenes)
- **Contratos** (PDF, Word)
- **Notas crédito/débito**
- **Documentos de nómina**
- **Comprobantes de pago**

### **¿Cómo organiza los documentos en Drive?**
Organiza automáticamente en estructura:
```
📁 Año 2025/
├── 📁 Enero/
│   ├── 📁 Facturas/
│   │   ├── 📁 Siigo/
│   │   └── 📁 Alegra/
│   ├── 📁 Recibos/
│   └── 📁 Contratos/
└── 📁 Febrero/
```

---

## 🔧 **INTEGRACIÓN CON SOFTWARE CONTABLE**

### **¿Cómo se integra con software sin API?**
Para software sin API (como Helisa):
1. **Extensión de navegador** autocompleta formularios
2. **Archivos CSV/Excel** para importación masiva
3. **RPA (Robotic Process Automation)** para automatización
4. **Interfaz manual asistida** con guías paso a paso

### **¿Qué información extrae automáticamente?**
- **Datos del proveedor**: Nombre, NIT, dirección, teléfono
- **Información del documento**: Número, fecha, vencimiento
- **Montos**: Total, subtotal, IVA, retenciones
- **Descripción**: Concepto, categorización
- **Metadatos**: Tipo de documento, confianza de extracción

### **¿Puedo personalizar el mapeo de campos?**
Sí, puedes personalizar completamente:
- **Campos de origen** (datos extraídos)
- **Campos de destino** (software contable)
- **Transformaciones** (mayúsculas, formato moneda, fechas)
- **Validaciones** personalizadas

---

## 🌐 **EXTENSIÓN DE NAVEGADOR**

### **¿Cómo funciona la extensión de navegador?**
La extensión:
- **Detecta automáticamente** formularios web
- **Autocompleta campos** con datos extraídos
- **Valida información** en tiempo real
- **Solicita confirmación** antes de enviar
- **Registra acciones** para auditoría

### **¿En qué navegadores funciona?**
- **Chrome** (recomendado)
- **Firefox**
- **Edge**
- **Safari** (limitado)

### **¿Es segura la extensión?**
Sí, la extensión:
- **No almacena datos** sensibles localmente
- **Solo accede** a formularios autorizados
- **Encripta** toda la comunicación
- **Requiere confirmación** del usuario

---

## 💰 **FACTURACIÓN Y COSTOS**

### **¿Cuánto cuesta el sistema?**
**Planes mensuales:**
- **Básico**: $29 USD (100 documentos incluidos)
- **Profesional**: $79 USD (500 documentos incluidos)
- **Enterprise**: $199 USD (documentos ilimitados)

**Cargos adicionales:**
- Documento excedente: $0.50 USD
- Integración API: $10 USD/mes
- Extensión navegador: $5 USD/mes

### **¿Cómo se factura por jurisdicción?**
- **Colombia**: Facturación electrónica DIAN
- **México**: CFDI y complementos
- **Argentina**: Facturación electrónica AFIP
- **Chile**: DTE (Documentos Tributarios Electrónicos)

### **¿Hay descuentos por volumen?**
Sí, descuentos progresivos:
- **10-50 usuarios**: 10% descuento
- **51-100 usuarios**: 20% descuento
- **100+ usuarios**: 30% descuento
- **Sector educativo**: 25% descuento

---

## 🔐 **SEGURIDAD Y PRIVACIDAD**

### **¿Cómo protege mis datos?**
- **Encriptación AES-256** en tránsito y reposo
- **Aislamiento multi-tenant** por empresa
- **Backup automático** con redundancia geográfica
- **Auditoría completa** de accesos y cambios
- **Cumplimiento GDPR** y normativas locales

### **¿Dónde se almacenan los datos?**
Los datos se almacenan en:
- **Servidores AWS** en región US East (N. Virginia)
- **Backup automático** en múltiples ubicaciones
- **Cumplimiento** con normativas de residencia de datos

### **¿Quién puede acceder a mis datos?**
Solo personal autorizado:
- **Tu equipo** con permisos configurados
- **Soporte técnico** (solo con tu autorización)
- **Auditores externos** (cumplimiento)

---

## 🚀 **IMPLEMENTACIÓN**

### **¿Cuánto tiempo toma la implementación?**
**Tiempo total: 4-6 semanas**
- **Fase 1** (Configuración básica): 1-2 semanas
- **Fase 2** (Integración software): 2-3 semanas
- **Fase 3** (Optimización): 1-2 semanas

### **¿Qué necesito para comenzar?**
Requisitos mínimos:
- **Email corporativo** para recepción de documentos
- **Cuenta Google Drive** para organización
- **Software contable** configurado
- **Acceso a internet** estable

### **¿Ofrecen capacitación?**
Sí, incluimos:
- **Capacitación inicial** (2 horas)
- **Videos tutoriales** disponibles 24/7
- **Webinars semanales** gratuitos
- **Soporte técnico** por chat y email

---

## 📊 **REPORTES Y MÉTRICAS**

### **¿Qué reportes genera el sistema?**
Reportes automáticos:
- **Documentos procesados** por período
- **Tasa de precisión** de la IA
- **Tiempo promedio** de procesamiento
- **Análisis por proveedor** y categoría
- **Tendencias de gastos** y costos
- **ROI de automatización**

### **¿Puedo personalizar los reportes?**
Sí, puedes:
- **Crear reportes personalizados**
- **Configurar alertas** automáticas
- **Exportar datos** en múltiples formatos
- **Integrar con BI** externo

### **¿Cómo mido el ROI?**
El sistema calcula automáticamente:
- **Tiempo ahorrado** por documento
- **Reducción de errores** manuales
- **Costo por documento** procesado
- **ROI mensual** y anual

---

## 🔧 **SOPORTE TÉCNICO**

### **¿Qué canales de soporte ofrecen?**
- **Chat en vivo**: 24/7 en la plataforma
- **Email**: soporte@universalassistant.com
- **Teléfono**: +57 1 234 5678 (8 AM - 6 PM)
- **Documentación**: docs.universalassistant.com

### **¿Cuál es el tiempo de respuesta?**
- **Crítico** (sistema caído): < 1 hora
- **Alto** (funcionalidad bloqueada): < 4 horas
- **Medio** (pregunta técnica): < 24 horas
- **Bajo** (mejora/sugerencia): < 72 horas

### **¿Ofrecen soporte en español?**
Sí, todo nuestro soporte es en español:
- **Equipo técnico** colombiano
- **Documentación** en español
- **Capacitación** en español
- **Comunidad** hispanohablante

---

## 🔮 **FUTURO Y ACTUALIZACIONES**

### **¿Con qué frecuencia actualizan el sistema?**
- **Actualizaciones menores**: Semanalmente
- **Nuevas funcionalidades**: Mensualmente
- **Mejoras de IA**: Trimestralmente
- **Nuevas integraciones**: Según demanda

### **¿Qué nuevas funcionalidades están planeadas?**
Próximas funcionalidades:
- **OCR avanzado** para documentos escaneados
- **Integración con banca** empresarial
- **App móvil** para validación rápida
- **Machine Learning** para mejora continua

### **¿Puedo sugerir nuevas funcionalidades?**
¡Absolutamente! Tenemos:
- **Portal de ideas** en la plataforma
- **Encuestas mensuales** de usuarios
- **Programa beta** para nuevas funcionalidades
- **Comunidad** para discusión de mejoras

---

## ❓ **PREGUNTAS FRECUENTES ESPECÍFICAS**

### **¿Funciona con facturación electrónica DIAN?**
Sí, el sistema es **compatible al 100%** con facturación electrónica DIAN:
- **Procesamiento automático** de XML
- **Validación** de estructura DIAN
- **Almacenamiento** según normativa
- **Reportes** de cumplimiento

### **¿Puedo usar el sistema sin software contable?**
Sí, puedes usar el sistema para:
- **Organización** de documentos
- **Clasificación** automática
- **Extracción** de datos
- **Reportes** básicos
- **Preparación** para contabilización manual

### **¿Qué pasa si la IA comete un error?**
El sistema incluye múltiples capas de seguridad:
- **Validación automática** de datos extraídos
- **Confirmación manual** requerida
- **Sistema de corrección** de errores
- **Aprendizaje continuo** para evitar errores futuros

### **¿Puedo exportar mis datos si cambio de sistema?**
Sí, puedes exportar:
- **Todos los documentos** procesados
- **Datos extraídos** en formato estándar
- **Configuraciones** y mapeos
- **Reportes** y métricas históricas

---

## 📞 **CONTACTO Y DEMO**

### **¿Puedo solicitar una demo?**
Sí, ofrecemos:
- **Demo gratuita** de 30 minutos
- **Prueba gratuita** de 14 días
- **Demo personalizada** para tu empresa
- **Webinar grupal** semanal

### **¿Cómo contacto al equipo comercial?**
- **Email**: ventas@universalassistant.com
- **Teléfono**: +57 1 234 5678
- **WhatsApp**: +57 300 123 4567
- **Formulario**: universalassistant.com/contacto

### **¿Hay referencias de clientes?**
Sí, tenemos casos de éxito en:
- **Pequeñas empresas** (50-100 facturas/mes)
- **Medianas empresas** (200-500 facturas/mes)
- **Grandes empresas** (1000+ facturas/mes)
- **Diferentes sectores** (retail, servicios, manufactura)

---

*FAQ generada automáticamente por el Sistema de Conocimiento de Producto*
*Última actualización: 20 de Diciembre de 2025*
*Versión: 1.0* 