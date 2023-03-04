import { AxiosResponse } from 'axios'
import { has, isPlainObject, split, includes } from 'lodash'
import { uid } from './cookie'

export const reportUrl = (
  response: AxiosResponse | undefined,
  isError = false
) => {
  const res: any = response && response.data
  let hasErrCode = false
  if (res) {
    if (has(res, 'code')) {
      hasErrCode = res.code != 1 && res.code != 1001
    }
    if (
      response &&
      response.config &&
      response.config.url &&
      includes(response.config.url, 'cms.cekid.com') &&
      has(res, 'code')
    ) {
      hasErrCode = res.code != 0
    }
    if (has(res, 'errno')) {
      hasErrCode = res.errno != 0
    }
  }
  const errMsg = isPlainObject(res)
    ? res.message || res.msg || res.reason || res.errmsg
    : response
    ? response.statusText
    : ''
  if (hasErrCode || isError) {
    import('@sentry/vue').then(Sentry => {
      // https://docs.sentry.io/platforms/javascript/guides/vue/enriching-events/scopes/#local-scopes
      Sentry.withScope(scope => {
        const url =
          response && response.config && response.config.url
            ? split(response.config.url, '?', 1)[0]
            : undefined
        scope.setLevel(isError ? 'error' : 'warning')
        if (url) {
          scope.setTag('errorUrl', url)
        }
        if (uid) {
          scope.setUser({ id: uid })
        }
        if (errMsg) {
          Sentry.captureMessage(errMsg)
        }
      })
    })
  }
}
