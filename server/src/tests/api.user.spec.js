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
        BACKEND_URL + '/users/login',
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
})

