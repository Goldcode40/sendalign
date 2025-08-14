// eslint.config.mjs
import next from 'eslint-config-next';

export default [
  ...next,
  {
    rules: {
      // Relax for MVP build
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
