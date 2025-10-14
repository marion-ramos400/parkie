import { describe, 
  test, 
  it, 
  expect, 
  vi,
  afterEach,
  beforeAll,
  afterAll,
  } from 'vitest'
import { connectDB } from '../db/utils.js'
import UserController from '../controllers/user.controller.js'
import Mock from './mock.js'

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
}

describe('controller create user ', async () => {
  const userControl = new UserController()
  const mock = new Mock()

  beforeAll(async () => {
    await connectDB()
  })

  afterEach(async () => {
    mock.clear()
    for (let p in payload) {
      await userControl.delete(
        mock.request(payload[p]),
        mock.response()
      )
    }
  }) 
  
  it('creates non admin user', async () => {
    const req = mock.request(payload.createUserNonAdmin)
    const res = mock.response()
    await userControl.create(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ isAdmin: false }) 
      })
    )
  })

  it('creates admin user', async () => {
    const req = mock.request(payload.createUserAdmin)
    const res = mock.response()
    await userControl.create(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ isAdmin: true }) 
      })
    )
  })
})


