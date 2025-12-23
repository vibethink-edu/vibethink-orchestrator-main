# Web Tagging & Analytics - Complete Reference

**Version:** 1.0.0  
**Status:** ✅ REFERENCE DOCUMENT  
**Last Updated:** 2025-12-23  
**Purpose:** Complete context for AI agents - NO repetitive questions to user

---

## 🎯 Purpose

This document provides **COMPLETE** context about web tagging, analytics, SEO, and metadata for the ViTo AI Assistant platform. AI agents should **NEVER** ask the user about these topics - all answers are here.

---

## 📊 Analytics Platforms Used

### Google Analytics 4 (GA4)
**Status:** ✅ Active  
**Tracking ID:** `G-XXXXXXXXXX` (to be configured per environment)  
**Implementation:** gtag.js

**What We Track:**
- Page views
- User sessions
- Custom events (button clicks, form submissions)
- E-commerce events (if applicable)
- User demographics
- Traffic sources

**Configuration:**
```typescript
// lib/analytics/google-analytics.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

---

### Mixpanel
**Status:** ⏳ Planned (not yet implemented)  
**Use Case:** Product analytics, user behavior tracking

---

### Hotjar
**Status:** ⏳ Planned (not yet implemented)  
**Use Case:** Heatmaps, session recordings, user feedback

---

## 🏷️ Meta Tags (SEO)

### Standard Meta Tags

**Every page MUST have:**

```html
<!-- Primary Meta Tags -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="[Page-specific description, 150-160 chars]" />
<meta name="keywords" content="[Relevant keywords, comma-separated]" />
<meta name="author" content="VibeThink" />
<meta name="robots" content="index, follow" />

<!-- Language & Locale -->
<meta http-equiv="content-language" content="en" />
<link rel="alternate" hreflang="en" href="https://vibethink.com/en" />
<link rel="alternate" hreflang="es" href="https://vibethink.com/es" />
<link rel="alternate" hreflang="ar" href="https://vibethink.com/ar" />
<link rel="alternate" hreflang="zh" href="https://vibethink.com/zh" />
<link rel="alternate" hreflang="fr" href="https://vibethink.com/fr" />
<link rel="alternate" hreflang="pt" href="https://vibethink.com/pt" />
<link rel="alternate" hreflang="de" href="https://vibethink.com/de" />
<link rel="alternate" hreflang="x-default" href="https://vibethink.com/en" />
```

---

### Open Graph (Facebook, LinkedIn)

```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://vibethink.com/" />
<meta property="og:title" content="[Page Title]" />
<meta property="og:description" content="[Page Description]" />
<meta property="og:image" content="https://vibethink.com/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="en_US" />
<meta property="og:site_name" content="VibeThink" />
```

**Image Requirements:**
- Size: 1200x630px (recommended)
- Format: JPG or PNG
- Max file size: 8MB
- Aspect ratio: 1.91:1

---

### Twitter Cards

```html
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://vibethink.com/" />
<meta name="twitter:title" content="[Page Title]" />
<meta name="twitter:description" content="[Page Description]" />
<meta name="twitter:image" content="https://vibethink.com/twitter-image.jpg" />
<meta name="twitter:creator" content="@vibethink" />
<meta name="twitter:site" content="@vibethink" />
```

**Image Requirements:**
- Size: 1200x600px (recommended)
- Format: JPG, PNG, WEBP, or GIF
- Max file size: 5MB

---

### Favicon & App Icons

```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

<!-- Android -->
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#000000" />

<!-- Microsoft -->
<meta name="msapplication-TileColor" content="#000000" />
<meta name="msapplication-config" content="/browserconfig.xml" />
```

---

## 🔍 Structured Data (Schema.org)

### Organization Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VibeThink",
  "url": "https://vibethink.com",
  "logo": "https://vibethink.com/logo.png",
  "description": "AI-powered project management and collaboration platform",
  "sameAs": [
    "https://twitter.com/vibethink",
    "https://linkedin.com/company/vibethink",
    "https://github.com/vibethink"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-XXX-XXX-XXXX",
    "contactType": "Customer Service",
    "availableLanguage": ["en", "es", "ar", "zh", "fr", "pt", "de"]
  }
}
</script>
```

