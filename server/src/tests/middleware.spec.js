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
import { hashPassword } from '../middleware/hashpassword.js'
import { validateLogin } from '../middleware/validateLogin.js'
import * as tokenAuth from '../middleware/verifyAuth.js'
//import { tokenAuth.verifyJwt, refreshToken } from ''
import { 
  createUser, 
  deleteUser, 
  logInUser } from '../controllers/user.controller.js'
import { MONGODB_URI } from '../env.js'
import mongoose from 'mongoose'
import { 
  mockRequest, 
  mockResponse, 
  mockNext, 
  sleep } from './mockReqRes.js'
import { JWT_EXPIRE } from '../env.js'

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

const execAfterJwtExpire = (callback) => {
  setTimeout(callback, JWT_EXPIRE)
}

const execAfterSec = (callback, ms) => {
  setTimeout(callback, ms * 1000)
}

describe('middleware', async() => {
  let payloadCopy;
  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI, { dbName: 'parkie' })
  })
  beforeEach(() => {
    //deepcopy so that everything disconnected
    payloadCopy = JSON.parse(JSON.stringify(payload))
    vi.useFakeTimers()
  })
  afterEach(async () => {
    //put back to orig value
    payload = payloadCopy
    await deleteUser(
      mockRequest({}, payload.validateUser),
      mockResponse()
    )
    vi.resetAllMocks()
    vi.restoreAllMocks()
  })
  it('successfully hashes password', async() => {
    const req = mockRequest({}, payload.shortPassword)
    const res = mockResponse()
    const pwdCopy = payload.shortPassword.password
    await hashPassword(req, res, mockNext)
    expect(mockNext).toBeCalledTimes(1)
    expect(req.body.password)
      .toHaveLengthGreaterThan(pwdCopy.length)
  })

  it('success validates login credentials', async () => {
    const req = mockRequest({}, payload.validateUser)
    const res = mockResponse()
    const pwdCopy = payload.validateUser.password
    //create user
    await hashPassword(req, res, mockNext)
    await createUser(req, res)

    //reset password to orig value
    req.body.password = pwdCopy
    await validateLogin(req, res, mockNext)
    expect(mockNext).toHaveBeenCalledTimes(2)
    expect(req.body.user.email).toEqual(payload.validateUser.email)
  })

  it('successfully verifies jwt', async () => { 
    const req = mockRequest({}, payload.validateUser)
    const res = mockResponse()
    const pwdCopy = payload.validateUser.password
    //create user
    await hashPassword(req, res, mockNext)
    await createUser(req, res)

    //reset password to orig value
    req.body.password = pwdCopy
    await validateLogin(req, res, mockNext)
    await logInUser(req, res)
    const jwtoken = res.data.token

    //verify token
    req.headers = {
      authorization: `Bearer ${jwtoken}`
    } 
    await tokenAuth.verifyJwt(req, res, mockNext)
    expect(req.body.tokenObj).toHaveProperty('email')
  })

  it('throws error when jwt is expired', async () => {
    const req = mockRequest({}, payload.validateUser)
    const res = mockResponse()
    const pwdCopy = payload.validateUser.password
    //create user
    await hashPassword(req, res, mockNext)
    await createUser(req, res)

    //reset password to orig value
    req.body.password = pwdCopy
    await validateLogin(req, res, mockNext)
    await logInUser(req, res)
    const jwtoken = res.data.token
    
    //verify token
    req.headers = {
      authorization: `Bearer ${jwtoken}`
    } 
    //verify after timer
    execAfterJwtExpire(() => tokenAuth.verifyJwt(req, res, mockNext))
    vi.runAllTimers()
    expect(res.status).toBeCalledWith(500)
    expect(res.data.msg).toContain('expired')
  })

  it('successfully refreshes accesstoken', async () => {
    const req = mockRequest({}, payload.validateUser)
    const res = mockResponse()
    const pwdCopy = payload.validateUser.password
    //create user
    await hashPassword(req, res, mockNext)
    await createUser(req, res)

    //reset password to orig value
    req.body.password = pwdCopy
    await validateLogin(req, res, mockNext)
    await logInUser(req, res)
    const jwtoken = res.data.token
    
    //verify token
    req.headers = {
      authorization: `Bearer ${jwtoken}`
    } 
    req.cookies = {
      refreshToken: res.data.refreshToken
    }

    //refresh after timer
    execAfterSec(async () => {
      await tokenAuth.refreshToken(req, res)
      expect(res.status).toBeCalledWith(201)
      expect(res.data.msg).toContain('refreshed')
    }, 5)
    vi.runAllTimers()
  })

  it('throws error when refresh token is expired', async () => {
    const req = mockRequest({}, payload.validateUser)
    const res = mockResponse()
    const pwdCopy = payload.validateUser.password
    //create user
    await hashPassword(req, res, mockNext)
    await createUser(req, res)

    //reset password to orig value
    req.body.password = pwdCopy
    await validateLogin(req, res, mockNext)
    await logInUser(req, res)
    const jwtoken = res.data.token
    
    //verify token
    req.headers = {
      authorization: `Bearer ${jwtoken}`
    } 
    req.cookies = {
      refreshToken: res.data.refreshToken
    }

    //refresh after timer
    execAfterSec(async () => {
      await tokenAuth.refreshToken(req, res)
      expect(res.status).toBeCalledWith(401)
      expect(res.data.msg).toContain('expired')
    }, 14 * 60 * 60)
    vi.runAllTimers()
  })

})



