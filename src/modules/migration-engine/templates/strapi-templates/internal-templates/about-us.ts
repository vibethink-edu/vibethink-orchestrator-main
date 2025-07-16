import { StrapiTemplate } from '../../types/template-types';

/**
 * Plantilla About Us para Página Interna
 * 
 * Características:
 * - Hero section con imagen de fondo
 * - Timeline de la empresa
 * - Grid del equipo con fotos y redes sociales
 * - Sección de valores/misión
 * - Formulario de contacto
 * - SEO optimizado para Organization schema
 */
export const aboutUsTemplate: StrapiTemplate = {
  id: 'about-us-page',
  name: 'About Us Page',
  description: 'Página sobre nosotros con timeline y equipo',
  category: 'internal',
  difficulty: 'intermediate',
  seoOptimized: true,
  mobileResponsive: true,
  previewImage: '/templates/about-us-preview.jpg',
  
  // Configuración de componentes
  components: [
    {
      id: 'hero-section',
      type: 'HeroSection',
      name: 'Hero Section',
      description: 'Sección principal con título y imagen de fondo',
      props: {
        title: {
          type: 'string',
          value: 'Sobre Nosotros',
          label: 'Título Principal',
          placeholder: 'Ingresa el título principal',
          required: true,
          maxLength: 60
        },
        subtitle: {
          type: 'string',
          value: 'Conoce nuestro equipo y nuestra historia',
          label: 'Subtítulo',
          placeholder: 'Ingresa el subtítulo',
          required: false,
          maxLength: 120
        },
        description: {
          type: 'string',
          value: 'Somos una empresa innovadora comprometida con la excelencia y la transformación digital.',
          label: 'Descripción',
          placeholder: 'Descripción de la empresa',
          required: false,
          maxLength: 200
        },
        backgroundImage: {
          type: 'string',
          value: '/images/about-hero.jpg',
          label: 'Imagen de Fondo',
          placeholder: 'URL de la imagen',
          required: false
        },
        overlay: {
          type: 'boolean',
          value: true,
          label: 'Overlay sobre imagen',
          required: false
        },
        layout: {
          type: 'select',
          value: 'centered',
          options: ['default', 'centered', 'split', 'minimal'],
          label: 'Layout del Hero',
          required: true
        },
        height: {
          type: 'select',
          value: 'large',
          options: ['full', 'large', 'medium', 'small'],
          label: 'Altura del Hero',
          required: true
        }
      },
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#1a1a1a',
        overlayColor: 'rgba(0,0,0,0.6)',
        overlayTextColor: '#ffffff'
      }
    },
    {
      id: 'mission-vision',
      type: 'MissionVision',
      name: 'Misión y Visión',
      description: 'Sección con misión, visión y valores',
      props: {
        title: {
          type: 'string',
          value: 'Nuestra Misión y Visión',
          label: 'Título de la Sección',
          placeholder: 'Título de misión y visión',
          required: false
        },
        mission: {
          type: 'object',
          value: {
            title: 'Nuestra Misión',
            content: 'Transformar empresas a través de la innovación tecnológica, proporcionando soluciones que impulsen el crecimiento y la eficiencia.',
            icon: '🎯'
          },
          label: 'Misión',
          required: true
        },
        vision: {
          type: 'object',
          value: {
            title: 'Nuestra Visión',
            content: 'Ser líderes en la transformación digital, reconocidos por nuestra innovación, calidad y compromiso con el éxito de nuestros clientes.',
            icon: '🔮'
          },
          label: 'Visión',
          required: true
        },
        values: {
          type: 'array',
          value: [
            {
              title: 'Innovación',
              content: 'Buscamos constantemente nuevas formas de resolver problemas',
              icon: '💡'
            },
            {
              title: 'Excelencia',
              content: 'Nos esforzamos por la calidad en todo lo que hacemos',
              icon: '⭐'
            },
            {
              title: 'Integridad',
              content: 'Actuamos con honestidad y transparencia',
              icon: '🤝'
            },
            {
              title: 'Colaboración',
              content: 'Trabajamos juntos para lograr resultados extraordinarios',
              icon: '👥'
            }
          ],
          label: 'Valores',
          itemType: 'object',
          itemSchema: {
            title: { type: 'string', required: true },
            content: { type: 'string', required: true },
            icon: { type: 'string', required: true }
          }
        }
      },
      styles: {
        backgroundColor: '#f8f9fa',
        textColor: '#1a1a1a',
        cardBackgroundColor: '#ffffff',
        cardBorderRadius: '12px',
        cardShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }
    },
    {
      id: 'timeline',
      type: 'Timeline',
      name: 'Timeline de la Empresa',
      description: 'Línea de tiempo con hitos importantes',
      props: {
        title: {
          type: 'string',
          value: 'Nuestra Historia',
          label: 'Título de la Sección',
          placeholder: 'Título del timeline',
          required: false
        },
        subtitle: {
          type: 'string',
          value: 'Un viaje de innovación y crecimiento',
          label: 'Subtítulo de la Sección',
          placeholder: 'Subtítulo del timeline',
          required: false
        },
        events: {
          type: 'array',
          value: [
            {
              year: '2020',
              title: 'Fundación',
              description: 'Nacimos con una visión clara de transformar la industria tecnológica',
              image: '/timeline/2020.jpg',
              achievements: ['Primer cliente', 'Equipo de 5 personas']
            },
            {
              year: '2021',
              title: 'Primera Expansión',
              description: 'Crecimos a 50 clientes y expandimos nuestro equipo',
              image: '/timeline/2021.jpg',
              achievements: ['50 clientes', 'Equipo de 20 personas']
            },
            {
              year: '2022',
              title: 'Expansión Internacional',
              description: 'Llegamos a mercados internacionales y abrimos oficinas en 3 países',
              image: '/timeline/2022.jpg',
              achievements: ['Presencia en 3 países', '200 clientes']
            },
            {
              year: '2023',
              title: 'Líderes en IA',
              description: 'Nos convertimos en referentes en inteligencia artificial',
              image: '/timeline/2023.jpg',
              achievements: ['500 clientes', 'Equipo de 100 personas']
            },
            {
              year: '2024',
              title: 'Innovación Continua',
              description: 'Seguimos innovando y creciendo con nuevas tecnologías',
              image: '/timeline/2024.jpg',
              achievements: ['1000+ clientes', 'Presencia global']
            }
          ],
          label: 'Eventos del Timeline',
          itemType: 'object',
          itemSchema: {
            year: { type: 'string', required: true },
            title: { type: 'string', required: true },
            description: { type: 'string', required: true },
            image: { type: 'string', required: false },
            achievements: { type: 'array', itemType: 'string', required: false }
          }
        },
        layout: {
          type: 'select',
          value: 'vertical',
          options: ['vertical', 'horizontal', 'cards'],
          label: 'Layout del Timeline',
          required: true
        },
        showImages: {
          type: 'boolean',
          value: true,
          label: 'Mostrar imágenes',
          required: false
        },
        showAchievements: {
          type: 'boolean',
          value: true,
          label: 'Mostrar logros',
          required: false
        }
      },
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#1a1a1a',
        timelineColor: '#007bff',
        cardBackgroundColor: '#f8f9fa',
        cardBorderRadius: '8px'
      }
    },
    {
      id: 'team-grid',
      type: 'TeamGrid',
      name: 'Grid del Equipo',
      description: 'Equipo con fotos, roles y redes sociales',
      props: {
        title: {
          type: 'string',
          value: 'Nuestro Equipo',
          label: 'Título de la Sección',
          placeholder: 'Título del equipo',
          required: false
        },
        subtitle: {
          type: 'string',
          value: 'Conoce a las personas detrás de nuestro éxito',
          label: 'Subtítulo de la Sección',
          placeholder: 'Subtítulo del equipo',
          required: false
        },
        members: {
          type: 'array',
          value: [
            {
              name: 'Ana López',
              role: 'CEO & Fundadora',
              bio: 'Experta en transformación digital con más de 15 años de experiencia en tecnología.',
              avatar: '/team/ana.jpg',
              email: 'ana@empresa.com',
              social: {
                linkedin: 'https://linkedin.com/in/ana-lopez',
                twitter: 'https://twitter.com/ana_lopez',
                github: 'https://github.com/ana-lopez'
              },
              department: 'Ejecutivo',
              joinDate: '2020'
            },
            {
              name: 'Carlos Rodríguez',
              role: 'CTO',
              bio: 'Especialista en arquitectura de software y tecnologías emergentes.',
              avatar: '/team/carlos.jpg',
              email: 'carlos@empresa.com',
              social: {
                linkedin: 'https://linkedin.com/in/carlos-rodriguez',
                twitter: 'https://twitter.com/carlos_rodriguez',
                github: 'https://github.com/carlos-rodriguez'
              },
              department: 'Tecnología',
              joinDate: '2020'
            },
            {
              name: 'María García',
              role: 'Directora de Marketing',
              bio: 'Estratega de marketing digital con enfoque en crecimiento y conversión.',
              avatar: '/team/maria.jpg',
              email: 'maria@empresa.com',
              social: {
                linkedin: 'https://linkedin.com/in/maria-garcia',
                twitter: 'https://twitter.com/maria_garcia'
              },
              department: 'Marketing',
              joinDate: '2021'
            },
            {
              name: 'David Martínez',
              role: 'Director de Ventas',
              bio: 'Experto en desarrollo de negocios y relaciones con clientes.',
              avatar: '/team/david.jpg',
              email: 'david@empresa.com',
              social: {
                linkedin: 'https://linkedin.com/in/david-martinez'
              },
              department: 'Ventas',
              joinDate: '2021'
            },
            {
              name: 'Laura Fernández',
              role: 'Lead Designer',
              bio: 'Diseñadora UX/UI apasionada por crear experiencias excepcionales.',
              avatar: '/team/laura.jpg',
              email: 'laura@empresa.com',
              social: {
                linkedin: 'https://linkedin.com/in/laura-fernandez',
                dribbble: 'https://dribbble.com/laura-fernandez'
              },
              department: 'Diseño',
              joinDate: '2022'
            },
            {
              name: 'Roberto Silva',
              role: 'Senior Developer',
              bio: 'Desarrollador full-stack especializado en React y Node.js.',
              avatar: '/team/roberto.jpg',
              email: 'roberto@empresa.com',
              social: {
                linkedin: 'https://linkedin.com/in/roberto-silva',
                github: 'https://github.com/roberto-silva'
              },
              department: 'Tecnología',
              joinDate: '2022'
            }
          ],
          label: 'Miembros del Equipo',
          itemType: 'object',
          itemSchema: {
            name: { type: 'string', required: true },
            role: { type: 'string', required: true },
            bio: { type: 'string', required: true },
            avatar: { type: 'string', required: false },
            email: { type: 'string', required: false },
            social: { type: 'object', required: false },
            department: { type: 'string', required: false },
            joinDate: { type: 'string', required: false }
          }
        },
        layout: {
          type: 'select',
          value: 'grid',
          options: ['grid', 'list', 'carousel'],
          label: 'Layout del Equipo',
          required: true
        },
        columns: {
          type: 'number',
          value: 3,
          label: 'Número de Columnas',
          min: 1,
          max: 4,
          required: true
        },
        showBio: {
          type: 'boolean',
          value: true,
          label: 'Mostrar biografía',
          required: false
        },
        showEmail: {
          type: 'boolean',
          value: true,
          label: 'Mostrar email',
          required: false
        },
        showSocial: {
          type: 'boolean',
          value: true,
          label: 'Mostrar redes sociales',
          required: false
        },
        showDepartment: {
          type: 'boolean',
          value: true,
          label: 'Mostrar departamento',
          required: false
        },
        showJoinDate: {
          type: 'boolean',
          value: true,
          label: 'Mostrar fecha de ingreso',
          required: false
        }
      },
      styles: {
        backgroundColor: '#f8f9fa',
        textColor: '#1a1a1a',
        cardBackgroundColor: '#ffffff',
        cardBorderRadius: '12px',
        cardShadow: '0 4px 6px rgba(0,0,0,0.1)',
        avatarBorderRadius: '50%'
      }
    },
    {
      id: 'stats-section',
      type: 'StatsSection',
      name: 'Sección de Estadísticas',
      description: 'Estadísticas y números importantes',
      props: {
        title: {
          type: 'string',
          value: 'Números que Hablan',
          label: 'Título de la Sección',
          placeholder: 'Título de estadísticas',
          required: false
        },
        subtitle: {
          type: 'string',
          value: 'Algunos números que demuestran nuestro impacto',
          label: 'Subtítulo de la Sección',
          placeholder: 'Subtítulo de estadísticas',
          required: false
        },
        stats: {
          type: 'array',
          value: [
            {
              number: '1000+',
              label: 'Clientes Satisfechos',
              icon: '👥'
            },
            {
              number: '50+',
              label: 'Países',
              icon: '🌍'
            },
            {
              number: '99.9%',
              label: 'Uptime',
              icon: '⚡'
            },
            {
              number: '24/7',
              label: 'Soporte',
              icon: '🛠️'
            }
          ],
          label: 'Estadísticas',
          itemType: 'object',
          itemSchema: {
            number: { type: 'string', required: true },
            label: { type: 'string', required: true },
            icon: { type: 'string', required: false }
          }
        },
        layout: {
          type: 'select',
          value: 'grid',
          options: ['grid', 'list', 'carousel'],
          label: 'Layout de Estadísticas',
          required: true
        },
        columns: {
          type: 'number',
          value: 4,
          label: 'Número de Columnas',
          min: 2,
          max: 6,
          required: true
        },
        animation: {
          type: 'boolean',
          value: true,
          label: 'Animación de números',
          required: false
        }
      },
      styles: {
        backgroundColor: '#007bff',
        textColor: '#ffffff',
        cardBackgroundColor: 'rgba(255,255,255,0.1)',
        cardBorderRadius: '8px'
      }
    },
    {
      id: 'contact-form',
      type: 'ContactForm',
      name: 'Formulario de Contacto',
      description: 'Formulario de contacto con validación',
      props: {
        title: {
          type: 'string',
          value: '¿Tienes preguntas?',
          label: 'Título del Formulario',
          placeholder: 'Título del formulario',
          required: true
        },
        subtitle: {
          type: 'string',
          value: 'Contáctanos para más información sobre nuestros servicios',
          label: 'Subtítulo del Formulario',
          placeholder: 'Subtítulo del formulario',
          required: false
        },
        fields: {
          type: 'array',
          value: ['name', 'email', 'phone', 'company', 'message'],
          options: [
            { value: 'name', label: 'Nombre' },
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Teléfono' },
            { value: 'company', label: 'Empresa' },
            { value: 'subject', label: 'Asunto' },
            { value: 'message', label: 'Mensaje' }
          ],
          label: 'Campos del Formulario',
          required: true
        },
        submitText: {
          type: 'string',
          value: 'Enviar Mensaje',
          label: 'Texto del Botón',
          placeholder: 'Texto del botón de envío',
          required: true
        },
        successMessage: {
          type: 'string',
          value: '¡Gracias por tu mensaje! Te contactaremos pronto.',
          label: 'Mensaje de Éxito',
          placeholder: 'Mensaje cuando se envía correctamente',
          required: false
        },
        errorMessage: {
          type: 'string',
          value: 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.',
          label: 'Mensaje de Error',
          placeholder: 'Mensaje cuando hay un error',
          required: false
        },
        showPrivacy: {
          type: 'boolean',
          value: true,
          label: 'Mostrar checkbox de privacidad',
          required: false
        },
        privacyText: {
          type: 'string',
          value: 'Acepto la política de privacidad',
          label: 'Texto de Privacidad',
          placeholder: 'Texto del checkbox de privacidad',
          required: false
        },
        privacyLink: {
          type: 'string',
          value: '/privacy',
          label: 'Enlace de Privacidad',
          placeholder: '/privacy',
          required: false
        }
      },
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#1a1a1a',
        buttonColor: '#007bff',
        buttonTextColor: '#ffffff',
        inputBorderColor: '#dee2e6',
        inputFocusColor: '#007bff'
      }
    }
  ],
  
  // Configuración SEO
  seo: {
    title: 'Sobre Nosotros - {company}',
    description: 'Conoce nuestro equipo, nuestra historia y nuestra misión. Descubre por qué somos líderes en {industry}.',
    keywords: ['sobre nosotros', 'equipo', 'historia', 'misión', 'valores', '{company}'],
    schema: 'Organization',
    ogImage: '/images/og-about.jpg',
    twitterCard: 'summary_large_image'
  },
  
  // Configuración de performance
  performance: {
    lighthouse: {
      performance: 85,
      accessibility: 95,
      bestPractices: 90,
      seo: 95
    },
    coreWebVitals: {
      lcp: '< 2.5s',
      fid: '< 100ms',
      cls: '< 0.1'
    }
  },
  
  // Configuración de accesibilidad
  accessibility: {
    wcagLevel: 'AA',
    features: [
      'Keyboard navigation',
      'Screen reader support',
      'High contrast mode',
      'Focus indicators',
      'Alt text for images'
    ]
  },
  
  // Configuración de responsive
  responsive: {
    breakpoints: {
      mobile: '320px',
      tablet: '768px',
      desktop: '1024px',
      large: '1440px'
    },
    mobileFirst: true
  },
  
  // Configuración de analytics
  analytics: {
    events: [
      'team_member_click',
      'timeline_event_click',
      'contact_form_submit',
      'social_link_click'
    ],
    goals: [
      'contact_form_submit',
      'team_member_contact'
    ]
  },
  
  // Configuración de A/B testing
  abTesting: {
    variants: [
      {
        name: 'Control',
        heroTitle: 'Sobre Nosotros',
        ctaText: 'Enviar Mensaje'
      },
      {
        name: 'Variant A',
        heroTitle: 'Conoce Nuestro Equipo',
        ctaText: 'Contactar Ahora'
      },
      {
        name: 'Variant B',
        heroTitle: 'Nuestra Historia',
        ctaText: 'Solicitar Información'
      }
    ]
  }
}; 