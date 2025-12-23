# Plan-Based Feature Access Control

**Version:** 1.0.0  
**Status:** ✅ MANDATORY  
**Effective Date:** 2025-12-23  
**Authority:** CTO - Marcelo Escallón

---

## 🎯 Purpose

Define **clear feature access rules** based on user subscription plans, ensuring the system knows which features are available to each user and can communicate this appropriately in all 7 languages.

---

## 📋 Subscription Plans

### Free Plan (Tier 0)
**Price:** $0/month  
**Target:** Individual users, testing, basic usage

**Features Included:**
- ✅ Basic dashboard access
- ✅ Project viewing (read-only)
- ✅ Standard UI components
- ✅ Email support (48h response)
- ✅ All 7 languages support
- ✅ Basic analytics

**Features NOT Included:**
- ❌ AI Chat/Consultation
- ❌ Voice AI Assistant
- ❌ Pro AI Models (GPT-4, Claude, etc.)
- ❌ Advanced analytics
- ❌ Priority support
- ❌ Custom integrations
- ❌ Team collaboration
- ❌ API access

---

### Starter Plan (Tier 1)
**Price:** $19/month  
**Target:** Small teams, freelancers

**Features Included:**
- ✅ Everything in Free
- ✅ **AI Chat (Basic)** - GPT-3.5, limited queries
- ✅ Project creation and editing
- ✅ Team collaboration (up to 3 users)
- ✅ Email support (24h response)
- ✅ Basic API access

**Features NOT Included:**
- ❌ Voice AI Assistant
- ❌ Pro AI Models (GPT-4, Claude)
- ❌ Advanced analytics
- ❌ Priority support
- ❌ Custom integrations
- ❌ Unlimited team members

---

### Professional Plan (Tier 2)
**Price:** $49/month  
**Target:** Growing businesses, agencies

**Features Included:**
- ✅ Everything in Starter
- ✅ **AI Chat (Pro)** - GPT-4, Claude, unlimited queries
- ✅ **Voice AI Assistant** - Text-to-Speech, Speech-to-Text
- ✅ Advanced analytics
- ✅ Team collaboration (up to 10 users)
- ✅ Priority email support (4h response)
- ✅ Full API access
- ✅ Custom integrations

**Features NOT Included:**
- ❌ Dedicated account manager
- ❌ Custom AI model training
- ❌ White-label options
- ❌ SLA guarantees

---

### Enterprise Plan (Tier 3)
**Price:** Custom  
**Target:** Large organizations, enterprises

**Features Included:**
- ✅ Everything in Professional
- ✅ **Custom AI Models** - Fine-tuned for your business
- ✅ **Dedicated Voice Channels** - Custom voice clones
- ✅ Unlimited team members
- ✅ Dedicated account manager
- ✅ 24/7 priority support (1h response)
- ✅ White-label options
- ✅ SLA guarantees (99.9% uptime)
- ✅ Custom integrations
- ✅ On-premise deployment options

---

## 🔐 Feature Access Matrix

| Feature | Free | Starter | Pro | Enterprise |
|---------|------|---------|-----|------------|
| **Core Features** |
| Dashboard Access | ✅ | ✅ | ✅ | ✅ |
| Project Viewing | ✅ (Read-only) | ✅ | ✅ | ✅ |
| Project Creation | ❌ | ✅ | ✅ | ✅ |
| Team Collaboration | ❌ | ✅ (3 users) | ✅ (10 users) | ✅ (Unlimited) |
| **AI Features** |
| AI Chat (Basic) | ❌ | ✅ (Limited) | ✅ (Unlimited) | ✅ (Unlimited) |
| AI Chat (Pro Models) | ❌ | ❌ | ✅ | ✅ |
| Voice AI Assistant | ❌ | ❌ | ✅ | ✅ |
| Custom AI Models | ❌ | ❌ | ❌ | ✅ |
| **Voice Features** |
| Text-to-Speech | ❌ | ❌ | ✅ | ✅ |
| Speech-to-Text | ❌ | ❌ | ✅ | ✅ |
| Voice Cloning | ❌ | ❌ | ❌ | ✅ |
| **Analytics** |
| Basic Analytics | ✅ | ✅ | ✅ | ✅ |
| Advanced Analytics | ❌ | ❌ | ✅ | ✅ |
| Custom Reports | ❌ | ❌ | ❌ | ✅ |
| **Support** |
| Email Support | ✅ (48h) | ✅ (24h) | ✅ (4h) | ✅ (1h) |
| Priority Support | ❌ | ❌ | ✅ | ✅ |
| Dedicated Manager | ❌ | ❌ | ❌ | ✅ |
| **Integration** |
| Basic API | ❌ | ✅ | ✅ | ✅ |
| Full API | ❌ | ❌ | ✅ | ✅ |
| Custom Integrations | ❌ | ❌ | ✅ | ✅ |
| **Languages** |
| All 7 Languages | ✅ | ✅ | ✅ | ✅ |

