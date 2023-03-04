import loadScript from 'load-script'
import { isHzwApp } from './cookie'
import { getAppPosition } from './native'
import { localStore } from './storage'
import { getCityId } from './city'
import { setLoading } from './helper'
import { STORAGE_KEYS } from '@/constants/storage'
import { PositionType } from '@/types/position'

async function getH5Postition(): Promise<PositionType | null> {
  function getLoc() {
    return new Promise((resolve, reject) => {
      if (window.AMap && window.AMap.Map) {
        resolve(window.AMap)
      } else {
        loadScript(
          '//webapi.amap.com/maps?v=1.3&key=d8efc3c388ce874cab0c12f9e928ceee&callback=onAMapLoaded',
          (err: any) => {
            if (err) {
              reject(null)
            } else {
              window.onAMapLoaded = () => {
                resolve(window.AMap)
              }
            }
          }
        )
      }
    })
  }
  const AMap: any | null = await getLoc()
  return new Promise((resolve, reject) => {
    try {
      if (AMap) {
        const map = new AMap.Map('iCenter')
        map.plugin('AMap.Geolocation', () => {
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 5000, // 超过5秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
          })
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', (data: any) => {
            try {
              console.log('geolocation complete', data)
              const adcode = data.addressComponent.adcode
              let cityId = `${adcode.slice(0, 4)}00`
              const cityName = data.addressComponent.city
              const lat = data.position.lat
              const lng = data.position.lng
              cityId = getCityId(cityId)
              const obj = {
                cityId,
                cityName,
                adcode,
                lat,
                lng
              }

              resolve(obj)
            } catch (e) {
              resolve(null)
            }
          }) // 返回定位信息
          AMap.event.addListener(geolocation, 'error', (error: any) => {
            console.error('geolocation error', error)
            reject(error)
          }) // 返回定位出错信息
        })
      } else {
        resolve(null)
      }
    } catch (e) {
      reject(e)
    }
  })
}

async function getLocPosition(): Promise<PositionType | null> {
  let position: PositionType | null
  if (isHzwApp()) {
    position = await getAppPosition()
  } else {
    position = await getH5Postition()
  }
  if (position && position.cityId) {
    localStore.setItem(STORAGE_KEYS.CITY_LIFE, {
      ...position,
      time: new Date().getTime()
    })
  }
  return position
}
/**
 *
 * @param hasLoading 是否有loading默认有
 */
export async function getPosition(
  hasLoading = false,
  cache = 30
): Promise<PositionType | null> {
  return null
}
