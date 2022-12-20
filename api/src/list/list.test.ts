import app, { pool } from '../app'
import supertest from 'supertest'

const request = supertest(app)
const url = '/api/list'

let token = ''
let userId: number

beforeAll(async () => {
  // reset tables
  await pool.query('BEGIN')
  await pool.query('TRUNCATE TABLE users CASCADE')
  await pool.query('TRUNCATE TABLE user_products CASCADE')
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
  userId = body.id
})

afterAll(() => pool.end())

describe('list route', () => {
  test('POST /list', async () => {
    const data = {
      productId: '11232131',
      userId
    }

    const { status, body } = await request
      .post(url)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send(data)

    expect(status).toBe(201)
    expect(body.ean).toEqual(data.productId)
  })
  test('POST /list when not logged in', async () => {
    const data = {
      productId: '11232131',
      userId
    }

    const { status } = await request
      .post(url)
      .set('Accept', 'application/json')
      .send(data)

    expect(status).toBe(500)
  })
  test('POST /list with the same ean', async () => {
    const data = {
      productId: '11232131',
      userId
    }

    const { status } = await request
      .post(url)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send(data)

    expect(status).toBe(500)
  })
  test('POST /list with different ean', async () => {
    const data = {
      productId: '112321312',
      userId
    }

    const { status } = await request
      .post(url)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send(data)

    expect(status).toBe(201)
  })
  test('GET /list', async () => {
    const { status, body } = await request.get(url + '/' + userId)

    expect(status).toBe(200)
    expect(body[0].ean).toEqual('11232131')
    expect(body[1].ean).toEqual('112321312')
  })
  test('GET /list/{userId} userId doesnt exist', async () => {
    const { status, body } = await request.get(url + '/' + 1001)

    expect(status).toBe(200)
    expect(body).toEqual([])
  })
  test('DELETE /list', async () => {
    const data = {
      ean: '11232131',
      userId: userId
    }
    const { status } = await request
      .delete(url)
      .set('Authorization', 'Bearer ' + token)
      .send(data)

    const { body } = await request.get(url + '/' + userId)
    expect(status).toBe(200)
    expect(body.length).toBe(1)
    expect(body[0].ean).toEqual('112321312')
  })
  test('DELETE /list item doesnt exists', async () => {
    const data = {
      ean: '11232131',
      userId: userId
    }
    const { status } = await request
      .delete(url)
      .set('Authorization', 'Bearer ' + token)
      .send(data)

    expect(status).toBe(404)
  })
})
