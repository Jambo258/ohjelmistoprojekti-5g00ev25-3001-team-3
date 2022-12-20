import BaseService from '../utils/baseService'
import { IReview } from './models'
import * as query from '../db/queries/reviews/reviews.queries'
import { ApiError } from '../utils/apiError'
import IServiceMethods from '../utils/serviceMethods'

export type TReviewCreationParams = Pick<IReview, 'body' | 'rating'> & {
  userId: number
  productId: string
}

export class ReviewService
  extends BaseService
  implements IServiceMethods<IReview>
{
  public async create(reviewParams: TReviewCreationParams): Promise<IReview> {
    await this.checkProduct(reviewParams.productId)
    const newReview = await query.addReview.run(
      {
        body: reviewParams.body,
        product_id: reviewParams.productId,
        user_id: reviewParams.userId,
        rating: reviewParams.rating
      },
      this.client
    )
    const result = newReview[0]
    if (!result || result.username === null) {
      throw new ApiError('Internal Server Error', 500)
    }
    return {
      body: result.body,
      productId: result.product_id,
      rating: result.rating,
      userId: result.user_id,
      username: result.username
    }
  }

  public async delete({
    product_id,
    user_id
  }: {
    product_id: string
    user_id: number
  }): Promise<IReview> {
    const response = await query.deleteReview.run(
      { product_id, user_id },
      this.client
    )
    const review = response[0]
    if (!review || review.username === null) {
      throw new ApiError('Not found', 404)
    }
    return {
      body: review.body,
      productId: review.product_id,
      rating: review.rating,
      userId: review.user_id,
      username: review.username
    }
  }

  public async get(ean: string): Promise<Array<IReview>> {
    const response = await query.getReviews.run(
      { product_id: ean },
      this.client
    )
    return response.map((el) => ({
      userId: el.user_id,
      productId: el.product_id,
      rating: el.rating,
      body: el.body,
      username: el.username
    }))
  }
  public async update(): Promise<IReview> {
    throw new Error('Not Implemented')
  }
}
