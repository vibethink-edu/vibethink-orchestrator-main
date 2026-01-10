import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest-setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        '**/dist/**',
        '**/.next/**',
        '**/cypress/**',
        '**/playwright/**',
        '**/scripts/**',
        '**/docs/**',
        '**/archives/**',
        '**/backups/**',
        '**/src/archives/**',
        '**/src/archives/third-party/**',
        '**/*.backup*',
        '**/www/**',
        '**/src/modules/postiz-analysis/**',
        '**/src/services/vtk/message-formatting/tests/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'eslint-plugin-custom/**/*.test.js'
    ],
    exclude: [
      'node_modules/',
      'dist/',
      'tests/e2e/',
      'tests/performance/',
      'tests/integration/',
      'src/tests/e2e/',
      'src/tests/integration/',
      'src/tests/acceptance/',
      '**/archives/**',
      '**/backups/**',
      '**/src/archives/**',
      '**/src/archives/third-party/**',
      '**/*.backup*',
      '**/www/**',
      '**/src/archives/third-party/payload-v2.0.0/**',
      '**/src/archives/third-party/payload-v2.8.5/**',
      '**/src/archives/v4.15.0/**',
      '**/src/modules/postiz-analysis/**',
      '**/src/services/vtk/message-formatting/tests/**',
      '**/src/apps/**/node_modules/**',
      '**/*.spec.ts',
      '**/*.e2e.ts',
      '**/*.playwright.ts',
      '**/COMPONENT-acceptance.spec.js',
      '**/wcag-compliance.test.ts'
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
      '@mocks': path.resolve(__dirname, './tests/mocks')
    }
  }
}); 