import { serviceFactory } from '../app'
import {
  Controller,
  Get,
  Path,
  Route,
  Response,
  Request,
  Delete,
  Security,
  SuccessResponse,
  Body,
  Post
} from 'tsoa'
import { IListItemCreationParams, ListService } from './service'
import {
  ValidateErrorJSON,
  ApiErrorType,
  InternalError,
  ApiError
} from '../utils/apiError'
import { Ilist } from './models'
import { jwtObj } from 'src/authentication'

@Route('list')
export class ListController extends Controller {
  private service: ListService
  constructor() {
    super()
    this.service = serviceFactory.listService()
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<InternalError>(500, 'Internal Server error')
  @Get('{userId}')
  public async getList(@Path() userId: number): Promise<Array<Ilist>> {
    return this.service.get({ userId })
  }

  @SuccessResponse('200', 'Success')
  @Response<InternalError>(500, 'Internal Server error')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<ApiErrorType>(401, 'Unauthorized')
  @Security('jwt', ['admin', 'normal'])
  @Delete()
  public async deleteListItem(
    @Request() request: Record<string, unknown> & { user: jwtObj },
    @Body() requestBody: { userId: number; ean: string }
  ): Promise<Ilist> {
    if (
      request.user.role !== 'admin' &&
      requestBody.userId !== request.user.id
    ) {
      throw new ApiError('Unauthorized', 401)
    }
    return await this.service.delete({
      userId: requestBody.userId,
      productId: requestBody.ean
    })
  }

  @SuccessResponse('201', 'Created')
  @Response<InternalError>(500, 'Internal Server error')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<ApiErrorType>(401, 'Unauthorized')
  @Security('jwt', ['admin', 'normal'])
  @Post()
  public async createListItem(
    @Request() request: Record<string, unknown> & { user: jwtObj },
    @Body() requestBody: IListItemCreationParams
  ): Promise<Ilist> {
    if (requestBody.userId !== request.user.id) {
      throw new ApiError('Unauthorized', 401)
    }
    return await this.service.create({
      productId: requestBody.productId,
      userId: requestBody.userId
    })
  }
}
