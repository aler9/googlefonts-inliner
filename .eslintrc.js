module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:jest/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'no-console': [ 'off' ],
    'no-restricted-syntax': [ 'off' ],
    'no-await-in-loop': [ 'off' ],
  }
};
