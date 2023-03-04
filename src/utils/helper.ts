import { divide, isEmpty, round, toNumber } from 'lodash'
import queryString from 'query-string'
import Clipboard from 'clipboard'

export function setLoading(isShow = true) {
  const loadDom: HTMLElement | null = document.querySelector(
    '#loadingComponent'
  ) as HTMLElement
  if (loadDom) {
    if (isShow) {
      loadDom.style.display = 'flex'
    } else {
      loadDom.style.display = 'none'
    }
  }
}

export function toLogin(url?: string) {
  // const referUrl = url || location.href
  // location.href = `//passport.cekid.com/passport/login?cmd=login&referer=${encodeURIComponent(
  //   referUrl
  // )}`
}

function supportWebp(): boolean {
  const ele = document.createElement('canvas')
  ele.width = 1
  ele.height = 1
  return (
    ele.toDataURL &&
    ele.toDataURL('image/webp').indexOf('data:image/webp') === 0
  )
}

/* 压缩腾讯云图片质量 */
export function compressImage(
  value: string,
  width?: number,
  height?: number,
  isTailor = false
) {
  let img = ''
  const suffix = supportWebp() ? 'webp' : 'jpg'
  if (value) {
    value = value.replace(/^http(s?):/, '')
    if (isTailor) {
      img = `${value}?imageMogr2/crop/${width}x${height}/q/80/format/${suffix}`
    } else {
      img = `${value}?imageView2/2`
      if (width) {
        img += `/w/${width}`
      }
      if (height) {
        img += `/h/${height}`
      }
      img += `/q/80/format/${suffix}`
    }
  }
  return img
}

/* url拼接kwtarget=blank */
export function getKwtargetUrl(url: string) {
  const urlObj = queryString.parseUrl(url)
  urlObj.query.kwtarget = 'blank'
  return queryString.stringifyUrl(urlObj)
}

/* rem转响应式后的实际尺寸 */
export function rem2RealPx(rem: number) {
  return rem * parseFloat(document.documentElement.style.fontSize)
}

/* 手机号掩码 */
export function maskTel(tel?: string) {
  if (!tel) {
    return ''
  }
  return tel.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1****$3')
}

export function toDemotion(value: string | number, rate = 100) {
  let num = toNumber(value)
  num = isNaN(num) ? 0 : num
  return round(divide(num, rate), 2)
}

/* 价格分->元 */
export function getYenPrice(price?: string | number) {
  let integer = ''
  let decimal = ''
  const fen = toNumber(price)
  if (isNaN(fen)) {
    return ''
  }
  const yen = round(divide(fen, 100), 2).toString()
  const result = yen.split('.')
  integer = result[0]
  decimal = result[1]
  let value = `${integer}`
  if (!isEmpty(decimal)) {
    value += `.${decimal}`
  }
  return value
}

/* 距离m->km */
export function getDistanceKm(m: number) {
  if (m <= 100) {
    return '0.1'
  } else {
    const km = round(m / 1000, 1).toString()
    if (km.split('.').length == 1) {
      return `${km}.0`
    } else {
      return `${km}`
    }
  }
}

/* url拼接分享key */
export function getHserecomkeyUrl(url: string, shareKey: string) {
  const urlObj = queryString.parseUrl(url)
  urlObj.query.hserecomkey = shareKey
  return queryString.stringifyUrl(urlObj)
}

/* 复制文字到剪贴板 */
export async function copyTextClipboard(text = ''): Promise<boolean> {
  return new Promise(resolve => {
    const button = document.createElement('button')
    const clipboard = new Clipboard(button, {
      text: () => text
    })
    clipboard.on('success', (e: ClipboardJS.Event) => {
      console.log(e)
      resolve(true)
      button.remove()
      clipboard.destroy()
    })
    clipboard.on('error', e => {
      console.error(e)
      resolve(false)
      button.remove()
      clipboard.destroy()
    })
    button.click()
  })
}
