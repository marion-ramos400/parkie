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
import { connectDB } from '../db/utils.js'
import UserController from '../controllers/user.controller.js'
import Mock from './mock.js'
import HTTP from '../http/codes.js'
import { TestUtilsUser } from './utils.js'

const payload = {
  createUserNonAdmin: {
    email: 'emailTest123456@email.com',
    password: '123asdzxc'
  },
  createUserAdmin: {
    email: 'emailTest123456@email.com',
    password: '123asdzxc',
    isAdmin: true,
  },
  fakeTokenObj: {
    email: 'emailFromToken@ffmail.com',
    id: 'asdfjio12312312ad'
  }
}

describe('controller user ', async () => {
  const userControl = new UserController()
  let mock;

  beforeAll(async () => {
    await connectDB()
  })

  beforeEach(async () => {
    mock = new Mock()
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

  describe('create', async () => {
    it('creates non admin user', async () => {
      const tUser = new TestUtilsUser(payload.createUserNonAdmin, mock)
      const [req, res] = await tUser.createUser()
      expect(res.status).toHaveBeenCalledWith(HTTP.CREATED)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({ isAdmin: false }) 
        })
      )
    })

    it('creates admin user', async () => {
      const tUser = new TestUtilsUser(payload.createUserAdmin, mock)
      const [req, res] = await tUser.createUser()
      expect(res.status).toHaveBeenCalledWith(HTTP.CREATED)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({ isAdmin: true }) 
        })
      )
    })

    it('throws user already exists', async () => {
      const tUser = new TestUtilsUser(payload.createUserNonAdmin, mock)
      await tUser.createUser()
      const [req, res] = await tUser.createUser()
      expect(res.status).toHaveBeenCalledWith(HTTP.BAD_REQUEST)
      expect(res.data.msg).toContain('already exists')
    })
  })

  describe('delete', async() => {
    it('successfully deletes user', async () => {
      const tUser = new TestUtilsUser(payload.createUserNonAdmin, mock)
      const [req, res] = await tUser.createUser()
      await userControl.delete(req, res)
      expect(res.status).toHaveBeenLastCalledWith(HTTP.SUCCESS)
      expect(res.data.msg).toContain('deleted')
    }) 
    it('throws error user not found', async () => {
      const req = mock.request(payload.createUserNonAdmin)
      const res = mock.response()
      await userControl.delete(req, res)
      expect(res.status).toHaveBeenCalledWith(HTTP.NOT_FOUND)
      expect(res.data.msg).toContain('not found')

    })
  })

  describe('validate', async() => {
    it('successfully validates user', async () => {
      const tUser = new TestUtilsUser(payload.createUserNonAdmin, mock)
      const [req, res] = await tUser.createUser()
      req.body.tokenObj = {
        email: res.data.user.email,
        id: res.data.user.id.toString()
      }
      await userControl.validate(req, res)
      expect(res.status).toHaveBeenLastCalledWith(HTTP.SUCCESS)
      expect(res.data.msg).toContain('validated')
    }) 

    it('throws error user not found', async () => {
      const req = {
        body: { tokenObj: payload.fakeTokenObj }
      } 
      const res = mock.response()
      await userControl.validate(req, res)
      expect(res.status).toHaveBeenLastCalledWith(HTTP.NOT_FOUND)
      expect(res.data.msg).toContain('not found')
    })
  })

  describe('get', async() => {
    it('successfully gets user and its bookings', async () => {
      const tUser = new TestUtilsUser(payload.createUserNonAdmin, mock)
      const [req, res] = await tUser.createUser()
      req.body.tokenObj = {
        email: res.data.user.email,
        id: res.data.user.id.toString()
      }
      await userControl.get(req, res)
      expect(res.status).toHaveBeenLastCalledWith(HTTP.SUCCESS)
      expect(res.data).toHaveProperty('id')
      expect(res.data).toHaveProperty('email')
      expect(res.data.msg).toContain('User found')
    })

    it('throws error user not found', async () => {
      const req = {
        body: { tokenObj: payload.fakeTokenObj }
      } 
      const res = mock.response()
      await userControl.get(req, res)
      expect(res.status).toHaveBeenLastCalledWith(HTTP.NOT_FOUND)
      expect(res.data.msg).toContain('not found')
    })
  })

  describe('login', async() => {
    it('succesfully logs in user', async () => {
      const tUser = new TestUtilsUser(payload.createUserNonAdmin, mock)
      const [req, res] = await tUser.createUser()
      req.body.user = res.data.user
      await userControl.login(req, res)
      expect(res.status).toHaveBeenCalledWith(HTTP.SUCCESS)
      expect(res.data.msg).toContain('login success')
      expect(res.cookies).toHaveProperty('accessToken')
      expect(res.cookies).toHaveProperty('refreshToken')
    })

    it('throws error when no user in request', async () => {
      const req = {}
      const res = mock.response()
      await userControl.login(req, res)
      expect(res.status).toHaveBeenCalledWith(HTTP.ERROR)
    })
  })

  describe('logout', async() => {
    it('successfully logs out user', async () => {
      const tUser = new TestUtilsUser(payload.createUserNonAdmin, mock)
      const [req, res] = await tUser.createUser()
      req.body.user = res.data.user
      await userControl.login(req, res)
      req.cookies = {
        refreshToken: res.cookies.refreshToken
      }
      await userControl.logout(req, res)
      expect(res.status).toHaveBeenLastCalledWith(HTTP.SUCCESS)
      expect(res.data.msg).toContain('logged out')
    })

    it('throws error when no refreshToken cookie', async () => {
      const tUser = new TestUtilsUser(payload.createUserNonAdmin, mock)
      const [req, res] = await tUser.createUser()
      req.body.user = res.data.user
      await userControl.login(req, res)
      req.cookies = {
        refreshToken: null
      }
      await userControl.logout(req, res)
      expect(res.status).toHaveBeenLastCalledWith(HTTP.ERROR)
      expect(res.data.msg).toContain('logout error')
    })

  })

})




