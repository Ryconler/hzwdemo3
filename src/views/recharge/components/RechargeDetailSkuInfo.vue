<template>
  <div v-if="activedSku" class="recharge-detail">
    <div class="recharge-detail-title">
      <i></i>
      <h3>充值详情</h3>
      <div class="store-selector" @click="storeClick">
        <span>{{ storeInfo.storeName }}</span>
        <i></i>
      </div>
    </div>
    <div class="coin-detail">
      {{ getYenPrice(activedSku.price) }}元={{
        activedSku.rechargeAmount / 100 +
        activedSku.giveAmount / 100 +
        activedSku.returnCoinNum / 100
      }}币{{
        activedSkuCoinGiftDetail &&
        `（含充值${
          activedSku.rechargeAmount / 100
        }${activedSkuCoinGiftDetail}）`
      }}
    </div>
    <div
      v-if="
        activedSkuConsumeInfo?.singleConsumeItems &&
        activedSkuConsumeInfo.singleConsumeItems.length > 0
      "
      class="consume-info"
    >
      <div class="consume-info-title">
        <p class="title">游玩1次消费币值：</p>
      </div>
      <ul class="consume-items">
        <li
          v-for="(item, index) in activedSkuConsumeInfo.singleConsumeItems"
          :key="index"
          class="consume-item"
        >
          {{ item.projectName }}：{{ item.writeOffMoney }}币<em
            >（约{{ item.consumeCoin }}元/次）</em
          >
        </li>
      </ul>
    </div>
    <div
      v-if="activedSkuReturnCoupons.length > 0 || activedSkuReturnCoins"
      class="promotions"
    >
      <div class="promotion-labels">
        <template v-if="activedSkuReturnCoupons.length > 0">
          <div class="promotion-label">
            <span>充值返券</span>
          </div>
        </template>
        <template v-if="activedSkuReturnCoins">
          <div class="promotion-label">
            <span>核销返币</span>
          </div>
        </template>
      </div>
      <button
        class="promotion-button"
        @click="promotionPopupShow = true"
      ></button>

      <PromotionPopup
        v-model="promotionPopupShow"
        :return-coupons="activedSkuReturnCoupons"
        :return-coins="activedSkuReturnCoins"
      ></PromotionPopup>
    </div>
    <p v-if="activedSku.skuLights" class="desc">
      {{ activedSku.skuLights }}
    </p>
  </div>
</template>
<script lang="ts" setup>
import { useMainStore } from '@/store'
import { useChildCardStore } from '@/store/childCard'
import { getYenPrice } from '@/utils'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mainStore = useMainStore()
const childCardStore = useChildCardStore()
const { cityInfo } = storeToRefs(mainStore)
const {
  storeInfo,
  activedSku,
  activedSkuConsumeInfo,
  activedSkuCoinGiftDetail,
  activedSkuReturnCoupons,
  activedSkuReturnCoins
} = storeToRefs(childCardStore)

const promotionPopupShow = ref(false)

const storeClick = () => {
  router.push({
    name: 'storeList',
    query: {
      citycode: cityInfo.value.cityId,
      cityname: cityInfo.value.cityName
    }
  })
}
</script>
<style lang="scss" scoped>
.recharge-detail {
  padding: 12px;
  border-radius: 10px;
  background: #fff3f7;
  & > *:last-child {
    margin-bottom: 0 !important;
  }
  .recharge-detail-title {
    display: flex;
    align-items: center;
    margin: 0 0 12px;
    i {
      flex: none;
      display: inline-block;
      width: 15px;
      height: 16px;
      background: url(https://hzwimspic-1251601690.image.myqcloud.com/92f90b80-90c7-11ed-9682-3d9e57f0f720_size_60x64)
        0 0/100% 100% no-repeat;
    }
    h3 {
      flex: none;
      display: inline-block;
      line-height: 17px;
      color: #262626;
      font-weight: 600;
      font-size: 14px;
      margin: 0 4px;
    }
    .store-selector {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
      span {
        flex: 1;
        line-height: 15px;
        color: #ff397e;
        font-size: 12px;
        text-align: right;
        @include ellicpsis;
      }
      i {
        flex: none;
        display: block;
        margin-left: 2px;
        width: 10px;
        height: 10px;
        background: url(https://hzwimspic-1251601690.image.myqcloud.com/6bf76690-90cb-11ed-9682-3d9e57f0f720_size_40x40)
          0 0/100% 100% no-repeat;
      }
    }
  }
  .coin-detail {
    line-height: 18px;
    color: #ff397e;
    font-weight: 500;
    font-size: 12px;
    word-break: break-all;
    margin-bottom: 12px;
  }
  .consume-info {
    padding: 12px 12px 10px;
    border-radius: 8px;
    background: #ffffff;
    margin-bottom: 12px;
    .consume-info-title {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .title {
        flex: none;
        line-height: 17px;
        color: #262626;
        font-weight: 500;
        font-size: 13px;
        margin: 0;
      }
    }
    .consume-items {
      margin: 0;
      padding: 0;
      list-style: none;
      .consume-item {
        line-height: 20px;
        color: #262626;
        font-size: 12px;
        margin-bottom: 10px;
        &::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 4px;
          background: url(https://hzwimspic-1251601690.image.myqcloud.com/fa9dd810-90cc-11ed-9682-3d9e57f0f720_size_16x16)
            0 0/100% 100% no-repeat;
          margin-right: 4px;
          vertical-align: 2px;
        }
        &:last-child {
          margin: 0;
        }
        em {
          color: #ff397e;
          font-style: normal;
        }
      }
    }
  }
  .promotions {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    .promotion-labels {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      height: 22px;
      overflow: hidden;
      .promotion-label {
        display: flex;
        align-items: center;
        height: 22px;
        padding: 0 6px;
        background: #ffffff;
        box-sizing: border-box;
        line-height: normal;
        color: #ff397e;
        font-size: 12px;
        margin-right: 6px;
        @include border(all, #ff397e, 1px, 4px);
        span {
          @include ellicpsis;
        }
      }
    }
    .promotion-button {
      flex: none;
      width: 42px;
      height: 20px;
      background: url(https://hzwimspic-1251601690.image.myqcloud.com/2aebdb00-90d4-11ed-91a9-17a5fe58e408_size_168x80)
        0 0/100% 100% no-repeat;
      border: none;
      padding: 0;
    }
  }
  .desc {
    line-height: 18px;
    color: #666666;
    font-size: 12px;
    margin: 0;
    @include ellicpsisN(3);
  }
}
</style>
