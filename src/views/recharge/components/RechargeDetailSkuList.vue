<template>
  <ul
    v-if="childCardDetail?.skuList && childCardDetail.skuList.length > 0"
    class="recharge-options"
  >
    <li
      v-for="item in childCardDetail.skuList.slice(
        0,
        childCardDetail.skuList.length <= 6 || skuAllShowed ? undefined : 5
      )"
      :key="item.skuId"
      class="recharge-option"
      :class="item.skuId == activeSkuId && 'active'"
      @click="skuClick(item)"
    >
      <p
        v-if="
          getPromotionTitle(
            item.userLimit,
            item.returnCoinNum,
            item.returnCouponInfo
          )
        "
        class="tag"
        :class="item.userLimit === MEMBER_TYPE.BLACK_GOLD ? 'black-gold' : ''"
      >
        <span>{{
          getPromotionTitle(
            item.userLimit,
            item.returnCoinNum,
            item.returnCouponInfo
          )
        }}</span>
      </p>
      <span class="money pf-simbold">{{ getYenPrice(item.price) }}元</span>
      <span class="coin"
        >到账{{
          item.rechargeAmount / 100 +
          item.giveAmount / 100 +
          item.returnCoinNum / 100
        }}币</span
      >
    </li>
    <li
      v-if="childCardDetail.skuList.length > 6 && !skuAllShowed"
      class="recharge-option more"
      @click="skuAllShowed = true"
    >
      <span>更多</span>
      <span>充值金额</span>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import { MEMBER_TYPE } from '@/constants/childCard'
import { useChildCardStore } from '@/store/childCard'
import { ChildCardSkuType } from '@/types/childCard'
import { getYenPrice } from '@/utils'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const childCardStore = useChildCardStore()
const { childCardDetail, activeSkuId } = storeToRefs(childCardStore)
const skuAllShowed = ref(false)
const getPromotionTitle = (
  type: number,
  returnCoinNum: number,
  returnCouponInfo: any
) => {
  if (type === MEMBER_TYPE.BLACK_GOLD) {
    return '黑金专享'
  } else if (type === MEMBER_TYPE.HZW_NEW_MEMBER) {
    return 'demo新客专享'
  } else if (type === MEMBER_TYPE.CHILD_MEMBER) {
    return '童乐园新客专享'
  } else if (type === MEMBER_TYPE.NORMAL && returnCoinNum > 0) {
    return `到店核销返${returnCoinNum / 100}币`
  } else if (returnCouponInfo) {
    return '充值返券'
  }
  return ''
}
const skuClick = async (sku: ChildCardSkuType) => {
  activeSkuId.value = sku.skuId
  childCardStore.setChildCardDetail()
  childCardStore.setActivedSkuConsumeInfo()
}
</script>
<style lang="scss" scoped>
.recharge-options {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 12px;
  .recharge-option {
    flex: none;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 31.3%;
    height: 66px;
    background: #ffffff;
    margin-right: 3.05%;
    margin-bottom: 12px;
    border: 1px solid #eaeaea;
    border-radius: 6px;
    // @include border(all, #eaeaea, 1px, 6px);
    &:nth-child(3n) {
      margin-right: 0;
    }
    &:nth-last-child(1),
    &:nth-last-child(2),
    &:nth-last-child(3) {
      margin-bottom: 0;
    }
    .tag {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      left: -1px;
      top: -5px;
      padding: 0 6px;
      height: 14px;
      max-width: 100%;
      background-color: #ff397e;
      border-radius: 7px 7px 7px 0;
      z-index: 1;
      span {
        line-height: normal;
        color: #ffffff;
        font-size: 10px;
        @include ellicpsis;
      }
      &.black-gold {
        background: linear-gradient(270deg, #443f3f 0%, #624e4e 100%);
        span {
          color: #fad6b1;
        }
      }
    }
    .money {
      font-size: 16px;
      line-height: 20px;
      margin-bottom: 3px;
      color: #262626;
    }
    .coin {
      line-height: 15px;
      font-size: 12px;
      color: #bababa;
    }
    &.active {
      background: #fff7fb;
      border: 1px solid #ff397e;
      // @include border(all, #ff397e, 1px, 6px);
      .money {
        color: #ff397e;
      }
      .coin {
        color: #ff397e;
      }
    }
    &.more {
      line-height: 20px;
      color: #262626;
      font-size: 14px;
    }
  }
}
</style>
