<template>
  <div class="product-card">
    <div class="store-info">
      <div class="store-cate">
        <div class="store-icon"><i></i></div>
        <span class="pf-medium">自营</span>
      </div>
      <div class="store-title pf-simbold">demo自营</div>
    </div>
    <div class="product-info">
      <ImgHzw
        class="product-image"
        :src="product.cmmdtyImage"
        :width="93"
        :height="70"
      ></ImgHzw>
      <div class="product-detail">
        <h1 class="product-name pf-medium">{{ product.skuName }}</h1>
        <h2 class="product-price pf-simbold">
          ¥{{ getYenPrice(product.price) }}
        </h2>
        <p class="product-desc">
          {{ getYenPrice(product.price) }}元={{
            product.rechargeAmount / 100 +
            product.giveAmount / 100 +
            product.returnCoinNum / 100
          }}币<template v-if="product.giveAmount || product.returnCoinNum"
            >（含充值{{ product.rechargeAmount / 100
            }}{{ product.giveAmount ? '+赠送' + product.giveAmount / 100 : ''
            }}{{
              product.returnCoinNum
                ? '+核销返' + product.returnCoinNum / 100
                : ''
            }}）
          </template>
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getYenPrice } from '@/utils'
import { PropType } from 'vue'

type ProductType = {
  cmmdtyImage: string
  skuName: string
  price: number
  giveAmount: number //赠送币值
  rechargeAmount: number //充值币值
  returnCoinNum: number
}

defineProps({
  product: {
    type: Object as PropType<ProductType>,
    default() {
      return {}
    }
  },
  showReturnCoinNum: {
    type: Boolean,
    default: false
  }
})
</script>
<style lang="scss" scoped>
.product-card {
  border-radius: 8px;
  padding: 0 12px;
  background: #ffffff;
  overflow: hidden;
  .store-info {
    display: flex;
    align-items: center;
    padding: 20px 0 10px;
    height: 16px;
    box-sizing: content-box;
    .store-cate {
      flex: none;
      display: flex;
      align-items: center;
      width: 43px;
      height: 14px;
      overflow: hidden;
      background: url(@/assets/images/order-confirm/bg-store_cate.png) 0 0/100%
        100% no-repeat;
      margin-right: 5px;
      .store-icon {
        flex: none;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 17.5px;
        height: 14px;
        background: url(@/assets/images/order-confirm/bg-store_icon.png) 0 0/100%
          100% no-repeat;
        margin-right: 1.5px;
        i {
          width: 11px;
          height: 11px;
          background: url(@/assets/images/order-confirm/icon-store.png) 0 0/100%
            100% no-repeat;
          margin-left: 1px;
        }
      }
      > span {
        flex: 1;
        color: #ff397e;
        line-height: 12px;
        font-size: 12px;
        transform: scale(0.833); //原字号10px，兼容安卓字体<12px显示问题
        transform-origin: left center;
        white-space: nowrap;
      }
    }
    .store-title {
      flex: 1;
      color: #262626;
      line-height: 16px;
      font-size: 13px;
      @include ellicpsis;
    }
  }
  .product-info {
    display: flex;
    padding: 10px 0;
    margin-bottom: 10px;
    .product-image {
      flex: none;
      border-radius: 4px;
      margin-right: 10px;
      overflow: hidden;
    }
    .product-detail {
      flex: 1;
      overflow: hidden;
      .product-name {
        font-size: 14px;
        color: #121212;
        line-height: 17px;
        min-height: 34px;
      }
      .product-price {
        font-size: 15px;
        color: #262626;
        line-height: 17px;
        margin-bottom: 5px;
      }
      .product-desc {
        font-size: 11px;
        color: #262626;
        line-height: 14px;
      }
    }
  }
}
</style>
