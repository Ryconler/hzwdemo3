<template>
  <div class="order-confirm">
    <div class="order-confirm-wrap">
      <ProductCard
        class="product-comp"
        :product="confirmOrderInfo?.skuInfo"
        :show-return-coin-num="true"
      ></ProductCard>
      <section class="param">
        <ul class="form-list">
          <li class="form-item param-amount">
            <span class="name">购买数量</span>
            <div class="value pf-medium">
              <VanStepper
                v-model="formData.num"
                theme="round"
                disable-input
              ></VanStepper>
            </div>
          </li>
          <li class="form-item param-total">
            <span class="name">商品总额</span>
            <div class="value pf-simbold">¥{{ productTotalYen }}</div>
          </li>
        </ul>
      </section>
      <section
        v-if="returnCoins || returnCoupons.length > 0"
        class="promotion"
        @click="showDialog"
      >
        <div>优惠</div>
        <p v-if="returnCoins && returnCoupons.length > 0">共<span>2</span>个</p>
        <p v-else-if="returnCoins">
          核销返<span
            >{{ (returnCoins.returnCoinNum / 100) * formData.num }}币</span
          >
        </p>
        <p v-else-if="returnCoupons.length > 0">充值返券</p>
        <img src="@/assets/images/order-confirm/icon_right.png" />
      </section>
      <PromotionPopup
        v-model="show"
        :return-coupons="returnCoupons"
        :return-coins="returnCoins"
      ></PromotionPopup>
      <section class="invite">
        <ul class="form-list">
          <li class="form-item invite-code">
            <span class="name"
              >邀请码<em style="color: #808080">（选填）</em></span
            >
            <div class="value">
              <VanField
                v-model="formData.inviteCode"
                placeholder="请输入邀请码"
              ></VanField>
            </div>
          </li>
        </ul>
      </section>
      <div class="menu_wkBox_back_box"></div>
    </div>
    <div class="order-confirm-protocol">
      <div class="protocol-wrap">
        <VanCheckbox v-model="protocolAgreed"></VanCheckbox>
        <p>
          我已阅读、理解并同意<a href="javascript:void(0)"
            >《童玩卡服务协议》</a
          >
        </p>
      </div>
      <div class="menu_wkBox_back_box"></div>
    </div>
    <div class="order-confirm-action">
      <div class="action-wrap">
        <div class="confirm-money">
          <span class="text">应付款：</span>
          <span class="money pf-simbold">
            <span class="yen">&yen;</span>
            <span class="integer">{{ payTotalTexts[0] }}</span>
            <span class="decimal">.{{ payTotalTexts[1] }}</span>
          </span>
        </div>
        <button class="confirm-button pf-medium" @click="confirmClick">
          提交订单
        </button>
      </div>
      <div class="menu_wkBox_back_box"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { createOrder, queryOrderConfirm } from '@/api/order'
