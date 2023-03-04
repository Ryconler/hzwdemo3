import { createApp } from 'vue'
import { Lazyload } from 'vant'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import directives from './plugins/directives'
import middlewares from './plugins/middlewares'
import mixins from './plugins/mixins'
import sentry from './plugins/sentry'
import './assets/css/normalize.scss'
import 'vant/es/toast/style'

const app = createApp(App)
app.use(directives)
app.use(middlewares)
app.use(mixins)
app.use(sentry)
app.use(Lazyload)
app.use(createPinia()).use(router).mount('#app')
