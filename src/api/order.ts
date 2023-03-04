import urlPrefixes from '@/constants/urlPrefixes'
import {
  cookies,
  http,
  isAndroidApp,
  isCzjApp,
  isHzwApp,
  isIosApp,
  isMiniprogram,
  isRkhy,
  toLogin
} from '@/utils'
import { ResultType } from '@/types/http'
import queryString from 'query-string'
import {
  ConfirmOrderType,
  CreateResultType,
  OrderType,
  RefundOrderType
} from '@/types/order'
import { Toast } from 'vant'

const api = {
  queryOrderConfirm: `${urlPrefixes.ccardomsapi}/ccard-oms-api/UOrder/confirmOrder.do`,
  createOrder: `${urlPrefixes.ccardomsapi}/ccard-oms-api/UOrder/createOrder.do`,
  queryOrderDetail: `${urlPrefixes.ccardomsapi}/ccard-oms-api/UOrder/queryOrderDetail.do`,
  cancelOrder: `${urlPrefixes.ccardomsapi}/ccard-oms-api/UOrder/cancelOrder.do`,
  queryRefundDetail: `${urlPrefixes.ccardomsapi}/ccard-oms-api/refund/detail.do`
}

/* 查询待确认订单  */
/* http://mytest.kapi.haiziwang.com:3003/project/2876/interface/api/48945 */
export async function queryOrderConfirm(params: {
  skuId: number | string
  storeCode: string
  shareKey?: string
}) {
  const query = queryString.stringify({
    orderType: 1, //订单类型：1正价订单
    ...params
  })
  const result: ResultType<ConfirmOrderType> = await http.get(
    `${api.queryOrderConfirm}?${query}`
  )
  const { data, code } = result
  if (code == '1') {
    return data || null
  } else {
    throw result
  }
}

/* 创建订单  */
/* http://mytest.kapi.haiziwang.com:3003/project/2876/interface/api/48954 */
export async function createOrder(params: {
  skuId: number | string
  storeCode: string
  num: number
  orderPrice: number
  payPrice: number
  inviteCode?: string
  shareKey?: string
}) {
  const query = queryString.parse(location.search)
  const extInfo = []
  const deviceCode = (query && query.deviceCode) ?? ''
  if (deviceCode) {
    extInfo.push({
      labelKey: 'deviceCode',
      labelName: '设备号',
      labelValue: deviceCode
    })
  }
  const orderSource = isCzjApp()
    ? 1
    : isHzwApp()
    ? 2
    : deviceCode //电玩充值
    ? 12
    : isRkhy()
    ? 3
    : (await isMiniprogram())
    ? 9
    : 8
  const result: ResultType<CreateResultType> = await http.post(
    `${api.createOrder}`,
    `${queryString.stringify({
      uid: cookies.get('uid'),
      orderType: 1,
      orderSource,
      appPlatfrom: isIosApp() ? 1 : isAndroidApp() ? 2 : undefined,
      appVersion: cookies.get('version'),
      extInfo: JSON.stringify(extInfo),
      ...params
    })}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
  const { code, data } = result
  if (code == '1') {
    return data || null
  } else {
    throw result
  }
}

/* 查询订单详情 */
export async function queryOrderDetail(orderId: string) {
  const query = queryString.stringify({
    orderId
  })
  const result: ResultType<OrderType> = await http.get(
    `${api.queryOrderDetail}?${query}`
  )
  const { data, code } = result
  if (code == '1') {
    return data || null
  } else {
    throw result
  }
}

/* 取消订单 */
export async function cancelOrder(orderId: string) {
  const query = queryString.stringify({
    orderId
  })
  const result: ResultType<null> = await http.get(`${api.cancelOrder}?${query}`)
  const { msg, code } = result
  if (code == '1') {
    return msg
  } else {
    throw result
  }
}

/* 退款详情 */
export async function queryRefundDetail(orderId: string) {
  const query = queryString.stringify({
    orderId
  })
  const result: ResultType<RefundOrderType> = await http.get(
    `${api.queryRefundDetail}?${query}`
  )
  const { data, code } = result
  if (code == '1') {
    return data || null
  } else {
    throw result
  }
}
