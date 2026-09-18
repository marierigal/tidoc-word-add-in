import js from '@eslint/js';
import tsESLint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';

export default tsESLint.config(
  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tsESLint.configs.recommended,

  // Import rules — flatConfigs.typescript already includes flatConfigs.recommended
  importPlugin.flatConfigs.typescript,

  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    rules: {
      'no-unused-vars': 'off',

      '@typescript-eslint/member-delimiter-style': 'error',
      '@typescript-eslint/no-explicit-any': 'off',

      '@typescript-eslint/explicit-member-accessibility': ['error', {
        accessibility: 'explicit',
        overrides: {
          constructors: 'no-public',
        },
      }],

      '@typescript-eslint/member-ordering': 'error',

      'import/no-useless-path-segments': ['error', {
        noUselessIndex: true,
      }],

      'import/order': ['error', {
        'groups': ['builtin', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
        },
      }],
    },
  },

  // Must be last: disables stylistic rules that would conflict with Prettier
  prettierConfig
);
