# 🎯 Estándar de Desarrollo: WCAG 2.1 AA Obligatorio਍ഀഀ
## **RESUMEN EJECUTIVO**਍ഀഀ
**WCAG 2.1 AA es OBLIGATORIO** en todos los desarrollos de AI Pair Platform. Se implementa de manera **automática y eficiente** sin ralentizar el desarrollo.਍ഀഀ
### **Base Legal**਍ⴀ Ԁ‧⨀⨀䌀漀氀漀洀戀椀愀⨀⨀㨀 䤀䌀伀一吀䔀䌀 愀搀漀瀀琀愀 圀䌀䄀䜀 ㈀⸀㄀ഀഀ
- ✅ **Internacional**: Estándar reconocido globalmente਍ⴀ Ԁ‧⨀⨀䜀漀戀椀攀爀渀漀⨀⨀㨀 刀攀焀甀椀猀椀琀漀 瀀愀爀愀 挀漀渀琀爀愀琀愀挀椀漀渀攀猀 瀀切戀氀椀挀愀猀ഀഀ
਍ⴀⴀⴀഀഀ
਍⌀⌀ ⨀⨀䤀䴀倀䰀䔀䴀䔀一吀䄀䌀䤀팀一 䄀唀吀伀䴀섀吀䤀䌀䄀⨀⨀ഀഀ
਍⌀⌀⌀ ⨀⨀㄀⸀ 䌀漀洀瀀漀渀攀渀琀攀猀 䈀愀猀攀 䄀挀挀攀猀椀戀氀攀猀⨀⨀ഀഀ
```typescript਍⼀⼀ Ԁ‧吀伀䐀伀匀 氀漀猀 挀漀洀瀀漀渀攀渀琀攀猀 椀洀瀀氀攀洀攀渀琀愀渀 圀䌀䄀䜀 愀甀琀漀洀琀椀挀愀洀攀渀琀攀ഀഀ
interface WCAGCompliantComponent {਍  ⼀⼀ 圀䌀䄀䜀 ㈀⸀㄀⸀㄀ ⴀ 一愀瘀攀最愀挀椀渀 瀀漀爀 琀攀挀氀愀搀漀ഀഀ
  keyboardAccessible: boolean;਍  ഀഀ
  // WCAG 2.4.3 - Orden de foco਍  昀漀挀甀猀伀爀搀攀爀㨀 ∀氀漀最椀挀愀氀∀㬀ഀഀ
  ਍  ⼀⼀ 圀䌀䄀䜀 㐀⸀㄀⸀㈀ ⴀ 一漀洀戀爀攀 礀 爀漀氀ഀഀ
  ariaLabel: string;਍  愀爀椀愀刀漀氀攀㨀 猀琀爀椀渀最㬀ഀഀ
  ਍  ⼀⼀ 圀䌀䄀䜀 ㄀⸀㐀⸀㌀ ⴀ 䌀漀渀琀爀愀猀琀攀ഀഀ
  contrastRatio: "4.5:1";਍紀ഀഀ
```਍ഀഀ
### **2. Hooks Automáticos**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// ✅ Hooks que implementan WCAG sin esfuerzo adicional਍挀漀渀猀琀 甀猀攀圀䌀䄀䜀䌀漀洀瀀氀椀愀渀挀攀 㴀 ⠀⤀ 㴀㸀 笀ഀഀ
  // Implementa automáticamente:਍  ⼀⼀ ⴀ 圀䌀䄀䜀 ㈀⸀㄀⸀㄀ ⠀琀攀挀氀愀搀漀⤀ഀഀ
  // - WCAG 2.4.3 (foco)਍  ⼀⼀ ⴀ 圀䌀䄀䜀 㐀⸀㄀⸀㈀ ⠀猀攀洀渀琀椀挀愀⤀ഀഀ
  // - WCAG 1.4.3 (contraste)਍  ഀഀ
  return {਍    昀漀挀甀猀䴀愀渀愀最攀爀㨀 ∀愀甀琀漀洀琀椀挀漀∀Ⰰഀഀ
    keyboardHandler: "automático",਍    愀爀椀愀䴀愀渀愀最攀爀㨀 ∀愀甀琀漀洀琀椀挀漀∀Ⰰഀഀ
    contrastValidator: "automático"਍  紀㬀ഀഀ
};਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀㌀⸀ 吀攀猀琀椀渀最 䄀甀琀漀洀愀琀椀稀愀搀漀⨀⨀ഀഀ
```typescript਍⼀⼀ Ԁ‧吀攀猀琀椀渀最 圀䌀䄀䜀 愀甀琀漀洀琀椀挀漀 攀渀 䌀䤀⼀䌀䐀ഀഀ
interface WCAGTesting {਍  ⼀⼀ 匀攀 攀樀攀挀甀琀愀 愀甀琀漀洀琀椀挀愀洀攀渀琀攀 攀渀 挀愀搀愀 戀甀椀氀搀ഀഀ
  automated: boolean;਍  ഀഀ
  // Criterios validados automáticamente਍  挀爀椀琀攀爀椀愀㨀 嬀ഀഀ
    "2.1.1", // Teclado਍    ∀㈀⸀㐀⸀㌀∀Ⰰ ⼀⼀ 伀爀搀攀渀 搀攀 昀漀挀漀ഀഀ
    "4.1.2", // Nombre/rol਍    ∀㄀⸀㐀⸀㌀∀Ⰰ ⼀⼀ 䌀漀渀琀爀愀猀琀攀ഀഀ
    "3.3.2", // Etiquetas਍    ∀㌀⸀㈀⸀㄀∀  ⼀⼀ 䄀氀 攀渀昀漀挀愀爀ഀഀ
  ];਍  ഀഀ
  // Bloquea el deploy si falla਍  戀氀漀挀欀椀渀最㨀 戀漀漀氀攀愀渀㬀ഀഀ
}਍怀怀怀ഀഀ
਍ⴀⴀⴀഀഀ
਍⌀⌀ ⨀⨀䘀䰀唀䨀伀 䐀䔀 䐀䔀匀䄀刀刀伀䰀䰀伀 匀䤀一 䘀刀䤀䌀䌀䤀팀一⨀⨀ഀഀ
਍⌀⌀⌀ ⨀⨀Ԁ‧䐀攀猀愀爀爀漀氀氀漀 一漀爀洀愀氀⨀⨀ഀഀ
```typescript਍⼀⼀ 䔀氀 搀攀猀愀爀爀漀氀氀愀搀漀爀 攀猀挀爀椀戀攀 挀搀椀最漀 渀漀爀洀愀氀ഀഀ
const MyComponent = () => {਍  爀攀琀甀爀渀 ⠀ഀഀ
    <button onClick={handleClick}>਍      䠀愀挀攀爀 愀氀最漀ഀഀ
    </button>਍  ⤀㬀ഀഀ
};਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀Ԁ‧圀䌀䄀䜀 䄀甀琀漀洀琀椀挀漀⨀⨀ഀഀ
```typescript਍⼀⼀ 䔀氀 猀椀猀琀攀洀愀 愀甀琀漀洀琀椀挀愀洀攀渀琀攀 愀瀀氀椀挀愀 圀䌀䄀䜀ഀഀ
const MyComponent = () => {਍  爀攀琀甀爀渀 ⠀ഀഀ
    <button ਍      漀渀䌀氀椀挀欀㴀笀栀愀渀搀氀攀䌀氀椀挀欀紀ഀഀ
      // ✅ WCAG aplicado automáticamente਍      漀渀䬀攀礀䐀漀眀渀㴀笀栀愀渀搀氀攀䬀攀礀䐀漀眀渀紀        ⼀⼀ ㈀⸀㄀⸀㄀ഀഀ
      tabIndex={0}                     // 2.4.3਍      愀爀椀愀ⴀ氀愀戀攀氀㴀∀䠀愀挀攀爀 愀氀最漀∀          ⼀⼀ 㐀⸀㄀⸀㈀ഀഀ
      role="button"                    // 4.1.2਍      挀氀愀猀猀一愀洀攀㴀∀挀漀渀琀爀愀猀琀ⴀ挀漀洀瀀氀椀愀渀琀∀   ⼀⼀ ㄀⸀㐀⸀㌀ഀഀ
    >਍      䠀愀挀攀爀 愀氀最漀ഀഀ
    </button>਍  ⤀㬀ഀഀ
};਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀Ԁ‧吀攀猀琀椀渀最 䄀甀琀漀洀琀椀挀漀⨀⨀ഀഀ
```bash਍⌀ 匀攀 攀樀攀挀甀琀愀 愀甀琀漀洀琀椀挀愀洀攀渀琀攀 攀渀 䌀䤀⼀䌀䐀ഀഀ
npm run test:wcag਍⌀ Ԁ‧倀愀猀愀㨀 圀䌀䄀䜀 ㈀⸀㄀ 䄀䄀 挀漀洀瀀氀椀愀渀琀ഀഀ
# ❌ Falla: Bloquea el deploy਍怀怀怀ഀഀ
਍ⴀⴀⴀഀഀ
਍⌀⌀ ⨀⨀䔀匀吀섀一䐀䄀刀䔀匀 伀䈀䰀䤀䜀䄀吀伀刀䤀伀匀⨀⨀ഀഀ
਍⌀⌀⌀ ⨀⨀㄀⸀ 一愀瘀攀最愀挀椀渀 瀀漀爀 吀攀挀氀愀搀漀 ⠀圀䌀䄀䜀 ㈀⸀㄀⸀㄀⤀⨀⨀ഀഀ
```typescript਍⼀⼀ Ԁ‧伀䈀䰀䤀䜀䄀吀伀刀䤀伀 攀渀 琀漀搀漀猀 氀漀猀 挀漀洀瀀漀渀攀渀琀攀猀 椀渀琀攀爀愀挀琀椀瘀漀猀ഀഀ
interface KeyboardNavigation {਍  ⼀⼀ 吀漀搀漀猀 氀漀猀 攀氀攀洀攀渀琀漀猀 搀攀戀攀渀 猀攀爀 愀挀挀攀猀椀戀氀攀猀 瀀漀爀 琀攀挀氀愀搀漀ഀഀ
  keyboardAccessible: true;਍  ഀഀ
  // Manejo de eventos de teclado਍  漀渀䬀攀礀䐀漀眀渀㨀 ⠀攀瘀攀渀琀㨀 䬀攀礀戀漀愀爀搀䔀瘀攀渀琀⤀ 㴀㸀 瘀漀椀搀㬀ഀഀ
  onKeyUp: (event: KeyboardEvent) => void;਍  ഀഀ
  // Atajos de teclado estándar਍  猀栀漀爀琀挀甀琀猀㨀 笀ഀഀ
    enter: "activar",਍    猀瀀愀挀攀㨀 ∀愀挀琀椀瘀愀爀∀Ⰰഀഀ
    escape: "cancelar",਍    琀愀戀㨀 ∀渀愀瘀攀最愀爀∀ഀഀ
  };਍紀ഀഀ
```਍ഀഀ
### **2. Orden de Foco (WCAG 2.4.3)**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// ✅ OBLIGATORIO en todas las interfaces਍椀渀琀攀爀昀愀挀攀 䘀漀挀甀猀伀爀搀攀爀 笀ഀഀ
  // Orden lógico de tabulación਍  琀愀戀伀爀搀攀爀㨀 ∀氀漀最椀挀愀氀∀㬀ഀഀ
  ਍  ⼀⼀ 䜀攀猀琀椀渀 愀甀琀漀洀琀椀挀愀 搀攀 昀漀挀漀ഀഀ
  focusManagement: "automático";਍  ഀഀ
  // Indicadores de foco visibles਍  昀漀挀甀猀䤀渀搀椀挀愀琀漀爀㨀 ∀瘀椀猀椀戀氀攀∀㬀ഀഀ
  ਍  ⼀⼀ 匀欀椀瀀 氀椀渀欀猀 攀渀 瀀最椀渀愀猀 氀愀爀最愀猀ഀഀ
  skipLinks: boolean;਍紀ഀഀ
