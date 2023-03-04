import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'
import pxtorem from 'postcss-pxtorem'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const IS_PROD = mode === 'production'

  return {
    // 插件配置
    plugins: [
      vue(), // 提供 Vue 3 单文件组件支持
      Components({
        resolvers: [VantResolver()] // vant组件的按需引入支持
      }),
      legacy() // 为传统浏览器提供支持（打包出两套代码），默认读取browserslist配置
    ],
    base: IS_PROD ? '/hzwdemo3' : '/', // 设置打包路径
    css: {
      postcss: {
        plugins: [
          autoprefixer(), // 根据browserslist配置自动补全适配不同浏览器的css前缀
          // PostCss的插件，可将 px 单位转化为 rem 单位
          pxtorem({
            rootValue: 37.5, // 1px -> 1/37.5rem
            propList: ['*'], // 所有的css属性的px都将被转换
            minPixelValue: 2,
            exclude: 'node_modules' // 排除node_modules中的px转换
          })
        ]
      },
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `@import "@/assets/css/variables.scss";` // 给所有scss样式自动在前面导入这个两个scss文件，开发时即可直接使用变量与方法，无需再事先手动导入
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: 8095,
      open: false,
      cors: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: true,
      target: 'es2015' // 指定构建目标，最低支持 es2015
    }
  }
})
