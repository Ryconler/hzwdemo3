<template>
  <VanPopup
    v-model:show="promotionPopupShow"
    position="bottom"
    class="promotion-popup"
  >
    <div class="popup-main">
      <div class="popup-title">
        <h2 class="title">
          优惠{{ returnCoupons.length > 0 && returnCoins ? '（2个）' : '' }}
        </h2>
        <i class="close-icon" @click="promotionPopupShow = false"></i>
      </div>
      <ul class="promotion-list">
        <li v-if="returnCoupons.length > 0" class="promotion-item">
          <div class="promotion-title">
            <i></i>
            <h3 class="title">充值返券</h3>
          </div>
          <p class="promotion-desc">订单支付成功后可获得返券：</p>
          <p
            v-for="(coupon, index) in returnCoupons"
            :key="index"
            class="coupon-name"
          >
            ·{{ coupon.couponName }}
          </p>
        </li>
        <li v-if="returnCoins" class="promotion-item">
          <div class="promotion-title">
            <i></i>
            <h3 class="title">核销返币</h3>
          </div>
          <p class="promotion-desc">
            下单成功后，<em>{{ returnCoins.verifyLimitDate }}</em
            >天内在以下门店核销<em>1</em>次即可返币：
          </p>
          <p
            v-for="(store, index) in returnCoins.storeInfo"
            :key="index"
            class="store-name"
          >
            ·{{ store.storeName }}
          </p>
        </li>
      </ul>
    </div>
    <div class="popup-bottom">
      <div class="confirm-button" @click="promotionPopupShow = false">确认</div>
      <div class="menu_wkBox_back_box"></div>
    </div>
  </VanPopup>
</template>
<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  returnCoupons: {
    type: Array as PropType<{ couponId: number; couponName: string }[]>,
    default() {
      return []
    }
  },
  returnCoins: {
    type: Object as PropType<{
      returnCoinNum: number
      storeInfo: { storeCode: string; storeName: string }[]
      verifyLimitDate: number
    }>,
    default() {
      return null
    }
  }
})

const promotionPopupShow = ref(props.modelValue)

watch(
  () => props.modelValue,
  val => {
    promotionPopupShow.value = val
  }
)

watch(promotionPopupShow, val => {
  emits('update:modelValue', val)
})
</script>
<style lang="scss">
.promotion-popup {
  border-radius: 10px 10px 0 0 !important;
}
</style>
<style lang="scss" scoped>
.popup-main {
  padding: 18px 12px 0;
  background: #f6f6f6;
  box-sizing: border-box;
  .popup-title {
    position: relative;
    margin: 0 0 17px;
    .title {
      margin: 0;
      line-height: 22px;
      color: #121212;
      font-weight: 500;
      font-size: 17.5px;
      text-align: center;
    }
    .close-icon {
      position: absolute;
      right: 1.5px;
      top: 3px;
      display: block;
      width: 16px;
      height: 16px;
      background: url(https://hzwimspic-1251601690.image.myqcloud.com/49146f30-9641-11ed-8a9d-dff935d725d5_size_64x64)
        0 0/100% 100% no-repeat;
    }
  }
  .promotion-list {
    box-sizing: border-box;
    max-height: 356.5px;
    overflow: auto;
    list-style: none;
    padding: 0 0 18px;
    margin: 0;
    text-align: left;
    .promotion-item {
      padding: 16px 12px;
      border-radius: 10px;
      background: #ffffff;
      margin-bottom: 12px;
      &:last-child {
        margin-bottom: 0;
      }
      .promotion-title {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        i {
          flex: none;
          width: 10px;
          height: 10px;
          margin-right: 3.5px;
          background: url(https://hzwimspic-1251601690.image.myqcloud.com/1c8ec540-9642-11ed-8a9d-dff935d725d5_size_40x40)
            0 0/100% 100% no-repeat;
        }
        .title {
          flex: 1;
          line-height: 17px;
          color: #000000;
          font-weight: 600;
          font-size: 14px;
          margin: 0;
        }
      }
      .promotion-desc {
        line-height: 16px;
        color: #666666;
        font-size: 13px;
        margin: 0 0 6.5px;
        em {
          font-style: normal;
          color: #ff397e;
        }
      }
      .coupon-name {
        line-height: 22px;
        color: #ff397e;
        font-size: 13px;
        margin: 0;
      }
      .store-name {
        line-height: 22px;
        color: #666666;
        font-size: 13px;
        margin: 0;
      }
    }
  }
}
.popup-bottom {
  background: #ffffff;
  padding: 7.5px 12px;
  .confirm-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    background: linear-gradient(90deg, #ff3892 14.66%, #ff0048 100%);
    border-radius: 20px;
    line-height: 22.5px;
    color: #ffffff;
    font-weight: 500;
    font-size: 16px;
  }
}
</style>
