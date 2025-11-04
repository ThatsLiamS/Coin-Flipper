const { configs } = require('@eslint/js');
const globals = require('globals');
const nodeGlobals = globals.node;

const isProduction = false;

module.exports = [
	// Base recommended rules
	configs.recommended,

	{
		files: ['**/*.js', '**/*.cjs'],
		ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', 'test/', 'logs/'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'commonjs',
			globals: {
				...nodeGlobals,
			},
		},
		plugins: {
			import: require('eslint-plugin-import'),
			security: require('eslint-plugin-security'),
			unicorn: require('eslint-plugin-unicorn'),
		},
		rules: {
			// ----- Style -----
			indent: ['error', 'tab'],
			quotes: ['error', 'single', { avoidEscape: true }],
			semi: ['error', 'always'],
			'comma-dangle': ['error', 'always-multiline'],
			'object-curly-spacing': ['error', 'always'],
			'array-bracket-spacing': ['error', 'never'],
			'eol-last': ['error', 'always'],

			// ----- Best Practices / Correctness -----
			'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'no-var': 'error',
			'prefer-const': 'error',
			'eqeqeq': ['error', 'always'],
			'curly': ['error', 'all'],
			'no-nested-ternary': 'error',
			'arrow-body-style': ['error', 'as-needed'],
			'no-param-reassign': ['error', { props: false }],
			'callback-return': 'error',

			// ----- Console -----
			'no-console': isProduction ? 'error' : 'off',

			// ----- Import Rules -----
			'import/order': ['error', {
				groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
				'newlines-between': 'always',
				alphabetize: { order: 'asc', caseInsensitive: true },
			}],
			'import/no-unresolved': 'error',
			'import/no-commonjs': 'off', // We're using CJS intentionally
			'import/extensions': ['error', 'ignorePackages', {
				js: 'never',
				cjs: 'never',
			}],

			// ----- Security Rules (balanced) -----
			'security/detect-object-injection': 'warn',
			'security/detect-non-literal-require': 'error',

			// ----- Unicorn Rules -----
			'unicorn/prefer-module': 'off', // We’re using CommonJS
			'unicorn/no-null': 'off',
		},
	},
];
