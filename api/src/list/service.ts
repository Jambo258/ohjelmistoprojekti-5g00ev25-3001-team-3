import IServiceMethods from '../utils/serviceMethods'
import BaseService from '../utils/baseService'
import { Ilist } from './models'
import * as query from '../db/queries/list/list.queries'
import { ApiError } from '../utils/apiError'

export interface IListItemCreationParams {
  productId: string
  userId: number
}

export class ListService extends BaseService implements IServiceMethods<Ilist> {
  public async create(p: IListItemCreationParams): Promise<Ilist> {
    await this.checkProduct(p.productId)
    const response = await query.addListItem.run(
      { user_id: p.userId, product_id: p.productId },
      this.client
    )
    return { ean: response[0].product_id }
  }

  public async get(
    p: Pick<IListItemCreationParams, 'userId'>
  ): Promise<Array<Ilist>> {
    const response = await query.getList.run({ user_id: p.userId }, this.client)
    if (response.length === 0) {
      return []
    }
    return response.map((el) => ({ ean: el.product_id }))
  }

  // List item is only an ean and does not currently have any other information.
  public async update(): Promise<Ilist> {
    throw new Error('Not Implemented')
  }

  public async delete(p: IListItemCreationParams): Promise<Ilist> {
    const response = await query.deleteListItem.run(
      { user_id: p.userId, product_id: p.productId },
      this.client
    )
    if (!response[0]) {
      throw new ApiError('Not found', 404)
    }
    return { ean: response[0].product_id }
  }
}
