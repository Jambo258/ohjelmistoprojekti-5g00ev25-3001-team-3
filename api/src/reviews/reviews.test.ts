// Reviews integration tests
import { deleteReview } from '../db/queries/reviews/reviews.queries'
import supertest from 'supertest'
import app, { pool } from '../app'
import { TReviewCreationParams } from './service'

const request = supertest(app)

const url = '/api/reviews'
let token = ''
let username = ''
let userId: number
const testBody = 'testbody text'
const testProductId = '123123123'
const testRating = '3'

beforeAll(async () => {
  // reset tables
  await pool.query('BEGIN')
  await pool.query('TRUNCATE TABLE users CASCADE')
  await pool.query('TRUNCATE TABLE products_review CASCADE')
  await pool.query('COMMIT')
  // create user
  const data = {
    password: 'testpassword',
    username: 'testusername'
  }
  const { body } = await request
    .post('/api/users')
    .set('Accept', 'application/json')
    .send(data)

  token = body.token
  username = body.username
  userId = body.id
})

afterAll(() => pool.end())

describe('reviews route', () => {
  test('POST /reviews', async () => {
    const data: Omit<TReviewCreationParams, 'userId'> = {
      body: testBody,
      productId: testProductId,
      rating: testRating
    }

    const { status, body } = await request
      .post(url)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send(data)

    expect(status).toBe(201)
    expect(body.rating).toEqual(data.rating)
    expect(body.productId).toEqual(data.productId)
    expect(body.userId).toEqual(userId)
    expect(body.body).toEqual(data.body)
    expect(body.username).toEqual(username)
  })
  test('POST /reviews when user has already a review for the product', async () => {
    const data: Omit<TReviewCreationParams, 'userId'> = {
      body: testBody,
      productId: testProductId,
      rating: testRating
    }

    const { status } = await request
      .post(url)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send(data)

    expect(status).toBe(500)
  })
  test('GET /reviews/{ean}', async () => {
    // Create another acc & review
    const data = {
      password: 'testpassword1',
      username: 'testusername1'
    }
    const { body } = await request
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(data)

    const reviewData: Omit<TReviewCreationParams, 'userId'> = {
      body: testBody + ' new',
      productId: testProductId,
      rating: '5'
    }

    await request
      .post(url)
      .set('Authorization', 'Bearer ' + body.token)
      .set('Accept', 'application/json')
      .send(reviewData)

    const response = await request.get(url + '/' + testProductId)
    expect(response.status).toEqual(200)
    expect(response.body[0].userId).toEqual(userId)
    expect(response.body[1].userId).toEqual(body.id)
  })
  test('DELETE /reviews', async () => {
    const data = {
      userId,
      productId: testProductId
    }

    const { status, body } = await request
      .delete(url)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send(data)

    expect(status).toBe(200)
    expect(body.rating).toEqual(testRating)
    expect(body.productId).toEqual(data.productId)
    expect(body.userId).toEqual(userId)
    expect(body.body).toEqual(testBody)
    expect(body.username).toEqual(username)

    expect(
      await deleteReview.run(
        { product_id: body.product_id, user_id: body.user_id },
        pool
      )
    ).toEqual([])
  })
})
