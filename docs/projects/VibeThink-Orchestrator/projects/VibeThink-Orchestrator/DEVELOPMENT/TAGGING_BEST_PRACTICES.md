# Buenas Prácticas de Desarrollo - Sistema Universal de Etiquetas਍ഀഀ
## **Propósito y Contexto**਍ഀഀ
El **Sistema Universal de Etiquetas** es una **definición genérica de buenas prácticas** que fortalece el desarrollo de categorización no esperada, evitando la necesidad de crear campos específicos para cada caso de uso. Las etiquetas nos ayudan en filtros, búsquedas y organización flexible de datos.਍ഀഀ
## **Principios Fundamentales**਍ഀഀ
### **1. Flexibilidad Antes que Rigidez**਍ⴀ ⨀⨀倀爀漀戀氀攀洀愀㨀⨀⨀ 䌀愀洀瀀漀猀 瀀爀攀搀攀昀椀渀椀搀漀猀 氀椀洀椀琀愀渀 氀愀 愀搀愀瀀琀愀戀椀氀椀搀愀搀ഀഀ
- **Solución:** Etiquetas permiten categorización dinámica਍ⴀ ⨀⨀䈀攀渀攀昀椀挀椀漀㨀⨀⨀ 䰀漀猀 甀猀甀愀爀椀漀猀 漀爀最愀渀椀稀愀渀 猀攀最切渀 猀甀猀 渀攀挀攀猀椀搀愀搀攀猀 攀猀瀀攀挀昀椀挀愀猀ഀഀ
਍⌀⌀⌀ ⨀⨀㈀⸀ 䌀愀琀攀最漀爀椀稀愀挀椀渀 一漀 䔀猀瀀攀爀愀搀愀⨀⨀ഀഀ
- **Problema:** Los desarrolladores no pueden prever todos los casos de uso਍ⴀ ⨀⨀匀漀氀甀挀椀渀㨀⨀⨀ 䔀琀椀焀甀攀琀愀猀 瀀攀爀洀椀琀攀渀 挀愀琀攀最漀爀椀稀愀挀椀渀 攀洀攀爀最攀渀琀攀ഀഀ
- **Beneficio:** Adaptación natural a flujos de trabajo únicos਍ഀഀ
### **3. Filtros y Búsquedas Poderosas**਍ⴀ ⨀⨀倀爀漀戀氀攀洀愀㨀⨀⨀ 䈀切猀焀甀攀搀愀猀 氀椀洀椀琀愀搀愀猀 瀀漀爀 挀愀洀瀀漀猀 昀椀樀漀猀ഀഀ
- **Solución:** Filtros por múltiples etiquetas combinadas਍ⴀ ⨀⨀䈀攀渀攀昀椀挀椀漀㨀⨀⨀ 䔀渀挀漀渀琀爀愀爀 椀渀昀漀爀洀愀挀椀渀 搀攀 昀漀爀洀愀 椀渀琀甀椀琀椀瘀愀ഀഀ
਍⌀⌀ ⨀⨀䌀甀渀搀漀 䤀洀瀀氀攀洀攀渀琀愀爀 䔀琀椀焀甀攀琀愀猀⨀⨀ഀഀ
਍⌀⌀⌀ ⨀⨀Ԁ‧䌀愀猀漀猀 搀攀 唀猀漀 䤀搀攀愀氀攀猀⨀⨀ഀഀ
਍⌀⌀⌀⌀ ⨀⨀㄀⸀ 䔀渀琀椀搀愀搀攀猀 挀漀渀 䌀愀琀攀最漀爀椀稀愀挀椀渀 嘀愀爀椀愀戀氀攀⨀⨀ഀഀ
```typescript਍⼀⼀ 䰀‧䴀愀氀㨀 䌀愀洀瀀漀猀 昀椀樀漀猀 氀椀洀椀琀愀渀琀攀猀ഀഀ
interface Customer {਍  椀渀搀甀猀琀爀礀㨀 猀琀爀椀渀最㬀 ⼀⼀ 䰀椀洀椀琀愀搀漀 愀 瘀愀氀漀爀攀猀 瀀爀攀搀攀昀椀渀椀搀漀猀ഀഀ
  size: 'small' | 'medium' | 'large'; // Opciones rígidas਍  猀琀愀琀甀猀㨀 ✀愀挀琀椀瘀攀✀ 簀 ✀椀渀愀挀琀椀瘀攀✀㬀 ⼀⼀ 䔀猀琀愀搀漀猀 昀椀樀漀猀ഀഀ
}਍ഀഀ
// ✅ Bien: Etiquetas flexibles਍椀渀琀攀爀昀愀挀攀 䌀甀猀琀漀洀攀爀 笀ഀഀ
  // Campos básicos + etiquetas para categorización਍  渀愀洀攀㨀 猀琀爀椀渀最㬀ഀഀ
  email: string;਍  ⼀⼀ 䰀愀猀 攀琀椀焀甀攀琀愀猀 洀愀渀攀樀愀渀㨀 椀渀搀甀猀琀爀椀愀Ⰰ 琀愀洀愀漀Ⰰ 攀猀琀愀搀漀Ⰰ 瀀爀椀漀爀椀搀愀搀Ⰰ 攀琀挀⸀ഀഀ
}਍怀怀怀ഀഀ
਍⌀⌀⌀⌀ ⨀⨀㈀⸀ 䘀椀氀琀爀漀猀 礀 䈀切猀焀甀攀搀愀猀 䄀瘀愀渀稀愀搀愀猀⨀⨀ഀഀ
```typescript਍⼀⼀ 䰀漀猀 甀猀甀愀爀椀漀猀 瀀甀攀搀攀渀 戀甀猀挀愀爀 瀀漀爀 挀甀愀氀焀甀椀攀爀 挀漀洀戀椀渀愀挀椀渀ഀഀ
const urgentVIPClients = await searchByTags({਍  攀渀琀椀琀礀开琀礀瀀攀㨀 ✀挀漀渀琀愀挀琀✀Ⰰഀഀ
  tag_names: ['urgente', 'vip', 'cliente-premium']਍紀⤀㬀ഀഀ
```਍ഀഀ
#### **3. Organización Emergente**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// Los usuarios crean categorías según evolucionan sus necesidades਍⼀⼀ 匀攀洀愀渀愀 ㄀㨀 嬀✀渀甀攀瘀漀✀Ⰰ ✀瀀爀漀猀瀀攀挀琀漀✀Ⰰ ✀挀氀椀攀渀琀攀✀崀ഀഀ
// Semana 4: ['nuevo', 'prospecto', 'cliente', 'vip', 'escalado', 'industria-tech']਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀䰀‧䌀愀猀漀猀 䐀漀渀搀攀 一伀 唀猀愀爀 䔀琀椀焀甀攀琀愀猀⨀⨀ഀഀ
਍⌀⌀⌀⌀ ⨀⨀㄀⸀ 䐀愀琀漀猀 䔀猀琀爀甀挀琀甀爀愀搀漀猀 䌀爀琀椀挀漀猀⨀⨀ഀഀ
```typescript਍⼀⼀ Ԁ‧唀猀愀爀 挀愀洀瀀漀猀 攀猀瀀攀挀昀椀挀漀猀 瀀愀爀愀 搀愀琀漀猀 挀爀琀椀挀漀猀ഀഀ
interface User {਍  攀洀愀椀氀㨀 猀琀爀椀渀最㬀 ⼀⼀ 䌀愀洀瀀漀 攀猀瀀攀挀昀椀挀漀 瀀愀爀愀 愀甀琀攀渀琀椀挀愀挀椀渀ഀഀ
  role: UserRole; // Enum para permisos਍  挀漀洀瀀愀渀礀开椀搀㨀 猀琀爀椀渀最㬀 ⼀⼀ 䌀愀洀瀀漀 攀猀瀀攀挀昀椀挀漀 瀀愀爀愀 洀甀氀琀椀ⴀ琀攀渀愀渀挀礀ഀഀ
}਍ഀഀ
// ✅ Usar etiquetas para categorización flexible਍⼀⼀ 䔀琀椀焀甀攀琀愀猀㨀 嬀✀搀攀猀愀爀爀漀氀氀愀搀漀爀✀Ⰰ ✀猀攀渀椀漀爀✀Ⰰ ✀昀爀漀渀琀攀渀搀✀Ⰰ ✀爀攀愀挀琀✀Ⰰ ✀攀焀甀椀瀀漀ⴀ愀✀崀ഀഀ
```਍ഀഀ
#### **2. Validaciones de Negocio**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// ❌ No usar etiquetas para validaciones críticas਍⼀⼀ 䔀琀椀焀甀攀琀愀猀 渀漀 最愀爀愀渀琀椀稀愀渀 挀漀渀猀椀猀琀攀渀挀椀愀 搀攀 搀愀琀漀猀ഀഀ
਍⼀⼀ Ԁ‧唀猀愀爀 挀愀洀瀀漀猀 攀猀瀀攀挀昀椀挀漀猀 瀀愀爀愀 瘀愀氀椀搀愀挀椀漀渀攀猀ഀഀ
interface Deal {਍  愀洀漀甀渀琀㨀 渀甀洀戀攀爀㬀 ⼀⼀ 嘀愀氀椀搀愀挀椀渀 搀攀 琀椀瀀漀 礀 爀愀渀最漀ഀഀ
  currency: string; // Validación de valores permitidos਍  猀琀愀最攀㨀 䐀攀愀氀匀琀愀最攀㬀 ⼀⼀ 䔀渀甀洀 瀀愀爀愀 昀氀甀樀漀 搀攀 瘀攀渀琀愀猀ഀഀ
}਍怀怀怀ഀഀ
਍⌀⌀ ⨀⨀倀愀琀爀渀 搀攀 䤀洀瀀氀攀洀攀渀琀愀挀椀渀 䔀猀琀渀搀愀爀⨀⨀ഀഀ
਍⌀⌀⌀ ⨀⨀㄀⸀ 䔀猀琀爀甀挀琀甀爀愀 搀攀 䔀渀琀椀搀愀搀⨀⨀ഀഀ
```typescript਍⼀⼀ 吀漀搀愀猀 氀愀猀 攀渀琀椀搀愀搀攀猀 焀甀攀 爀攀焀甀椀攀爀攀渀 攀琀椀焀甀攀琀愀猀 猀椀最甀攀渀 攀猀琀攀 瀀愀琀爀渀ഀഀ
interface EntityWithTags {਍  ⼀⼀ 䌀愀洀瀀漀猀 戀猀椀挀漀猀 搀攀 氀愀 攀渀琀椀搀愀搀ഀഀ
  id: string;਍  挀漀洀瀀愀渀礀开椀搀㨀 猀琀爀椀渀最㬀ഀഀ
  name: string;਍  ⼀⼀ ⸀⸀⸀ 漀琀爀漀猀 挀愀洀瀀漀猀 攀猀瀀攀挀昀椀挀漀猀ഀഀ
  ਍  ⼀⼀ 䰀愀猀 攀琀椀焀甀攀琀愀猀 猀攀 洀愀渀攀樀愀渀 愀 琀爀愀瘀猀 搀攀氀 栀漀漀欀 甀猀攀䔀渀琀椀琀礀吀愀最猀ഀഀ
  // NO incluir tags directamente en la interfaz਍紀ഀഀ
```਍ഀഀ
### **2. Hook de Implementación**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// Usar useEntityTags en todos los componentes਍挀漀渀猀琀 䴀礀䌀漀洀瀀漀渀攀渀琀 㴀 ⠀笀 攀渀琀椀琀礀䤀搀 紀㨀 笀 攀渀琀椀琀礀䤀搀㨀 猀琀爀椀渀最 紀⤀ 㴀㸀 笀ഀഀ
  const { ਍    琀愀最猀Ⰰ ഀഀ
    loading, ਍    甀瀀搀愀琀攀吀愀最猀Ⰰ ഀഀ
    hasTag, ਍    最攀琀吀愀最猀䈀礀䌀愀琀攀最漀爀礀 ഀഀ
  } = useEntityTags('entity_type', entityId);਍  ഀഀ
  // Lógica del componente਍紀㬀ഀഀ
```਍ഀഀ
### **3. Componentes UI Estándar**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// Mostrar etiquetas਍㰀吀愀最䐀椀猀瀀氀愀礀 ഀഀ
  tags={tags} ਍  洀愀砀吀愀最猀㴀笀㘀紀 ഀഀ
  onTagClick={handleTagClick} ਍⼀㸀ഀഀ
਍⼀⼀ 䔀搀椀琀愀爀 攀琀椀焀甀攀琀愀猀ഀഀ
<TagSelector਍  猀攀氀攀挀琀攀搀吀愀最猀㴀笀琀愀最猀紀ഀഀ
  availableTags={availableTags}਍  漀渀吀愀最猀䌀栀愀渀最攀㴀笀甀瀀搀愀琀攀吀愀最猀紀ഀഀ
  placeholder="Añadir etiquetas..."਍  愀氀氀漀眀䌀爀攀愀琀攀㴀笀琀爀甀攀紀ഀഀ
/>਍怀怀怀ഀഀ
਍⌀⌀ ⨀⨀䌀愀琀攀最漀爀愀猀 搀攀 䔀琀椀焀甀攀琀愀猀 刀攀挀漀洀攀渀搀愀搀愀猀⨀⨀ഀഀ
਍⌀⌀⌀ ⨀⨀倀漀爀 䴀搀甀氀漀⨀⨀ഀഀ
਍⌀⌀⌀⌀ ⨀⨀䌀刀䴀⨀⨀ഀഀ
```typescript਍挀漀渀猀琀 䌀刀䴀开䌀䄀吀䔀䜀伀刀䤀䔀匀 㴀 笀ഀഀ
  'Estado del Cliente': ['nuevo', 'prospecto', 'cliente', 'inactivo'],਍  ✀䤀渀搀甀猀琀爀椀愀✀㨀 嬀✀琀攀挀栀✀Ⰰ ✀昀椀渀愀渀稀愀猀✀Ⰰ ✀猀愀氀甀搀✀Ⰰ ✀攀搀甀挀愀挀椀渀✀Ⰰ ✀爀攀琀愀椀氀✀崀Ⰰഀഀ
  'Tamaño': ['startup', 'pyme', 'empresa', 'corporación'],਍  ✀倀爀椀漀爀椀搀愀搀✀㨀 嬀✀戀愀樀愀✀Ⰰ ✀洀攀搀椀愀✀Ⰰ ✀愀氀琀愀✀Ⰰ ✀甀爀最攀渀琀攀✀崀Ⰰഀഀ
  'Fuente': ['referido', 'marketing', 'evento', 'cold-call'],਍  ✀刀攀最椀渀✀㨀 嬀✀渀漀爀琀攀✀Ⰰ ✀猀甀爀✀Ⰰ ✀攀猀琀攀✀Ⰰ ✀漀攀猀琀攀✀Ⰰ ✀椀渀琀攀爀渀愀挀椀漀渀愀氀✀崀ഀഀ
};਍怀怀怀ഀഀ
਍⌀⌀⌀⌀ ⨀⨀䠀攀氀瀀 䐀攀猀欀⨀⨀ഀഀ
```typescript਍挀漀渀猀琀 䠀䔀䰀倀开䐀䔀匀䬀开䌀䄀吀䔀䜀伀刀䤀䔀匀 㴀 笀ഀഀ
  'Tipo de Problema': ['técnico', 'facturación', 'funcionalidad', 'bug'],਍  ✀倀爀漀搀甀挀琀漀✀㨀 嬀✀愀瀀瀀ⴀ眀攀戀✀Ⰰ ✀愀瀀瀀ⴀ洀漀戀椀氀攀✀Ⰰ ✀愀瀀椀✀Ⰰ ✀搀愀猀栀戀漀愀爀搀✀崀Ⰰഀഀ
  'Prioridad': ['baja', 'media', 'alta', 'crítica'],਍  ✀䔀猀琀愀搀漀✀㨀 嬀✀愀戀椀攀爀琀漀✀Ⰰ ✀攀渀ⴀ瀀爀漀挀攀猀漀✀Ⰰ ✀攀猀瀀攀爀愀渀搀漀ⴀ挀氀椀攀渀琀攀✀Ⰰ ✀爀攀猀甀攀氀琀漀✀崀Ⰰഀഀ
  'Escalamiento': ['nivel-1', 'nivel-2', 'supervisor', 'gerencia'],਍  ✀䌀氀椀攀渀琀攀✀㨀 嬀✀瘀椀瀀✀Ⰰ ✀瀀爀攀洀椀甀洀✀Ⰰ ✀攀猀琀渀搀愀爀✀Ⰰ ✀渀甀攀瘀漀✀崀ഀഀ
};਍怀怀怀ഀഀ
਍⌀⌀⌀⌀ ⨀⨀伀瀀攀爀愀琀椀漀渀愀氀 刀攀瀀漀猀椀琀漀爀椀攀猀⨀⨀ഀഀ
```typescript਍挀漀渀猀琀 伀倀䔀刀䄀吀䤀伀一匀开䌀䄀吀䔀䜀伀刀䤀䔀匀 㴀 笀ഀഀ
  'Departamento': ['ventas', 'marketing', 'soporte', 'desarrollo'],਍  ✀吀椀瀀漀 搀攀 刀攀挀甀爀猀漀✀㨀 嬀✀琀攀洀瀀氀愀琀攀✀Ⰰ ✀最甀愀✀Ⰰ ✀瀀爀漀挀攀猀漀✀Ⰰ ✀挀栀攀挀欀氀椀猀琀✀崀Ⰰഀഀ
  'Uso': ['frecuente', 'ocasional', 'especializado', 'deprecado'],਍  ✀䌀愀氀椀搀愀搀✀㨀 嬀✀愀氀琀愀✀Ⰰ ✀洀攀搀椀愀✀Ⰰ ✀戀愀樀愀✀Ⰰ ✀攀渀ⴀ爀攀瘀椀猀椀渀✀崀Ⰰഀഀ
  'Versión': ['v1', 'v2', 'beta', 'estable']਍紀㬀ഀഀ
```਍ഀഀ
## **Patrones de Filtrado y Búsqueda**਍ഀഀ
### **1. Filtros Simples**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// Filtrar por una etiqueta਍挀漀渀猀琀 甀爀最攀渀琀吀椀挀欀攀琀猀 㴀 琀椀挀欀攀琀猀⸀昀椀氀琀攀爀⠀琀椀挀欀攀琀 㴀㸀 ഀഀ
  ticketTags.hasTag('urgente')਍⤀㬀ഀഀ
```਍ഀഀ
### **2. Filtros Combinados**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// Filtrar por múltiples etiquetas (AND)਍挀漀渀猀琀 瘀椀瀀唀爀最攀渀琀䌀氀椀攀渀琀猀 㴀 挀氀椀攀渀琀猀⸀昀椀氀琀攀爀⠀挀氀椀攀渀琀 㴀㸀 ഀഀ
  clientTags.hasAllTags(['vip', 'urgente'])਍⤀㬀ഀഀ
਍⼀⼀ 䘀椀氀琀爀愀爀 瀀漀爀 洀切氀琀椀瀀氀攀猀 攀琀椀焀甀攀琀愀猀 ⠀伀刀⤀ഀഀ
const priorityClients = clients.filter(client => ਍  挀氀椀攀渀琀吀愀最猀⸀栀愀猀䄀渀礀吀愀最⠀嬀✀瘀椀瀀✀Ⰰ ✀瀀爀攀洀椀甀洀✀Ⰰ ✀甀爀最攀渀琀攀✀崀⤀ഀഀ
);਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀㌀⸀ 䘀椀氀琀爀漀猀 瀀漀爀 䌀愀琀攀最漀爀愀⨀⨀ഀഀ
```typescript਍⼀⼀ 䘀椀氀琀爀愀爀 瀀漀爀 挀愀琀攀最漀爀愀 攀猀瀀攀挀昀椀挀愀ഀഀ
const techClients = clients.filter(client => {਍  挀漀渀猀琀 椀渀搀甀猀琀爀礀吀愀最猀 㴀 挀氀椀攀渀琀吀愀最猀⸀最攀琀吀愀最猀䈀礀䌀愀琀攀最漀爀礀⠀✀䤀渀搀甀猀琀爀椀愀✀⤀㬀ഀഀ
  return industryTags.some(tag => tag.name === 'tech');਍紀⤀㬀ഀഀ
```਍ഀഀ
### **4. Búsqueda Avanzada**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// Búsqueda por múltiples criterios਍挀漀渀猀琀 猀攀愀爀挀栀刀攀猀甀氀琀猀 㴀 愀眀愀椀琀 猀攀愀爀挀栀䈀礀吀愀最猀⠀笀ഀഀ
  entity_type: 'contact',਍  琀愀最开渀愀洀攀猀㨀 嬀✀瘀椀瀀✀Ⰰ ✀琀攀挀栀✀Ⰰ ✀渀漀爀琀攀✀崀ഀഀ
});਍怀怀怀ഀഀ
਍⌀⌀ ⨀⨀伀瀀琀椀洀椀稀愀挀椀漀渀攀猀 搀攀 倀攀爀昀漀爀洀愀渀挀攀⨀⨀ഀഀ
਍⌀⌀⌀ ⨀⨀㄀⸀ 䌀愀爀最愀 䰀愀稀礀 搀攀 䔀琀椀焀甀攀琀愀猀⨀⨀ഀഀ
```typescript਍⼀⼀ 匀漀氀漀 挀愀爀最愀爀 攀琀椀焀甀攀琀愀猀 挀甀愀渀搀漀 猀攀愀 渀攀挀攀猀愀爀椀漀ഀഀ
const { tags, loading } = useEntityTags('contact', contactId);਍ഀഀ
// Mostrar skeleton mientras carga਍椀昀 ⠀氀漀愀搀椀渀最⤀ 爀攀琀甀爀渀 㰀吀愀最匀欀攀氀攀琀漀渀 ⼀㸀㬀ഀഀ
```਍ഀഀ
### **2. Caché de Etiquetas Populares**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// Cachear etiquetas más usadas਍挀漀渀猀琀 笀 琀愀最猀 紀 㴀 甀猀攀吀愀最猀⠀⤀㬀ഀഀ
const popularTags = useMemo(() => ਍  琀愀最猀⸀昀椀氀琀攀爀⠀琀愀最 㴀㸀 琀愀最⸀甀猀愀最攀开挀漀甀渀琀 㸀 ㄀　⤀Ⰰ ഀഀ
  [tags]਍⤀㬀ഀഀ
```਍ഀഀ
### **3. Paginación en Listas Grandes**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// Paginar resultados de búsqueda਍挀漀渀猀琀 猀攀愀爀挀栀圀椀琀栀倀愀最椀渀愀琀椀漀渀 㴀 愀猀礀渀挀 ⠀瀀愀爀愀洀猀㨀 匀攀愀爀挀栀倀愀爀愀洀猀⤀ 㴀㸀 笀ഀഀ
  const results = await searchByTags(params);਍  爀攀琀甀爀渀 瀀愀最椀渀愀琀攀刀攀猀甀氀琀猀⠀爀攀猀甀氀琀猀Ⰰ 瀀愀最攀Ⰰ 氀椀洀椀琀⤀㬀ഀഀ
};਍怀怀怀ഀഀ
਍⌀⌀ ⨀⨀嘀愀氀椀搀愀挀椀漀渀攀猀 礀 匀攀最甀爀椀搀愀搀⨀⨀ഀഀ
਍⌀⌀⌀ ⨀⨀㄀⸀ 䰀洀椀琀攀猀 搀攀 䔀琀椀焀甀攀琀愀猀⨀⨀ഀഀ
```typescript਍⼀⼀ 䰀椀洀椀琀愀爀 渀切洀攀爀漀 搀攀 攀琀椀焀甀攀琀愀猀 瀀漀爀 攀渀琀椀搀愀搀ഀഀ
const MAX_TAGS_PER_ENTITY = 20;਍挀漀渀猀琀 䴀䄀堀开吀䄀䜀匀开倀䔀刀开䌀䄀吀䔀䜀伀刀夀 㴀 㔀㬀ഀഀ
਍⼀⼀ 嘀愀氀椀搀愀爀 攀渀 攀氀 昀爀漀渀琀攀渀搀ഀഀ
if (selectedTags.length >= MAX_TAGS_PER_ENTITY) {਍  猀栀漀眀䔀爀爀漀爀⠀✀䴀砀椀洀漀 ㈀　 攀琀椀焀甀攀琀愀猀 瀀漀爀 攀渀琀椀搀愀搀✀⤀㬀ഀഀ
  return;਍紀ഀഀ
```਍ഀഀ
### **2. Validación de Nombres**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// Validar nombres de etiquetas਍挀漀渀猀琀 瘀愀氀椀搀愀琀攀吀愀最一愀洀攀 㴀 ⠀渀愀洀攀㨀 猀琀爀椀渀最⤀㨀 戀漀漀氀攀愀渀 㴀㸀 笀ഀഀ
  const minLength = 2;਍  挀漀渀猀琀 洀愀砀䰀攀渀最琀栀 㴀 㔀　㬀ഀഀ
  const validPattern = /^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s-]+$/;਍  ഀഀ
  return name.length >= minLength && ਍         渀愀洀攀⸀氀攀渀最琀栀 㰀㴀 洀愀砀䰀攀渀最琀栀 ☀☀ ഀഀ
         validPattern.test(name);਍紀㬀ഀഀ
```਍ഀഀ
### **3. Permisos de Creación**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// Verificar permisos antes de crear etiquetas਍挀漀渀猀琀 挀愀渀䌀爀攀愀琀攀吀愀最猀 㴀 栀愀猀倀攀爀洀椀猀猀椀漀渀⠀✀吀䄀䜀开䌀刀䔀䄀吀䔀✀⤀㬀ഀഀ
const canCreateCategories = hasPermission('CATEGORY_CREATE');਍ഀഀ
// Mostrar/ocultar opciones según permisos਍笀挀愀渀䌀爀攀愀琀攀吀愀最猀 ☀☀ 㰀䌀爀攀愀琀攀吀愀最䈀甀琀琀漀渀 ⼀㸀紀ഀഀ
```਍ഀഀ
## **Testing y QA**਍ഀഀ
### **1. Tests Unitarios**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
describe('Tag System', () => {਍  琀攀猀琀⠀✀猀栀漀甀氀搀 愀搀搀 琀愀最猀 琀漀 攀渀琀椀琀礀✀Ⰰ 愀猀礀渀挀 ⠀⤀ 㴀㸀 笀ഀഀ
    const { addTags, tags } = useEntityTags('contact', '123');਍    愀眀愀椀琀 愀搀搀吀愀最猀⠀嬀✀瘀椀瀀✀Ⰰ ✀甀爀最攀渀琀攀✀崀⤀㬀ഀഀ
    expect(tags).toHaveLength(2);਍  紀⤀㬀ഀഀ
  ਍  琀攀猀琀⠀✀猀栀漀甀氀搀 昀椀氀琀攀爀 戀礀 琀愀最猀✀Ⰰ ⠀⤀ 㴀㸀 笀ഀഀ
    const { hasTag, hasAllTags } = useEntityTags('contact', '123');਍    攀砀瀀攀挀琀⠀栀愀猀吀愀最⠀✀瘀椀瀀✀⤀⤀⸀琀漀䈀攀⠀琀爀甀攀⤀㬀ഀഀ
    expect(hasAllTags(['vip', 'urgente'])).toBe(true);਍  紀⤀㬀ഀഀ
});਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀㈀⸀ 吀攀猀琀猀 搀攀 䤀渀琀攀最爀愀挀椀渀⨀⨀ഀഀ
```typescript਍搀攀猀挀爀椀戀攀⠀✀吀愀最 䤀渀琀攀最爀愀琀椀漀渀✀Ⰰ ⠀⤀ 㴀㸀 笀ഀഀ
  test('should sync tags across modules', async () => {਍    ⼀⼀ 䌀爀攀愀爀 攀琀椀焀甀攀琀愀 攀渀 䌀刀䴀ഀഀ
    await createTag({ name: 'vip', category: 'Prioridad' });਍    ഀഀ
    // Verificar que está disponible en Help Desk਍    挀漀渀猀琀 栀攀氀瀀搀攀猀欀吀愀最猀 㴀 愀眀愀椀琀 最攀琀吀愀最猀⠀笀 洀漀搀甀氀攀㨀 ✀栀攀氀瀀搀攀猀欀✀ 紀⤀㬀ഀഀ
    expect(helpdeskTags).toContainEqual(਍      攀砀瀀攀挀琀⸀漀戀樀攀挀琀䌀漀渀琀愀椀渀椀渀最⠀笀 渀愀洀攀㨀 ✀瘀椀瀀✀ 紀⤀ഀഀ
    );਍  紀⤀㬀ഀഀ
});਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀㌀⸀ 吀攀猀琀猀 搀攀 倀攀爀昀漀爀洀愀渀挀攀⨀⨀ഀഀ
```typescript਍搀攀猀挀爀椀戀攀⠀✀吀愀最 倀攀爀昀漀爀洀愀渀挀攀✀Ⰰ ⠀⤀ 㴀㸀 笀ഀഀ
  test('should handle 1000+ tags efficiently', async () => {਍    挀漀渀猀琀 猀琀愀爀琀吀椀洀攀 㴀 瀀攀爀昀漀爀洀愀渀挀攀⸀渀漀眀⠀⤀㬀ഀഀ
    await searchByTags({ entity_type: 'contact', tag_names: ['vip'] });਍    挀漀渀猀琀 攀渀搀吀椀洀攀 㴀 瀀攀爀昀漀爀洀愀渀挀攀⸀渀漀眀⠀⤀㬀ഀഀ
    ਍    攀砀瀀攀挀琀⠀攀渀搀吀椀洀攀 ⴀ 猀琀愀爀琀吀椀洀攀⤀⸀琀漀䈀攀䰀攀猀猀吀栀愀渀⠀㄀　　⤀㬀 ⼀⼀ 㰀 ㄀　　洀猀ഀഀ
  });਍紀⤀㬀ഀഀ
```਍ഀഀ
## **Métricas y Analytics**਍ഀഀ
### **1. Métricas de Uso**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// Trackear uso de etiquetas਍挀漀渀猀琀 琀愀最䴀攀琀爀椀挀猀 㴀 笀ഀഀ
  total_tags_created: 150,਍  琀愀最猀开瀀攀爀开攀渀琀椀琀礀开愀瘀最㨀 ㌀⸀㈀Ⰰഀഀ
  most_used_tags: ['vip', 'urgente', 'tech'],਍  挀愀琀攀最漀爀椀攀猀开甀猀愀最攀㨀 笀ഀഀ
    'Prioridad': 45,਍    ✀䤀渀搀甀猀琀爀椀愀✀㨀 ㌀㈀Ⰰഀഀ
    'Estado': 23਍  紀ഀഀ
};਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀㈀⸀ 䴀琀爀椀挀愀猀 搀攀 倀攀爀昀漀爀洀愀渀挀攀⨀⨀ഀഀ
```typescript਍⼀⼀ 䴀漀渀椀琀漀爀攀愀爀 瀀攀爀昀漀爀洀愀渀挀攀ഀഀ
const performanceMetrics = {਍  愀瘀最开猀攀愀爀挀栀开琀椀洀攀㨀 㠀㔀Ⰰ ⼀⼀ 洀猀ഀഀ
  cache_hit_rate: 0.92, // 92%਍  搀戀开焀甀攀爀椀攀猀开瀀攀爀开洀椀渀甀琀攀㨀 ㄀㔀　Ⰰഀഀ
  memory_usage_mb: 45਍紀㬀ഀഀ
```਍ഀഀ
## **Mantenimiento y Evolución**਍ഀഀ
### **1. Limpieza de Etiquetas**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// Identificar etiquetas no utilizadas਍挀漀渀猀琀 甀渀甀猀攀搀吀愀最猀 㴀 琀愀最猀⸀昀椀氀琀攀爀⠀琀愀最 㴀㸀 琀愀最⸀甀猀愀最攀开挀漀甀渀琀 㴀㴀㴀 　⤀㬀ഀഀ
਍⼀⼀ 匀甀最攀爀椀爀 挀漀渀猀漀氀椀搀愀挀椀渀 搀攀 攀琀椀焀甀攀琀愀猀 猀椀洀椀氀愀爀攀猀ഀഀ
const similarTags = findSimilarTags(tags, threshold = 0.8);਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀㈀⸀ 䴀椀最爀愀挀椀渀 搀攀 䐀愀琀漀猀⨀⨀ഀഀ
```typescript਍⼀⼀ 䴀椀最爀愀爀 挀愀洀瀀漀猀 攀猀瀀攀挀昀椀挀漀猀 愀 攀琀椀焀甀攀琀愀猀ഀഀ
const migrateFieldToTags = async (entityType: string, fieldName: string) => {਍  挀漀渀猀琀 攀渀琀椀琀椀攀猀 㴀 愀眀愀椀琀 最攀琀䔀渀琀椀琀椀攀猀⠀攀渀琀椀琀礀吀礀瀀攀⤀㬀ഀഀ
  ਍  昀漀爀 ⠀挀漀渀猀琀 攀渀琀椀琀礀 漀昀 攀渀琀椀琀椀攀猀⤀ 笀ഀഀ
    const fieldValue = entity[fieldName];਍    椀昀 ⠀昀椀攀氀搀嘀愀氀甀攀⤀ 笀ഀഀ
      await tagEntity({਍        攀渀琀椀琀礀开琀礀瀀攀㨀 攀渀琀椀琀礀吀礀瀀攀Ⰰഀഀ
        entity_id: entity.id,਍        琀愀最开渀愀洀攀猀㨀 嬀昀椀攀氀搀嘀愀氀甀攀崀ഀഀ
      });਍    紀ഀഀ
  }਍紀㬀ഀഀ
```਍ഀഀ
## **Checklist de Implementación**਍ഀഀ
### **✅ Antes de Implementar**਍ⴀ 嬀 崀 䤀搀攀渀琀椀昀椀挀愀爀 攀渀琀椀搀愀搀攀猀 焀甀攀 爀攀焀甀椀攀爀攀渀 挀愀琀攀最漀爀椀稀愀挀椀渀 昀氀攀砀椀戀氀攀ഀഀ
- [ ] Definir categorías de etiquetas por módulo਍ⴀ 嬀 崀 䔀猀琀愀戀氀攀挀攀爀 氀洀椀琀攀猀 礀 瘀愀氀椀搀愀挀椀漀渀攀猀ഀഀ
- [ ] Planificar estrategia de migración si aplica਍ഀഀ
### **✅ Durante la Implementación**਍ⴀ 嬀 崀 唀猀愀爀 怀甀猀攀䔀渀琀椀琀礀吀愀最猀怀 栀漀漀欀 挀漀渀猀椀猀琀攀渀琀攀洀攀渀琀攀ഀഀ
- [ ] Implementar componentes UI estándar਍ⴀ 嬀 崀 䄀愀搀椀爀 瘀愀氀椀搀愀挀椀漀渀攀猀 搀攀 瀀攀爀洀椀猀漀猀ഀഀ
- [ ] Configurar RLS en base de datos਍ഀഀ
### **✅ Después de la Implementación**਍ⴀ 嬀 崀 䌀爀攀愀爀 琀攀猀琀猀 甀渀椀琀愀爀椀漀猀 礀 搀攀 椀渀琀攀最爀愀挀椀渀ഀഀ
- [ ] Configurar métricas y monitoreo਍ⴀ 嬀 崀 䐀漀挀甀洀攀渀琀愀爀 瀀愀琀爀漀渀攀猀 搀攀 甀猀漀ഀഀ
- [ ] Entrenar equipo en buenas prácticas਍ഀഀ
## **Conclusiones**਍ഀഀ
El **Sistema Universal de Etiquetas** es una **definición genérica de buenas prácticas** que:਍ഀഀ
1. **Evita la rigidez** de campos predefinidos਍㈀⸀ ⨀⨀䘀漀爀琀愀氀攀挀攀 氀愀 挀愀琀攀最漀爀椀稀愀挀椀渀⨀⨀ 攀洀攀爀最攀渀琀攀 礀 昀氀攀砀椀戀氀攀ഀഀ
3. **Potencia los filtros** y búsquedas avanzadas਍㐀⸀ ⨀⨀䔀猀挀愀氀愀 渀愀琀甀爀愀氀洀攀渀琀攀⨀⨀ 挀漀渀 氀愀猀 渀攀挀攀猀椀搀愀搀攀猀 搀攀氀 甀猀甀愀爀椀漀ഀഀ
5. **Mantiene consistencia** en toda la plataforma਍ഀഀ
Siguiendo estas buenas prácticas, cada módulo puede implementar etiquetas de forma consistente, aprovechando la flexibilidad y poder de categorización que ofrece el sistema.਍ഀഀ
---਍ഀഀ
**Documentado por:** Marcelo Escallón, CEO de Euphorianet  ਍⨀⨀䘀攀挀栀愀㨀⨀⨀ ㈀　 搀攀 䐀椀挀椀攀洀戀爀攀 搀攀 ㈀　㈀㐀  ഀഀ
**Confidencialidad:** Interno - Euphorianet਍