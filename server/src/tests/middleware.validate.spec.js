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
import HTTP from '../http/codes.js'
import Mock from './mock.js'

import { 
  ValidateSlot,
  PayloadInspector
} from '../middleware/validate.js'

import {
  MockSlot
} from './mock.payload.js'

describe('middleware payload validation', async () => {
  let mockhttp;
  let mSlot;
  let inspector = new PayloadInspector()
  beforeAll(async () => {
    await connectDB()
  })
  beforeEach(() => {
    mockhttp = new Mock()
    mSlot = new MockSlot()
  })

  it('throws slot not exist', async () => {
    const req = mockhttp.request(mSlot.payload().slotNotExist)
    const res = mockhttp.response()
    inspector.setValidation(new ValidateSlot()) 
    await inspector.validate(req, res, mockhttp.next)
    console.log(res.data)
    expect(res.status).toHaveBeenLastCalledWith(HTTP.NOT_FOUND)
  })
})
