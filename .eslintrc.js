/*
 * @Author: 焦质晔
 * @Date: 2019-11-19 09:28:52
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-19 09:45:50
 */

// off   或 0：表示不验证规则
// warn  或 1：表示验证规则，当不满足时，给警告
// error 或 2：表示验证规则，不满足时报错
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
    'spaced-comment': [2, 'always'], // 注释风格要有空格
    'no-sparse-arrays': [2], // 禁止稀疏数组 [1,,2]
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
