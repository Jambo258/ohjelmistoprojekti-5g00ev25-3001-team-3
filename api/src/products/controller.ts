import { Controller, Get, Route, SuccessResponse, Response } from 'tsoa'

import { InternalError, ValidateErrorJSON } from '../utils/apiError'
import { scraperClient } from '../app'

@Route('products')
export class ProductsController extends Controller {
  constructor() {
    super()
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<InternalError>(500, 'Internal Server error')
  @SuccessResponse('200', 'Success')
  @Get('search/{query}')
  public async searchProducts(@Route() query: string) {
    return { products: await scraperClient.searchItems(query) }
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<InternalError>(500, 'Internal Server error')
  @SuccessResponse('200', 'Success')
  @Get('details/{query}')
  public async getProductDetails(@Route() query: string) {
    return { products: await scraperClient.getDetails(query) }
  }
}
