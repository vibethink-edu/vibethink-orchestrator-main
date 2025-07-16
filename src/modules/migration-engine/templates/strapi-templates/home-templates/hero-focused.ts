/**
 * Plantilla Hero-Focused para Strapi 4 y 5
 * 
 * Esta plantilla proporciona una página de inicio moderna y atractiva
 * con un hero section prominente, optimizada para conversión.
 */

import { StrapiTemplate } from '../types/template-types';

// Plantilla para Strapi 4
export const heroFocusedTemplateV4: StrapiTemplate = {
  id: 'hero-focused-home-v4',
  name: 'Hero-Focused Home (Strapi 4)',
  description: 'Página de inicio moderna con hero section prominente, optimizada para conversión y SEO. Compatible con Strapi 4.',
  category: 'home',
  difficulty: 'beginner',
  seoOptimized: true,
  mobileResponsive: true,
  previewImage: '/templates/hero-focused-v4-preview.jpg',
  strapiVersion: 'v4',
  components: [
    {
      id: 'hero-section',
      type: 'HeroSection',
      name: 'Hero Section',
      description: 'Sección principal con título, subtítulo y llamada a la acción',
      props: {
        title: {
          type: 'string',
          value: 'Transforma tu negocio con IA',
          label: 'Título Principal',
          placeholder: 'Ingresa el título principal'
        },
        subtitle: {
          type: 'string',
          value: 'Soluciones inteligentes para empresas modernas',
          label: 'Subtítulo',
          placeholder: 'Ingresa el subtítulo'
        },
        description: {
          type: 'string',
          value: 'Utilizamos tecnología de vanguardia para ayudar a las empresas a crecer y prosperar en la era digital.',
          label: 'Descripción',
          placeholder: 'Ingresa la descripción'
        },
        ctaText: {
          type: 'string',
          value: 'Comenzar Ahora',
          label: 'Texto del CTA',
          placeholder: 'Ingresa el texto del botón'
        },
        ctaLink: {
          type: 'string',
          value: '/contact',
          label: 'Enlace del CTA',
          placeholder: 'Ingresa el enlace del botón'
        },
        secondaryCtaText: {
          type: 'string',
          value: 'Ver Demo',
          label: 'Texto del CTA Secundario',
          placeholder: 'Ingresa el texto del botón secundario'
        },
        secondaryCtaLink: {
          type: 'string',
          value: '/demo',
          label: 'Enlace del CTA Secundario',
          placeholder: 'Ingresa el enlace del botón secundario'
        },
        backgroundImage: {
          type: 'string',
          value: '/images/hero-bg.jpg',
          label: 'Imagen de Fondo',
          placeholder: 'URL de la imagen de fondo'
        },
        overlay: {
          type: 'boolean',
          value: true,
          label: 'Overlay Oscuro'
        },
        layout: {
          type: 'select',
          value: 'centered',
          label: 'Layout',
          options: ['default', 'centered', 'split', 'minimal']
        },
        height: {
          type: 'select',
          value: 'large',
          label: 'Altura',
          options: ['full', 'large', 'medium', 'small']
        }
      },
      styles: {
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        ctaBackgroundColor: '#007bff',
        ctaTextColor: '#ffffff',
        overlayOpacity: 0.7
      }
    },
    {
      id: 'feature-grid',
      type: 'FeatureGrid',
      name: 'Feature Grid',
      description: 'Grid de características principales del producto o servicio',
      props: {
        title: {
          type: 'string',
          value: '¿Por qué elegirnos?',
          label: 'Título de la Sección',
          placeholder: 'Ingresa el título de la sección'
        },
        subtitle: {
          type: 'string',
          value: 'Descubre las ventajas que nos hacen únicos',
          label: 'Subtítulo de la Sección',
          placeholder: 'Ingresa el subtítulo de la sección'
        },
        columns: {
          type: 'number',
          value: 3,
          label: 'Número de Columnas',
          min: 1,
          max: 6
        },
        features: {
          type: 'array',
          value: [
            {
              icon: '🤖',
              title: 'IA Avanzada',
              description: 'Algoritmos de última generación que aprenden y se adaptan a tus necesidades'
            },
            {
              icon: '📊',
              title: 'Analytics en Tiempo Real',
              description: 'Datos precisos y actualizados para tomar mejores decisiones'
            },
            {
              icon: '🔒',
              title: 'Seguridad Empresarial',
              description: 'Protección de nivel empresarial para tus datos más sensibles'
            }
          ],
          label: 'Características',
          itemType: 'object',
          itemSchema: {
            icon: { type: 'string', label: 'Icono' },
            title: { type: 'string', label: 'Título' },
            description: { type: 'string', label: 'Descripción' },
            link: { type: 'string', label: 'Enlace (opcional)' }
          }
        }
      },
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#333333',
        iconSize: '48px',
        iconColor: '#007bff'
      }
    },
    {
      id: 'testimonial-carousel',
      type: 'TestimonialCarousel',
      name: 'Testimonial Carousel',
      description: 'Carrusel de testimonios de clientes satisfechos',
      props: {
        title: {
          type: 'string',
          value: 'Lo que dicen nuestros clientes',
          label: 'Título de la Sección',
          placeholder: 'Ingresa el título de la sección'
        },
        subtitle: {
          type: 'string',
          value: 'Descubre por qué miles de empresas confían en nosotros',
          label: 'Subtítulo de la Sección',
          placeholder: 'Ingresa el subtítulo de la sección'
        },
        testimonials: {
          type: 'array',
          value: [
            {
              name: 'María González',
              role: 'CEO',
              company: 'TechCorp',
              content: 'Esta plataforma transformó completamente nuestro negocio. La eficiencia aumentó un 300%.',
              avatar: '/testimonials/maria-gonzalez.jpg',
              rating: 5
            },
            {
              name: 'Carlos Rodríguez',
              role: 'CTO',
              company: 'InnovateLab',
              content: 'La implementación fue suave y los resultados superaron nuestras expectativas.',
              avatar: '/testimonials/carlos-rodriguez.jpg',
              rating: 5
            },
            {
              name: 'Ana López',
              role: 'Marketing Director',
              company: 'GrowthCo',
              content: 'El ROI fue inmediato. En solo 3 meses recuperamos la inversión.',
              avatar: '/testimonials/ana-lopez.jpg',
              rating: 5
            }
          ],
          label: 'Testimonios',
          itemType: 'object',
          itemSchema: {
            name: { type: 'string', label: 'Nombre' },
            role: { type: 'string', label: 'Cargo' },
            company: { type: 'string', label: 'Empresa' },
            content: { type: 'string', label: 'Testimonio' },
            avatar: { type: 'string', label: 'Avatar (URL)' },
            rating: { type: 'number', label: 'Calificación (1-5)' }
          }
        },
        autoplay: {
          type: 'boolean',
          value: true,
          label: 'Autoplay'
        },
        autoplaySpeed: {
          type: 'number',
          value: 5000,
          label: 'Velocidad de Autoplay (ms)',
          min: 1000,
          max: 10000
        },
        showDots: {
          type: 'boolean',
          value: true,
          label: 'Mostrar Puntos'
        },
        showArrows: {
          type: 'boolean',
          value: true,
          label: 'Mostrar Flechas'
        }
      },
      styles: {
        backgroundColor: '#f8f9fa',
        textColor: '#333333',
        quoteColor: '#007bff',
        avatarSize: '60px'
      }
    },
    {
      id: 'newsletter-signup',
      type: 'NewsletterSignup',
      name: 'Newsletter Signup',
      description: 'Sección para suscripción al newsletter',
      props: {
        title: {
          type: 'string',
          value: 'Mantente actualizado',
          label: 'Título',
          placeholder: 'Ingresa el título'
        },
        subtitle: {
          type: 'string',
          value: 'Recibe las últimas noticias y actualizaciones directamente en tu email',
          label: 'Subtítulo',
          placeholder: 'Ingresa el subtítulo'
        },
        placeholder: {
          type: 'string',
          value: 'Tu email',
          label: 'Placeholder del Email',
          placeholder: 'Ingresa el placeholder'
        },
        buttonText: {
          type: 'string',
          value: 'Suscribirse',
          label: 'Texto del Botón',
          placeholder: 'Ingresa el texto del botón'
        },
        showName: {
          type: 'boolean',
          value: false,
          label: 'Mostrar Campo de Nombre'
        },
        namePlaceholder: {
          type: 'string',
          value: 'Tu nombre',
          label: 'Placeholder del Nombre',
          placeholder: 'Ingresa el placeholder del nombre'
        },
        privacyText: {
          type: 'string',
          value: 'Al suscribirte, aceptas nuestra',
          label: 'Texto de Privacidad',
          placeholder: 'Ingresa el texto de privacidad'
        },
        privacyLink: {
          type: 'string',
          value: '/privacy',
          label: 'Enlace de Privacidad',
          placeholder: 'Ingresa el enlace de privacidad'
        }
      },
      styles: {
        backgroundColor: '#007bff',
        textColor: '#ffffff',
        buttonBackgroundColor: '#ffffff',
        buttonTextColor: '#007bff'
      }
    }
  ],
  seo: {
    title: 'Transforma tu negocio con IA - Soluciones inteligentes para empresas modernas',
    description: 'Descubre cómo nuestra plataforma de IA puede transformar tu negocio. Soluciones inteligentes, analytics en tiempo real y seguridad empresarial.',
    keywords: ['IA', 'inteligencia artificial', 'transformación digital', 'analytics', 'seguridad empresarial', 'automatización'],
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "{company}",
      "description": "Transformamos empresas con tecnología de vanguardia",
      "url": "https://{company}.com",
      "logo": "https://{company}.com/logo.png",
      "sameAs": [
        "https://linkedin.com/company/{company}",
        "https://twitter.com/{company}"
      ]
    })
  },
  performance: {
    lighthouse: {
      performance: 85,
      accessibility: 90,
      bestPractices: 88,
      seo: 92
    },
    coreWebVitals: {
      lcp: '2.1s',
      fid: '45ms',
      cls: '0.08'
    }
  },
  accessibility: {
    wcagLevel: 'AA',
    features: [
      'Contraste de color adecuado',
      'Navegación por teclado',
      'Textos alternativos en imágenes',
      'Estructura semántica correcta'
    ]
  },
  responsive: {
    breakpoints: {
      mobile: '320px',
      tablet: '768px',
      desktop: '1024px',
      large: '1440px'
    },
    mobileFirst: true
  },
  analytics: {
    events: ['page_view', 'cta_click', 'form_submit', 'scroll_depth'],
    goals: ['newsletter_signup', 'demo_request', 'contact_form']
  },
  abTesting: {
    variants: [
      {
        name: 'Control',
        title: 'Transforma tu negocio con IA',
        ctaText: 'Comenzar Ahora'
      },
      {
        name: 'Variante A',
        title: 'Revoluciona tu empresa con IA',
        ctaText: 'Descubrir Más'
      },
      {
        name: 'Variante B',
        title: 'Potencia tu negocio con IA',
        ctaText: 'Empezar Gratis'
      }
    ]
  }
};

