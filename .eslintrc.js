module.exports = {
  extends: [
    '@vibethink/eslint-config',
  ],
  ignorePatterns: [
    'backups/**/*',
    'archives/**/*',
    'repo_archive/**/*',
    'node_modules/**/*',
    'dist/**/*',
    'build/**/*',
    'coverage/**/*',
    '*.min.js',
    '*.bundle.js'
  ],
  overrides: [
    {
      // Reglas específicas para archivos de configuración
      files: ['**/config/**/*.ts', '**/config/**/*.js'],
      rules: {
        // 'ai-pair-parametric/no-hardcoded-countries': 'off',
        // 'ai-pair-parametric/no-hardcoded-currencies': 'off',
        // 'ai-pair-parametric/no-hardcoded-legal-rules': 'off',
      }
    },
    {
      // Reglas específicas para tests
      files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
      rules: {
        // 'ai-pair-parametric/no-hardcoded-countries': 'off',
        // 'ai-pair-parametric/no-hardcoded-currencies': 'off',
        // 'ai-pair-parametric/no-hardcoded-legal-rules': 'off',
        // 'ai-pair-parametric/no-hardcoded-company-config': 'off',
        // 'ai-pair-parametric/no-hardcoded-jurisdiction': 'off',
        // 'ai-pair-parametric/require-company-config': 'off',
        // 'ai-pair-parametric/require-parametric-values': 'off',
      }
    }
  ]
};