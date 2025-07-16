import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import readableTailwindPlugin from 'eslint-plugin-readable-tailwind';

export default [
  // Configuración base para todos los archivos
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      'readable-tailwind': readableTailwindPlugin,
    },
    extends: [
      'next/core-web-vitals',
    ],
    ignores: [
      'node_modules/**/*',
      '.next/**/*',
      'dist/**/*',
      'build/**/*',
      'coverage/**/*',
      '*.min.js',
      '*.bundle.js'
    ],
    rules: {
      // Reglas críticas para máxima calidad y seguridad
      'no-console': 'error', // Prohíbe cualquier console.log/error/warn
      'no-debugger': 'error',
      'no-alert': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-expressions': 'error',
      'no-duplicate-imports': 'error',
      
      // Buenas prácticas de mantenibilidad
      'max-lines': ['warn', 500], // Recomienda dividir archivos >500 líneas
      'max-lines-per-function': ['warn', 40], // Recomienda dividir funciones >40 líneas
      'complexity': ['warn', 10], // Recomienda dividir funciones con complejidad >10
      'max-depth': ['warn', 4], // Recomienda no anidar más de 4 niveles
      'max-classes-per-file': ['warn', 1], // Recomienda una clase por archivo
      
      // Reglas de React
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  
  // Configuración específica para tests
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
    rules: {
      // Reglas específicas para tests
      'no-console': 'off', // Permitir console en tests
    }
  }
]; 