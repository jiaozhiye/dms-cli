module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ['plugin:vue/recommended', 'prettier', 'prettier/vue'],
  plugins: ['vue', 'prettier'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'spaced-comment': [2, 'always'],
    'prettier/prettier': [0],
    'vue/eqeqeq': [0],
    'vue/this-in-template': [0],
    'vue/attribute-hyphenation': [0],
    'vue/require-default-prop': [0],
    'vue/require-prop-types': [0],
    'vue/component-name-in-template-casing': [0],
    'vue/name-property-casing': [0]
  }
};
