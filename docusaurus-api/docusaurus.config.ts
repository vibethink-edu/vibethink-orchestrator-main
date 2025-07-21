import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'VThink API Documentation',
  tagline: 'Documentación completa de APIs y endpoints',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-domain.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docusaurus-api/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'vthink', // Usually your GitHub org/user name.
  projectName: 'docusaurus-api', // Usually your repo name.

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
      title: 'VThink API',
      logo: {
        alt: 'VThink API Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'API Docs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'Endpoints',
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
          title: 'Documentación',
          items: [
            {
              label: 'Inicio',
              to: '/',
            },
            {
              label: 'API Reference',
              to: '/docs/api/',
            },
            {
              label: 'Endpoints',
              to: '/docs/endpoints/',
            },
          ],
        },
        {
          title: 'Comunidad',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/vthink',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/vthink',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/vthink',
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
      additionalLanguages: ['json', 'bash', 'typescript', 'javascript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