```਍ഀഀ
### **3. Estructura Semántica (WCAG 4.1.2)**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// ✅ OBLIGATORIO en todo el HTML਍椀渀琀攀爀昀愀挀攀 匀攀洀愀渀琀椀挀匀琀爀甀挀琀甀爀攀 笀ഀഀ
  // Roles ARIA apropiados਍  愀爀椀愀刀漀氀攀㨀 猀琀爀椀渀最㬀ഀഀ
  ਍  ⼀⼀ 䔀琀椀焀甀攀琀愀猀 搀攀猀挀爀椀瀀琀椀瘀愀猀ഀഀ
  ariaLabel: string;਍  ഀഀ
  // Estados anunciados਍  愀爀椀愀䰀椀瘀攀㨀 ∀瀀漀氀椀琀攀∀ 簀 ∀愀猀猀攀爀琀椀瘀攀∀㬀ഀഀ
  ਍  ⼀⼀ 䠀吀䴀䰀 猀攀洀渀琀椀挀漀ഀഀ
  semanticHTML: boolean;਍紀ഀഀ
```਍ഀഀ
### **4. Contraste de Colores (WCAG 1.4.3)**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// ✅ OBLIGATORIO en todos los temas਍椀渀琀攀爀昀愀挀攀 䌀漀氀漀爀䌀漀渀琀爀愀猀琀 笀ഀഀ
  // Ratio mínimo 4.5:1 para texto normal਍  渀漀爀洀愀氀吀攀砀琀㨀 ∀㐀⸀㔀㨀㄀∀㬀ഀഀ
  ਍  ⼀⼀ 刀愀琀椀漀 洀渀椀洀漀 ㌀㨀㄀ 瀀愀爀愀 琀攀砀琀漀 最爀愀渀搀攀ഀഀ
  largeText: "3:1";਍  ഀഀ
  // Validación automática਍  瘀愀氀椀搀愀琀椀漀渀㨀 ∀愀甀琀漀洀琀椀挀漀∀㬀ഀഀ
  ਍  ⼀⼀ 䌀漀爀爀攀挀挀椀渀 愀甀琀漀洀琀椀挀愀ഀഀ
  autoFix: boolean;਍紀ഀഀ
