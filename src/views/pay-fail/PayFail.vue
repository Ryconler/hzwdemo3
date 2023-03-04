<template>
  <div class="pay-fail">
    <i class="fail-icon"></i>
    <h1 class="fail-text pf-medium">订单支付失败</h1>
    <h2 class="fail-tip">请及时支付哦</h2>
    <div class="buttons">
      <button class="view-button" @click="viewClick">查看订单</button>
      <button class="back-button" @click="backClick">返回</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { setPage, trackClick, trackView } from '@/utils'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

setPage({
  title: '支付失败',
  share: false
})

const orderId = ref(<string>route.query.orderId)

const viewClick = () => {
  location.href = `/hzwdemo3/order-detail/${orderId.value}?naviType=4&kwtarget=blank`
  trackClick({
    bizType: '127',
    pageLevelId: '121013558',
    clickId: '200001'
  })
}

const backClick = () => {
  location.href = `/hzwdemo3/recharge`
  trackClick({
    bizType: '127',
    pageLevelId: '121013558',
    clickId: '200003'
  })
}

trackView({
  bizType: '127',
  pageLevelId: '121013558',
  pageParam: { orderid: orderId.value }
})
</script>
<style lang="scss" scoped>
.pay-fail {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #ffffff;
  height: 321px;
  .fail-icon {
    width: 94px;
    height: 94.5px;
    background: url(@/assets/images/pay-fail/icon-fail.png) 0 0/100% 100%
      no-repeat;
    margin-bottom: 12px;
  }
  .fail-text {
    font-size: 20px;
    color: #262626;
    line-height: 24px;
    margin-bottom: 10px;
  }
  .fail-tip {
    font-size: 15px;
    color: #666666;
    line-height: 21px;
    margin-bottom: 30px;
  }
  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 120px;
      height: 40px;
      border-radius: 20.5px;
      font-size: 14px;
      line-height: 16px;
    }
    button.view-button {
      border: 1px solid #999999;
      color: #2a2a2a;
      margin-right: 24px;
    }
    button.back-button {
      border: 1px solid #ff397e;
      color: #ff397e;
    }
  }
}
</style>
