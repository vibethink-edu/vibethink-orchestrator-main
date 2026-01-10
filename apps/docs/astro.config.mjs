// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://vibethink-edu.github.io',
	base: '/vibethink-orchestrator-main',
	integrations: [
		starlight({
			title: 'ViTo Documentation',
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			sidebar: [
				{
					label: 'Documentation System',
					items: [
						{ label: 'System Strategy', link: '/system/documentation-system' },
						{ label: 'Governance Policy', link: '/system/governance' },
					],
				},
				{
					label: 'Product History',
					items: [
						{ label: 'Changelog', link: '/product/changelog' },
					],
				},
				{
					label: 'API / Developer Docs',
					items: [
						{ label: 'Versioning Strategy', link: '/api/versioning' },
						{ label: 'API Changelog', link: '/api/changelog' },
					],
				},
				{
					label: 'Operations / QA',
					items: [
						{ label: 'Release Process', link: '/operations/releases' },
					],
				},
				// Placeholders for future syncs or manual additions
				{
					label: 'Architecture',
					items: [
						{ label: 'Overview', link: '/system/documentation-system' } // Placeholder
					]
					// autogenerate: { directory: 'architecture' },
				},
				{
					label: 'Standards',
					items: [
						{ label: 'API Key Management', link: '/standards/api-key-management' }
					]
					// autogenerate: { directory: 'standards' },
				},
				{
					label: 'FITs',
					items: [
						{ label: 'FIT-001: API Keys', link: '/fits/fit-api-key-mgmt-001' }
					]
					// autogenerate: { directory: 'fits' },
				},
			],
		}),
	],
});
