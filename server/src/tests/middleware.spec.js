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

const mockRequest = (sessionData, body) => {
  return {
    session: { data: sessionData },
    body
  }
}

const mockResponse = () => {
  const res = {}
  res.status = vi.fn((code)=>res)
  res.json = vi.fn((resdata)=>res)
  return res
}

const mockNext = vi.fn()

let payload = {
  shortPassword: {
    email: 'emailTest123456@email.com',
    password: '123asdzxc'
  },
  longPassword: {
    email: 'emailTest123456@email.com',
    password: 'thisALong@**paSZWErdRoightHer',
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

describe('middleware hashpassword', async() => {
  let payloadCopy;
  beforeEach(() => {
     //deepcopy so that everything disconnected
    payloadCopy = JSON.parse(JSON.stringify(payload))
  })
  afterEach(() => {
    //put back to orig value
    payload = payloadCopy
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
})


