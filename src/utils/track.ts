type TrackParmsType = {
  bizType: string
  pageLevelId: string
  clickId?: string
  logType?: string
  pageParam?: any
  positionId?: string
  positionParam?: any
}

/* 上报事件/页面埋点 */
export const trackClick = (options: TrackParmsType) => {
  const {
    bizType,
    pageLevelId,
    clickId,
    positionId,
    logType = '20000'
  } = options
  let { pageParam, positionParam } = options
  pageParam = pageParam ? JSON.stringify(pageParam) : undefined
  positionParam = positionParam ? JSON.stringify(positionParam) : undefined
  try {
    const params = {
      bizType, // 业务类型
      pageLevelId, // 页面 ID
      clickId, // 事件编码
      logType, // 上报类型: '10000'页面、'20000'事件
      pageParam, // 页面参数
      positionId, // 坑位编码
      positionParam // 坑位内容参数
    }
    console.log(params)
    window.track && window.track._launch(params)
  } catch (e) {
    console.error(e)
  }
}

/* 上报页面埋点 */
export const trackView = (options: TrackParmsType) => {
  const { bizType, pageLevelId, positionId, pageParam, positionParam } = options
  const params = {
    bizType,
    pageLevelId,
    logType: '10000',
    pageParam,
    positionId,
    positionParam
  }
  trackClick(params)
}
