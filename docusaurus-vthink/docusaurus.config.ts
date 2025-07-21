import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'VThink 1.0 Methodology',
  tagline: 'Metodología de desarrollo y gestión de proyectos',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-domain.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docusaurus-vthink/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'vthink', // Usually your GitHub org/user name.
  projectName: 'docusaurus-vthink', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
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
            'https://github.com/your-org/your-repo/edit/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/your-org/your-repo/edit/main/',
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
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'VThink 1.0',
      logo: {
        alt: 'VThink Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Metodología',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          type: 'dropdown',
          label: 'Lenguaje',
          position: 'right',
          items: [
            {
              label: 'Español',
              to: '/',
              lang: 'es',
            },
            {
              label: 'English',
              to: '/en/',
              lang: 'en',
            },
          ],
        },
        {
          href: 'https://github.com/your-org/your-repo',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Metodología',
          items: [
            {
              label: 'Inicio',
              to: '/',
            },
            {
              label: 'Principios',
              to: '/docs/principles/',
            },
            {
              label: 'Procesos',
              to: '/docs/processes/',
            },
            {
              label: 'Herramientas',
              to: '/docs/tools/',
            },
          ],
        },
        {
          title: 'Comunidad',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/vthink',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/vthink',
            },
            {
              label: 'LinkedIn',
              href: 'https://linkedin.com/company/vthink',
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
              href: 'https://github.com/your-org/your-repo',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} VThink. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['json', 'bash', 'typescript', 'javascript', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
