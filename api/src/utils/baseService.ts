import { Pool } from 'pg'
import { addProduct } from '../db/queries/reviews/reviews.queries'
export default class BaseService {
  constructor(protected readonly client: Pool) {
    this.client = client
  }
  protected async checkProduct(ean: string): Promise<void> {
    await addProduct.run({ ean }, this.client)
  }
}
