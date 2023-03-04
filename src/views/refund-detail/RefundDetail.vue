<template>
  <div v-if="refundDetail" class="refund-detail">
    <div class="refund-detail-wrap">
      <section class="info">
        <h2 class="section-title pf-medium">退款信息</h2>
        <ul class="table-list">
          <li class="table-item">
            <span class="name">退款单号：</span>
            <div class="value pf-medium">
              {{ refundDetail.id
              }}<span
                :style="{ color: '#ff397e', marginLeft: `${10 / 37.5}rem` }"
                @click="copyClick"
                >复制</span
              >
            </div>
          </li>
          <li class="table-item">
            <span class="name">退款金额：</span>
            <div class="value pf-medium">
              ¥{{ getYenPrice(refundDetail.refundAmount) }}
            </div>
          </li>
          <li class="table-item">
            <span class="name">退款方式：</span>
            <div class="value pf-medium">原路返回</div>
          </li>
        </ul>
      </section>
      <section
        v-if="refundDetail.flowList && refundDetail.flowList.length > 0"
        class="flow"
      >
        <h2 class="section-title pf-medium">退款流程</h2>
        <div class="dividle"></div>
        <VanSteps
          class="flow-steps"
          direction="vertical"
          :active="refundDetail.flowList.length - 1"
        >
          <VanStep
            v-for="item in refundDetail.flowList"
            :key="item.createTime"
            class="flow-step"
          >
            <h3 class="pf-medium">{{ item.statusDesc }}</h3>
            <p>{{ moment(item.createTime).format('YYYY-MM-DD HH:mm') }}</p>
          </VanStep>
        </VanSteps>
      </section>
      <div class="menu_wkBox_back_box"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { copyTextClipboard, getYenPrice, setPage, toLogin } from '@/utils'
import { onMounted, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import { queryRefundDetail } from '@/api/order'
import { RefundOrderType } from '@/types/order'
import { Toast } from 'vant'
import moment from 'moment'

const route = useRoute()

setPage({
  title: '退款详情',
  share: false
})

const orderId = ref(<string>route.query.orderId)
const refundDetail: Ref<RefundOrderType | null> = ref(null)

onMounted(async () => {
  try {
    refundDetail.value = await queryRefundDetail(orderId.value)
  } catch (error: any) {
    console.error(error)
    if (error?.code == '4') {
      return toLogin()
    } else {
      Toast(error?.msg || '网络错误')
    }
  }
})

const copyClick = async () => {
  const res = await copyTextClipboard(String(refundDetail.value?.id))
  if (res) {
    Toast('复制成功')
  } else {
    Toast('复制失败')
  }
}
</script>
<style lang="scss" scoped>
.refund-detail {
  .refund-detail-wrap {
    padding: 10px 12px;
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
          .name {
            flex: none;
            font-size: 13px;
            color: #262626;
            line-height: 16px;
            margin-right: 8px;
          }
          .value {
            flex: 1;
            text-align: left;
            font-size: 13px;
            color: #262626;
            line-height: 16px;
          }
        }
      }
      .dividle {
        height: 1px;
        background: #ededed;
      }
    }
    section.flow {
      .flow-steps {
        margin-top: 16px;
        padding-left: 28px;
        .flow-step {
          padding-top: 0;
          padding-bottom: 16px;
          &::after {
            display: none;
          }
          &:last-child {
            padding-bottom: 0;
          }
          :deep(.van-step__title) {
            h3 {
              font-size: 14px;
              color: #262626;
              line-height: 16px;
              margin-bottom: 6px;
            }
            p {
              font-size: 12px;
              color: #666666;
              line-height: 16px;
            }
          }
          :deep(.van-step__circle-container) {
            left: -24px;
            top: 8px;
            font-size: 8px;
            i {
              border-radius: 50%;
              width: 8px;
              height: 8px;
              background: #ebebeb;
            }
            i.van-step__icon--active {
              background: #ff397e;
              &::before {
                display: none;
              }
            }
          }
          :deep(.van-step__line) {
            left: -24.5px;
            top: 8px;
            background: #ebebeb;
          }
        }
      }
    }
  }
}
</style>
