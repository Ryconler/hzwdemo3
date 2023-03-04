export type ChildCardType = {
  spu: ChildCardSpuType
  skuList: ChildCardSkuType[]
}

export type ChildCardSpuType = {
  cmmdtyImage: string
  content: string
  shareImage: string //分享主图
  spuId: number
  spuName: string
  shareMainTitle: string //分享主标题
}

export type ChildCardSkuType = {
  cityId: number
  frontDisplay: number
  cityName: string
  storeCode: string
  storeName: string
  skuId: number
  skuName: string
  giveAmount: number //赠送币值
  skuLights: string //亮点
  rechargeAmount: number //充值币值
  status: number
  putOnTime: number //上架时间时间戳
  saleEndTime: number //销售结束时间时间戳
  saleStartTime: number //销售开始时间时间戳
  saleNum: number
  availableInventory: number //库存
  price: number //售价单位分
  userLimit: number
  returnCoinNum: number
  returnCouponInfo: string
}

export type ChildCardSkuConsumeType = {
  returnCoinsInfo: {
    returnCoinNum: number
    storeInfo: { storeCode: string; storeName: string }[]
    verifyLimitDate: number
  }
  returnCouponInfo: string
  singleConsumeItems: {
    consumeCoin: string
    projectName: string
    writeOffMoney: number
  }[]
}
