import { ChildCardSkuConsumeType, ChildCardSkuType } from './../types/childCard'
import { Toast } from 'vant'
import {
  queryChildCardConsumeInfo,
  queryChildCardDetail
} from '@/api/childCard'
import { defaultCity, getSelectedCity } from '@/utils'
import { StoreDetailType, StoreType } from '@/types/store'
import { defineStore } from 'pinia'
import { ChildCardType } from '@/types/childCard'
import { useMainStore } from '.'
import { queryStoreList } from '@/api/store'

type StateType = {
  childCardDetail: ChildCardType | null
  activeSkuId: number | undefined
  activedSkuConsumeInfo: ChildCardSkuConsumeType | null
  storeInfo: StoreType
}
type GettersType = {
  activedSku: (state: StateType) => ChildCardSkuType | undefined
  activedSkuCoinGiftDetail: (state: StateType) => string
  activedSkuReturnCoupons: (state: StateType) => any
  activedSkuReturnCoins: (state: StateType) => any
}
type ActionsType = {
  initChildCardDetail: () => void
  setChildCardDetail: () => void
  setActivedSkuConsumeInfo: () => void
}

export const useChildCardStore = defineStore<
  string,
  StateType,
  GettersType,
  ActionsType
>('childCard', {
  state: () => {
    return {
      childCardDetail: null,
      activeSkuId: undefined,
      activedSkuConsumeInfo: null,
      storeInfo: {
        storeCode: '',
        storeName: ''
      }
    }
  },
  getters: {
    activedSku(state) {
      return state.childCardDetail?.skuList.find(
        item => item.skuId == state.activeSkuId
      )
    },
    activedSkuCoinGiftDetail(state) {
      let coinGiftDetail = ''
      coinGiftDetail += this.activedSku?.giveAmount
        ? `+赠送${this.activedSku.giveAmount / 100}`
        : ''
      coinGiftDetail += this.activedSku?.returnCoinNum
        ? `+核销返${this.activedSku.returnCoinNum / 100}`
        : ''
      return coinGiftDetail
    },
    activedSkuReturnCoupons(state) {
      return state.activedSkuConsumeInfo?.returnCouponInfo
        ? JSON.parse(state.activedSkuConsumeInfo.returnCouponInfo)
        : []
    },
    activedSkuReturnCoins(state) {
      return state.activedSkuConsumeInfo?.returnCoinsInfo
    }
  },
  actions: {
    async initChildCardDetail() {
      const mainStore = useMainStore()
      const cookieCityInfo = (await getSelectedCity()) || defaultCity
      /* 查询最近的商品信息 */
      const queryNearestChildCard = async () => {
        // 当前城市取url城市或定位或cookie
        const cityId =
          <string>mainStore.$route?.query.cityId ||
          mainStore.position?.cityId ||
          cookieCityInfo.cityId
        // 当前城市最近的有商品的门店
        let nearStoreInfos: StoreDetailType[] = []
        try {
          nearStoreInfos = await queryStoreList(
            cityId,
            mainStore.position?.lng,
            mainStore.position?.lat
          )
        } catch (error) {
          console.error(error)
        }
        if (nearStoreInfos.length == 0) {
          // 当前城市无有商品的门店，跳转门店列表页
          mainStore.$router?.replace({
            name: 'storeList',
            query: {
              citycode: cityId
            }
          })
        } else {
          try {
            this.childCardDetail = await queryChildCardDetail(
              nearStoreInfos[0].store_code,
              <string>mainStore.$route?.query.skuId ||
                <string>mainStore.$route?.query.filterId
            )
          } catch (error: any) {
            console.error(error)
            Toast(error?.msg || '网络错误')
          }
        }
      }

      if (mainStore.$route?.query.storeCode) {
        // 优先查询url门店的商品
        try {
          this.childCardDetail = await queryChildCardDetail(
            <string>mainStore.$route?.query.storeCode,
            <string>mainStore.$route?.query.skuId ||
              <string>mainStore.$route?.query.filterId
          )
        } catch (error: any) {
          console.error(error)
          if (error.code != '12') {
            Toast(error?.msg || '网络错误')
            return
          }
        }
        if (this.childCardDetail) {
          // url门店查到了商品
        } else {
          // url门店没有查到商品，查询最近门店商品
          await queryNearestChildCard()
          if (this.childCardDetail) {
            Toast('当前门店暂无在售的充值卡，已为您切换至最近的门店')
          }
        }
      } else {
        // url无门店查询最近门店商品
        await queryNearestChildCard()
      }
    },
    async setChildCardDetail() {
      const mainStore = useMainStore()
      try {
        this.childCardDetail = await queryChildCardDetail(
          this.storeInfo.storeCode,
          <string>mainStore.$route?.query.skuId ||
            <string>mainStore.$route?.query.filterId
        )
      } catch (error) {
        console.error(error)
      }
    },
    async setActivedSkuConsumeInfo() {
      if (this.activeSkuId && this.storeInfo.storeCode) {
        try {
          this.activedSkuConsumeInfo = await queryChildCardConsumeInfo(
            this.storeInfo.storeCode,
            this.activeSkuId
          )
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
})
