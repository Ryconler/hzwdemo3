import { App } from 'vue'
// https://docs.sentry.io/platforms/javascript/guides/vue/#vue-3
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

import { cookies } from '@/utils/cookie'
import router from '@/router'

export default (app: App) => {
  const isDEV = import.meta.env.DEV
  if (!isDEV) {
    const VueIntegration = Integrations.BrowserTracing
    Sentry.init({
      app,
      dsn: 'https://375661729f6548ae86f601c16741a0f6@trap.cekid.com/149',
      environment: 'production',
      integrations: [
        new VueIntegration({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router)
        })
      ],
      release: '' // --sentry release--
    })
    Sentry.setUser({
      uid: cookies.get('uid')
    })
  }
}