---

### WebApplication Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "VibeThink Orchestrator",
  "url": "https://vibethink.com",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250"
  }
}
</script>
```

---

### BreadcrumbList Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://vibethink.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Dashboard",
      "item": "https://vibethink.com/dashboard"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Projects",
      "item": "https://vibethink.com/dashboard/projects"
    }
  ]
}
</script>
```

---

## 📈 Custom Event Tracking

### Standard Events

**Button Clicks:**
```typescript
trackEvent({
  action: 'click',
  category: 'Button',
  label: 'AI Chat Open',
  value: 1
});
```

**Form Submissions:**
```typescript
trackEvent({
  action: 'submit',
  category: 'Form',
  label: 'Contact Form',
  value: 1
});
```

**Feature Usage:**
```typescript
trackEvent({
  action: 'use_feature',
  category: 'Feature',
  label: 'Voice AI Assistant',
  value: 1
});
```

**Language Switch:**
```typescript
trackEvent({
  action: 'language_change',
  category: 'i18n',
  label: `${fromLocale} -> ${toLocale}`,
  value: 1
});
```

**Upgrade Prompt:**
```typescript
trackEvent({
  action: 'upgrade_prompt_shown',
  category: 'Monetization',
  label: feature,
  value: requiredTier
});
```

---

## 🌐 Multilingual SEO

### URL Structure

**Pattern:** `/{locale}/{path}`

**Examples:**
- English: `https://vibethink.com/en/dashboard/projects`
- Spanish: `https://vibethink.com/es/dashboard/projects`
- Arabic: `https://vibethink.com/ar/dashboard/projects`

**Default (no locale):** Redirects to `/en/`

---

### Hreflang Implementation

**MANDATORY on every page:**

```html
<link rel="alternate" hreflang="en" href="https://vibethink.com/en/dashboard" />
<link rel="alternate" hreflang="es" href="https://vibethink.com/es/dashboard" />
<link rel="alternate" hreflang="ar" href="https://vibethink.com/ar/dashboard" />
<link rel="alternate" hreflang="zh" href="https://vibethink.com/zh/dashboard" />
<link rel="alternate" hreflang="fr" href="https://vibethink.com/fr/dashboard" />
<link rel="alternate" hreflang="pt" href="https://vibethink.com/pt/dashboard" />
<link rel="alternate" hreflang="de" href="https://vibethink.com/de/dashboard" />
<link rel="alternate" hreflang="x-default" href="https://vibethink.com/en/dashboard" />
```

---

### Localized Meta Tags

**Title Format:**
```
[Page Title] | VibeThink Orchestrator
```

**Examples:**
- EN: "Project Management | VibeThink Orchestrator"
- ES: "Gestión de Proyectos | VibeThink Orchestrator"
- AR: "إدارة المشاريع | VibeThink Orchestrator"

**Description (per language):**
```json
{
  "en": "Manage your projects with AI-powered insights and collaboration tools.",
  "es": "Gestiona tus proyectos con información impulsada por IA y herramientas de colaboración.",
  "ar": "إدارة مشاريعك بأدوات الذكاء الاصطناعي والتعاون."
}
```

---

## 🔐 Security Headers

```html
<!-- Content Security Policy -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline';" />

<!-- Referrer Policy -->
<meta name="referrer" content="strict-origin-when-cross-origin" />

<!-- Permissions Policy -->
<meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=(self), camera=(self)" />
```

---

## 📱 Progressive Web App (PWA)

### Manifest File

```json
// public/site.webmanifest
{
  "name": "VibeThink Orchestrator",
  "short_name": "VibeThink",
  "description": "AI-powered project management platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "lang": "en",
  "dir": "ltr"
}
```

**For RTL languages (Arabic):**
```json
{
  "lang": "ar",
  "dir": "rtl"
}
```

---

## 🎨 Canonical URLs

**ALWAYS set canonical URL:**

```html
<link rel="canonical" href="https://vibethink.com/en/dashboard/projects" />
```

