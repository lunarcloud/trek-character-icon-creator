import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'
import jsdoc from 'eslint-plugin-jsdoc'
import jest from 'eslint-plugin-jest'

/**
 * ESLint Configuration
 *
 * This configuration uses neostandard (modern StandardJS) with JSDoc validation.
 *
 * Commands:
 *   npm run eslint      - Run linter
 *   npm run eslint-fix  - Auto-fix issues
 */

const jsdocConfig = jsdoc.configs['flat/recommended']

const config = [
    // Base neostandard configuration for browser environment
    ...neostandard({
        env: ['browser'],
        ignores: [
            ...resolveIgnoresFromGitignore(),
            '**/lib/**/*.js'
        ]
    }),

    // JSDoc validation plugin
    jsdocConfig,
    {
        rules: {
            '@stylistic/indent': ['error', 4, { SwitchCase: 0 }],
            curly: 0,
            'jsdoc/reject-any-type': 0,
            'jsdoc/reject-function-type': 0,
            'jsdoc/no-undefined-types': [1, {
                definedTypes: [
                    'NodeListOf',
                    'FileSystemFileHandle'
                ]
            }],
            'jsdoc/require-jsdoc': ['error', {
                require: {
                    FunctionDeclaration: true,
                    MethodDefinition: true,
                    ClassDeclaration: true,
                    ArrowFunctionExpression: false,
                    FunctionExpression: true
                }
            }]
        }
    },

    // Special configuration for Jest test files
    {
        files: ['tests/**/*.test.js'],
        plugins: { jest },
        languageOptions: {
            globals: jest.environments.globals.globals
        },
        rules: {
            'jsdoc/require-jsdoc': 'off'
        }
    }
]

export default config
