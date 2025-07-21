import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'README',
      label: 'Inicio',
    },
    {
      type: 'category',
      label: 'API Reference',
      link: {
        type: 'doc',
        id: 'api/README',
      },
      items: [
        'api/authentication',
        'api/quickstart',
        'api/sdks',
        'api/best-practices',
        'api/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Endpoints',
      link: {
        type: 'doc',
        id: 'endpoints/overview',
      },
      items: [
        {
          type: 'category',
          label: 'Autenticación',
          items: [
            'endpoints/auth/login',
            'endpoints/auth/register',
            'endpoints/auth/refresh',
            'endpoints/auth/logout',
          ],
        },
        {
          type: 'category',
          label: 'Usuarios',
          items: [
            'endpoints/users/me',
            'endpoints/users/get',
            'endpoints/users/update',
            'endpoints/users/delete',
          ],
        },
        {
          type: 'category',
          label: 'Empresas',
          items: [
            'endpoints/companies/me',
            'endpoints/companies/get',
            'endpoints/companies/create',
            'endpoints/companies/update',
            'endpoints/companies/delete',
          ],
        },
        {
          type: 'category',
          label: 'Contenido',
          items: [
            'endpoints/content/pages',
            'endpoints/content/create',
            'endpoints/content/update',
            'endpoints/content/delete',
          ],
        },
        {
          type: 'category',
          label: 'IA',
          items: [
            'endpoints/ai/chat',
            'endpoints/ai/analyze',
            'endpoints/ai/generate',
            'endpoints/ai/models',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Ejemplos',
      link: {
        type: 'doc',
        id: 'examples/README',
      },
      items: [
        'examples/integration',
        'examples/curl',
        'examples/javascript',
        'examples/python',
        'examples/php',
      ],
    },
  ],
  
  // Sidebar específico para API
  apiSidebar: [
    {
      type: 'doc',
      id: 'api/README',
      label: 'API Overview',
    },
    {
      type: 'category',
      label: 'Autenticación',
      items: [
        'api/authentication',
        'api/authorization',
        'api/rate-limiting',
      ],
    },
    {
      type: 'category',
      label: 'SDKs',
      items: [
        'api/sdks/javascript',
        'api/sdks/python',
        'api/sdks/php',
        'api/sdks/java',
      ],
    },
    {
      type: 'category',
      label: 'Herramientas',
      items: [
        'api/postman-collection',
        'api/openapi-spec',
        'api/webhooks',
      ],
    },
  ],
};

export default sidebars;
