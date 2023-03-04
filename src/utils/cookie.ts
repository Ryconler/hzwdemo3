import jsCookie from 'js-cookie'
import { toLogin } from './helper'

export const cookies = jsCookie

export function getDevice(): string {
  const ua = navigator.userAgent
  const src = jsCookie.get('source')
  if (src === 'ios') {
    return 'ios'
  } else if (src === 'android') {
    return 'android'
  } else if (/MicroMessenger/i.test(ua)) {
    return 'weixin'
  } else if (/Mobile/i.test(ua)) {
    return 'mobile'
  }
  return 'other'
}

export function isAndroidApp(): boolean {
  return getDevice() === 'android'
}

export function isIosApp(): boolean {
  return getDevice() === 'ios'
}

export function isApp(): boolean {
  return isAndroidApp() || isIosApp()
}

export function isWeixin(): boolean {
  return getDevice() === 'weixin'
}

export async function isMiniprogram(): Promise<boolean> {
  return false
}

export function isRkhy(): boolean {
  const source = jsCookie.get('source')
  const apptype = jsCookie.get('apptype')
  return (source === 'android' || source === 'ios') && apptype === 'rkhy'
}

export function isHzwApp(): boolean {
  // app特指孩子王app，不包括人客合一
  const source = jsCookie.get('source')
  const appcode = jsCookie.get('appcode')
  return (source === 'android' || source === 'ios') && appcode === 'HZWMALL'
}

export function isCzjApp(): boolean {
  const source = jsCookie.get('source')
  const key = jsCookie.get('czjkey')
  const appcode = jsCookie.get('appcode')
  return (
    (source === 'android' || source === 'ios') &&
    (appcode === 'CZJ' || key === '1')
  )
}

export function isLogin(): boolean {
  const uid = jsCookie.get('uid')
  const skey = jsCookie.get('skey')
  return !!uid && !!skey
}

export const uid = jsCookie.get('uid') || ''
export const skey = jsCookie.get('skey') || ''
export const guid = jsCookie.get('guid') || ''

export function ensureLogin(url?: string) {
  return {
    uid: '1048557321',
    skey: 'H5C239E14E'
  }
}
