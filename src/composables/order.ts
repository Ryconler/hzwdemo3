import { OrderRefundState, OrderState } from '@/constants/order'
import { CreateResultType, OrderType } from '@/types/order'
import { cookies } from '@/utils'
import iconWaitPay from '@/assets/images/order-detail/icon-wait_pay.png'
import iconApplying from '@/assets/images/order-detail/icon-applying.png'
import iconSucceed from '@/assets/images/order-detail/icon-succeed.png'
import iconPayed from '@/assets/images/order-detail/icon-payed.png'
import iconCanceled from '@/assets/images/order-detail/icon-canceled.png'

/* 获取订单状态图标与文字 */
export function getOrderStatus(order: OrderType) {
  switch (order.refundState) {
    case OrderRefundState.Applying:
      return {
        icon: iconApplying,
        text: '退款中'
      }
    case OrderRefundState.Succeed:
      return {
        icon: iconSucceed,
        text: '已退款'
      }
  }
  switch (order.orderState) {
    case OrderState.WaitPay:
      return {
        icon: iconWaitPay,
        text: '待支付'
      }
    case OrderState.Payed:
      return {
        icon: iconPayed,
        text: '已充值'
      }
    case OrderState.WaitEvaluate:
      return {
        icon: iconPayed,
        text: '待评价'
      }
    case OrderState.Completed:
      return {
        icon: iconPayed,
        text: '已完成'
      }
    case OrderState.Canceled:
      return {
        icon: iconCanceled,
        text: '已取消'
      }
  }
  return {}
}

/* 跳转收银台支付 */
export function jumpToCashier(order: CreateResultType) {
  const orderId = order.orderId
  if (order.state == '2') {
    //无需支付
    location.href = `/hzwdemo3/pay-success?orderId=${orderId}`
  } else if (orderId) {
    const partnerid = order.partnerId
    const uid = cookies.get('uid')
    const skey = cookies.get('skey')
    location.href = `//cashier.cekid.com/query/${orderId}?cmd=khzwcashier&dealcode=${orderId}&partnerid=${partnerid}&platformid=${1}&uid=${uid}&skey=${skey}`
  }
}
