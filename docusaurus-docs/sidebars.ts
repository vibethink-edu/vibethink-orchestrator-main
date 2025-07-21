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
  // VibeThink Documentation Sidebar
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '🚀 Onboarding',
      items: [
        'onboarding/setup',
      ],
    },
    {
      type: 'category',
      label: '📖 Guías de Usuario',
      items: [
        'user-guides/project-overview',
        'user-guides/dashboard-manual',
      ],
    },
    {
      type: 'category',
      label: '🏢 Administración',
      items: [
        'company-admin/users',
      ],
    },
    {
      type: 'category',
      label: '🗺️ Roadmap',
      items: [
        'roadmap',
      ],
    },
    {
      type: 'category',
      label: '🔧 Soporte',
      items: [
        'troubleshooting/common-issues',
        'faq',
        'contact',
      ],
    },
  ],
};

export default sidebars;
