import { App } from 'vue'
import { trackView, trackClick } from '@/utils'

/**
 * 注册全局方法
 * @param app
 */
export default (app: App) => {
  app.config.globalProperties.$trackView = trackView
  app.config.globalProperties.$trackClick = trackClick
}
