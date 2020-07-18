interface ApiReturnData<T> {
  readonly success: boolean,
  readonly message?: string,
  readonly data?: T
}
