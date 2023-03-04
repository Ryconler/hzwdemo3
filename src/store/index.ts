import { PositionType } from '@/types/position'
import { CityType } from '@/types/city'
import { UserInfoType } from '@/types/user'
import { defineStore } from 'pinia'
import { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import router from '@/router'

type StateType = {
  $router: Router
  $route: RouteLocationNormalizedLoaded | null
  keepAliveRoutes: string[]
  userInfo: UserInfoType | null
  cityInfo: CityType
  position: PositionType | null
}

export const useMainStore = defineStore<string, StateType>('main', {
  state: () => {
    return {
      $router: router,
      $route: null,
      keepAliveRoutes: [],
      userInfo: null,
      cityInfo: {
        cityId: '320100',
        cityName: '南京'
      },
      position: null
    }
  },
  actions: {}
})