---

## 💬 User-Facing Messages (i18n)

### Feature Locked Messages

**English:**
```json
{
  "feature_locked": {
    "ai_chat": "AI Chat is available on Starter plan and above. Upgrade to unlock.",
    "voice_ai": "Voice AI Assistant is available on Professional plan and above. Upgrade to unlock.",
    "pro_models": "Pro AI Models (GPT-4, Claude) are available on Professional plan and above. Upgrade to unlock.",
    "custom_ai": "Custom AI Models are available on Enterprise plan. Contact sales.",
    "team_limit": "You've reached your team member limit. Upgrade to add more users.",
    "api_access": "API access is available on Starter plan and above. Upgrade to unlock."
  },
  "upgrade": {
    "cta": "Upgrade Now",
    "learn_more": "Learn More",
    "contact_sales": "Contact Sales"
  }
}
```

**Spanish:**
```json
{
  "feature_locked": {
    "ai_chat": "El Chat IA está disponible en el plan Starter y superiores. Actualiza para desbloquear.",
    "voice_ai": "El Asistente de Voz IA está disponible en el plan Professional y superiores. Actualiza para desbloquear.",
    "pro_models": "Los Modelos IA Pro (GPT-4, Claude) están disponibles en el plan Professional y superiores. Actualiza para desbloquear.",
    "custom_ai": "Los Modelos IA Personalizados están disponibles en el plan Enterprise. Contacta ventas.",
    "team_limit": "Has alcanzado el límite de miembros del equipo. Actualiza para agregar más usuarios.",
    "api_access": "El acceso a la API está disponible en el plan Starter y superiores. Actualiza para desbloquear."
  },
  "upgrade": {
    "cta": "Actualizar Ahora",
    "learn_more": "Más Información",
    "contact_sales": "Contactar Ventas"
  }
}
```

**Arabic:**
```json
{
  "feature_locked": {
    "ai_chat": "دردشة الذكاء الاصطناعي متاحة في خطة Starter وما فوق. قم بالترقية للفتح.",
    "voice_ai": "مساعد الصوت بالذكاء الاصطناعي متاح في خطة Professional وما فوق. قم بالترقية للفتح.",
    "pro_models": "نماذج الذكاء الاصطناعي الاحترافية (GPT-4، Claude) متاحة في خطة Professional وما فوق. قم بالترقية للفتح.",
    "custom_ai": "نماذج الذكاء الاصطناعي المخصصة متاحة في خطة Enterprise. اتصل بالمبيعات.",
    "team_limit": "لقد وصلت إلى حد أعضاء الفريق. قم بالترقية لإضافة المزيد من المستخدمين.",
    "api_access": "الوصول إلى API متاح في خطة Starter وما فوق. قم بالترقية للفتح."
  },
  "upgrade": {
    "cta": "الترقية الآن",
    "learn_more": "معرفة المزيد",
    "contact_sales": "اتصل بالمبيعات"
  }
}
```

*(Similar translations for ZH, FR, PT, DE)*

---

## 🔧 Implementation

### Database Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  subscription_tier INTEGER DEFAULT 0, -- 0=Free, 1=Starter, 2=Pro, 3=Enterprise
  subscription_status VARCHAR(20) DEFAULT 'active', -- active, cancelled, expired
  subscription_expires_at TIMESTAMP,
  features_enabled JSONB DEFAULT '{}', -- Custom feature flags
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscription_plans (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL, -- 'free', 'starter', 'professional', 'enterprise'
  tier INTEGER NOT NULL,
  price_monthly DECIMAL(10,2),
  features JSONB NOT NULL, -- List of enabled features
  limits JSONB NOT NULL -- Usage limits (team_members, api_calls, etc.)
);
```

### Feature Check Function

```typescript
// lib/auth/feature-access.ts
import { useUser } from '@/lib/auth';

export type FeatureName = 
  | 'ai_chat_basic'
  | 'ai_chat_pro'
  | 'voice_ai'
  | 'custom_ai'
  | 'advanced_analytics'
  | 'api_access'
  | 'team_collaboration';

export type SubscriptionTier = 0 | 1 | 2 | 3;

