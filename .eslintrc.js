module.exports = {
  env: {
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    'no-underscore-dangle': ['error', {
      allow: ['_id'],
    }],
  },
};
