/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface IServiceMethods<T> {
  create: (p: any) => Promise<T | Array<T>>
  get: (p: any) => Promise<T | Array<T>>
  update: (p: any) => Promise<T | Array<T>>
  delete: (p: any) => Promise<T | Array<T>>
}
