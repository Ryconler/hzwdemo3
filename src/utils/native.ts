import { Toast } from 'vant';
import { get, split } from 'lodash'
import { ajax } from './http'
import { isAndroidApp, isIosApp } from './cookie'
import { PositionType } from '@/types/position'

type OptionsType = Partial<{
  targetClass: string
  methodType: string
  methodName: string
  methodArgsTypes: string
  parm: {
    parmClass?: string
    parmKey?: string
    parmValue?: any
  }[]
}>

/* 设置标题 */
export function setTitle(title = '孕产·亲子') {
  document.title = title
}

/* 设置标题及刷新分享 */
export function setPage({ title = '孕产·亲子', refresh = true, share = true }) {
  document.title = title
}

type ShareConfigType = Partial<{
  channel: string //分享渠道2图文分享 5微信 6朋友圈	7新浪 3QQ 8复制链接
  imageByte: string //图文
  title: string // 标题
  desc: string // 秒杀
  imgUrl: string // 图片
  link: string // 链接
  subtext: string //价格
  kwsharescenetype: number //linkType，请求分享key参数
  linkid: string //linkContentId，请求分享key参数
  remark: string //remark，请求分享key参数
  dpH5: number
  dpinfoH5: string
  /* 微信小程序分享设置 */
  userName: string //小程序username
  webpageUrl: string // 低版本网页链接
  path: string // 小程序页面路径
  mpTitle: string // 分享标题
  mpDescription: string // 分享内容
  thumbUrl: string // 分享图片
  mpType: number // 小程序版本0正式版;1开发版;2体验版;
  page: string
  scene: string
}>
/* 设置分享信息 */
export function setShare(config: ShareConfigType = {}, miniData = {}) {
}

/* 拉起分享面板 */
export function openShareBoard() {
  Toast('模拟拉起原生分享面板')
}


type LatLngType = {
  lat: string
  lng: string
}
/* 获取App定位经纬度 */
async function getAPPLatAndLng(): Promise<LatLngType | null> {
  try {
    return null
  } catch (e) {
    return null
  }
}

/* 获取app定位的经纬度信息并转化出城市 */
export async function getAppPosition(): Promise<PositionType | null> {
  return null
}

/* 是否允许页面分享及刷新 */
export function allowRefreshOrShare(refresh = true, share = true): void {
}
