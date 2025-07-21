import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'VibeThink - Documentación',
  tagline: 'Plataforma SaaS Multi-tenant',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.vibethink.ai',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'vibethink', // Usually your GitHub org/user name.
  projectName: 'vibethink-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    localeConfigs: {
      es: {
        htmlLang: 'es',
        label: 'Español',
      },
      en: {
        htmlLang: 'en',
        label: 'English',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/vibethink/vibethink-docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/vibethink/vibethink-docs/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/vibethink-social-card.jpg',
    navbar: {
      title: 'VibeThink Docs',
      logo: {
        alt: 'VibeThink Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentación',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/vibethink/vibethink-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentación',
          items: [
            {
              label: 'Guías de Usuario',
              to: '/docs/intro',
            },
            {
              label: 'Onboarding',
              to: '/docs/onboarding',
            },
            {
              label: 'FAQ',
              to: '/docs/faq',
            },
          ],
        },
        {
          title: 'Empresa',
          items: [
            {
              label: 'Administración',
              to: '/docs/company-admin',
            },
            {
              label: 'Configuración',
              to: '/docs/configuration',
            },
            {
              label: 'Reportes',
              to: '/docs/reports',
            },
          ],
        },
        {
          title: 'Soporte',
          items: [
            {
              label: 'Troubleshooting',
              to: '/docs/troubleshooting',
            },
            {
              label: 'Contacto',
              to: '/docs/contact',
            },
            {
              label: 'Estado del Sistema',
              href: 'https://status.vibethink.ai',
            },
          ],
        },
        {
          title: 'Más',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/vibethink',
            },
            {
              label: 'API Docs',
              href: 'https://api.vibethink.ai',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} VibeThink. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