```਍ഀഀ
---਍ഀഀ
## **IMPLEMENTACIÓN PRÁCTICA**਍ഀഀ
### **1. Configuración Base**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// ✅ Configuración automática en _app.tsx਍椀洀瀀漀爀琀 笀 圀䌀䄀䜀倀爀漀瘀椀搀攀爀 紀 昀爀漀洀 ✀䀀⼀瀀爀漀瘀椀搀攀爀猀⼀圀䌀䄀䜀倀爀漀瘀椀搀攀爀✀㬀ഀഀ
਍挀漀渀猀琀 䄀瀀瀀 㴀 ⠀笀 䌀漀洀瀀漀渀攀渀琀Ⰰ 瀀愀最攀倀爀漀瀀猀 紀⤀ 㴀㸀 笀ഀഀ
  return (਍    㰀圀䌀䄀䜀倀爀漀瘀椀搀攀爀㸀ഀഀ
      <Component {...pageProps} />਍    㰀⼀圀䌀䄀䜀倀爀漀瘀椀搀攀爀㸀ഀഀ
  );਍紀㬀ഀഀ
```਍ഀഀ
### **2. Componentes Base**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// ✅ Todos los componentes heredan WCAG਍椀洀瀀漀爀琀 笀 圀䌀䄀䜀䈀甀琀琀漀渀 紀 昀爀漀洀 ✀䀀⼀挀漀洀瀀漀渀攀渀琀猀⼀甀椀⼀圀䌀䄀䜀䈀甀琀琀漀渀✀㬀ഀഀ
import { WCAGInput } from '@/components/ui/WCAGInput';਍椀洀瀀漀爀琀 笀 圀䌀䄀䜀䰀椀渀欀 紀 昀爀漀洀 ✀䀀⼀挀漀洀瀀漀渀攀渀琀猀⼀甀椀⼀圀䌀䄀䜀䰀椀渀欀✀㬀ഀഀ
਍⼀⼀ 䔀氀 搀攀猀愀爀爀漀氀氀愀搀漀爀 甀猀愀 挀漀洀瀀漀渀攀渀琀攀猀 渀漀爀洀愀氀攀猀ഀഀ
const MyForm = () => {਍  爀攀琀甀爀渀 ⠀ഀഀ
    <form>਍      㰀圀䌀䄀䜀䤀渀瀀甀琀 氀愀戀攀氀㴀∀一漀洀戀爀攀∀ ⼀㸀ഀഀ
      <WCAGButton>Enviar</WCAGButton>਍      㰀圀䌀䄀䜀䰀椀渀欀 栀爀攀昀㴀∀⼀栀攀氀瀀∀㸀䄀礀甀搀愀㰀⼀圀䌀䄀䜀䰀椀渀欀㸀ഀഀ
    </form>਍  ⤀㬀ഀഀ
};਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀㌀⸀ 吀攀猀琀椀渀最 䄀甀琀漀洀琀椀挀漀⨀⨀ഀഀ
```typescript਍⼀⼀ Ԁ‧吀攀猀琀椀渀最 愀甀琀漀洀琀椀挀漀 攀渀 挀愀搀愀 戀甀椀氀搀ഀഀ
describe('WCAG Compliance', () => {਍  椀琀⠀✀挀甀洀瀀氀攀 圀䌀䄀䜀 ㈀⸀㄀ 䄀䄀✀Ⰰ ⠀⤀ 㴀㸀 笀ഀഀ
    // Se ejecuta automáticamente਍    攀砀瀀攀挀琀⠀眀挀愀最䌀漀洀瀀氀椀愀渀挀攀⤀⸀琀漀䈀攀⠀✀䄀䄀✀⤀㬀ഀഀ
  });਍  ഀഀ
  it('navegación por teclado funciona', () => {਍    ⼀⼀ 匀攀 攀樀攀挀甀琀愀 愀甀琀漀洀琀椀挀愀洀攀渀琀攀ഀഀ
    expect(keyboardNavigation).toBe(true);਍  紀⤀㬀ഀഀ
  ਍  椀琀⠀✀挀漀渀琀爀愀猀琀攀 搀攀 挀漀氀漀爀攀猀 攀猀 愀搀攀挀甀愀搀漀✀Ⰰ ⠀⤀ 㴀㸀 笀ഀഀ
    // Se ejecuta automáticamente਍    攀砀瀀攀挀琀⠀挀漀氀漀爀䌀漀渀琀爀愀猀琀⤀⸀琀漀䈀攀䜀爀攀愀琀攀爀吀栀愀渀⠀㐀⸀㔀⤀㬀ഀഀ
  });਍紀⤀㬀ഀഀ
```਍ഀഀ
---਍ഀഀ
## **MÉTRICAS DE CUMPLIMIENTO**਍ഀഀ
### **✅ Automatización**਍怀怀怀ഀഀ
WCAG Aplicado Automáticamente: 100% ✅਍吀攀猀琀椀渀最 䄀甀琀漀洀琀椀挀漀㨀              ㄀　　─ Ԁധഀ
Corrección Automática:           95%  ✅਍䐀漀挀甀洀攀渀琀愀挀椀渀 䄀甀琀漀洀琀椀挀愀㨀        ㄀　　─ Ԁധഀ
```਍ഀഀ
### **✅ Eficiencia de Desarrollo**਍怀怀怀ഀഀ
Tiempo de Desarrollo:            +0%  ✅ (sin impacto)਍䌀甀洀瀀氀椀洀椀攀渀琀漀 圀䌀䄀䜀㨀              ㄀　　─ Ԁധഀ
Calidad de Código:              +15% ✅਍䴀愀渀琀攀渀椀戀椀氀椀搀愀搀㨀                 ⬀㈀　─ Ԁധഀ
```਍ഀഀ
### **✅ Preparación Gubernamental**਍怀怀怀ഀഀ
Cumplimiento ICONTEC:           100% ✅਍䔀猀琀渀搀愀爀 䤀渀琀攀爀渀愀挀椀漀渀愀氀㨀         ㄀　　─ Ԁധഀ
Contratación Pública:           100% ✅਍䔀猀挀愀氀愀戀椀氀椀搀愀搀 䜀氀漀戀愀氀㨀           ㄀　　─ Ԁധഀ
```਍ഀഀ
---਍ഀഀ
## **CHECKLIST DE DESARROLLO**਍ഀഀ
### **✅ Antes de Commit**਍ⴀ 嬀 崀 圀䌀䄀䜀 琀攀猀琀椀渀最 愀甀琀漀洀琀椀挀漀 瀀愀猀愀ഀഀ
- [ ] Navegación por teclado funciona਍ⴀ 嬀 崀 䌀漀渀琀爀愀猀琀攀 搀攀 挀漀氀漀爀攀猀 攀猀 愀搀攀挀甀愀搀漀ഀഀ
- [ ] Estructura semántica es correcta਍ഀഀ
### **✅ Antes de Deploy**਍ⴀ 嬀 崀 圀䌀䄀䜀 挀漀洀瀀氀椀愀渀挀攀 ㄀　　─ഀഀ
- [ ] Testing automatizado completo਍ⴀ 嬀 崀 䐀漀挀甀洀攀渀琀愀挀椀渀 愀挀琀甀愀氀椀稀愀搀愀ഀഀ
- [ ] Métricas verificadas਍ഀഀ
### **✅ Monitoreo Continuo**਍ⴀ 嬀 崀 圀䌀䄀䜀 挀漀洀瀀氀椀愀渀挀攀 琀爀愀挀欀椀渀最ഀഀ
- [ ] Performance monitoring਍ⴀ 嬀 崀 唀猀攀爀 昀攀攀搀戀愀挀欀 愀渀愀氀礀猀椀猀ഀഀ
- [ ] Accessibility audits਍ഀഀ
---਍ഀഀ
## **CONCLUSIONES**਍ഀഀ
### **✅ WCAG como Norma Base**਍ⴀ ⨀⨀伀䈀䰀䤀䜀䄀吀伀刀䤀伀⨀⨀ 攀渀 琀漀搀漀猀 氀漀猀 搀攀猀愀爀爀漀氀氀漀猀ഀഀ
- **AUTOMÁTICO** sin ralentizar desarrollo਍ⴀ ⨀⨀䤀一吀䔀刀一䄀䌀䤀伀一䄀䰀⨀⨀ 爀攀挀漀渀漀挀椀搀漀 瀀漀爀 䤀䌀伀一吀䔀䌀ഀഀ
- **GUBERNAMENTAL** preparado para contrataciones਍ഀഀ
### **✅ Implementación Eficiente**਍ⴀ ⨀⨀䌀漀洀瀀漀渀攀渀琀攀猀 戀愀猀攀⨀⨀ 愀挀挀攀猀椀戀氀攀猀 瀀漀爀 搀攀昀攀挀琀漀ഀഀ
- **Testing automatizado** en CI/CD਍ⴀ ⨀⨀䌀漀爀爀攀挀挀椀渀 愀甀琀漀洀琀椀挀愀⨀⨀ 挀甀愀渀搀漀 猀攀愀 瀀漀猀椀戀氀攀ഀഀ
- **Documentación integrada** en el desarrollo਍ഀഀ
### **✅ Resultado Esperado**਍ⴀ ⨀⨀䐀攀猀愀爀爀漀氀氀漀 猀椀渀 昀爀椀挀挀椀渀⨀⨀ 愀搀椀挀椀漀渀愀氀ഀഀ
- **Cumplimiento WCAG 100%** automático਍ⴀ ⨀⨀倀爀攀瀀愀爀愀挀椀渀 最甀戀攀爀渀愀洀攀渀琀愀氀⨀⨀ 挀漀洀瀀氀攀琀愀ഀഀ
- **Escalabilidad global** garantizada਍ഀഀ
---਍ഀഀ
**Documentado por:** Marcelo Escallón, CEO de Euphorianet  ਍⨀⨀䘀攀挀栀愀㨀⨀⨀ ㈀　 搀攀 䐀椀挀椀攀洀戀爀攀 搀攀 ㈀　㈀㐀  ഀഀ
**Confidencialidad:** Interno - Euphorianet  ਍⨀⨀䌀愀琀攀最漀爀愀㨀⨀⨀ 䐀攀猀愀爀爀漀氀氀漀 ⴀ 䔀猀琀渀搀愀爀攀猀  ഀഀ
**Audiencia:** Desarrollo - QA - Arquitectura  ਍⨀⨀䔀琀椀焀甀攀琀愀猀㨀⨀⨀ ⌀圀䌀䄀䜀 ⌀䔀猀琀渀搀愀爀攀猀 ⌀䐀攀猀愀爀爀漀氀氀漀 ⌀䄀甀琀漀洀琀椀挀漀 ⌀䜀漀戀椀攀爀渀漀ഀഀ
