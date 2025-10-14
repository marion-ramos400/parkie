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
import { hashPassword } from '../middleware/hashpassword.js'
import { validateLogin } from '../middleware/validateLogin.js'
import { connectDB } from '../db/utils.js'
import { JWT_MAX_AGE, REFRESH_MAX_AGE } from '../env.js'
import Auth from '../middleware/auth.js'
import UserController from '../controllers/user.controller.js'
import Mock from './mock.js'
import { TestUtilsUser } from './utils.js'

let payload = {
  shortPassword: {
    email: 'emailTest123456@email.com',
    password: '123asdzxc'
  },
  longPassword: {
    email: 'emailTest123456@email.com',
    password: 'thisALong@**paSZWErdRoightHer',
  },
  validateUser: {
    email: 'createDelete@email.com',
    password: 'validateCreateDelete'
  }
}

expect.extend({
  toHaveLengthGreaterThan(received, expectedLength) {
    const pass = received.length > expectedLength
    if (pass) {
      return {
        pass: true,
        message: () => {
          `length is greater than ${expectedLength}` 
        }
      }
    }
    else {
      return {
        pass: false,
        message: () => {
          `received length: ${received.length} 
          but expected length is > ${expectedLength}`
        }
      }
    }
  }
})

const execAftermSec = (callback, ms) => {
  setTimeout(callback, ms)
}

describe('middleware', async() => {
  const userControl = new UserController()
  const mock = new Mock()
  let payloadCopy;
  beforeAll(async () => {
    await connectDB()
  })
  beforeEach(() => {
    //deepcopy so that everything disconnected
    payloadCopy = JSON.parse(JSON.stringify(payload))
    vi.useFakeTimers()
  })
  afterEach(async () => {
    //put back to orig value
    payload = payloadCopy
    await userControl.delete(
      mock.request(payload.validateUser),
      mock.response()
    )
    vi.resetAllMocks()
    vi.restoreAllMocks()
    mock.clear()
  })
  it('successfully hashes password', async() => {
    const req = mock.request(payload.shortPassword)
    const res = mock.response()
    const pwdCopy = payload.shortPassword.password
    await hashPassword(req, res, mock.next)
    expect(mock.next).toBeCalledTimes(1)
    expect(req.body.password)
      .toHaveLengthGreaterThan(pwdCopy.length)
  })

  it('success validates login credentials', async () => {
    const req = mock.request(payload.validateUser)
    const res = mock.response()
    const pwdCopy = payload.validateUser.password
    //create user
    await hashPassword(req, res, mock.next)
    await userControl.create(req, res)

    //reset password to orig value
    req.body.password = pwdCopy
    await validateLogin(req, res, mock.next)
    expect(mock.next).toHaveBeenCalledTimes(2)
    expect(req.body.user.email).toEqual(payload.validateUser.email)
  })

  it('successfully verifies jwt', async () => { 
    const testUtilsUser = new TestUtilsUser(payload.validateUser, mock)
    const [req, res] = await testUtilsUser.createThenLogin()
    //verify token
    req.cookies = { accessToken: res.cookies.accessToken }
    await Auth.verifyJwt(req, res, mock.next)
    expect(req.body.tokenObj).toHaveProperty('email')
  })

  it('throws error when jwt is expired', async () => {
    const testUtilsUser = new TestUtilsUser(payload.validateUser, mock)
    const [req, res] = await testUtilsUser.createThenLogin()
    req.cookies = { accessToken: res.cookies.accessToken }
    //verify after timer
    execAftermSec(() => Auth.verifyJwt(req, res, mock.next), JWT_MAX_AGE)
    vi.runAllTimers()
    expect(res.status).toBeCalledWith(500)
    expect(res.data.msg).toContain('expired')
  })

  it('successfully refreshes accesstoken', async () => {
    const testUtilsUser = new TestUtilsUser(payload.validateUser, mock)
    const [req, res] = await testUtilsUser.createThenLogin()
    req.cookies = { refreshToken: res.cookies.refreshToken }
    //refresh after timer
    execAftermSec(async () => {
      await Auth.refreshToken(req, res)
      expect(res.status).toBeCalledWith(201)
      expect(res.data.msg).toContain('refreshed')
    }, REFRESH_MAX_AGE - 1000)
    vi.runAllTimers()
  })

  it('throws error when refresh token is expired', async () => {
    const testUtilsUser = new TestUtilsUser(payload.validateUser, mock)
    const [req, res] = await testUtilsUser.createThenLogin()
    req.cookies = { refreshToken: res.cookies.refreshToken }
    //refresh after timer
    execAftermSec(async () => {
      await Auth.refreshToken(req, res)
      expect(res.status).toBeCalledWith(401)
      expect(res.data.msg).toContain('expired')
    }, REFRESH_MAX_AGE)
    vi.runAllTimers()
  })

})



