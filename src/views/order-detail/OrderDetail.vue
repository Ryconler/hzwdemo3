<template>
  <div v-if="orderDtail" class="order-detail">
    <div class="order-bg" :style="{ paddingTop: `${barHeight + navHeight}px` }">
      <!-- 全屏页面顶部nav -->
      <div
        v-if="isFullscreen && barHeight > 0"
        class="order-nav"
        :style="{ top: `${barHeight}px`, height: `${navHeight}px` }"
      >
        <i class="nav-back" @click="backClick"></i>
      </div>
      <!-- 订单状态icon+文描 -->
      <h1 v-if="orderStatus.text" class="order-status pf-medium">
        <i :style="{ 'background-image': `url(${orderStatus.icon})` }"></i
        >{{ orderStatus.text }}
      </h1>
      <!-- 支付倒计时 -->
      <p
        v-if="orderDtail.orderState == OrderState.WaitPay && orderPayCountDown"
        class="order-text pf-medium"
      >
        还剩 {{ orderPayCountDown }} 自动取消
      </p>
      <!-- 退款完成 -->
      <p
        v-if="
          orderDtail.refundState == OrderRefundState.Succeed &&
          orderDtail.refundTime
        "
        class="order-text pf-medium"
      >
        {{ moment(orderDtail.refundTime).format('YYYY-MM-DD HH:mm:ss') }}
        退款完成
      </p>
      <!-- 退款详情 -->
      <button
        v-if="
          orderDtail.refundState == OrderRefundState.Applying ||
          orderDtail.refundState == OrderRefundState.Succeed
        "
        class="order-refund-detail"
        @click="refundDetailClick"
      >
        退款详情<i></i>
      </button>
    </div>
    <div class="order-detail-wrap">
      <ProductCard
        v-if="productInfo"
        class="product-comp"
        :product="productInfo"
        @click="productClick"
      ></ProductCard>
      <section v-if="orderPayed" class="coin">
        <h2 class="section-title pf-medium">币值信息</h2>
        <ul class="table-list">
          <li class="table-item">
            <span class="name">充值币值</span>
            <div class="value pf-medium">
              {{ orderDtail.rechargeAmount / 100 }}
            </div>
          </li>
          <li class="table-item">
            <span class="name">赠送币值</span>
            <div class="value pf-medium">{{ orderDtail.giveAmount / 100 }}</div>
          </li>
          <li class="table-item">
            <span class="name">到账币值</span>
            <div class="value pf-medium">
              {{
                orderDtail.rechargeAmount / 100 + orderDtail.giveAmount / 100
              }}
            </div>
          </li>
        </ul>
        <div class="dividle"></div>
        <ul class="table-list">
          <li class="table-item">
            <span class="name">消费币值</span>
            <div class="value pf-medium">{{ orderDtail.consume / 100 }}</div>
          </li>
          <li class="table-item">
            <span class="name">剩余币值</span>
            <div class="value pf-medium" style="color: #ff397e">
              {{ orderDtail.leftAmount / 100 }}
            </div>
          </li>
          <p class="coin-tip">*剩余币值=到账币值-消费币值</p>
        </ul>
      </section>
      <section
        v-if="
          returnCoupons.length > 0 ||
          (returnCoins && returnCoins.returnCoinNum > 0)
        "
        class="promotion"
      >
        <h2 class="section-title pf-medium">优惠信息</h2>
        <ul class="table-list">
          <li v-if="returnCoupons.length > 0" class="table-item coupon">
            <span class="name">充值返券</span>
            <div class="value pf-medium">
              <div v-for="(item, index) in returnCoupons" :key="index">
                {{ item }}
              </div>
            </div>
          </li>
          <template v-if="returnCoins && returnCoins.returnCoinNum > 0">
            <li class="table-item">
              <span class="name">核销返币</span>
              <div class="value pf-medium">
                {{ returnCoins.returnCoinNum / 100 }}
              </div>
            </li>
            <p
              class="promotion-tip"
              :class="returnCoins.hasReturn ? 'has-return' : ''"
              @click="showTrips"
            >
              {{ returnCoinNumTitle }}<span></span>
            </p>
          </template>
        </ul>
      </section>
      <section class="order">
        <h2 class="section-title pf-medium">订单信息</h2>
        <ul class="table-list">
          <li class="table-item">
            <span class="name">购买数量</span>
            <div class="value pf-medium">{{ orderDtail.num }}</div>
          </li>
          <li class="table-item param-total">
            <span class="name">商品总额</span>
            <div class="value pf-medium">
              ¥{{ getYenPrice(orderDtail.orderPrice) }}
            </div>
          </li>
          <li class="table-item param-total">
            <span class="name">{{ orderPayed ? '实付款' : '应付款' }}</span>
            <div class="value pf-medium" style="color: #ff397e">
              ¥<em class="big">{{ getYenPrice(orderDtail.payPrice) }}</em>
            </div>
          </li>
        </ul>
        <div class="dividle"></div>
        <ul class="table-list">
          <li class="table-item">
            <span class="name">订单编号：</span>
            <div class="value pf-medium">
              {{ orderDtail.orderId
              }}<span
                :style="{ color: '#ff397e', marginLeft: `${10 / 37.5}rem` }"
                @click="copyClick"
                >复制</span
              >
            </div>
          </li>
          <li class="table-item param-total">
            <span class="name">下单时间：</span>
            <div class="value pf-medium">
              {{ moment(orderDtail.orderTime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </li>
          <li class="table-item param-total">
            <span class="name">订单状态：</span>
            <div class="value pf-medium">{{ orderStatus.text }}</div>
          </li>
        </ul>
      </section>
      <div class="menu_wkBox_back_box"></div>
    </div>
    <div
      v-if="orderDtail.orderState == OrderState.WaitPay"
      class="order-detail-action"
    >
      <div class="action-wrap">
        <button class="cancel-button" @click="cancelClick">取消订单</button>
        <button class="pay-button" @click="payClick">立即支付</button>
      </div>
      <div class="menu_wkBox_back_box"></div>
    </div>
    <van-dialog
      v-if="orderDtail.returnCoinsInfo"
      v-model:show="show"
      confirm-button-text="知道了"
    >
      <div class="dialog-container">
        <p>
          下单成功后，{{
            orderDtail.returnCoinsInfo.endTime
              ? orderDtail.returnCoinsInfo.endTime + '之前'
              : ''
          }}在以下门店核销1次即可返币：
        </p>
        <span
          v-for="(item, index) in orderDtail?.returnCoinsInfo.storeInfo"
          :key="index"
          >·{{ item.storeName }}</span
        >
      </div>
    </van-dialog>
  </div>
</template>
<script lang="ts" setup>
import {
  copyTextClipboard,
  getYenPrice,
  isApp,
  rem2RealPx,
  setPage,
  toLogin,
  trackView
} from '@/utils'
import { computed, onMounted, Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { cancelOrder, queryOrderDetail } from '@/api/order'
import { OrderType } from '@/types/order'
import { getOrderStatus, jumpToCashier } from '@/composables/order'
import moment from 'moment'
import { OrderRefundState, OrderState } from '@/constants/order'
import { Toast, Dialog } from 'vant'
import { debounce } from 'lodash'
const VanDialog = Dialog.Component
const route = useRoute()

setPage({
  title: '订单详情',
  share: false
})

const isFullscreen = computed(() => {
  const naviType = route.query.naviType
  return isApp() && naviType == '4'
})

const barHeight = computed(() => {
  return 0
})

const navHeight = computed(() => {
  if (isFullscreen.value) {
    return rem2RealPx(44 / 37.5)
  }
  return rem2RealPx(22 / 37.5)
})

const returnCoinNumTitle = computed(() => {
  if (returnCoins.value) {
    if (returnCoins.value.hasReturn) {
      return '*已核销返币'
    } else {
      let str = returnCoins.value.endTime
        ? returnCoins.value.endTime + '之前'
        : ''
      return `未返，${str}在指定门店核销即可返币`
    }
  }
  return ''
})

const orderId = ref(<string>route.params.orderId)
const orderDtail: Ref<OrderType | null> = ref(null)
const orderPayCountDown = ref('')
let orderPayCountDownInterval: number

/* 订单状态图标与文字 */
const orderStatus = computed(() => {
  return orderDtail.value ? getOrderStatus(orderDtail.value) : {}
})

/* 订单是否已支付 */
const orderPayed = computed(() => {
  return (
    orderStatus.value.text != '待支付' && orderStatus.value.text != '已取消'
  )
})

const productInfo = computed(() => {
  return (
    orderDtail.value && {
      cmmdtyImage: orderDtail.value.commdtyImage,
      skuName: orderDtail.value.skuName,
      price: orderDtail.value.skuPrice,
      giveAmount: orderDtail.value.giveAmount / orderDtail.value.num,
      rechargeAmount: orderDtail.value.rechargeAmount / orderDtail.value.num,
      returnCoinNum:
        (orderDtail.value.returnCoinsInfo &&
          orderDtail.value.returnCoinsInfo.returnCoinNum /
            orderDtail.value.num) ??
        0 //返币
    }
  )
})
/* 返券 */
const returnCoupons = computed(() => {
  return orderDtail.value?.returnCouponInfo || []
  // if (orderDtail.value?.returnCouponInfo) {
  //   return JSON.parse(orderDtail.value.returnCouponInfo) || []
  // } else {
  //   return []
  // }
})
/* 返币 */
const returnCoins = computed(() => {
  return orderDtail.value?.returnCoinsInfo
})

const show = ref(false)

const showTrips = () => {
  if (orderDtail.value?.returnCoinsInfo?.hasReturn) return
  show.value = true
}

onMounted(async () => {
  try {
    orderDtail.value = await queryOrderDetail(orderId.value)
  } catch (error: any) {
    console.error(error)
    if (error?.code == '4') {
      return toLogin()
    } else {
      Toast(error?.msg || '网络错误')
    }
  }
  if (orderDtail.value?.orderState == OrderState.WaitPay) {
    let finished = calcOrderPayCountDown()
    if (!finished) {
      orderPayCountDownInterval = setInterval(() => {
        finished = calcOrderPayCountDown()
        finished && location.reload()
      }, 1000)
    }
  }
  trackView({
    bizType: '127',
    pageLevelId: '121013559',
    pageParam: { orderid: orderId.value }
  })
})

/* 待支付倒计时 */
function calcOrderPayCountDown(): boolean {
  const nowMoment = moment()
  const expireMoment = moment(orderDtail.value?.orderTime).add(1, 'hours')
  if (expireMoment.isValid()) {
    const diff = expireMoment.diff(nowMoment, 'seconds')
    if (diff <= 0) {
      // 倒计时结束
      clearInterval(orderPayCountDownInterval)
      orderPayCountDown.value = `${0}分${0}秒`
      return true
    } else {
      const diffMinutes = Math.floor(diff / 60)
      const diffSeconds = diff % 60
      orderPayCountDown.value = `${diffMinutes}分${diffSeconds}秒`
    }
  } else {
    clearInterval(orderPayCountDownInterval)
    orderPayCountDown.value = ''
  }
  return false
}

const backClick = () => {
}

const productClick = () => {
  location.href = `/hzwdemo3/recharge?kwtarget=blank`
}

const copyClick = async () => {
  const res = await copyTextClipboard(orderDtail.value?.orderId)
  if (res) {
    Toast('复制成功')
  } else {
    Toast('复制失败')
  }
}

const cancelClick = debounce(
  async () => {
    try {
      await cancelOrder(orderId.value)
      location.reload()
    } catch (error: any) {
      console.error(error)
      if (error?.code == '4') {
        return toLogin()
      } else {
        Toast(error?.msg || '网络错误')
      }
    }
  },
  3000,
  {
    leading: true,
    trailing: false
  }
)
const payClick = () => {
  orderDtail.value &&
    jumpToCashier({
      orderId: orderDtail.value.orderId,
      partnerId: '3006',
      payOrderId: orderDtail.value.orderId,
      state: '1'
    })
}
const refundDetailClick = () => {
  location.href = `/hzwdemo3/refund-detail?orderId=${orderId.value}&kwtarget=blank`
}
</script>
<style lang="scss" scoped>
.order-detail {
  .order-bg {
    overflow: hidden;
    padding-bottom: 84px;
    margin-bottom: -64px;
    background: linear-gradient(122deg, #ff2424 0%, #ff387a 95%);
    .order-nav {
      position: fixed;
      left: 0;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 0 12px;
      .nav-back {
        flex: none;
        width: 22px;
        height: 22px;
        background: url(@/assets/images/order-detail/icon-back.png) 0 0/100%
          100% no-repeat;
      }
    }
    .order-status {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      color: #ffffff;
      line-height: 24px;
      margin-bottom: 11px;
      i {
        width: 24px;
        height: 24px;
        margin-right: 6px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: 0 0;
      }
    }
    .order-text {
      font-size: 13px;
      color: #ffffff;
      line-height: 16px;
      margin-bottom: 8px;
      text-align: center;
    }
    .order-refund-detail {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 22px;
      border: 0.75px solid #ffffff;
      border-radius: 10.5px;
      font-size: 13px;
      color: #ffffff;
      line-height: 16px;
      margin: 0 auto;
      i {
        margin-left: 2px;
        width: 10px;
        height: 10px;
        background: url(@/assets/images/order-detail/icon-more.png) 0 0/100%
          100% no-repeat;
      }
    }
    & > *:last-child {
      margin-bottom: 0;
    }
  }
  .order-detail-wrap {
    padding: 0 12px 50px;

    .product-comp {
      margin-bottom: 10px;
    }
    section {
      border-radius: 8px;
      padding: 0 12px 16px;
      background: #ffffff;
      overflow: hidden;
      margin-bottom: 10px;
      h2.section-title {
        padding: 16px 0 12px;
        font-size: 15px;
        color: #121212;
        line-height: 18px;
      }
      ul.table-list {
        li.table-item {
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          align-items: center;
          min-height: 16px;
          margin-bottom: 12px;
          &:last-of-type {
            margin-bottom: 0;
          }
          &.coupon {
            align-items: flex-start;
            .value {
              color: #ff397e;
              line-height: 22px;
            }
          }
          .name {
            flex: none;
            font-size: 13px;
            color: #262626;
            line-height: 16px;
          }
          .value {
            flex: 1;
            text-align: right;
            font-size: 13px;
            color: #262626;
            line-height: 16px;
            .big {
              font-size: 16px;
              vertical-align: baseline;
            }
          }
        }
        p.coin-tip {
          margin-top: 5px;
          font-size: 11px;
          color: #999999;
          line-height: 14px;
        }
        p.promotion-tip {
          width: 100%;
          color: #ff397e;
          font-size: 11px;
          margin-top: 5px;
          line-height: 1.3;
          text-decoration-line: underline;

          span {
            width: 12px;
            min-width: 12px;
            display: inline-block;
            height: 12px;
            transform: translateY(2px);
            background: url(@/assets/images/order-detail/icon_question.png)
              no-repeat;
            background-position: center;
            background-size: 100% 100%;
            margin-left: 5px;
          }
        }
        p.promotion-tip.has-return {
          text-decoration-line: none;
          color: #999999;
          span {
            display: none;
          }
        }
      }
      ul.table-list ~ .dividle {
        margin: 16px 0;
        height: 1px;
        background: #ededed;
      }
    }
  }
  .order-detail-action {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 10px 12px;
    background: #ffffff;
    border-top: 1px solid #f0f0f0;
    .action-wrap {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 72px;
        height: 30px;
        border-radius: 15px;
        font-size: 12px;
        line-height: 15px;
      }
      button.cancel-button {
        border: 1px solid #999999;
        color: #2a2a2a;
        margin-right: 10px;
      }
      button.pay-button {
        background: linear-gradient(90deg, #ff397e, #ff074c);
        color: #ffffff;
      }
    }
  }
}

:deep(.van-popup) {
  border-radius: 14px;
  .van-dialog__header {
    margin-top: 20px;
    color: #262626;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
  }
  .van-dialog__footer {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ff397e;
    font-weight: 600;
    font-size: 16px;
  }
  .van-button__text {
    display: block;
    height: 44px;
    line-height: 44px;
    width: 300px;
  }
}
.dialog-container {
  width: 280px;
  color: #666666;
  pad: 20px;
  max-height: 300px;
  overflow-y: scroll;
  line-height: normal;
  font-family: PingFang SC;
  font-size: 14px;
  padding-bottom: 25px;
  p {
    margin: 20px 20px 10px;
  }
  span {
    display: block;
    margin: 0 20px;
  }
}
</style>
