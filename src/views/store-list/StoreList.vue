<template>
  <div class="store-list">
    <button class="select-button" @click="cityClick">
      {{ cityName }}<i></i>
    </button>
    <ul v-if="storeList.length > 0">
      <li
        v-for="item in storeList"
        :key="item.store_code"
        class="store-item"
        @click="storeClick(item)"
      >
        <img :src="item.photo" alt="" class="store-img" />
        <div class="store-info">
          <h2 class="store-name pf-medium">{{ item.store_name }}</h2>
          <p class="store-address">{{ item.address_street }}</p>
          <span v-if="item.distance" class="store-distance">
            <i></i>{{ getDistanceKm(item.distance) }}km
          </span>
        </div>
      </li>
    </ul>
    <div v-else class="empty">
      <img src="@/assets/images/store-list/icon-empty.png" alt="" />
      <p>当前城市暂无充值商品在售的门店</p>
    </div>
    <div class="menu_wkBox_back_box"></div>
  </div>
</template>
<script lang="ts" setup>
import { queryStoreList } from '@/api/store'
import {
  defaultCity,
  getCityId,
  getCityNameByCityId,
  getDistanceKm,
  getPosition,
  setLoading,
  setPage
} from '@/utils'
import { StoreDetailType, StoreType } from '@/types/store'
import { onMounted, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import queryString from 'query-string'

setLoading(true)
setPage({
  title: '选择门店'
})

const route = useRoute()

const storeList: Ref<StoreDetailType[]> = ref([])

const cityId = ref(<string>route.query.citycode)
const cityName = ref(<string>route.query.cityname)

onMounted(async () => {
  if (cityId.value) {
    cityId.value = getCityId(cityId.value)
    cityName.value = (
      cityName.value || (await getCityNameByCityId(cityId.value))
    ).replace('市', '')
  } else {
    cityId.value = defaultCity.cityId
    cityName.value = defaultCity.cityName
  }
  const position = await getPosition()
  try {
    storeList.value = await queryStoreList(
      cityId.value,
      position?.lng,
      position?.lat
    )
  } catch (error) {
    console.error(error)
  }
  setLoading(false)
})

const cityClick = () => {
  location.href = `https://w.cekid.com/city-list.html?referer=${encodeURIComponent(
    location.href
  )}`
}

const storeClick = (store: StoreType) => {
  const url = queryString.stringifyUrl({
    url: route.query.referer
      ? decodeURIComponent(<string>route.query.referer)
      : '/hzwdemo3/recharge',
    query: {
      cityId: cityId.value,
      cityName: cityName.value,
      storeCode: store.store_code,
      storeName: store.store_name
    }
  })
  location.href = url
}
</script>
<style lang="scss" scoped>
.store-list {
  padding: 20px 12px;
  .select-button {
    display: flex;
    height: 17px;
    font-size: 14px;
    color: #262626;
    align-items: center;
    margin-bottom: 10px;
    i {
      width: 12px;
      height: 12px;
      background: url(@/assets/images/store-list/icon-arrow_down.png) 0 0/100%
        100% no-repeat;
      margin-left: 4px;
    }
  }
  ul {
    li {
      display: flex;
      padding: 12px;
      border-radius: 8px;
      background: #ffffff;
      margin-bottom: 12px;
      .store-img {
        flex: none;
        width: 77px;
        height: 58px;
        border-radius: 4px;
        margin-right: 10px;
      }
      .store-info {
        flex: 1;
        overflow: hidden;
        .store-name {
          color: #262626;
          font-size: 17px;
          margin-bottom: 6px;
          line-height: 21px;
          @include ellicpsis;
        }
        .store-address {
          color: #999999;
          font-size: 12px;
          margin-bottom: 12px;
          line-height: 15px;
          @include ellicpsis;
        }
        .store-distance {
          display: flex;
          justify-content: center;
          align-items: center;
          width: fit-content;
          padding: 0 5px;
          height: 16px;
          border-radius: 8px 8px 0px 8px;
          background: #f6f6f6;
          color: #666666;
          font-size: 10px;
          i {
            flex: none;
            width: 10px;
            height: 10px;
            background: url(@/assets/images/store-list/icon-locate.png) 0 0/100%
              100% no-repeat;
            margin-right: 3px;
          }
        }
      }
    }
  }
  .empty {
    margin: 100px 0;
    img {
      display: block;
      width: 140px;
      height: 140px;
      margin: 0 auto 14px;
    }
    p {
      color: #999999;
      font-size: 14px;
      line-height: 17px;
      text-align: center;
    }
  }
}
</style>
