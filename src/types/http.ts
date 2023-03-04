export type ResultType<T> = Partial<{
  data: T
  content: T
  code: string
  msg: string
  errno: number
  errmsg: string
}>
