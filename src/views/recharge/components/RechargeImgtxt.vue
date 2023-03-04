<template>
  <section v-if="childCardDetail?.spu?.content" class="notice">
    <h2 class="notice-title">
      <i class="notice-icon"></i>
      <span class="pf-simbold">购买须知</span>
    </h2>
    <div class="notice-wrap">
      <div class="notice-content" v-html="childCardDetail.spu.content"></div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { useChildCardStore } from '@/store/childCard'
import { storeToRefs } from 'pinia'

const childCardStore = useChildCardStore()
const { childCardDetail } = storeToRefs(childCardStore)
</script>
<style lang="scss" scoped>
section.notice {
  margin: 0 12px;
  .notice-title {
    display: flex;
    align-items: center;
    height: 45px;
    padding: 0 10px 0 12px;
    background: url(@/assets/images/recharge/bg-section2.png) 0 0/100% 45px
      no-repeat;
    > .notice-icon {
      flex: none;
      width: 22px;
      height: 22px;
      background: url(@/assets/images/recharge/icon-notice.png) 0 0/100% 100%
        no-repeat;
      margin-right: 4px;
    }
    > span {
      flex: 1;
      line-height: 22.5px;
      color: #262626;
      font-size: 16px;
      @include ellicpsis;
    }
  }
  .notice-wrap {
    background: #ffffff;
    overflow: hidden;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    .notice-content {
      margin: 0 10px 10px;
      word-break: break-word;
      word-wrap: break-word;
    }
  }
}
</style>
