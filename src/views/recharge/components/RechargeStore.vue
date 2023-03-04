<template>
  <div class="store" @click="storeClick">
    <span class="store-text">销售门店</span>
    <span class="store-name">{{ storeInfo.storeName }}</span>
    <i class="more-icon"></i>
  </div>
</template>
<script lang="ts" setup>
import { useMainStore } from '@/store'
import { useChildCardStore } from '@/store/childCard'
import { trackClick } from '@/utils'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const mainStore = useMainStore()
const childCardStore = useChildCardStore()
const { cityInfo } = storeToRefs(mainStore)
const { storeInfo } = storeToRefs(childCardStore)
const router = useRouter()

const storeClick = () => {
  router.push({
    name: 'storeList',
    query: {
      citycode: cityInfo.value.cityId,
      cityname: cityInfo.value.cityName
    }
  })
  trackClick({
    bizType: '127',
    pageLevelId: '121013556',
    clickId: '200002',
    positionParam: { citycode: cityInfo.value.cityId }
  })
}
</script>
<style lang="scss" scoped>
.store {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 12px;
  margin: 0 12px 12px;
  border-radius: 8px;
  background: #ffffff;
  .store-text {
    flex: none;
    color: #999999;
    font-size: 14px;
    line-height: 20px;
    margin-right: 6px;
  }
  .store-name {
    flex: 1;
    text-align: right;
    line-height: 20px;
    color: #262626;
    font-size: 14px;
    @include ellicpsis;
  }
  .more-icon {
    flex: none;
    width: 10px;
    height: 10px;
    margin-left: 6px;
    background: url(@/assets/images/recharge/icon-more.png) 0 0/100% 100%
      no-repeat;
  }
}
</style>
