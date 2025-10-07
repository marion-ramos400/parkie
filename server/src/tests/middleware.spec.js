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
import { verifyJwt } from '../middleware/verifyAuth.js'
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

describe('middleware', async() => {
  let payloadCopy;
  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI, { dbName: 'parkie' })
  })
  beforeEach(() => {
     //deepcopy so that everything disconnected
    payloadCopy = JSON.parse(JSON.stringify(payload))
  })
  afterEach(async () => {
    //put back to orig value
    payload = payloadCopy
    await deleteUser(
      mockRequest({}, payload.validateUser),
      mockResponse()
    )
    vi.resetAllMocks()
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
    await verifyJwt(req, res, mockNext)
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
    
    //delay past expiry
    await sleep(3000)
    //verify token
    req.headers = {
      authorization: `Bearer ${jwtoken}`
    } 
    await verifyJwt(req, res, mockNext)
    expect(res.status).toBeCalledWith(500)
    expect(res.data.msg).toContain('expired')
    
  })

})