import {
  cookies,
  ensureLogin,
  setLoading,
  setPage,
  toLogin,
  trackClick,
  trackView
} from '@/utils'
import { debounce, divide, round } from 'lodash'
import { ConfirmOrderType } from '@/types/order'
import { Toast, Dialog } from 'vant'
import { computed, onMounted, Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { jumpToCashier } from '@/composables/order'

setLoading(true)
setPage({
  title: '童玩卡充值',
  share: false
})

ensureLogin()

const route = useRoute()

const skuId = ref(<string>route.query.skuId)
const storeCode = ref(<string>route.query.storeCode)
const shareKey = ref(
  <string>route.query.hserecomkey ||
    (cookies.get('hserecomkey') !== 'undefined'
      ? cookies.get('hserecomkey')
      : '')
)

const confirmOrderInfo: Ref<ConfirmOrderType | null> = ref(null)
const returnCoupons = computed(() => {
  if (confirmOrderInfo.value?.returnCouponInfo) {
    return JSON.parse(confirmOrderInfo.value.returnCouponInfo) || []
  } else {
    return []
  }
})
const returnCoins = computed(() => {
  return confirmOrderInfo.value?.returnCoinsInfo
})
const formData = ref({
  num: 1,
  inviteCode: ''
})
const protocolAgreed = ref(true)

/* 商品总额 */
const productTotalFen = computed(() => {
  return formData.value.num * (confirmOrderInfo.value?.skuInfo.price || 0)
})
const productTotalYen = computed(() => {
  return round(divide(productTotalFen.value, 100), 2).toFixed(2)
})

/* 应付款文本 */
const payTotalTexts = computed(() => {
  return productTotalYen.value.split('.')
})

onMounted(async () => {
  try {
    confirmOrderInfo.value = await queryOrderConfirm({
      skuId: skuId.value,
      storeCode: storeCode.value,
      shareKey: shareKey.value
    })
  } catch (error: any) {
    console.error(error)
    if (error?.code == '4') {
      toLogin()
    } else {
      Toast(error?.msg || '网络错误')
    }
  }

  formData.value.inviteCode =
    confirmOrderInfo.value?.shareDetail?.shareCode || ''
  setLoading(false)
  trackView({
    bizType: '127',
    pageLevelId: '121013557',
    pageParam: {
      skuid: skuId.value,
      storecode: storeCode.value,
      staffnumb: formData.value.inviteCode
    }
  })
})

const show = ref(false)

watch(show, val => {})

const showDialog = () => {
  show.value = true
}

const confirmClick = debounce(
  async () => {
    if (!protocolAgreed.value) {
      Toast('请先同意《童玩卡服务协议》')
      return
    }
    try {
      Toast('下单成功，这里模拟跳转收银台')
      setTimeout(() => {
        jumpToCashier({
          state: '2',
          orderId: '123',
          partnerId: '3006',
          payOrderId: '123'
        })
      }, 1000)
    } catch (error: any) {
      if (error?.code == '4') {
        return toLogin()
      } else {
        Toast(error?.msg || '网络错误')
      }
    }

    trackClick({
      bizType: '127',
      pageLevelId: '121013557',
      clickId: '200001',
      positionParam: {
        skuid: skuId.value,
        storecode: storeCode.value,
        'Staff numb': formData.value.inviteCode
      }
    })
  },
  3000,
  {
    leading: true,
    trailing: false
  }
)
</script>
<style lang="scss" scoped>
.order-confirm {
  .order-confirm-wrap {
    padding: 10px 12px 117px;

    section {
      border-radius: 8px;
      padding: 0 12px;
      background: #ffffff;
      overflow: hidden;
      margin-bottom: 10px;
      ul.form-list {
        li.form-item {
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          align-items: center;
          min-height: 38px;
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
            // 输入框
            .van-field {
              padding: 0;
              color: inherit;
              line-height: inherit;
              font-size: inherit;
              :deep(.van-cell__value) {
                color: inherit;
                text-align: inherit;
                input {
                  color: inherit;
                  text-align: inherit;
                }
              }
            }
            // 步进器
            .van-stepper {
              :deep(button) {
                width: 20px;
                height: 20px;
                color: #121212;
                background: #ffffff;
                border: 0.714px solid #cccccc;
                &::before {
                  width: 8px;
                  height: 1.5px;
                }
                &::after {
                  width: 1.5px;
                  height: 8px;
                }
                &.van-stepper__minus--disabled {
                  opacity: 1;
                  &::before {
                    background: #cccccc;
                  }
                }
              }
              :deep(input) {
                font-size: inherit;
                color: inherit;
                line-height: inherit;
                width: 50px;
                height: auto;
                margin: 0;
              }
            }
          }
        }
      }
    }
    .product-comp {
      margin-bottom: 10px;
    }
    section.param {
      padding-top: 9px;
      padding-bottom: 9px;
    }
    section.invite {
      padding-top: 6px;
      padding-bottom: 6px;
    }
    section.promotion {
      padding-top: 6px;
      padding-bottom: 6px;
      display: flex;
      height: 50px;
      align-items: center;
      padding: 0 12px;
      div {
        color: #262626;
        font-size: 13px;
      }
      p {
        text-align: right;
        flex: 1;
        margin-right: 6px;
        color: #262626;
        font-size: 13px;
        span {
          color: #ff397e;
          font-weight: 600;
        }
      }
      img {
        width: 10px;
        height: 10px;
      }
    }
  }
  .order-confirm-protocol {
    position: fixed;
    left: 0;
    bottom: 82px;
    width: 100%;
    .protocol-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 17px;
      .van-checkbox {
        flex: none;
        margin-right: 5px;
        :deep(.van-checkbox__icon) {
          font-size: 15px;
          .van-icon {
            width: 15px;
            height: 15px;
            line-height: 15px;
          }
          &.van-checkbox__icon--checked .van-icon {
            border-color: #eb4d7e;
            background-color: #eb4d7e;
          }
        }
      }
      p {
        font-size: 12px;
        color: #262626;
        line-height: 15px;
        a {
          color: #ff397e;
        }
      }
    }
  }
  .order-confirm-action {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 10px 12px 12px;
    background: #ffffff;
    border-top: 1px solid #f0f0f0;
    .action-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .confirm-money {
        display: flex;
        align-items: flex-end;
        .text {
          font-size: 12px;
          color: #000000;
          margin-bottom: 2px;
        }
        .money {
          display: flex;
          align-items: flex-end;
          color: #ff397e;
          margin-left: -3.5px;
          .yen {
            font-size: 12px;
            margin-bottom: 2px;
          }
          .integer {
            font-size: 20px;
          }
          .decimal {
            font-size: 12px;
            margin-bottom: 1px;
          }
        }
      }
      button.confirm-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 104px;
        height: 40px;
        border-radius: 20px;
        background: linear-gradient(90deg, #ff397e, #ff074c);
        color: #ffffff;
        font-size: 16px;
        line-height: 20px;
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
  max-height: 300px;
  overflow-y: scroll;
  pad: 20px;
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