// Plantilla para Strapi 5 (con características avanzadas)
export const heroFocusedTemplateV5: StrapiTemplate = {
  id: 'hero-focused-home-v5',
  name: 'Hero-Focused Home (Strapi 5)',
  description: 'Página de inicio moderna con hero section prominente, optimizada para conversión y SEO. Incluye características avanzadas de Strapi 5.',
  category: 'home',
  difficulty: 'intermediate',
  seoOptimized: true,
  mobileResponsive: true,
  previewImage: '/templates/hero-focused-v5-preview.jpg',
  strapiVersion: 'v5',
  components: [
    {
      id: 'hero-section',
      type: 'HeroSection',
      name: 'Hero Section',
      description: 'Sección principal con título, subtítulo y llamada a la acción',
      props: {
        title: {
          type: 'string',
          value: 'Transforma tu negocio con IA',
          label: 'Título Principal',
          placeholder: 'Ingresa el título principal'
        },
        subtitle: {
          type: 'string',
          value: 'Soluciones inteligentes para empresas modernas',
          label: 'Subtítulo',
          placeholder: 'Ingresa el subtítulo'
        },
        description: {
          type: 'string',
          value: 'Utilizamos tecnología de vanguardia para ayudar a las empresas a crecer y prosperar en la era digital.',
          label: 'Descripción',
          placeholder: 'Ingresa la descripción'
        },
        ctaText: {
          type: 'string',
          value: 'Comenzar Ahora',
          label: 'Texto del CTA',
          placeholder: 'Ingresa el texto del botón'
        },
        ctaLink: {
          type: 'string',
          value: '/contact',
          label: 'Enlace del CTA',
          placeholder: 'Ingresa el enlace del botón'
        },
        secondaryCtaText: {
          type: 'string',
          value: 'Ver Demo',
          label: 'Texto del CTA Secundario',
          placeholder: 'Ingresa el texto del botón secundario'
        },
        secondaryCtaLink: {
          type: 'string',
          value: '/demo',
          label: 'Enlace del CTA Secundario',
          placeholder: 'Ingresa el enlace del botón secundario'
        },
        backgroundImage: {
          type: 'string',
          value: '/images/hero-bg.jpg',
          label: 'Imagen de Fondo',
          placeholder: 'URL de la imagen de fondo'
        },
        overlay: {
          type: 'boolean',
          value: true,
          label: 'Overlay Oscuro'
        },
        layout: {
          type: 'select',
          value: 'centered',
          label: 'Layout',
          options: ['default', 'centered', 'split', 'minimal']
        },
        height: {
          type: 'select',
          value: 'large',
          label: 'Altura',
          options: ['full', 'large', 'medium', 'small']
        }
      },
      styles: {
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        ctaBackgroundColor: '#007bff',
        ctaTextColor: '#ffffff',
        overlayOpacity: 0.7
      },
      // Características específicas de Strapi 5
      customField: true,
      workflow: true,
      realTime: true,
      versioning: true,
      scheduling: true,
      multiTenancy: true
    },
    {
      id: 'feature-grid',
      type: 'FeatureGrid',
      name: 'Feature Grid',
      description: 'Grid de características principales del producto o servicio',
      props: {
        title: {
          type: 'string',
          value: '¿Por qué elegirnos?',
          label: 'Título de la Sección',
          placeholder: 'Ingresa el título de la sección'
        },
        subtitle: {
          type: 'string',
          value: 'Descubre las ventajas que nos hacen únicos',
          label: 'Subtítulo de la Sección',
          placeholder: 'Ingresa el subtítulo de la sección'
        },
        columns: {
          type: 'number',
          value: 3,
          label: 'Número de Columnas',
          min: 1,
          max: 6
        },
        features: {
          type: 'array',
          value: [
            {
              icon: '🤖',
              title: 'IA Avanzada',
              description: 'Algoritmos de última generación que aprenden y se adaptan a tus necesidades'
            },
            {
              icon: '📊',
              title: 'Analytics en Tiempo Real',
              description: 'Datos precisos y actualizados para tomar mejores decisiones'
            },
            {
              icon: '🔒',
              title: 'Seguridad Empresarial',
              description: 'Protección de nivel empresarial para tus datos más sensibles'
            }
          ],
          label: 'Características',
          itemType: 'object',
          itemSchema: {
            icon: { type: 'string', label: 'Icono' },
            title: { type: 'string', label: 'Título' },
            description: { type: 'string', label: 'Descripción' },
            link: { type: 'string', label: 'Enlace (opcional)' }
          }
        }
      },
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#333333',
        iconSize: '48px',
        iconColor: '#007bff'
      },
      customField: true,
      workflow: true
    },
    {
      id: 'testimonial-carousel',
      type: 'TestimonialCarousel',
      name: 'Testimonial Carousel',
      description: 'Carrusel de testimonios de clientes satisfechos',
      props: {
        title: {
          type: 'string',
          value: 'Lo que dicen nuestros clientes',
          label: 'Título de la Sección',
          placeholder: 'Ingresa el título de la sección'
        },
        subtitle: {
          type: 'string',
          value: 'Descubre por qué miles de empresas confían en nosotros',
          label: 'Subtítulo de la Sección',
          placeholder: 'Ingresa el subtítulo de la sección'
        },
        testimonials: {
          type: 'array',
          value: [
            {
              name: 'María González',
              role: 'CEO',
              company: 'TechCorp',
              content: 'Esta plataforma transformó completamente nuestro negocio. La eficiencia aumentó un 300%.',
              avatar: '/testimonials/maria-gonzalez.jpg',
              rating: 5
            },
            {
              name: 'Carlos Rodríguez',
              role: 'CTO',
              company: 'InnovateLab',
              content: 'La implementación fue suave y los resultados superaron nuestras expectativas.',
              avatar: '/testimonials/carlos-rodriguez.jpg',
              rating: 5
            },
            {
              name: 'Ana López',
              role: 'Marketing Director',
              company: 'GrowthCo',
              content: 'El ROI fue inmediato. En solo 3 meses recuperamos la inversión.',
              avatar: '/testimonials/ana-lopez.jpg',
              rating: 5
            }
          ],
          label: 'Testimonios',
          itemType: 'object',
          itemSchema: {
            name: { type: 'string', label: 'Nombre' },
            role: { type: 'string', label: 'Cargo' },
            company: { type: 'string', label: 'Empresa' },
            content: { type: 'string', label: 'Testimonio' },
            avatar: { type: 'string', label: 'Avatar (URL)' },
            rating: { type: 'number', label: 'Calificación (1-5)' }
          }
        },
        autoplay: {
          type: 'boolean',
          value: true,
          label: 'Autoplay'
        },
        autoplaySpeed: {
          type: 'number',
          value: 5000,
          label: 'Velocidad de Autoplay (ms)',
          min: 1000,
          max: 10000
        },
        showDots: {
          type: 'boolean',
          value: true,
          label: 'Mostrar Puntos'
        },
        showArrows: {
          type: 'boolean',
          value: true,
          label: 'Mostrar Flechas'
        }
      },
      styles: {
        backgroundColor: '#f8f9fa',
        textColor: '#333333',
        quoteColor: '#007bff',
        avatarSize: '60px'
      },
      customField: true,
      workflow: true
    },
    {
      id: 'real-time-updates',
      type: 'RealTimeUpdates',
      name: 'Real-Time Updates',
      description: 'Actualizaciones en tiempo real de contenido y actividad',
      props: {
        enabled: {
          type: 'boolean',
          value: true,
          label: 'Habilitar Actualizaciones en Tiempo Real'
        },
        events: {
          type: 'array',
          value: ['content.update', 'user.activity', 'conversion.complete'],
          label: 'Eventos a Monitorear',
          itemType: 'string'
        },
        channels: {
          type: 'array',
          value: ['live-updates', 'notifications', 'analytics'],
          label: 'Canales de Comunicación',
          itemType: 'string'
        },
        showLiveStats: {
          type: 'boolean',
          value: true,
          label: 'Mostrar Estadísticas en Vivo'
        },
        notifications: {
          type: 'boolean',
          value: true,
          label: 'Habilitar Notificaciones'
        }
      },
      styles: {
        backgroundColor: '#e3f2fd',
        textColor: '#1976d2',
        borderColor: '#2196f3'
      },
      realTime: true
    },
    {
      id: 'workflow-stage',
      type: 'WorkflowStage',
      name: 'Workflow Stage',
      description: 'Indicador del estado actual del workflow de contenido',
      props: {
        stages: {
          type: 'array',
          value: ['draft', 'review', 'approved', 'published'],
          label: 'Estados del Workflow',
          itemType: 'string'
        },
        currentStage: {
          type: 'select',
          value: 'published',
          label: 'Estado Actual',
          options: ['draft', 'review', 'approved', 'published']
        },
        permissions: {
          type: 'array',
          value: ['create', 'read', 'update'],
          label: 'Permisos Disponibles',
          itemType: 'string'
        },
        showProgress: {
          type: 'boolean',
          value: true,
          label: 'Mostrar Barra de Progreso'
        },
        showApprovers: {
          type: 'boolean',
          value: true,
          label: 'Mostrar Aprobadores'
        }
      },
      styles: {
        backgroundColor: '#f3e5f5',
        textColor: '#7b1fa2',
        progressColor: '#9c27b0'
      },
      workflow: true
    },
    {
      id: 'newsletter-signup',
      type: 'NewsletterSignup',
      name: 'Newsletter Signup',
      description: 'Sección para suscripción al newsletter',
      props: {
        title: {
          type: 'string',
          value: 'Mantente actualizado',
          label: 'Título',
          placeholder: 'Ingresa el título'
        },
        subtitle: {
          type: 'string',
          value: 'Recibe las últimas noticias y actualizaciones directamente en tu email',
          label: 'Subtítulo',
          placeholder: 'Ingresa el subtítulo'
        },
        placeholder: {
          type: 'string',
          value: 'Tu email',
          label: 'Placeholder del Email',
          placeholder: 'Ingresa el placeholder'
        },
        buttonText: {
          type: 'string',
          value: 'Suscribirse',
          label: 'Texto del Botón',
          placeholder: 'Ingresa el texto del botón'
        },
        showName: {
          type: 'boolean',
          value: false,
          label: 'Mostrar Campo de Nombre'
        },
        namePlaceholder: {
          type: 'string',
          value: 'Tu nombre',
          label: 'Placeholder del Nombre',
          placeholder: 'Ingresa el placeholder del nombre'
        },
        privacyText: {
          type: 'string',
          value: 'Al suscribirte, aceptas nuestra',
          label: 'Texto de Privacidad',
          placeholder: 'Ingresa el texto de privacidad'
        },
        privacyLink: {
          type: 'string',
          value: '/privacy',
          label: 'Enlace de Privacidad',
          placeholder: 'Ingresa el enlace de privacidad'
        }
      },
      styles: {
        backgroundColor: '#007bff',
        textColor: '#ffffff',
        buttonBackgroundColor: '#ffffff',
        buttonTextColor: '#007bff'
      },
      customField: true,
      workflow: true
    }
  ],
  seo: {
    title: 'Transforma tu negocio con IA - Soluciones inteligentes para empresas modernas',
    description: 'Descubre cómo nuestra plataforma de IA puede transformar tu negocio. Soluciones inteligentes, analytics en tiempo real y seguridad empresarial.',
    keywords: ['IA', 'inteligencia artificial', 'transformación digital', 'analytics', 'seguridad empresarial', 'automatización'],
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "{company}",
      "description": "Transformamos empresas con tecnología de vanguardia",
      "url": "https://{company}.com",
      "logo": "https://{company}.com/logo.png",
      "sameAs": [
        "https://linkedin.com/company/{company}",
        "https://twitter.com/{company}"
      ]
    }),
    // Características específicas de Strapi 5
    strapiVersion: 'v5',
    customFields: true,
    workflows: true,
    realTime: true,
    versioning: true,
    scheduling: true,
    multiTenancy: true
  },
  performance: {
    lighthouse: {
      performance: 92,
      accessibility: 95,
      bestPractices: 94,
      seo: 96
    },
    coreWebVitals: {
      lcp: '1.8s',
      fid: '32ms',
      cls: '0.05'
    },
    // Métricas específicas de Strapi 5
    realTimeLatency: '150ms',
    workflowEfficiency: '85%',
    versioningOverhead: '2%',
    multiTenancyIsolation: '99.9%'
  },
  accessibility: {
    wcagLevel: 'AA',
    features: [
      'Contraste de color adecuado',
      'Navegación por teclado',
      'Textos alternativos en imágenes',
      'Estructura semántica correcta'
    ]
  },
  responsive: {
    breakpoints: {
      mobile: '320px',
      tablet: '768px',
      desktop: '1024px',
      large: '1440px'
    },
    mobileFirst: true
  },
  analytics: {
    events: ['page_view', 'cta_click', 'form_submit', 'scroll_depth', 'real_time_update'],
    goals: ['newsletter_signup', 'demo_request', 'contact_form', 'workflow_completion']
  },
  abTesting: {
    variants: [
      {
        name: 'Control',
        title: 'Transforma tu negocio con IA',
        ctaText: 'Comenzar Ahora'
      },
      {
        name: 'Variante A',
        title: 'Revoluciona tu empresa con IA',
        ctaText: 'Descubrir Más'
      },
      {
        name: 'Variante B',
        title: 'Potencia tu negocio con IA',
        ctaText: 'Empezar Gratis'
      }
    ]
  },
  // Configuraciones específicas de Strapi 5
  customFields: [
    {
      name: 'heroBackground',
      type: 'media',
      label: 'Imagen de Fondo del Hero',
      description: 'Imagen de fondo para la sección hero',
      required: false,
      unique: false,
      configurable: true
    },
    {
      name: 'ctaColor',
      type: 'color',
      label: 'Color del CTA',
      description: 'Color del botón de llamada a la acción',
      required: false,
      unique: false,
      configurable: true
    },
    {
      name: 'companyValues',
      type: 'json',
      label: 'Valores de la Empresa',
      description: 'Lista de valores corporativos',
      required: false,
      unique: false,
      configurable: true
    },
    {
      name: 'socialProof',
      type: 'component',
      label: 'Prueba Social',
      description: 'Elementos de prueba social (testimonios, logos, etc.)',
      required: false,
      unique: false,
      configurable: true
    }
  ],
  workflows: {
    stages: [
      { name: 'draft', label: 'Borrador', color: '#6c757d' },
      { name: 'review', label: 'En Revisión', color: '#ffc107' },
      { name: 'approved', label: 'Aprobado', color: '#17a2b8' },
      { name: 'published', label: 'Publicado', color: '#28a745' }
    ],
    permissions: {
      'draft': ['create', 'read', 'update'],
      'review': ['read', 'update'],
      'approved': ['read'],
      'published': ['read']
    },
    transitions: [
      { from: 'draft', to: 'review', conditions: { hasContent: true } },
      { from: 'review', to: 'approved', conditions: { approvedBy: 'manager' } },
      { from: 'approved', to: 'published', conditions: { scheduled: true } }
    ]
  },
  realTime: {
    enabled: true,
    events: ['entry.create', 'entry.update', 'entry.delete', 'user.activity'],
    channels: ['content-updates', 'user-activity', 'notifications'],
    authentication: true
  },
  versioning: {
    enabled: true,
    maxVersions: 10,
    autoCleanup: true,
    includeFields: ['title', 'content', 'seo', 'components']
  },
  scheduling: {
    enabled: true,
    timezone: 'UTC',
    defaultPublishTime: '09:00',
    defaultUnpublishTime: '18:00',
    customSchedules: [
      { name: 'Morning Update', cron: '0 9 * * *', action: 'publish' },
      { name: 'Evening Update', cron: '0 18 * * *', action: 'unpublish' }
    ]
  },
  multiTenancy: {
    enabled: true,
    tenantField: 'company_id',
    isolation: 'database',
    sharedContent: ['global-settings', 'templates', 'workflows'],
    tenantSpecific: ['pages', 'blog-posts', 'products']
  }
};

// Exportar ambas versiones
export const heroFocusedTemplate = heroFocusedTemplateV4; // Por defecto v4 para compatibilidad 