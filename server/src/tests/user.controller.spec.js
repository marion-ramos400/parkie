import { describe, 
  test, 
  it, 
  expect, 
  vi,
  afterEach,
  beforeAll,
  afterAll,
  } from 'vitest'
import mongoose from 'mongoose'
import { createUser, deleteUser } from '../controllers/user.controller.js'
import { MONGODB_URI } from '../env.js'
import { mockRequest, mockResponse } from './mockReqRes.js'

const payload = {
  createUserNonAdmin: {
    email: 'emailTest123456@email.com',
    password: '123asdzxc'
  },
  createUserAdmin: {
    email: 'emailTest123456@email.com',
    password: '123asdzxc',
    isAdmin: true,
  }
}

const clearUsers = async () => {
  for (let p in payload) {
    await deleteUser(
      mockRequest({}, payload[p]),
      mockResponse()
    )
  }
}

describe('controller create user ', async () => {

  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI, { dbName: 'parkie' })
  })

  afterEach(async () => {
    await clearUsers()
  }) 
  
  it('creates non admin user', async () => {
    const req = mockRequest(
      {},
      payload.createUserNonAdmin)
    const res = mockResponse()
    await createUser(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ isAdmin: false }) 
      })
    )
  })

  it('creates admin user', async () => {
    const req = mockRequest(
      {},
      payload.createUserAdmin)
    const res = mockResponse()
    await createUser(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ isAdmin: true }) 
      })
    )
  })
})


