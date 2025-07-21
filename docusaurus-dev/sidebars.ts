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
  // VibeThink Dev Documentation Sidebar
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '🏗️ Arquitectura',
      items: [
        'architecture/overview',
        'architecture/decisions',
        'architecture/patterns',
        'architecture/security',
      ],
    },
    {
      type: 'category',
      label: '🗺️ Roadmap Dev',
      items: [
        'roadmap/overview',
        'roadmap/backend',
        'roadmap/frontend',
        'roadmap/devops',
        'roadmap/testing',
      ],
    },
    {
      type: 'category',
      label: '🛠️ Herramientas',
      items: [
        'tools/setup',
        'tools/workflow',
        'tools/debugging',
        'tools/performance',
      ],
    },
    {
      type: 'category',
      label: '🧪 Testing',
      items: [
        'testing/strategy',
        'testing/unit',
        'testing/integration',
        'testing/e2e',
      ],
    },
    {
      type: 'category',
      label: '🚀 Deployment',
      items: [
        'deployment/ci-cd',
        'deployment/environments',
        'deployment/monitoring',
      ],
    },
    {
      type: 'category',
      label: '📚 Guías',
      items: [
        'guides/coding-standards',
        'guides/git-workflow',
        'guides/code-review',
        'guides/documentation',
      ],
    },
  ],
};

export default sidebars; 