**Rules:**
- Use absolute URLs
- Include locale in URL
- Point to the primary version of the page
- Avoid duplicate content issues

---

## 🚀 Performance Optimization

### Preconnect to External Domains

```html
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

### DNS Prefetch

```html
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
```

### Preload Critical Resources

```html
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/critical.css" as="style" />
```

---

## 📊 Conversion Tracking

### Google Ads Conversion

```html
<!-- Google Ads Conversion Tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXX');
</script>
```

### Facebook Pixel

```html
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'XXXXXXXXXXXXXXXXX');
  fbq('track', 'PageView');
</script>
```

---

## 🎯 Implementation in Next.js

### Layout Component

```typescript
// app/layout.tsx
import { Metadata } from 'next';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://vibethink.com'),
  title: {
    default: 'VibeThink Orchestrator',
    template: '%s | VibeThink Orchestrator'
  },
  description: 'AI-powered project management and collaboration platform',
  keywords: ['project management', 'AI', 'collaboration', 'productivity'],
  authors: [{ name: 'VibeThink' }],
  creator: 'VibeThink',
  publisher: 'VibeThink',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vibethink.com',
    siteName: 'VibeThink',
    title: 'VibeThink Orchestrator',
    description: 'AI-powered project management platform',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VibeThink Orchestrator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibeThink Orchestrator',
    description: 'AI-powered project management platform',
    creator: '@vibethink',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://vibethink.com',
    languages: {
      'en': 'https://vibethink.com/en',
      'es': 'https://vibethink.com/es',
      'ar': 'https://vibethink.com/ar',
      'zh': 'https://vibethink.com/zh',
      'fr': 'https://vibethink.com/fr',
      'pt': 'https://vibethink.com/pt',
      'de': 'https://vibethink.com/de',
    },
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

### Page-Specific Metadata

```typescript
// app/dashboard/projects/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Management',
  description: 'Manage your projects with AI-powered insights',
  openGraph: {
    title: 'Project Management | VibeThink',
    description: 'Manage your projects with AI-powered insights',
    url: 'https://vibethink.com/dashboard/projects',
  },
};
```

---

## ✅ Checklist for Every Page

- [ ] Title tag (unique, 50-60 chars)
- [ ] Meta description (unique, 150-160 chars)
- [ ] Canonical URL
- [ ] Hreflang tags (all 7 languages)
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Structured data (Schema.org)
- [ ] Favicon
- [ ] Language attribute on `<html>`
- [ ] Viewport meta tag
- [ ] Character encoding (UTF-8)

---

## 🚫 Common Mistakes to Avoid

1. **Missing hreflang tags** - MANDATORY for multilingual sites
2. **Duplicate meta descriptions** - Each page must be unique
3. **Missing canonical URLs** - Causes duplicate content issues
4. **Wrong image sizes** - OG images must be 1200x630px
5. **Hardcoded locale in metadata** - Must be dynamic
6. **Missing structured data** - Hurts SEO
7. **No analytics tracking** - Can't measure success

---

## 📚 Resources

**Testing Tools:**
- Google Search Console: https://search.google.com/search-console
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Schema.org Validator: https://validator.schema.org/
- Google Rich Results Test: https://search.google.com/test/rich-results

---

## ✅ AI Agent Instructions

**When implementing web tagging:**

1. **NEVER ask the user** about:
   - What meta tags to use (use this document)
   - What analytics to implement (use GA4)
   - What structured data to add (use Schema.org)
   - What hreflang tags to use (all 7 languages)

2. **ALWAYS:**
   - Include all 7 languages in hreflang
   - Use canonical URLs
   - Add Open Graph and Twitter Cards
   - Include structured data
   - Set proper language attributes
   - Use UTF-8 encoding

3. **REFERENCE:**
   - This document for all tagging questions
   - GLOBAL_MULTILINGUAL_STANDARD.md for language rules
   - PLAN_BASED_FEATURE_ACCESS.md for feature tracking

---

**Last Updated:** 2025-12-23  
**Version:** 1.0.0  
**Status:** ✅ Complete Reference - NO user questions needed
