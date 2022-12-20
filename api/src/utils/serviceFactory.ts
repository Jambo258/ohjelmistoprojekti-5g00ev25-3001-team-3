import { Pool } from 'pg'
import { ListService } from '../list/service'
import { ReviewService } from '../reviews/service'
import { UsersService } from '../users/service'

export default class ServiceFactory {
  public constructor(private readonly client: Pool) {
    this.client = client
  }

  public userService() {
    return new UsersService(this.client)
  }

  public reviewService() {
    return new ReviewService(this.client)
  }

  public listService() {
    return new ListService(this.client)
  }
}
