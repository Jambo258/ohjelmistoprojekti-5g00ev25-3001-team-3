import supertest from 'supertest'
import app, { pool } from '../app'
import { UserCreationParams } from './service'

const request = supertest(app)

const url = '/api/users'
let token: string
let id: number

beforeAll(async () => {
  await pool.query('BEGIN')
  await pool.query('TRUNCATE TABLE users CASCADE')
  await pool.query('COMMIT')
})

afterAll(() => pool.end())

describe('Users route', () => {
  test('POST /users', async () => {
    const data: UserCreationParams = {
      password: 'testpassword',
      username: 'testusername'
    }
    const { status, body } = await request
      .post(url)
      .set('Accept', 'application/json')
      .send(data)

    expect(status).toBe(201)
    expect(body.username).toEqual('testusername')
    expect(body.password).not.toEqual(data.password)
  })

  test('POST /users, when username exists', async () => {
    const data: UserCreationParams = {
      password: 'testpassword',
      username: 'testusername'
    }
    const { status } = await request
      .post(url)
      .set('Accept', 'application/json')
      .send(data)

    expect(status).toBe(500)
  })

  test('POST /users/auth', async () => {
    const response = await request
      .post(url + '/auth')
      .set('Accept', 'application/json')
      .send({
        password: 'testpassword',
        username: 'testusername'
      })

    expect(response.status).toBe(200)
    expect(response.body.token).toBeTruthy()
    expect(response.body.username).toEqual('testusername')
    expect(response.body.password).toBeUndefined()
    expect(response.body.id).toBeTruthy()
    token = response.body.token
    id = response.body.id
  })

  test('PATCH /users', async () => {
    const data = {
      username: 'newusername',
      password: 'newpassword',
      id,
      role: null
    }

    const { status, body } = await request
      .patch(url)
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .send(data)

    expect(status).toBe(200)
    expect(body.password).toBeUndefined()
    expect(body.username).toEqual(data.username)
    expect(body.role).toEqual('normal')

    // Test login with new stuff
    const response = await request
      .post(url + '/auth')
      .set('Accept', 'application/json')
      .send({
        password: data.password,
        username: data.username
      })

    expect(response.status).toBe(200)
    expect(response.body.token).toBeTruthy()
    expect(response.body.username).toEqual(data.username)
    expect(response.body.password).toBeUndefined()
    expect(response.body.id).toBeTruthy()

    const res = await request
      .post(url + '/auth')
      .set('Accept', 'application/json')
      .send({
        password: 'testpassword',
        username: data.username
      })

    expect(res.status).toBe(401)
  })

  test('GET /users/:id', async () => {
    const { status, body } = await request.get(url + '/' + id)
    expect(status).toBe(200)
    expect(body.id).toBe(id)
    expect(body.password).toBeUndefined()
  })

  test('DELETE /users/:id', async () => {
    const response = await request
      .delete(url + '/' + id)
      .set('Authorization', 'Bearer ' + token)
      .send(undefined)
    expect(response.status).toBe(200)
  })
})
