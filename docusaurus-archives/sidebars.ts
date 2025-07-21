import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

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
      label: 'Versiones',
      link: {
        type: 'doc',
        id: 'versions/overview',
      },
      items: [
        'versions/overview',
      ],
    },
    {
      type: 'category',
      label: 'Migraciones',
      link: {
        type: 'doc',
        id: 'migrations/overview',
      },
      items: [
        'migrations/overview',
      ],
    },
  ],
};

export default sidebars;
