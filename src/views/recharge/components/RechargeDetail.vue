<template>
  <section
    v-if="childCardDetail?.skuList && childCardDetail.skuList.length > 0"
    class="detail"
  >
    <h2 class="detail-title">
      <i class="purchase-icon"></i>
      <span class="pf-simbold">童玩卡充值</span>
      <div class="share-icon" @click="shareClick">
        <i></i>
        <span>分享</span>
      </div>
    </h2>
    <div class="detail-wrap">
      <RechargeDetailSkuList></RechargeDetailSkuList>
      <RechargeDetailSkuInfo></RechargeDetailSkuInfo>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { useMainStore } from '@/store'
import { useChildCardStore } from '@/store/childCard'
import {
  getHserecomkeyUrl,
  isHzwApp,
  isMiniprogram,
  isRkhy,
  openShareBoard,
  setShare,
  trackClick
} from '@/utils'
import { storeToRefs } from 'pinia'
import RechargeDetailSkuList from './RechargeDetailSkuList.vue'
import RechargeDetailSkuInfo from './RechargeDetailSkuInfo.vue'
import { Toast } from 'vant'
import queryString from 'query-string'
import { queryShareKey } from '@/api/shareKey'

const mainStore = useMainStore()
const childCardStore = useChildCardStore()
const { cityInfo } = storeToRefs(mainStore)
const { storeInfo, childCardDetail, activedSku } = storeToRefs(childCardStore)

const shareClick = async () => {
  const isMini = await isMiniprogram()
  if (!isHzwApp() && !isRkhy() && !isMini) {
    Toast('请在App中打开页面进行分享')
    return
  }
  Toast.loading({
    message: '加载中...',
    forbidClick: false,
    duration: 0
  })
  const linkObj = queryString.parseUrl(location.href)
  const link = queryString.stringifyUrl({
    url: linkObj.url,
    query: {
      cityId: cityInfo.value.cityId,
      storeCode: storeInfo.value.storeCode,
      skuId: activedSku.value?.skuId
    }
  })
  const title =
    (childCardDetail.value?.spu.shareMainTitle ||
      childCardDetail.value?.spu.spuName) +
    ' - ' +
    storeInfo.value.storeName
  const cover =
    childCardDetail.value?.spu.shareImage ||
    childCardDetail.value?.spu.cmmdtyImage
  const remark = JSON.stringify({
    url: encodeURIComponent(location.href),
    contentId: childCardDetail.value?.spu.spuId
  })
  const linkContentId = JSON.stringify({
    spuid: childCardDetail.value?.spu.spuId
  })
  const price = activedSku.value?.price
  const coin = activedSku.value
    ? activedSku.value.rechargeAmount / 100 +
      activedSku.value.giveAmount / 100 +
      activedSku.value.returnCoinNum / 100
    : ''
  const miniData: any = {}
  if (isMini) {
    // 小程序分享信息
    // 小程序环境需要手动查询分享key并拼接
    const shareKey = await queryShareKey({
      linkcontentid: linkContentId,
      linkcontenttitle: title,
      remark
    })
    Object.assign(miniData, {
      title,
      link: getHserecomkeyUrl(link, shareKey), // 分享链接
      imageList: [cover], // 海报里的主图，多规格商品可以传多个图片
      imgUrl: cover, // 分享卡片的图片 5:4
      price, // 价格，单位分，非必传
      tags: coin ? [`到账${coin}币`] : [],
      pageTitle: '分享', // 分享页标题
      backgroundImage: cover
    })
  }
  setShare(
    {
      link,
      channel: '2,3,5,6,7,8',
      userName: 'gh_362b01c44275', // 孩子王小程序
      title,
      desc: storeInfo.value.storeName,
      imgUrl: cover,
      linkid: JSON.stringify({
        spuid: childCardDetail.value?.spu.spuId
      }),
      remark,
      /* 海报 */
      dpH5: 1,
      dpinfoH5: JSON.stringify({
        imageurl: cover, // 海报里的主图，1:1，多规格商品图用逗号分割
        product_name: title,
        price, // 价格，单位分，非必传
        link,
        path: link,
        tags: coin ? [`到账${coin}币`] : []
      }),
      /* 小程序 */
      path: `/pages/mall-index/index?refererH5=${encodeURIComponent(link)}`,
      page: '/pages/mall-index/index',
      scene: `$$ENCODE(${encodeURIComponent(link)})`
    },
    miniData
  )
  openShareBoard()
  Toast.clear()
  trackClick({
    bizType: '127',
    pageLevelId: '121013556',
    clickId: '200001',
    positionParam: { storecode: storeInfo.value.storeCode }
  })
}
</script>
<style lang="scss" scoped>
section.detail {
  margin: 0 12px 12px;
  .detail-title {
    display: flex;
    align-items: center;
    height: 45px;
    padding: 0 17px 0 12px;
    background: url(@/assets/images/recharge/bg-section1.png) 0 0/100% 45px
      no-repeat;
    .purchase-icon {
      flex: none;
      width: 22px;
      height: 22px;
      background: url(@/assets/images/recharge/icon-recharge.png) 0 0/100% 100%
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
    .share-icon {
      flex: none;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      i {
        width: 20px;
        height: 20px;
        background: url(@/assets/images/recharge/icon-share.png) 0 0/100% 100%
          no-repeat;
        margin-bottom: 2px;
      }
      span {
        color: #999999;
        font-size: 9px;
        line-height: 11px;
      }
    }
  }
  .detail-wrap {
    background: #ffffff;
    overflow: hidden;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    padding: 12px;
  }
}
</style>
