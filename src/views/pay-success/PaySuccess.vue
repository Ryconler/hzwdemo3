<template>
  <div class="pay-success">
    <i class="success-icon"></i>
    <h1 class="success-text pf-medium">订单支付成功</h1>
    <h2 class="success-tip">童玩币已充值到账</h2>
    <div class="buttons">
      <button class="view-button" @click="viewClick">查看订单</button>
      <button class="use-button" @click="useClick">立即使用</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { setPage, toLogin, trackClick, trackView } from '@/utils'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { queryOrderDetail } from '@/api/order'
import { isArray, find } from 'lodash'
import { Toast } from 'vant'
const route = useRoute()

setPage({
  title: '支付成功',
  share: false
})

const orderId = ref(<string>route.query.orderId)
const deviceCode = ref('')
const cashPay = ref(0) //是否现金支付

const viewClick = () => {
  location.href = `/hzwdemo3/order-detail/${orderId.value}?naviType=4&kwtarget=blank`
  trackClick({
    bizType: '127',
    pageLevelId: '121013558',
    clickId: '200001'
  })
}

const useClick = () => {
  Toast('模拟跳转二维码核销页面')
  trackClick({
    bizType: '127',
    pageLevelId: '121013558',
    clickId: '200002'
  })
}

trackView({
  bizType: '127',
  pageLevelId: '121013558',
  pageParam: { orderid: orderId.value }
})

onMounted(async () => {
  try {
    const result: any = await queryOrderDetail(orderId.value)
    if (result) {
      cashPay.value = +result.orderSource === 13 ? 1 : 0
      if (result.extInfoList && isArray(result.extInfoList)) {
        const val = find(
          result.extInfoList,
          item => 'deviceCode' === item.labelKey
        )
        if (val) {
          deviceCode.value = val.labelValue
        }
      }
    }
  } catch (error: any) {
    console.error(error)
    if (error?.code == '4') {
      return toLogin()
    } else {
      Toast(error?.msg || '网络错误')
    }
  }
})
</script>
<style lang="scss" scoped>
.pay-success {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #ffffff;
  height: 321px;
  .success-icon {
    width: 94px;
    height: 94.5px;
    background: url(@/assets/images/pay-success/icon-success.png) 0 0/100% 100%
      no-repeat;
    margin-bottom: 12px;
  }
  .success-text {
    font-size: 20px;
    color: #262626;
    line-height: 24px;
    margin-bottom: 10px;
  }
  .success-tip {
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
    button.use-button {
      background: linear-gradient(90deg, #ff397e, #ff074c);
      color: #ffffff;
    }
  }
}
</style>
