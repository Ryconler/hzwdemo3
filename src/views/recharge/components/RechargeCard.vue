<template>
  <div class="card">
    <h1 class="card-title pf-simbold">
      {{ childCardDetail?.spu.spuName }}
    </h1>
    <div class="account-text">充值账号</div>
    <div class="account-number pf-simbold">
      {{ maskTel(userInfo?.mobile) }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useMainStore } from '@/store'
import { useChildCardStore } from '@/store/childCard'
import { maskTel } from '@/utils'
import { storeToRefs } from 'pinia'

const mainStore = useMainStore()
const childCardStore = useChildCardStore()
const { userInfo } = storeToRefs(mainStore)
const { childCardDetail } = storeToRefs(childCardStore)
</script>
<style lang="scss" scoped>
.card {
  height: 178px;
  background: url(@/assets/images/recharge/bg-card.png) 0 0/100% 100% no-repeat;
  padding: 0 20px;
  margin: 0 16px 15.5px;
  overflow: hidden;
  .card-title {
    margin-top: 30px;
    color: #ffffff;
    font-size: 22px;
    line-height: 25px;
    @include ellicpsis;
  }
  .account-text {
    margin-top: 21px;
    color: #ffdbdb;
    font-size: 14px;
    line-height: 20px;
  }
  .account-number {
    margin-top: 2px;
    color: #ffffff;
    font-size: 16px;
    line-height: 22.5px;
  }
}
</style>
