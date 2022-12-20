import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { User } from './models'
import * as query from '../db/queries/users/users.queries'
import { ApiError } from '../utils/apiError'
import BaseService from '../utils/baseService'
import IServiceMethods from '../utils/serviceMethods'

export type UserCreationParams = Pick<User, 'username'> & { password: string }

export class UsersService extends BaseService implements IServiceMethods<User> {
  public async create(userCreationParams: UserCreationParams): Promise<User> {
    const newUser = await query.addUser.run(
      { user: userCreationParams },
      this.client
    )
    if (!newUser[0]) {
      throw new ApiError('Internal Server Error', 500)
    }
    return newUser[0]
  }

  public async get(id: number): Promise<User> {
    const user = await query.getUser.run({ id }, this.client)
    if (!user[0]) {
      throw new ApiError(
        'Not found',
        404,
        'No user with id: ' + id + ' was found'
      )
    }
    return user[0]
  }

  public async update(
    userUpdateParams: query.IUpdateUserParams
  ): Promise<User> {
    const user = await query.updateUser.run(userUpdateParams, this.client)
    if (!user[0]) {
      throw new ApiError('Internal Server Error', 500)
    }
    return user[0]
  }

  public async getAll(): Promise<Array<User>> {
    return await query.getAllUsers.run(void 0, this.client)
  }

  public async getAuthInfo(
    username: string
  ): Promise<User & { password: string }> {
    const user = await query.getUserAuthInfo.run({ username }, this.client)
    if (!user[0]) {
      throw new ApiError('Unauthorized', 401)
    }
    return user[0]
  }

  public async delete(id: query.IDeleteUserParams): Promise<User> {
    const user = await query.deleteUser.run(id, this.client)
    if (!user[0]) {
      console.log('no return')
      throw new ApiError('Internal Server Error', 500)
    }
    return user[0]
  }

  public async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 12)
    } catch (error) {
      throw new ApiError('Internal Server Error', 500)
    }
  }

  public async jwtCreation({
    id,
    username,
    role
  }: Pick<User, 'id' | 'role' | 'username'>): Promise<string> {
    try {
      const token = jwt.sign(
        {
          id,
          username,
          role
        },
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.JWT_SECRET!,
        { expiresIn: '8h' }
      )
      return token
    } catch {
      throw new ApiError('Internal Server Error', 500)
    }
  }

  public async compareHashes(
    password: string,
    hashed: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashed)
    } catch (error) {
      throw new ApiError('Internal Server Error', 500)
    }
  }
}
