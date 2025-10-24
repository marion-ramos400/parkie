import { 
  describe, 
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
import { BACKEND_URL } from '../env.js'
import { User } from '../models/models.js'
import UserController from '../controllers/user.controller.js'
import { hashPassword } from '../middleware/hashpassword.js'
import { connectDB } from '../db/utils.js'
import Mock from './mock.js'
import { MockUser } from './mock.payload.js'
import HTTP from '../http/codes.js'

const payload = new MockUser().payload()
//  {
//  createNonAdmin: {
//    email: 'useruser@gmail.com',
//    password: '1234',
//    organization: 'Babadoo Inc'
//  },
//  createAdmin: {
//    email: 'userAdmin@gmail.com',
//    password: '1234',
//    organization: 'Babadoo Inc',
//    isAdmin: true
//  },
//  nonExistentUser: {
//    email: 'nonexistent@pmail.com',
//    password: 'yi(012)123p**'
//  }
//}

const deleteTestUsers = async () => {
  await connectDB()
  await User.deleteOne({ email: payload.createUserNonAdmin.email })
  await User.deleteOne({ email: payload.createUserAdmin.email })
}

describe('calls /users/create endpoint', async () => {
  afterEach(async () => {
    await deleteTestUsers()
    vi.resetAllMocks()
    vi.restoreAllMocks()
  })
  it('creates non admin user through api', async () => {
    let data;
    let status;
    await axios.post(
        BACKEND_URL + '/users/create',
        payload.createUserNonAdmin
      )
      .then(res => {
        data = res.data
        status = res.status
      })
      .catch(err => {
        console.error(err.message)
      })
      .finally(() => {
        expect(status).toBe(HTTP.CREATED)
        expect(data).toHaveProperty('user')
      })
  })
})

describe('calls /users/login endpoint', async () => {
  const mock = new Mock()
  const userControl = new UserController()
  let mreq;
  let mres;
  const ENDPOINT = BACKEND_URL + '/users/login'
  beforeEach(async () => {
    await connectDB()
    const pCopy = JSON.parse(
      JSON.stringify(payload.createUserNonAdmin)
    )
    mreq = mock.request(pCopy)
    mres = mock.response()
    await hashPassword(mreq, mres, mock.next)
    await userControl.create(mreq, mres)
  })
  afterEach(async () => {
    await deleteTestUsers()
    mock.clear()
    vi.clearAllMocks()
  })

  it('logs in user through api', async () => {
    let data;
    let status;
    await axios.post(
        ENDPOINT,
        payload.createUserNonAdmin
      ) 
      .then(res => {
        data = res.data
        status = res.status
      })
      .catch(err => {
        console.error(err.message)
      })
      .finally(() => {
        expect(status).toBe(HTTP.SUCCESS)
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
        data = err.response.data
        status = err.response.status
      })
      .finally(() => {
        expect(status).toBe(HTTP.NOT_FOUND)
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
        expect(status).toBe(HTTP.BAD_REQUEST)
        expect(data.msg).toContain('bad request')
      })

  })
})

