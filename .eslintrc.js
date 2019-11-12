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
    'prettier/prettier': [
      'error',
      {
        htmlWhitespaceSensitivity: 'ignore',
        semi: true,
        singleQuote: true,
        printWidth: 200
      }
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any'
        }
      }
    ],
    'vue/eqeqeq': ['off'],
    'vue/this-in-template': ['off'],
    'vue/attribute-hyphenation': ['off'],
    'vue/require-default-prop': ['off'],
    'vue/require-prop-types': ['off'],
    'vue/component-name-in-template-casing': ['off'],
    'vue/name-property-casing': ['off']
  }
};
