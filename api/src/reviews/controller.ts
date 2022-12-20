import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Response,
  Security,
  Request,
  Delete,
  Get,
  Path
} from 'tsoa'

import { serviceFactory } from '../app'
import {
  ApiError,
  ApiErrorType,
  InternalError,
  ValidateErrorJSON
} from '../utils/apiError'
import { IReview } from './models'
import { jwtObj } from '../authentication'
import { ReviewService, TReviewCreationParams } from './service'

@Route('reviews')
export class ReviewController extends Controller {
  private service: ReviewService
  constructor() {
    super()
    this.service = serviceFactory.reviewService()
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<InternalError>(500, 'Internal Server error')
  @Response<ApiErrorType>(401, 'Unauthorized')
  @SuccessResponse('201', 'Created')
  @Security('jwt', ['admin', 'normal'])
  @Post()
  public async createReview(
    @Body() requestBody: Omit<TReviewCreationParams, 'userId'>,
    @Request() request: Record<string, unknown> & { user: jwtObj }
  ): Promise<IReview> {
    return await this.service.create(
      Object.assign(requestBody, { userId: request.user.id })
    )
  }

  @SuccessResponse('200', 'Success')
  @Response<InternalError>(500, 'Internal Server error')
  @Response<ApiErrorType>(401, 'Unauthorized')
  @Response<ApiErrorType>(404, 'Not Found')
  @Security('jwt', ['admin', 'normal'])
  @Delete()
  public async deleteReview(
    @Body() requestBody: Pick<IReview, 'productId' | 'userId'>,
    @Request() request: Record<string, unknown> & { user: jwtObj }
  ): Promise<IReview> {
    if (
      request.user.id !== requestBody.userId &&
      request.user.role !== 'admin'
    ) {
      throw new ApiError('Unauthorized', 401)
    }
    return await this.service.delete({
      product_id: requestBody.productId,
      user_id: requestBody.userId
    })
  }

  @SuccessResponse('200', 'Success')
  @Response<InternalError>(500, 'Internal Server error')
  @Get('{ean}')
  public async getReviews(@Path() ean: string): Promise<Array<IReview>> {
    return await this.service.get(ean)
  }
}
