import urlPrefixes from '@/constants/urlPrefixes'
import { ajax, cookies, isMiniprogram, isRkhy } from '@/utils'

const api = {
  queryShareKey: `${urlPrefixes.mallbackapi}/share/commercialInterface/getKey.do`
}

/**
 * http://wiki.haiziwang.com/xwiki/bin/view/Main/%E5%95%86%E5%9F%8E%E4%BA%A7%E5%93%81%E7%A0%94%E5%8F%91/%E5%88%86%E4%BA%ABKey%E7%B3%BB%E7%BB%9F-share/%E8%8E%B7%E5%8F%96Key%E6%8E%A5%E5%8F%A3/
 */
export async function queryShareKey(params = {}) {
  const uid = cookies.get('uid')
  if (!uid) {
    return ''
  }
  const rkhy = isRkhy()
  try {
    const jsonobj = {
      uid,
      ip: '1.1.1.1',
      isShort: true,
      commercialname: '孩子王',
      token: 'YjYphjJdS5RzGiOoQmnApw==',
      accessterminal: rkhy
        ? 1
        : (await isMiniprogram()) // 企微环境调用可能会卡住
        ? 6
        : 2, //接入终端
      utype: rkhy ? 1 : 2, //用户类型:1员工,2会员
      linktype: rkhy ? 24 : 2, //链接类型
      linkcontentid: encodeURIComponent(location.href),
      remark: {},
      ...params
    }
    const url = `${api.queryShareKey}?jsonobj=${encodeURIComponent(
      JSON.stringify(jsonobj)
    )}`
    const res: any = await ajax.get(url)
    if (+res.result === 0) {
      return res.data || ''
    } else {
      return ''
    }
  } catch (error) {
    return ''
  }
}
