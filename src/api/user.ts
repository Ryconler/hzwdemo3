import queryString from 'query-string'
import urlPrefixes from '@/constants/urlPrefixes'
import { ajax, cookies } from '@/utils'
import { ResultType } from '@/types/http'
import { UserInfoType } from '@/types/user'

const api = {
  queryUserInfo: `${urlPrefixes.userapi}/user/GetUserInfo`
}

/* 查询登录用户信息 */
export async function queryUserInfo() {
  const query = queryString.stringify({
    uid: cookies.get('uid'),
    skey: cookies.get('skey')
  })
  const result: ResultType<UserInfoType> = await ajax.get(
    `${api.queryUserInfo}?${query}`
  )
  const { errno, data } = result
  if (errno == 0) {
    return data || null
  } else {
    throw result
  }
}
