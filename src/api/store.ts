import { StoreDetailType } from './../types/store'
import queryString from 'query-string'
import urlPrefixes from '@/constants/urlPrefixes'
import { ajax } from '@/utils'
import { ResultType } from '@/types/http'

const api = {
  queryStoreList: `${urlPrefixes.ccardapi}/ccard-api/api/spu/queryKidStore.do`
}

/* 查询附近有童玩卡的门店 */
export async function queryStoreList(
  cityId: string,
  lng?: string,
  lat?: string
) {
  const query = queryString.stringify({
    cityId,
    lng,
    lat
  })
  const result: ResultType<StoreDetailType[]> = await ajax.get(
    `${api.queryStoreList}?${query}`
  )
  const { data, code } = result
  if (code == '1') {
    return data || []
  } else {
    throw result
  }
}
