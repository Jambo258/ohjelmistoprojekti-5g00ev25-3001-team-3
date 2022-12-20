import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
  Response,
  Delete,
  Security,
  Request,
  Patch
} from 'tsoa'

import { serviceFactory } from '../app'
import {
  ApiError,
  ApiErrorType,
  InternalError,
  ValidateErrorJSON
} from '../utils/apiError'
import { User } from '../users/models'
import { UsersService, UserCreationParams } from '../users/service'
import { jwtObj } from '../authentication'
import { IUpdateUserParams } from '../db/queries/users/users.queries'

@Route('users')
export class UsersController extends Controller {
  private service: UsersService
  constructor() {
    super()
    this.service = serviceFactory.userService()
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<ApiErrorType>(404, 'Not Found')
  @Get('{userId}')
  public async getUser(@Path() userId: number): Promise<User> {
    return this.service.get(userId)
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<InternalError>(500, 'Internal Server error')
  @SuccessResponse('201', 'Created')
  @Post()
  public async createUser(
    @Body() requestBody: UserCreationParams
  ): Promise<User & { token: string }> {
    const hashedPassword = await this.service.hashPassword(requestBody.password)
    const user = await this.service.create({
      username: requestBody.username,
      password: hashedPassword
    })
    const token = await this.service.jwtCreation({
      id: user.id,
      username: user.username,
      role: user.role
    })
    return Object.assign(user, { token })
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<InternalError>(500, 'Internal Server error')
  @Response<ApiErrorType>(401, 'Unauthorized')
  @SuccessResponse('200', 'Success')
  @Post('auth')
  public async loginUser(
    @Body() requestBody: { username: string; password: string }
  ): Promise<User & { token: string }> {
    const { password, ...user } = await this.service.getAuthInfo(
      requestBody.username
    )
    if (!(await this.service.compareHashes(requestBody.password, password))) {
      throw new ApiError('Unauthorized', 401)
    }
    const token = await this.service.jwtCreation({
      id: user.id,
      username: user.username,
      role: user.role
    })
    return Object.assign(user, { token })
  }

  @SuccessResponse('200', 'Success')
  @Response<InternalError>(500, 'Internal Server error')
  @Response<ApiErrorType>(401, 'Unauthorized')
  @Security('jwt', ['admin', 'normal'])
  @Delete('{userId}')
  public async deleteUser(
    @Route() userId: number,
    @Request() request: Record<string, unknown> & { user: jwtObj }
  ): Promise<User> {
    if (request.user.role !== 'admin' && request.user.id !== userId) {
      throw new ApiError('Unauthorized', 401)
    }
    return await this.service.delete({ id: userId })
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<InternalError>(500, 'Internal Server error')
  @SuccessResponse('200', 'Success')
  @Get()
  public async getAllUsers() {
    return await this.service.getAll()
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<InternalError>(500, 'Internal Server error')
  @Response<ApiErrorType>(401, 'Unauthorized')
  @SuccessResponse('200', 'Success')
  @Security('jwt', ['admin', 'normal'])
  @Patch()
  public async updateUser(
    @Body() updateParams: IUpdateUserParams,
    @Request() request: Record<string, unknown> & { user: jwtObj }
  ) {
    if (request.user.role !== 'admin' && request.user.id !== updateParams.id) {
      throw new ApiError('Unauthorized', 401)
    }

    if (
      updateParams.role &&
      updateParams.role !== request.role &&
      request.role !== 'admin'
    ) {
      throw new ApiError('Unauthorized', 401)
    }

    if (updateParams.password) {
      return await this.service.update({
        ...updateParams,
        password: await this.service.hashPassword(updateParams.password)
      })
    } else {
      return await this.service.update(updateParams)
    }
  }
}
