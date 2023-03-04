import { findIndex } from 'lodash'
import { cookies } from './cookie'
import { ajax } from './http'
import { COOKIE_KEYS } from '@/constants/storage'
import { CityType } from '@/types/city'

enum Municipality {
  BeiJin = '110000',
  TianJin = '120000',
  ShangHai = '310000',
  ChongQin = '500000'
}

const municipalityList = [
  Municipality.BeiJin,
  Municipality.ShangHai,
  Municipality.TianJin,
  Municipality.ChongQin
]

export const defaultCity: CityType = {
  cityId: '320100',
  cityName: '南京'
}

export function getCityId(cityId: string) {
  if (findIndex(municipalityList, o => o == cityId) > -1) {
    return `${Number(cityId) + 100}`
  }
  return cityId
}

export async function getCityNameByCityId(cityId: string): Promise<string> {
  return ''
}

/* 从cookie获取选择城市 */
export async function getSelectedCity(): Promise<CityType | null> {
  return null
}
