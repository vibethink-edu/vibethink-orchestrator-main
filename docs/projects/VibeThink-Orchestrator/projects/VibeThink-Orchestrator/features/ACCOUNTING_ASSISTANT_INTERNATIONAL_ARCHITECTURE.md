# Arquitectura Internacional del Asistente de Contabilidad਍ഀഀ
## 🎯 **PROBLEMA ARQUITECTÓNICO**਍ഀഀ
### **Desafío**਍ⴀ ⨀⨀䄀猀椀猀琀攀渀琀攀 最攀渀爀椀挀漀⨀⨀ 焀甀攀 昀甀渀挀椀漀渀攀 攀渀 挀甀愀氀焀甀椀攀爀 瀀愀猀ഀഀ
- **Localización específica** para Colombia (y otros países)਍ⴀ ⨀⨀䔀猀挀愀氀愀戀椀氀椀搀愀搀⨀⨀ 猀椀渀 爀漀洀瀀攀爀 昀甀渀挀椀漀渀愀氀椀搀愀搀 攀砀椀猀琀攀渀琀攀ഀഀ
- **Mantenibilidad** del código਍ഀഀ
### **Solución**਍⨀⨀䄀爀焀甀椀琀攀挀琀甀爀愀 攀渀 䌀愀瀀愀猀㨀 䌀漀爀攀 ⬀ 䰀漀挀愀氀椀稀愀琀椀漀渀 ⬀ 䌀漀渀昀椀最甀爀愀琀椀漀渀⨀⨀ഀഀ
਍ⴀⴀⴀഀഀ
਍⌀⌀ 㰀ퟘ࿟⃾⨀⨀䄀刀儀唀䤀吀䔀䌀吀唀刀䄀 䔀一 䌀䄀倀䄀匀⨀⨀ഀഀ
਍⌀⌀⌀ ⨀⨀㄀⸀ 㸀⃝䌀伀刀䔀 䰀䄀夀䔀刀 ⠀䜀攀渀爀椀挀漀⤀⨀⨀ഀഀ
```typescript਍⼀⼀ 䌀漀爀攀 最攀渀爀椀挀漀 焀甀攀 昀甀渀挀椀漀渀愀 攀渀 挀甀愀氀焀甀椀攀爀 瀀愀猀ഀഀ
interface AccountingAssistantCore {਍  ⼀⼀ 䘀甀渀挀椀漀渀愀氀椀搀愀搀攀猀 甀渀椀瘀攀爀猀愀氀攀猀ഀഀ
  documentProcessing: DocumentProcessor;਍  愀氀攀爀琀匀礀猀琀攀洀㨀 䄀氀攀爀琀匀礀猀琀攀洀㬀ഀഀ
  organizationSystem: OrganizationSystem;਍  猀甀最最攀猀琀椀漀渀䔀渀最椀渀攀㨀 匀甀最最攀猀琀椀漀渀䔀渀最椀渀攀㬀ഀഀ
  notificationSystem: NotificationSystem;਍  ഀഀ
  // Configuración dinámica਍  挀漀渀昀椀最㨀 䄀猀猀椀猀琀愀渀琀䌀漀渀昀椀最㬀ഀഀ
  localization: LocalizationConfig;਍  樀甀爀椀猀搀椀挀琀椀漀渀㨀 䨀甀爀椀猀搀椀挀琀椀漀渀䌀漀渀昀椀最㬀ഀഀ
}਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀㈀⸀ 㰀ෘ⃟䰀伀䌀䄀䰀䤀娀䄀吀䤀伀一 䰀䄀夀䔀刀 ⠀䔀猀瀀攀挀昀椀挀漀 瀀漀爀 倀愀猀⤀⨀⨀ഀഀ
```typescript਍⼀⼀ 䌀漀渀昀椀最甀爀愀挀椀渀 攀猀瀀攀挀昀椀挀愀 瀀漀爀 樀甀爀椀猀搀椀挀挀椀渀ഀഀ
interface LocalizationConfig {਍  挀漀甀渀琀爀礀㨀 猀琀爀椀渀最㬀ഀഀ
  language: string;਍  挀甀爀爀攀渀挀礀㨀 猀琀爀椀渀最㬀ഀഀ
  dateFormat: string;਍  渀甀洀戀攀爀䘀漀爀洀愀琀㨀 猀琀爀椀渀最㬀ഀഀ
  timezone: string;਍  ഀഀ
  // Regulaciones específicas਍  琀愀砀匀礀猀琀攀洀㨀 吀愀砀匀礀猀琀攀洀䌀漀渀昀椀最㬀ഀഀ
  complianceRules: ComplianceConfig;਍  搀漀挀甀洀攀渀琀吀礀瀀攀猀㨀 䐀漀挀甀洀攀渀琀吀礀瀀攀䌀漀渀昀椀最㬀ഀഀ
  softwareIntegrations: SoftwareConfig;਍紀ഀഀ
```਍ഀഀ
### **3. ⚙️ CONFIGURATION LAYER (Dinámico)**਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// Configuración que se carga dinámicamente਍椀渀琀攀爀昀愀挀攀 䨀甀爀椀猀搀椀挀琀椀漀渀䌀漀渀昀椀最 笀ഀഀ
  // Configuración fiscal਍  琀愀砀刀愀琀攀猀㨀 吀愀砀刀愀琀攀䌀漀渀昀椀最㬀ഀഀ
  taxDeadlines: TaxDeadlineConfig;਍  琀愀砀䘀漀爀洀猀㨀 吀愀砀䘀漀爀洀䌀漀渀昀椀最㬀ഀഀ
  ਍  ⼀⼀ 匀漀昀琀眀愀爀攀 挀漀渀琀愀戀氀攀 氀漀挀愀氀ഀഀ
  accountingSoftware: SoftwareCatalog;਍  椀渀琀攀最爀愀琀椀漀渀䰀攀瘀攀氀猀㨀 䤀渀琀攀最爀愀琀椀漀渀䰀攀瘀攀氀嬀崀㬀ഀഀ
  ਍  ⼀⼀ 刀攀最甀氀愀挀椀漀渀攀猀 攀猀瀀攀挀昀椀挀愀猀ഀഀ
  complianceRules: ComplianceRule[];਍  愀甀搀椀琀刀攀焀甀椀爀攀洀攀渀琀猀㨀 䄀甀搀椀琀刀攀焀甀椀爀攀洀攀渀琀嬀崀㬀ഀഀ
  reportingStandards: ReportingStandard[];਍紀ഀഀ
```਍ഀഀ
---਍ഀഀ
## 📁 **ESTRUCTURA DE ARCHIVOS**਍ഀഀ
```਍猀爀挀⼀ഀഀ
├── components/਍Ȁ‥  ᐀%%‥愀挀挀漀甀渀琀椀渀最⼀ഀഀ
│       ├── core/                    # 🧠 CORE LAYER਍Ȁ‥      Ȁ‥  ᰀ%%‥䄀挀挀漀甀渀琀椀渀最䄀猀猀椀猀琀愀渀琀䌀漀爀攀⸀琀猀砀ഀഀ
│       │   ├── DocumentProcessor.tsx਍Ȁ‥      Ȁ‥  ᰀ%%‥䄀氀攀爀琀匀礀猀琀攀洀⸀琀猀砀ഀഀ
│       │   ├── OrganizationSystem.tsx਍Ȁ‥      Ȁ‥  ᐀%%‥匀甀最最攀猀琀椀漀渀䔀渀最椀渀攀⸀琀猀砀ഀഀ
│       │਍Ȁ‥      ᰀ%%‥氀漀挀愀氀椀稀愀琀椀漀渀⼀            ⌀ 㰀ෘ⃟䰀伀䌀䄀䰀䤀娀䄀吀䤀伀一 䰀䄀夀䔀刀ഀഀ
│       │   ├── jurisdictions/਍Ȁ‥      Ȁ‥  Ȁ‥  ᰀ%%‥挀漀氀漀洀戀椀愀⼀ഀഀ
│       │   │   │   ├── ColombiaConfig.ts਍Ȁ‥      Ȁ‥  Ȁ‥  Ȁ‥  ᰀ%%‥䌀漀氀漀洀戀椀愀渀吀愀砀匀礀猀琀攀洀⸀琀猀ഀഀ
│       │   │   │   ├── ColombianCompliance.ts਍Ȁ‥      Ȁ‥  Ȁ‥  Ȁ‥  ᐀%%‥䌀漀氀漀洀戀椀愀渀匀漀昀琀眀愀爀攀⸀琀猀ഀഀ
│       │   │   ├── mexico/਍Ȁ‥      Ȁ‥  Ȁ‥  Ȁ‥  ᰀ%%‥䴀攀砀椀挀漀䌀漀渀昀椀最⸀琀猀ഀഀ
│       │   │   │   └── ...਍Ȁ‥      Ȁ‥  Ȁ‥  ᰀ%%‥愀爀最攀渀琀椀渀愀⼀ഀഀ
│       │   │   │   ├── ArgentinaConfig.ts਍Ȁ‥      Ȁ‥  Ȁ‥  Ȁ‥  ᐀%%‥⸀⸀⸀ഀഀ
│       │   │   └── index.ts਍Ȁ‥      Ȁ‥  Ȁഥഀ
│       │   ├── languages/਍Ȁ‥      Ȁ‥  Ȁ‥  ᰀ%%‥攀猀⼀ഀഀ
│       │   │   │   ├── accounting.json਍Ȁ‥      Ȁ‥  Ȁ‥  Ȁ‥  ᰀ%%‥愀氀攀爀琀猀⸀樀猀漀渀ഀഀ
│       │   │   │   └── suggestions.json਍Ȁ‥      Ȁ‥  Ȁ‥  ᰀ%%‥攀渀⼀ഀഀ
│       │   │   │   ├── accounting.json਍Ȁ‥      Ȁ‥  Ȁ‥  Ȁ‥  ᐀%%‥⸀⸀⸀ഀഀ
│       │   │   └── pt/਍Ȁ‥      Ȁ‥  Ȁ‥      ᰀ%%‥愀挀挀漀甀渀琀椀渀最⸀樀猀漀渀ഀഀ
│       │   │       └── ...਍Ȁ‥      Ȁ‥  Ȁഥഀ
│       │   └── LocalizationManager.ts਍Ȁ‥      Ȁഥഀ
│       └── config/                  # ⚙️ CONFIGURATION LAYER਍Ȁ‥          ᰀ%%‥䄀猀猀椀猀琀愀渀琀䌀漀渀昀椀最⸀琀猀ഀഀ
│           ├── JurisdictionLoader.ts਍Ȁ‥          ᐀%%‥䐀礀渀愀洀椀挀䌀漀渀昀椀最⸀琀猀ഀഀ
│਍ᰀ%%‥栀漀漀欀猀⼀ഀഀ
│   └── accounting/਍Ȁ‥      ᰀ%%‥挀漀爀攀⼀ഀഀ
│       │   ├── useAccountingAssistant.ts਍Ȁ‥      Ȁ‥  ᰀ%%‥甀猀攀䐀漀挀甀洀攀渀琀倀爀漀挀攀猀猀椀渀最⸀琀猀ഀഀ
│       │   └── useAlertSystem.ts਍Ȁ‥      Ȁഥഀ
│       ├── localization/਍Ȁ‥      Ȁ‥  ᰀ%%‥甀猀攀䰀漀挀愀氀椀稀愀琀椀漀渀⸀琀猀ഀഀ
│       │   └── useJurisdiction.ts਍Ȁ‥      Ȁഥഀ
│       └── config/਍Ȁ‥          ᐀%%‥甀猀攀䄀猀猀椀猀琀愀渀琀䌀漀渀昀椀最⸀琀猀ഀഀ
│਍ᰀ%%‥琀礀瀀攀猀⼀ഀഀ
│   └── accounting/਍Ȁ‥      ᰀ%%‥挀漀爀攀⼀ഀഀ
│       │   ├── AssistantTypes.ts਍Ȁ‥      Ȁ‥  ᐀%%‥䐀漀挀甀洀攀渀琀吀礀瀀攀猀⸀琀猀ഀഀ
│       │਍Ȁ‥      ᰀ%%‥氀漀挀愀氀椀稀愀琀椀漀渀⼀ഀഀ
│       │   ├── LocalizationTypes.ts਍Ȁ‥      Ȁ‥  ᐀%%‥䨀甀爀椀猀搀椀挀琀椀漀渀吀礀瀀攀猀⸀琀猀ഀഀ
│       │਍Ȁ‥      ᐀%%‥挀漀渀昀椀最⼀ഀഀ
│           └── ConfigTypes.ts਍Ȁഥഀ
└── config/਍    ᐀%%‥樀甀爀椀猀搀椀挀琀椀漀渀猀⼀ഀഀ
        ├── colombia.json਍        ᰀ%%‥洀攀砀椀挀漀⸀樀猀漀渀ഀഀ
        ├── argentina.json਍        ᐀%%‥琀攀洀瀀氀愀琀攀猀⼀ഀഀ
            ├── base-jurisdiction.json਍            ᐀%%‥戀愀猀攀ⴀ猀漀昀琀眀愀爀攀⸀樀猀漀渀ഀഀ
```਍ഀഀ
---਍ഀഀ
## 🔧 **IMPLEMENTACIÓN TÉCNICA**਍ഀഀ
### **1. 🧠 CORE LAYER - Genérico**਍ഀഀ
```typescript਍⼀⼀ 䄀挀挀漀甀渀琀椀渀最䄀猀猀椀猀琀愀渀琀䌀漀爀攀⸀琀猀砀ഀഀ
export const AccountingAssistantCore: React.FC<CoreProps> = ({਍  樀甀爀椀猀搀椀挀琀椀漀渀Ⰰഀഀ
  language,਍  挀漀渀昀椀最ഀഀ
}) => {਍  挀漀渀猀琀 笀 氀漀挀愀氀椀稀愀琀椀漀渀 紀 㴀 甀猀攀䰀漀挀愀氀椀稀愀琀椀漀渀⠀樀甀爀椀猀搀椀挀琀椀漀渀Ⰰ 氀愀渀最甀愀最攀⤀㬀ഀഀ
  const { jurisdictionConfig } = useJurisdiction(jurisdiction);਍  ഀഀ
  return (਍    㰀搀椀瘀 挀氀愀猀猀一愀洀攀㴀∀愀挀挀漀甀渀琀椀渀最ⴀ愀猀猀椀猀琀愀渀琀ⴀ挀漀爀攀∀㸀ഀഀ
      <DocumentProcessor ਍        挀漀渀昀椀最㴀笀樀甀爀椀猀搀椀挀琀椀漀渀䌀漀渀昀椀最⸀搀漀挀甀洀攀渀琀吀礀瀀攀猀紀ഀഀ
        localization={localization}਍      ⼀㸀ഀഀ
      <AlertSystem ਍        挀漀渀昀椀最㴀笀樀甀爀椀猀搀椀挀琀椀漀渀䌀漀渀昀椀最⸀挀漀洀瀀氀椀愀渀挀攀刀甀氀攀猀紀ഀഀ
        localization={localization}਍      ⼀㸀ഀഀ
      <OrganizationSystem ਍        挀漀渀昀椀最㴀笀樀甀爀椀猀搀椀挀琀椀漀渀䌀漀渀昀椀最⸀漀爀最愀渀椀稀愀琀椀漀渀刀甀氀攀猀紀ഀഀ
        localization={localization}਍      ⼀㸀ഀഀ
      <SuggestionEngine ਍        挀漀渀昀椀最㴀笀樀甀爀椀猀搀椀挀琀椀漀渀䌀漀渀昀椀最⸀猀甀最最攀猀琀椀漀渀刀甀氀攀猀紀ഀഀ
        localization={localization}਍      ⼀㸀ഀഀ
    </div>਍  ⤀㬀ഀഀ
};਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀㈀⸀ 㰀ෘ⃟䰀伀䌀䄀䰀䤀娀䄀吀䤀伀一 䰀䄀夀䔀刀 ⴀ 䔀猀瀀攀挀昀椀挀漀⨀⨀ഀഀ
਍怀怀怀琀礀瀀攀猀挀爀椀瀀琀ഀഀ
// jurisdictions/colombia/ColombiaConfig.ts਍攀砀瀀漀爀琀 挀漀渀猀琀 䌀漀氀漀洀戀椀愀䌀漀渀昀椀最㨀 䨀甀爀椀猀搀椀挀琀椀漀渀䌀漀渀昀椀最 㴀 笀ഀഀ
  country: 'CO',਍  氀愀渀最甀愀最攀㨀 ✀攀猀✀Ⰰഀഀ
  currency: 'COP',਍  搀愀琀攀䘀漀爀洀愀琀㨀 ✀䐀䐀⼀䴀䴀⼀夀夀夀夀✀Ⰰഀഀ
  numberFormat: '#,##0.00',਍  琀椀洀攀稀漀渀攀㨀 ✀䄀洀攀爀椀挀愀⼀䈀漀最漀琀愀✀Ⰰഀഀ
  ਍  琀愀砀匀礀猀琀攀洀㨀 笀ഀഀ
    vatRate: 0.19,਍    爀攀琀攀渀琀椀漀渀刀愀琀攀㨀 　⸀　㈀㔀Ⰰഀഀ
    taxPeriods: ['monthly', 'quarterly', 'annual'],਍    搀攀愀搀氀椀渀攀猀㨀 笀ഀഀ
      vat: { day: 20, month: 'next' },਍      爀攀琀攀渀琀椀漀渀㨀 笀 搀愀礀㨀 ㄀㔀Ⰰ 洀漀渀琀栀㨀 ✀渀攀砀琀✀ 紀Ⰰഀഀ
      income: { day: 31, month: 'august' }਍    紀ഀഀ
  },਍  ഀഀ
  complianceRules: {਍    搀椀愀渀刀攀焀甀椀爀攀洀攀渀琀猀㨀 琀爀甀攀Ⰰഀഀ
    electronicInvoicing: true,਍    爀攀琀攀渀琀椀漀渀伀戀氀椀最愀琀椀漀渀猀㨀 琀爀甀攀Ⰰഀഀ
    auditRequirements: {਍      琀栀爀攀猀栀漀氀搀㨀 㔀　　　　　　　Ⰰ ⼀⼀ 㔀　䴀 䌀伀倀ഀഀ
      frequency: 'annual'਍    紀ഀഀ
  },਍  ഀഀ
  documentTypes: {਍    椀渀瘀漀椀挀攀㨀 笀ഀഀ
      required: ['nit', 'amount', 'vat', 'date'],਍      漀瀀琀椀漀渀愀氀㨀 嬀✀搀攀猀挀爀椀瀀琀椀漀渀✀Ⰰ ✀瀀愀礀洀攀渀琀开琀攀爀洀猀✀崀Ⰰഀഀ
      validation: 'dian_validation'਍    紀Ⰰഀഀ
    receipt: {਍      爀攀焀甀椀爀攀搀㨀 嬀✀愀洀漀甀渀琀✀Ⰰ ✀搀愀琀攀✀Ⰰ ✀搀攀猀挀爀椀瀀琀椀漀渀✀崀Ⰰഀഀ
      optional: ['tax_id'],਍      瘀愀氀椀搀愀琀椀漀渀㨀 ✀戀愀猀椀挀开瘀愀氀椀搀愀琀椀漀渀✀ഀഀ
    }਍  紀Ⰰഀഀ
  ਍  猀漀昀琀眀愀爀攀䤀渀琀攀最爀愀琀椀漀渀猀㨀 笀ഀഀ
    siigo: {਍      愀瀀椀㨀 琀爀甀攀Ⰰഀഀ
      import: true,਍      攀砀瀀漀爀琀㨀 琀爀甀攀Ⰰഀഀ
      sync: true਍    紀Ⰰഀഀ
    alegra: {਍      愀瀀椀㨀 琀爀甀攀Ⰰഀഀ
      import: true,਍      攀砀瀀漀爀琀㨀 琀爀甀攀Ⰰഀഀ
      sync: true਍    紀Ⰰഀഀ
    helisa: {਍      愀瀀椀㨀 昀愀氀猀攀Ⰰഀഀ
      import: true,਍      攀砀瀀漀爀琀㨀 琀爀甀攀Ⰰഀഀ
      sync: false਍    紀ഀഀ
  }਍紀㬀ഀഀ
```਍ഀഀ
### **3. ⚙️ CONFIGURATION LAYER - Dinámico**਍ഀഀ
```typescript਍⼀⼀ 䨀甀爀椀猀搀椀挀琀椀漀渀䰀漀愀搀攀爀⸀琀猀ഀഀ
export class JurisdictionLoader {਍  瀀爀椀瘀愀琀攀 猀琀愀琀椀挀 挀漀渀昀椀最猀㨀 䴀愀瀀㰀猀琀爀椀渀最Ⰰ 䨀甀爀椀猀搀椀挀琀椀漀渀䌀漀渀昀椀最㸀 㴀 渀攀眀 䴀愀瀀⠀⤀㬀ഀഀ
  ਍  猀琀愀琀椀挀 愀猀礀渀挀 氀漀愀搀䨀甀爀椀猀搀椀挀琀椀漀渀⠀挀漀甀渀琀爀礀㨀 猀琀爀椀渀最⤀㨀 倀爀漀洀椀猀攀㰀䨀甀爀椀猀搀椀挀琀椀漀渀䌀漀渀昀椀最㸀 笀ഀഀ
    if (this.configs.has(country)) {਍      爀攀琀甀爀渀 琀栀椀猀⸀挀漀渀昀椀最猀⸀最攀琀⠀挀漀甀渀琀爀礀⤀℀㬀ഀഀ
    }਍    ഀഀ
    try {਍      ⼀⼀ 䌀愀爀最愀爀 挀漀渀昀椀最甀爀愀挀椀渀 搀椀渀洀椀挀愀ഀഀ
      const config = await import(`../config/jurisdictions/${country}.json`);਍      挀漀渀猀琀 戀愀猀攀䌀漀渀昀椀最 㴀 愀眀愀椀琀 椀洀瀀漀爀琀⠀✀⸀⸀⼀挀漀渀昀椀最⼀樀甀爀椀猀搀椀挀琀椀漀渀猀⼀琀攀洀瀀氀愀琀攀猀⼀戀愀猀攀ⴀ樀甀爀椀猀搀椀挀琀椀漀渀⸀樀猀漀渀✀⤀㬀ഀഀ
      ਍      ⼀⼀ 䴀攀爀最攀 挀漀渀 挀漀渀昀椀最甀爀愀挀椀渀 戀愀猀攀ഀഀ
      const mergedConfig = this.mergeConfigs(baseConfig, config);਍      ഀഀ
      this.configs.set(country, mergedConfig);਍      爀攀琀甀爀渀 洀攀爀最攀搀䌀漀渀昀椀最㬀ഀഀ
    } catch (error) {਍      挀漀渀猀漀氀攀⸀攀爀爀漀爀⠀怀䔀爀爀漀爀 氀漀愀搀椀渀最 樀甀爀椀猀搀椀挀琀椀漀渀 挀漀渀昀椀最 昀漀爀 ␀笀挀漀甀渀琀爀礀紀㨀怀Ⰰ 攀爀爀漀爀⤀㬀ഀഀ
      throw new Error(`Jurisdiction ${country} not supported`);਍    紀ഀഀ
  }਍  ഀഀ
  private static mergeConfigs(base: any, specific: any): JurisdictionConfig {਍    爀攀琀甀爀渀 笀ഀഀ
      ...base,਍      ⸀⸀⸀猀瀀攀挀椀昀椀挀Ⰰഀഀ
      // Merge profundo para objetos anidados਍      琀愀砀匀礀猀琀攀洀㨀 笀 ⸀⸀⸀戀愀猀攀⸀琀愀砀匀礀猀琀攀洀Ⰰ ⸀⸀⸀猀瀀攀挀椀昀椀挀⸀琀愀砀匀礀猀琀攀洀 紀Ⰰഀഀ
      complianceRules: { ...base.complianceRules, ...specific.complianceRules },਍      搀漀挀甀洀攀渀琀吀礀瀀攀猀㨀 笀 ⸀⸀⸀戀愀猀攀⸀搀漀挀甀洀攀渀琀吀礀瀀攀猀Ⰰ ⸀⸀⸀猀瀀攀挀椀昀椀挀⸀搀漀挀甀洀攀渀琀吀礀瀀攀猀 紀Ⰰഀഀ
      softwareIntegrations: { ...base.softwareIntegrations, ...specific.softwareIntegrations }਍    紀㬀ഀഀ
  }਍紀ഀഀ
```਍ഀഀ
---਍ഀഀ
## 🎯 **HOOKS ESPECIALIZADOS**਍ഀഀ
### **1. Hook de Localización**਍ഀഀ
```typescript਍⼀⼀ 栀漀漀欀猀⼀愀挀挀漀甀渀琀椀渀最⼀氀漀挀愀氀椀稀愀琀椀漀渀⼀甀猀攀䰀漀挀愀氀椀稀愀琀椀漀渀⸀琀猀ഀഀ
export const useLocalization = (jurisdiction: string, language: string) => {਍  挀漀渀猀琀 嬀氀漀挀愀氀椀稀愀琀椀漀渀Ⰰ 猀攀琀䰀漀挀愀氀椀稀愀琀椀漀渀崀 㴀 甀猀攀匀琀愀琀攀㰀䰀漀挀愀氀椀稀愀琀椀漀渀䌀漀渀昀椀最 簀 渀甀氀氀㸀⠀渀甀氀氀⤀㬀ഀഀ
  ਍  甀猀攀䔀昀昀攀挀琀⠀⠀⤀ 㴀㸀 笀ഀഀ
    const loadLocalization = async () => {਍      ⼀⼀ 䌀愀爀最愀爀 挀漀渀昀椀最甀爀愀挀椀渀 搀攀 樀甀爀椀猀搀椀挀挀椀渀ഀഀ
      const jurisdictionConfig = await JurisdictionLoader.loadJurisdiction(jurisdiction);਍      ഀഀ
      // Cargar traducciones਍      挀漀渀猀琀 琀爀愀渀猀氀愀琀椀漀渀猀 㴀 愀眀愀椀琀 椀洀瀀漀爀琀⠀怀⸀⸀⼀氀漀挀愀氀椀稀愀琀椀漀渀⼀氀愀渀最甀愀最攀猀⼀␀笀氀愀渀最甀愀最攀紀⼀愀挀挀漀甀渀琀椀渀最⸀樀猀漀渀怀⤀㬀ഀഀ
      ਍      猀攀琀䰀漀挀愀氀椀稀愀琀椀漀渀⠀笀ഀഀ
        ...jurisdictionConfig,਍        琀爀愀渀猀氀愀琀椀漀渀猀ഀഀ
      });਍    紀㬀ഀഀ
    ਍    氀漀愀搀䰀漀挀愀氀椀稀愀琀椀漀渀⠀⤀㬀ഀഀ
  }, [jurisdiction, language]);਍  ഀഀ
  return { localization };਍紀㬀ഀഀ
```਍ഀഀ
### **2. Hook de Configuración**਍ഀഀ
```typescript਍⼀⼀ 栀漀漀欀猀⼀愀挀挀漀甀渀琀椀渀最⼀挀漀渀昀椀最⼀甀猀攀䄀猀猀椀猀琀愀渀琀䌀漀渀昀椀最⸀琀猀ഀഀ
export const useAssistantConfig = (jurisdiction: string) => {਍  挀漀渀猀琀 嬀挀漀渀昀椀最Ⰰ 猀攀琀䌀漀渀昀椀最崀 㴀 甀猀攀匀琀愀琀攀㰀䄀猀猀椀猀琀愀渀琀䌀漀渀昀椀最 簀 渀甀氀氀㸀⠀渀甀氀氀⤀㬀ഀഀ
  ਍  甀猀攀䔀昀昀攀挀琀⠀⠀⤀ 㴀㸀 笀ഀഀ
    const loadConfig = async () => {਍      挀漀渀猀琀 樀甀爀椀猀搀椀挀琀椀漀渀䌀漀渀昀椀最 㴀 愀眀愀椀琀 䨀甀爀椀猀搀椀挀琀椀漀渀䰀漀愀搀攀爀⸀氀漀愀搀䨀甀爀椀猀搀椀挀琀椀漀渀⠀樀甀爀椀猀搀椀挀琀椀漀渀⤀㬀ഀഀ
      ਍      ⼀⼀ 䌀漀渀昀椀最甀爀愀挀椀渀 搀椀渀洀椀挀愀 戀愀猀愀搀愀 攀渀 樀甀爀椀猀搀椀挀挀椀渀ഀഀ
      const assistantConfig: AssistantConfig = {਍        愀氀攀爀琀吀礀瀀攀猀㨀 樀甀爀椀猀搀椀挀琀椀漀渀䌀漀渀昀椀最⸀挀漀洀瀀氀椀愀渀挀攀刀甀氀攀猀⸀愀氀攀爀琀吀礀瀀攀猀Ⰰഀഀ
        suggestionRules: jurisdictionConfig.suggestionRules,਍        漀爀最愀渀椀稀愀琀椀漀渀刀甀氀攀猀㨀 樀甀爀椀猀搀椀挀琀椀漀渀䌀漀渀昀椀最⸀漀爀最愀渀椀稀愀琀椀漀渀刀甀氀攀猀Ⰰഀഀ
        notificationPreferences: jurisdictionConfig.notificationPreferences਍      紀㬀ഀഀ
      ਍      猀攀琀䌀漀渀昀椀最⠀愀猀猀椀猀琀愀渀琀䌀漀渀昀椀最⤀㬀ഀഀ
    };਍    ഀഀ
    loadConfig();਍  紀Ⰰ 嬀樀甀爀椀猀搀椀挀琀椀漀渀崀⤀㬀ഀഀ
  ਍  爀攀琀甀爀渀 笀 挀漀渀昀椀最 紀㬀ഀഀ
};਍怀怀怀ഀഀ
਍ⴀⴀⴀഀഀ
਍⌀⌀ 㰀ෘ⃟⨀⨀䔀䨀䔀䴀倀䰀伀匀 䐀䔀 䰀伀䌀䄀䰀䤀娀䄀䌀䤀팀一⨀⨀ഀഀ
਍⌀⌀⌀ ⨀⨀㄀⸀ 䌀漀氀漀洀戀椀愀 ⠀䄀挀琀甀愀氀⤀⨀⨀ഀഀ
਍怀怀怀樀猀漀渀ഀഀ
// config/jurisdictions/colombia.json਍笀ഀഀ
  "country": "CO",਍  ∀氀愀渀最甀愀最攀∀㨀 ∀攀猀∀Ⰰഀഀ
  "currency": "COP",਍  ∀琀愀砀匀礀猀琀攀洀∀㨀 笀ഀഀ
    "vatRate": 0.19,਍    ∀爀攀琀攀渀琀椀漀渀刀愀琀攀∀㨀 　⸀　㈀㔀Ⰰഀഀ
    "deadlines": {਍      ∀瘀愀琀∀㨀 笀 ∀搀愀礀∀㨀 ㈀　Ⰰ ∀洀漀渀琀栀∀㨀 ∀渀攀砀琀∀ 紀Ⰰഀഀ
      "retention": { "day": 15, "month": "next" }਍    紀ഀഀ
  },਍  ∀挀漀洀瀀氀椀愀渀挀攀刀甀氀攀猀∀㨀 笀ഀഀ
    "dianRequirements": true,਍    ∀攀氀攀挀琀爀漀渀椀挀䤀渀瘀漀椀挀椀渀最∀㨀 琀爀甀攀ഀഀ
  },਍  ∀猀漀昀琀眀愀爀攀䤀渀琀攀最爀愀琀椀漀渀猀∀㨀 笀ഀഀ
    "siigo": { "api": true, "sync": true },਍    ∀愀氀攀最爀愀∀㨀 笀 ∀愀瀀椀∀㨀 琀爀甀攀Ⰰ ∀猀礀渀挀∀㨀 琀爀甀攀 紀Ⰰഀഀ
    "helisa": { "api": false, "import": true }਍  紀ഀഀ
}਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀㈀⸀ 䴀砀椀挀漀 ⠀䘀甀琀甀爀漀⤀⨀⨀ഀഀ
਍怀怀怀樀猀漀渀ഀഀ
// config/jurisdictions/mexico.json਍笀ഀഀ
  "country": "MX",਍  ∀氀愀渀最甀愀最攀∀㨀 ∀攀猀∀Ⰰഀഀ
  "currency": "MXN",਍  ∀琀愀砀匀礀猀琀攀洀∀㨀 笀ഀഀ
    "vatRate": 0.16,਍    ∀爀攀琀攀渀琀椀漀渀刀愀琀攀∀㨀 　⸀㄀　Ⰰഀഀ
    "deadlines": {਍      ∀瘀愀琀∀㨀 笀 ∀搀愀礀∀㨀 ㄀㜀Ⰰ ∀洀漀渀琀栀∀㨀 ∀渀攀砀琀∀ 紀Ⰰഀഀ
      "retention": { "day": 17, "month": "next" }਍    紀ഀഀ
  },਍  ∀挀漀洀瀀氀椀愀渀挀攀刀甀氀攀猀∀㨀 笀ഀഀ
    "satRequirements": true,਍    ∀攀氀攀挀琀爀漀渀椀挀䤀渀瘀漀椀挀椀渀最∀㨀 琀爀甀攀Ⰰഀഀ
    "cfdiRequirements": true਍  紀Ⰰഀഀ
  "softwareIntegrations": {਍    ∀挀漀渀琀瀀愀焀椀∀㨀 笀 ∀愀瀀椀∀㨀 琀爀甀攀Ⰰ ∀猀礀渀挀∀㨀 琀爀甀攀 紀Ⰰഀഀ
    "aspel": { "api": true, "sync": true },਍    ∀洀椀挀爀漀猀椀瀀∀㨀 笀 ∀愀瀀椀∀㨀 昀愀氀猀攀Ⰰ ∀椀洀瀀漀爀琀∀㨀 琀爀甀攀 紀ഀഀ
  }਍紀ഀഀ
```਍ഀഀ
### **3. Argentina (Futuro)**਍ഀഀ
```json਍⼀⼀ 挀漀渀昀椀最⼀樀甀爀椀猀搀椀挀琀椀漀渀猀⼀愀爀最攀渀琀椀渀愀⸀樀猀漀渀ഀഀ
{਍  ∀挀漀甀渀琀爀礀∀㨀 ∀䄀刀∀Ⰰഀഀ
  "language": "es",਍  ∀挀甀爀爀攀渀挀礀∀㨀 ∀䄀刀匀∀Ⰰഀഀ
  "taxSystem": {਍    ∀瘀愀琀刀愀琀攀∀㨀 　⸀㈀㄀Ⰰഀഀ
    "retentionRate": 0.035,਍    ∀搀攀愀搀氀椀渀攀猀∀㨀 笀ഀഀ
      "vat": { "day": 20, "month": "next" },਍      ∀爀攀琀攀渀琀椀漀渀∀㨀 笀 ∀搀愀礀∀㨀 ㈀　Ⰰ ∀洀漀渀琀栀∀㨀 ∀渀攀砀琀∀ 紀ഀഀ
    }਍  紀Ⰰഀഀ
  "complianceRules": {਍    ∀愀昀椀瀀刀攀焀甀椀爀攀洀攀渀琀猀∀㨀 琀爀甀攀Ⰰഀഀ
    "electronicInvoicing": true,਍    ∀洀漀渀漀琀爀椀戀甀琀漀∀㨀 琀爀甀攀ഀഀ
  },਍  ∀猀漀昀琀眀愀爀攀䤀渀琀攀最爀愀琀椀漀渀猀∀㨀 笀ഀഀ
    "tango": { "api": true, "sync": true },਍    ∀猀椀猀挀漀∀㨀 笀 ∀愀瀀椀∀㨀 琀爀甀攀Ⰰ ∀猀礀渀挀∀㨀 琀爀甀攀 紀Ⰰഀഀ
    "exact": { "api": false, "import": true }਍  紀ഀഀ
}਍怀怀怀ഀഀ
਍ⴀⴀⴀഀഀ
਍⌀⌀ 㴀胘⃞⨀⨀嘀䔀一吀䄀䨀䄀匀 䐀䔀 䔀匀吀䄀 䄀刀儀唀䤀吀䔀䌀吀唀刀䄀⨀⨀ഀഀ
਍⌀⌀⌀ ⨀⨀㄀⸀ 㸀⃝䴀愀渀琀攀渀椀戀椀氀椀搀愀搀⨀⨀ഀഀ
- **Core genérico** no cambia al agregar países਍ⴀ ⨀⨀䌀漀渀昀椀最甀爀愀挀椀漀渀攀猀 猀攀瀀愀爀愀搀愀猀⨀⨀ 瀀漀爀 樀甀爀椀猀搀椀挀挀椀渀ഀഀ
- **Fácil testing** de cada capa independientemente਍ഀഀ
### **2. 🌍 Escalabilidad**਍ⴀ ⨀⨀䄀最爀攀最愀爀 瀀愀猀⨀⨀ 㴀 猀漀氀漀 愀爀挀栀椀瘀漀 搀攀 挀漀渀昀椀最甀爀愀挀椀渀ഀഀ
- **Sin modificar** código existente਍ⴀ ⨀⨀䌀愀爀最愀 搀椀渀洀椀挀愀⨀⨀ 搀攀 挀漀渀昀椀最甀爀愀挀椀漀渀攀猀ഀഀ
਍⌀⌀⌀ ⨀⨀㌀⸀ 餀༦⃾䘀氀攀砀椀戀椀氀椀搀愀搀⨀⨀ഀഀ
- **Configuración granular** por país਍ⴀ ⨀⨀伀瘀攀爀爀椀搀攀 搀攀 昀甀渀挀椀漀渀愀氀椀搀愀搀攀猀⨀⨀ 攀猀瀀攀挀昀椀挀愀猀ഀഀ
- **Heredar** de configuración base਍ഀഀ
### **4. 🔧 Desarrollo**਍ⴀ ⨀⨀䔀焀甀椀瀀漀猀 瀀愀爀愀氀攀氀漀猀⨀⨀ 瀀漀爀 樀甀爀椀猀搀椀挀挀椀渀ഀഀ
- **Sin conflictos** de merge਍ⴀ ⨀⨀吀攀猀琀椀渀最 椀渀搀攀瀀攀渀搀椀攀渀琀攀⨀⨀ 瀀漀爀 瀀愀猀ഀഀ
਍ⴀⴀⴀഀഀ
਍⌀⌀ 㴀쯘⃜⨀⨀倀刀伀䌀䔀匀伀 䐀䔀 䄀䜀刀䔀䜀䄀刀 一唀䔀嘀伀 倀䄀촀匀⨀⨀ഀഀ
਍⌀⌀⌀ ⨀⨀倀愀猀漀 ㄀㨀 䌀爀攀愀爀 䌀漀渀昀椀最甀爀愀挀椀渀 䈀愀猀攀⨀⨀ഀഀ
```bash਍⌀ 䌀漀瀀椀愀爀 琀攀洀瀀氀愀琀攀 戀愀猀攀ഀഀ
cp config/jurisdictions/templates/base-jurisdiction.json config/jurisdictions/brazil.json਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀倀愀猀漀 ㈀㨀 倀攀爀猀漀渀愀氀椀稀愀爀 䌀漀渀昀椀最甀爀愀挀椀渀⨀⨀ഀഀ
```json਍笀ഀഀ
  "country": "BR",਍  ∀氀愀渀最甀愀最攀∀㨀 ∀瀀琀∀Ⰰഀഀ
  "currency": "BRL",਍  ∀琀愀砀匀礀猀琀攀洀∀㨀 笀ഀഀ
    "vatRate": 0.18,਍    ∀爀攀琀攀渀琀椀漀渀刀愀琀攀∀㨀 　⸀　㄀㔀ഀഀ
  }਍紀ഀഀ
```਍ഀഀ
### **Paso 3: Agregar Traducciones**਍怀怀怀戀愀猀栀ഀഀ
# Crear archivos de traducción਍洀欀搀椀爀 ⴀ瀀 猀爀挀⼀氀漀挀愀氀椀稀愀琀椀漀渀⼀氀愀渀最甀愀最攀猀⼀瀀琀ഀഀ
touch src/localization/languages/pt/accounting.json਍怀怀怀ഀഀ
਍⌀⌀⌀ ⨀⨀倀愀猀漀 㐀㨀 吀攀猀琀椀渀最⨀⨀ഀഀ
```typescript਍⼀⼀ 吀攀猀琀 攀猀瀀攀挀昀椀挀漀 瀀愀爀愀 䈀爀愀猀椀氀ഀഀ
describe('Brazil Accounting Assistant', () => {਍  椀琀⠀✀猀栀漀甀氀搀 氀漀愀搀 䈀爀愀稀椀氀 挀漀渀昀椀最甀爀愀琀椀漀渀✀Ⰰ 愀猀礀渀挀 ⠀⤀ 㴀㸀 笀ഀഀ
    const config = await JurisdictionLoader.loadJurisdiction('BR');਍    攀砀瀀攀挀琀⠀挀漀渀昀椀最⸀挀漀甀渀琀爀礀⤀⸀琀漀䈀攀⠀✀䈀刀✀⤀㬀ഀഀ
    expect(config.taxSystem.vatRate).toBe(0.18);਍  紀⤀㬀ഀഀ
});਍怀怀怀ഀഀ
਍ⴀⴀⴀഀഀ
਍⌀⌀ Ԁ‧⨀⨀䌀伀一䌀䰀唀匀䤀팀一⨀⨀ഀഀ
਍䔀猀琀愀 愀爀焀甀椀琀攀挀琀甀爀愀 瀀攀爀洀椀琀攀㨀ഀഀ
਍㄀⸀ ⨀⨀㸀⃝䌀漀爀攀 最攀渀爀椀挀漀⨀⨀ 焀甀攀 昀甀渀挀椀漀渀愀 攀渀 挀甀愀氀焀甀椀攀爀 瀀愀猀ഀഀ
2. **🌍 Localización específica** sin modificar código਍㌀⸀ ⨀⨀餀༦⃾䌀漀渀昀椀最甀爀愀挀椀渀 搀椀渀洀椀挀愀⨀⨀ 瀀漀爀 樀甀爀椀猀搀椀挀挀椀渀ഀഀ
4. **🚀 Escalabilidad** sin romper funcionalidad਍㔀⸀ ⨀⨀㴀⟘⃝䴀愀渀琀攀渀椀戀椀氀椀搀愀搀⨀⨀ 搀攀氀 挀搀椀最漀ഀഀ
਍⨀⨀䔀氀 愀猀椀猀琀攀渀琀攀 搀攀 挀漀渀琀愀戀椀氀椀搀愀搀 挀漀氀漀洀戀椀愀渀漀 猀攀 挀漀渀瘀椀攀爀琀攀 攀渀 甀渀愀 椀渀猀琀愀渀挀椀愀 攀猀瀀攀挀昀椀挀愀 搀攀氀 愀猀椀猀琀攀渀琀攀 最攀渀爀椀挀漀Ⰰ 洀愀渀琀攀渀椀攀渀搀漀 琀漀搀愀 氀愀 昀甀渀挀椀漀渀愀氀椀搀愀搀 瀀攀爀漀 挀漀渀 挀漀渀昀椀最甀爀愀挀椀渀 氀漀挀愀氀椀稀愀搀愀⸀⨀⨀ 㰀꿘ෟഀ
਍ⴀⴀⴀഀഀ
਍⨀䐀漀挀甀洀攀渀琀漀 最攀渀攀爀愀搀漀 瀀漀爀 攀氀 匀椀猀琀攀洀愀 搀攀 䌀漀渀漀挀椀洀椀攀渀琀漀 搀攀 倀爀漀搀甀挀琀漀⨀ഀഀ
*Fecha: 20 de Diciembre de 2025*਍⨀䄀爀焀甀椀琀攀挀琀甀爀愀㨀 䌀漀爀攀 ⬀ 䰀漀挀愀氀椀稀愀琀椀漀渀 ⬀ 䌀漀渀昀椀最甀爀愀琀椀漀渀⨀ഀഀ
