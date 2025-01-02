import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import filenamesPlugin from 'eslint-plugin-filenames';
import importPlugin from 'eslint-plugin-import';

export default [
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    { languageOptions: { globals: { ...globals.node } } },
    pluginJs.configs.recommended,
    {
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            'no-console': 'off',
            'no-unused-vars': 'warn',
        }
    },
    {
        plugins: {
            filenames: filenamesPlugin,
            import: importPlugin,
        },
        rules: {
            
            "filenames/no-index": 2,
            "import/no-unresolved": 2
        }
    }
];