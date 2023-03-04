<template>
  <div v-if="activedSku" class="recharge-action">
    <button
      v-if="
        activedSku.availableInventory == 0 ||
        moment().isAfter(moment(activedSku.saleEndTime))
      "
      disabled
      class="purchase-button pf-medium"
    >
      已售罄
    </button>
    <button v-else class="purchase-button pf-medium" @click="purchaseClick">
      立即购买
    </button>
    <div class="menu_wkBox_back_box"></div>
  </div>
</template>
<script lang="ts" setup>
import { ensureLogin, setLoading, setPage, trackClick } from '@/utils'

import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import { useChildCardStore } from '@/store/childCard'
import { storeToRefs } from 'pinia'

setLoading(true)
ensureLogin()
setPage({
  title: '童玩卡充值',
  share: false
})

const route = useRoute()
const router = useRouter()

const childCardStore = useChildCardStore()
const { childCardDetail, activedSku, storeInfo } = storeToRefs(childCardStore)

const purchaseClick = () => {
  router.push({
    name: 'orderConfirm',
    query: {
      spuId: childCardDetail.value?.spu.spuId,
      skuId: activedSku.value?.skuId,
      storeCode: storeInfo.value.storeCode,
      hserecomkey: route.query.hserecomkey,
      deviceCode: route.query.deviceCode //电玩的充值页会带入deviceCode
    }
  })
  trackClick({
    bizType: '127',
    pageLevelId: '121013556',
    clickId: '200003',
    positionParam: {
      skuid: activedSku.value?.skuId,
      storecode: storeInfo.value.storeCode
    }
  })
}
</script>
<style lang="scss" scoped>
.recharge-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 5px 12px;
  background: #ffffff;
  button.purchase-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    border-radius: 20px;
    background: linear-gradient(
      90deg,
      rgba(255, 57, 126, 1) 0%,
      rgba(255, 7, 76, 1) 100%
    );
    color: #ffffff;
    font-size: 14px;
    line-height: 20px;
  }
  button.purchase-button[disabled] {
    background: #cccccc;
    color: #999999;
  }
}
</style>
