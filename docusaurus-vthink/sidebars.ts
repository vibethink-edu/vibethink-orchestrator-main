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
      label: 'Principios',
      link: {
        type: 'doc',
        id: 'principles/overview',
      },
      items: [
        'principles/clean-code',
        'principles/solid-principles',
        'principles/security-first',
        'principles/architecture-principles',
      ],
    },
    {
      type: 'category',
      label: 'Procesos',
      link: {
        type: 'doc',
        id: 'processes/overview',
      },
      items: [
        'processes/overview',
      ],
    },
  ],
};

export default sidebars;
