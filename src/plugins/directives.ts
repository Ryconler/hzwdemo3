import { compressImage } from '@/utils'
import { App } from 'vue'

/**
 * 注册全局自定义指令
 * @param app
 */
export default (app: App) => {
  // 富文本图片压缩
  app.directive('xhtml', (el, binding) => {
    const value = binding.value
    const ele = document.createElement('div')
    ele.innerHTML = value
    ele.querySelectorAll('img').forEach(img => {
      img.src = compressImage(img.src)
    })
    el.innerHTML = ele.innerHTML
  })
}
