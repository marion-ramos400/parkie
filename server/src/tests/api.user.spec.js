import { describe, 
  test, 
  it, 
  expect, 
  vi,
  afterEach,
  beforeEach,
  beforeAll,
  afterAll,
  } from 'vitest'
import mongoose from 'mongoose'
import axios from 'axios'
import { MONGODB_URI, DB_NAME, BACKEND_URL } from '../env.js'
import { User } from '../models/user.models.js'
import { createUser } from '../controllers/user.controller.js'
import { hashPassword } from '../middleware/hashpassword.js'
import { connectDB } from '../db/utils.js'
import { 
  mockRequest, 
  mockResponse, 
  mockNext } from './mockReqRes.js'

const payload = {
  createNonAdmin: {
    email: 'useruser@gmail.com',
    password: '1234',
    organization: 'Babadoo Inc'
  },
  createAdmin: {
    email: 'userAdmin@gmail.com',
    password: '1234',
    organization: 'Babadoo Inc',
    isAdmin: true
  },
  nonExistentUser: {
    email: 'nonexistent@pmail.com',
    password: 'yi(012)123p**'
  }
}

const deleteTestUsers = async () => {
  await connectDB()
  await User.deleteOne({ email: payload.createNonAdmin.email })
  await User.deleteOne({ email: payload.createAdmin.email })
}

describe('calls /users/create endpoint', () => {
  afterEach(async () => {
    await deleteTestUsers()
  })
  it('creates non admin user through api', async () => {
    let data;
    let status;
    await axios.post(
      BACKEND_URL + '/users/create',
      payload.createNonAdmin
      )
      .then(res => {
        data = res.data
        status = res.status
      })
      .catch(err => {
        console.error(err.message)
      })
      .finally(() => {
        expect(status).toBe(201)
        expect(data).toHaveProperty('user')
      })
  })
})

describe('calls /users/login endpoint', async () => {
  let mreq;
  let mres;
  const ENDPOINT = BACKEND_URL + '/users/login'
  beforeEach(async () => {
    await connectDB()
    const pCopy = JSON.parse(
      JSON.stringify(payload.createNonAdmin)
    )
    mreq = mockRequest({}, pCopy)
    mres = mockResponse()
    await hashPassword(mreq, mres, mockNext)
    await createUser(mreq, mres)
  })
  afterEach(async () => {
    await deleteTestUsers()
    vi.clearAllMocks()
  })

  it('logs in user through api', async () => {
    let data;
    let status;
    await axios.post(
        ENDPOINT,
        payload.createNonAdmin
      ) 
      .then(res => {
        data = res.data
        status = res.status
      })
      .catch(err => {
        console.error(err.message)
      })
      .finally(() => {
        expect(status).toBe(200)
        expect(data).toHaveProperty('token')
      })
  })

  it('sends back 404 for user does not exist', async () => {
    let data;
    let status;
    await axios.post(
        ENDPOINT,
        payload.nonExistentUser
      ) 
      .then(res => {
        data = res.data
        status = res.status
      })
      .catch(err => {
        console.error(err.message)
        data = err.response.data
        status = err.response.status
      })
      .finally(() => {
        expect(status).toBe(404)
        expect(data.msg).toContain('does not exist')
      })
  })

  it('sends back 400 for empty login credentials', async () => {
    let data;
    let status;
    await axios.post(
        ENDPOINT,
        { email: '', password: ''}
      ) 
      .then(res => {
        data = res.data
        status = res.status
      })
      .catch(err => {
        console.error(err.message)
        data = err.response.data
        status = err.response.status
      })
      .finally(() => {
        expect(status).toBe(400)
        expect(data.msg).toContain('bad request')
      })

  })
})

