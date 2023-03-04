<template>
  <div class="recharge">
    <div class="recharge-wrap">
      <RechargeCard></RechargeCard>
      <RechargeDetail></RechargeDetail>
      <RechargeStore></RechargeStore>
      <RechargeImgtxt></RechargeImgtxt>
      <div class="menu_wkBox_back_box"></div>
    </div>
    <RechargeAction></RechargeAction>
  </div>
</template>
<script lang="ts" setup>
import { queryUserInfo } from '@/api/user'
import {
  cookies,
  defaultCity,
  ensureLogin,
  getCityId,
  getCityNameByCityId,
  getPosition,
  getSelectedCity,
  setLoading,
  setPage,
  toLogin,
  trackView
} from '@/utils'

import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/store/index'
import { useChildCardStore } from '@/store/childCard'
import { storeToRefs } from 'pinia'
import RechargeCard from './components/RechargeCard.vue'
import RechargeDetail from './components/RechargeDetail.vue'
import RechargeStore from './components/RechargeStore.vue'
import RechargeImgtxt from './components/RechargeImgtxt.vue'
import RechargeAction from './components/RechargeAction.vue'

setLoading(true)
ensureLogin()
setPage({
  title: '童玩卡充值',
  share: false
})

const route = useRoute()

const mainStore = useMainStore()
const { userInfo, cityInfo, position } = storeToRefs(mainStore)
const childCardStore = useChildCardStore()
const { childCardDetail, activeSkuId, storeInfo } = storeToRefs(childCardStore)

onMounted(async () => {
  // 用户信息查询
  try {
    userInfo.value = await queryUserInfo()
  } catch (error) {
    console.error(error)
  }
  if (!userInfo.value) {
    toLogin()
    return
  }
  position.value = await getPosition()
  await childCardStore.initChildCardDetail()
  completeInfos() // 补全门店名称、城市信息
  childCardStore.setActivedSkuConsumeInfo()
  setLoading(false)
  trackView({
    bizType: '127',
    pageLevelId: '121013556',
    pageParam: {
      citycode: cityInfo.value.cityId,
      fuid: cookies.get('uid'),
      storecode: storeInfo.value.storeCode
    }
  })
})

/* 补全门店、城市信息 */
async function completeInfos() {
  const firstSku = childCardDetail.value?.skuList[0]
  // sku兜底选中
  if (route.query.skuId) {
    activeSkuId.value = Number(route.query.skuId)
  } else {
    activeSkuId.value = firstSku?.skuId
  }
  // storeInfo
  storeInfo.value.storeCode = firstSku?.storeCode || ''
  storeInfo.value.storeName = firstSku?.storeName || ''
  // cityInfo
  if (firstSku?.cityId) {
    cityInfo.value.cityId = getCityId(firstSku.cityId.toString())
    cityInfo.value.cityName = (
      await getCityNameByCityId(cityInfo.value.cityId)
    ).replace('市', '')
  } else if (route.query.cityId) {
    cityInfo.value.cityId = <string>route.query.cityId
    cityInfo.value.cityName = (
      await getCityNameByCityId(<string>route.query.cityId)
    ).replace('市', '')
  } else if (position.value?.cityId && position.value.cityName) {
    cityInfo.value.cityId = position.value.cityId
    cityInfo.value.cityName = position.value.cityName
  } else {
    const cookieCityInfo = (await getSelectedCity()) || defaultCity
    cityInfo.value.cityId = cookieCityInfo.cityId
    cityInfo.value.cityName = cookieCityInfo.cityName
  }
}
</script>
<style lang="scss" scoped>
.recharge {
  background: url(@/assets/images/recharge/bg-recharge.png) 0 0/100% auto
    no-repeat;
  .recharge-wrap {
    padding: 16px 0 71px;
  }
}
</style>
