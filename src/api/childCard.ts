import urlPrefixes from '@/constants/urlPrefixes'
import { ajax } from '@/utils'
import { ChildCardSkuConsumeType, ChildCardType } from '@/types/childCard'
import { ResultType } from '@/types/http'
import queryString from 'query-string'

const api = {
  queryChildCardDetail: `${urlPrefixes.ccardapi}/ccard-api/api/spu/queryCmmdtyDetail.do`,
  querySingleConsumeItem: `${urlPrefixes.ccardapi}/ccard-api/api/spu/querySingleConsumeItem.do`
}

/* 童玩卡详情 */
export async function queryChildCardDetail(storeCode: string, skuId?: string) {
  const query = queryString.stringify({
    storeCode,
    skuId
  })
  const result: ResultType<ChildCardType> = await ajax.get(
    `${api.queryChildCardDetail}?${query}`
  )
  const { data, code } = result
  if (code == '1') {
    return data || null
  } else {
    throw result
  }
}

/* 童玩卡详情 */
export async function queryChildCardConsumeInfo(
  storeCode: string,
  skuId: number
) {
  const query = queryString.stringify({
    storeCode,
    skuId
  })
  const result: ResultType<ChildCardSkuConsumeType> = await ajax.get(
    `${api.querySingleConsumeItem}?${query}`
  )
  const { data, code } = result
  if (code == '1') {
    return data || null
  } else {
    throw result
  }
}
