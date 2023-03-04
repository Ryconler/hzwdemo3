export enum OrderState {
  WaitPay = 10, //待支付
  Payed = 20, //已支付
  WaitEvaluate = 30, //待评价(已核销)
  Completed = 40, //已完成
  Canceled = 50 //已取消
}

export enum OrderRefundState {
  WaitApply = 10, //未申请退款
  Applying = 20, //退款中(已申请退款)
  Succeed = 30, //退款完成
  Failed = 40 //退款失败
}
