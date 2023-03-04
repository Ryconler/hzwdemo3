import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteRecordRaw
} from 'vue-router'
import { setLoading } from '@/utils'
import { useMainStore } from '@/store/index'

const routes: Array<RouteRecordRaw> = [
  // 充值
  {
    path: '/recharge',
    alias: '/',
    name: 'recharge',
    component: () => import('@/views/recharge/Recharge.vue'),
    meta: { keepAliveName: 'Recharge' }
  },
  // 门店列表
  {
    path: '/store-list',
    name: 'storeList',
    component: () => import('@/views/store-list/StoreList.vue')
  },
  // 订单确认
  {
    path: '/order-confirm',
    name: 'orderConfirm',
    component: () => import('@/views/order-confirm/OrderConfirm.vue')
  },
  // 订单详情
  {
    path: '/order-detail/:orderId',
    name: 'orderDetail',
    component: () => import('@/views/order-detail/OrderDetail.vue')
  },
  // 退款详情
  {
    path: '/refund-detail',
    name: 'refundDetail',
    component: () => import('@/views/refund-detail/RefundDetail.vue')
  },
  // 支付成功
  {
    path: '/pay-success',
    name: 'paySuccess',
    component: () => import('@/views/pay-success/PaySuccess.vue')
  },
  // 支付失败
  {
    path: '/pay-fail',
    name: 'payFail',
    component: () => import('@/views/pay-fail/PayFail.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/Test.vue'),
    meta: { keepAliveName: 'Test' }
  }
]

const scrollBehavior = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded,
  savedPosition: any
) => {
  if (!from.name) {
    // 没有来源路由，刷新页面
    // 为防止数据没有加载但是吸顶已经上去了，不返回原先的滚动条位置
    return {
      left: 0,
      top: 0
    }
  }
  if (savedPosition) {
    return savedPosition
  } else {
    if (to.hash) {
      return {
        el: to.hash
      }
    }
  }
}

const router = createRouter({
  history: createWebHistory('hzwdemo3'),
  scrollBehavior,
  routes
})

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    if (Object.keys(to.query).indexOf('_debug') > -1 || import.meta.env.DEV) {
      import('vconsole').then(v => {
        new v.default()
      })
    }
    const mainStore = useMainStore()
    mainStore.$route = to
    const keepAliveName = <string>to.meta.keepAliveName
    if (
      keepAliveName &&
      mainStore.keepAliveRoutes.indexOf(keepAliveName) === -1
    ) {
      mainStore.keepAliveRoutes.push(keepAliveName)
    }
    setLoading()
    next()
  }
)

router.afterEach(() => {
  setLoading(false)
})

export default router
