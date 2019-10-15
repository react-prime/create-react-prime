module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: 'eslint:recommended',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'comma-dangle': ['error', 'always-multiline'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'max-len': ['error', { code: 100 }],
    'linebreak-style': ['error', 'unix'],
    'no-trailing-spaces': 1,
    'no-multiple-empty-lines': 1,
    'no-console': ['error', { 'allow': ['warn', 'error'] }],
  }
};
