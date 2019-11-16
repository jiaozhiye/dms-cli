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
    // 缩进为2个空格
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        alignAttributesVertically: true,
        ignores: []
      }
    ],
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 10,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'prettier/prettier': ['off'],
    'vue/html-self-closing': ['off'],
    'vue/eqeqeq': ['off'],
    'vue/this-in-template': ['off'],
    'vue/attribute-hyphenation': ['off'],
    'vue/require-default-prop': ['off'],
    'vue/require-prop-types': ['off'],
    'vue/component-name-in-template-casing': ['off'],
    'vue/name-property-casing': ['off']
  }
};
