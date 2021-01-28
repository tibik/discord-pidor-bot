module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  plugins: ['prettier'],
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    camelcase: 'off',
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