const FEATURE_TIER_MAP: Record<FeatureName, SubscriptionTier> = {
  ai_chat_basic: 1,      // Starter+
  ai_chat_pro: 2,        // Professional+
  voice_ai: 2,           // Professional+
  custom_ai: 3,          // Enterprise only
  advanced_analytics: 2, // Professional+
  api_access: 1,         // Starter+
  team_collaboration: 1  // Starter+
};

export function useFeatureAccess(feature: FeatureName): {
  hasAccess: boolean;
  requiredTier: SubscriptionTier;
  currentTier: SubscriptionTier;
  upgradeUrl: string;
} {
  const user = useUser();
  const currentTier = user?.subscription_tier ?? 0;
  const requiredTier = FEATURE_TIER_MAP[feature];
  const hasAccess = currentTier >= requiredTier;
  
  return {
    hasAccess,
    requiredTier,
    currentTier,
    upgradeUrl: `/pricing?upgrade_to=${requiredTier}`
  };
}
```

### UI Component Example

```typescript
// components/FeatureGate.tsx
'use client';

import { useFeatureAccess } from '@/lib/auth/feature-access';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface FeatureGateProps {
  feature: FeatureName;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { hasAccess, upgradeUrl } = useFeatureAccess(feature);
  const { t } = useTranslation('feature_access');
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/50">
      <Lock className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        {t(`feature_locked.${feature}`)}
      </h3>
      <Button asChild>
        <a href={upgradeUrl}>{t('upgrade.cta')}</a>
      </Button>
    </div>
  );
}

// Usage
<FeatureGate feature="voice_ai">
  <VoiceAIAssistant />
</FeatureGate>
```

---

## 🎨 UI Indicators

### Plan Badge

```typescript
// components/PlanBadge.tsx
export function PlanBadge({ tier }: { tier: SubscriptionTier }) {
  const { t } = useTranslation('plans');
  
  const badges = {
    0: { label: t('free'), color: 'bg-gray-500' },
    1: { label: t('starter'), color: 'bg-blue-500' },
    2: { label: t('professional'), color: 'bg-purple-500' },
    3: { label: t('enterprise'), color: 'bg-gold-500' }
  };
  
  const badge = badges[tier];
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded ${badge.color} text-white`}>
      {badge.label}
    </span>
  );
}
```

### Feature Lock Overlay

```typescript
// components/FeatureLockOverlay.tsx
export function FeatureLockOverlay({ feature }: { feature: FeatureName }) {
  const { t } = useTranslation('feature_access');
  const { upgradeUrl } = useFeatureAccess(feature);
  
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center max-w-md p-6">
        <Lock className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">{t(`feature_locked.${feature}`)}</h2>
        <p className="text-muted-foreground mb-6">{t('upgrade.description')}</p>
        <Button size="lg" asChild>
          <a href={upgradeUrl}>{t('upgrade.cta')}</a>
        </Button>
      </div>
    </div>
  );
}
```

---

## 📊 Analytics & Tracking

**Track feature access attempts:**

```typescript
// lib/analytics/feature-tracking.ts
export function trackFeatureAccess(feature: FeatureName, hasAccess: boolean) {
  analytics.track('Feature Access Attempt', {
    feature,
    hasAccess,
    userTier: user.subscription_tier,
    requiredTier: FEATURE_TIER_MAP[feature],
    timestamp: new Date().toISOString()
  });
  
  if (!hasAccess) {
    analytics.track('Upgrade Prompt Shown', {
      feature,
      currentTier: user.subscription_tier,
      targetTier: FEATURE_TIER_MAP[feature]
    });
  }
}
```

---

## ✅ Implementation Checklist

- [ ] Create subscription_plans table
- [ ] Add subscription_tier to users table
- [ ] Implement useFeatureAccess hook
- [ ] Create FeatureGate component
- [ ] Add feature_access translations (all 7 languages)
- [ ] Implement PlanBadge component
- [ ] Create FeatureLockOverlay component
- [ ] Add analytics tracking
- [ ] Test all features with different tiers
- [ ] Document upgrade flows

---

## 🔒 Security

**Server-side validation is MANDATORY:**

```typescript
// app/api/ai-chat/route.ts
export async function POST(req: Request) {
  const user = await getUser(req);
  
  // ✅ ALWAYS validate on server
  if (user.subscription_tier < 1) {
    return Response.json(
      { error: 'AI Chat requires Starter plan or higher' },
      { status: 403 }
    );
  }
  
  // Proceed with AI chat logic
}
```

**Never trust client-side checks alone!**

---

## ✅ Approval

**Approved by:** Marcelo Escallón (CTO)  
**Date:** 2025-12-23  
**Status:** MANDATORY for all feature development  
**Version:** 1.0.0

---

**This ensures users always know what features are available to them, in their language.**
