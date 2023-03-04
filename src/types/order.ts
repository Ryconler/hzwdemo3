import { OrderRefundState, OrderState } from '@/constants/order'

export type OrderType = {
  spuName: string
  skuName: string
  commdtyImage: string
  skuPrice: number
  orderPrice: number
  payPrice: number
  giveAmount: number //赠送币值
  rechargeAmount: number //充值币值
  consume: number //消费币值：实时显示当前订单已核销币值
  leftAmount: number //剩余币值：实时显示当前订单剩余币值，点击？显示计算公式“剩余币值=到账币值 - 消费币值”
  orderId: string
  orderState: OrderState
  refundState: OrderRefundState
  refundTime: number //退款完成时间
  orderTime: number //下单时间
  num: number
  returnCoinsInfo?: {
    returnCoinNum: number
    hasReturn: number
    endTime: string
    storeInfo: { storeCode: string; storeName: string }[]
  }
  returnCouponInfo: string
}

export type ConfirmOrderType = {
  skuInfo: {
    skuName: string
    spuName: string
    cmmdtyImage: string
    price: number
    giveAmount: number
    rechargeAmount: number
    returnCoinNum: number
  }
  shareDetail?: { shareCode: string }
  returnCoinsInfo?: {
    verifyLimitDate: number
    returnCoinNum: number
    storeInfo: { storeCode: string; storeName: string }[]
  }
  returnCouponInfo: string
}

export type CreateResultType = {
  orderId: string //订单号
  partnerId: string //接入方 3006
  payOrderId: string //payOrderId
  state: '1' | '2' //当前下单是否需要支付 1 需要 2不需要
}

export type RefundOrderType = {
  id: number
  refundAmount: number
  refundMethod: 1 //退款方式:1原路退回
  refundMethodDesc: string
  flowList: {
    status: OrderRefundState
    statusDesc: string
    createTime: number
  }[]
}
