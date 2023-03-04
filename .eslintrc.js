module.exports = {
  env: {
    node: true,
    'vue/setup-compiler-macros': true
    //在使用 script setup新特性时 出现'defineProps' is not defined的错误
  },

  parser: 'vue-eslint-parser', //在eslint-plugin-vue 解析器
  //https://github.com/vuejs/vue-eslint-parser#readme
  extends: [
    'eslint:recommended', //eslint标准
    'plugin:vue/vue3-recommended', //eslint-plugin-vue
    'plugin:@typescript-eslint/recommended', //@typescript-eslint/eslint-plugin
    'prettier' //eslint-config-prettier
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser', //@typescript-eslint/parser
    //如果想为 vue 单文件组件中的 script 部分使用单独的 parser 可以将 parserOptions.parser 指定为想使用的 parser 即可
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-empty-function': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-v-html': 0
  }
}
