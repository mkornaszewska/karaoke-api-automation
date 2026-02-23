import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPlaywright from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/dist/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/tests/**/*.ts'],
    ...eslintPluginPlaywright.configs['flat/recommended'],
    rules: {
      ...eslintPluginPlaywright.configs['flat/recommended'].rules,
      'playwright/expect-expect': 'error',
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/no-skipped-test': 'warn',
      'playwright/no-focused-test': 'error',
      'playwright/valid-expect': 'error',
      'playwright/prefer-web-first-assertions': 'warn',
    },
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  {
    files: ['**/helpers/**/*.ts', '**/utils/**/*.ts', '**/fixtures/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
