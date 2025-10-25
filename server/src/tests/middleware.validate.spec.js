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
import { TestUtils } from './utils.js'
import { connectDB } from '../db/utils.js'
import HTTP from '../http/codes.js'
import Mock from './mock.js'

import { FloorPlanController, UserController } from '../controllers/controllers.js'
import { FloorPlan } from '../models/models.js'
import * as va  from '../middleware/validate.js'
import {
  MockSlot,
  MockFloorPlan,
  MockUser,
  MockBooking,
} from './mock.payload.js'

describe('middleware payload validation', async () => {
  let mockhttp
  let mSlot
  let mFlrPlan
  let tuFlrplan
  let mUser
  let tuUser
  let mBook
  beforeAll(async () => {
    await connectDB()
  })
  beforeEach(() => {
    mockhttp = new Mock()
    mSlot = new MockSlot()
    mFlrPlan = new MockFloorPlan()
    tuFlrplan = new TestUtils(new FloorPlanController())
    mUser = new MockUser()
    tuUser = new TestUtils(new UserController())
    mBook = new MockBooking() 
  })
  afterEach(async () => {
    await tuFlrplan.delete()
    await tuUser.delete()
  })

  it('throws slot not exist', async () => {
    const req = mockhttp.request({
      slot: mSlot.payload().slotNotExist
    })
    const res = mockhttp.response()
    const inspector = new va.Validator(new va.ValidateSlot())
    await inspector.validate(req, res, mockhttp.next)
    expect(res.status).toHaveBeenLastCalledWith(HTTP.NOT_FOUND)
  })

  it('successfully validates slot exists', async () => {
    await tuFlrplan.create(mFlrPlan.payload().towerOneFlr1)

    const req = mockhttp.request({
      slot: mSlot.payload().slotExist
    })
    const res = mockhttp.response()
    const inspector = new va.Validator(new va.ValidateSlot())
    await inspector.validate(req, res, mockhttp.next)
    expect(mockhttp.next).toHaveBeenCalled()
    expect(req.body).toHaveProperty('slot')
  })

  it('successsfully validates slot is in floorplan', async () => {
    await tuFlrplan.create(mFlrPlan.payload().towerOneFlr1) 

    const { name } = mFlrPlan.payload().towerOneFlr1
    const floorplan = await FloorPlan.findOne({ name })
    
    const req = {
      body: {
        slot: mSlot.payload().slotExist,
        floorplan 
      }
    }
    const res = mockhttp.response()
    const inspector = new va.Validator(new va.ValidateSlotInFloorplan())
    await inspector.validate(req, res, mockhttp.next)
    expect(mockhttp.next).toHaveBeenCalled()
  })

  it('throws slot not in floorplan', async () => {
    await tuFlrplan.create(mFlrPlan.payload().towerOneFlr1) 

    const { name } = mFlrPlan.payload().towerOneFlr1
    const floorplan = await FloorPlan.findOne({ name })
    
    const req = {
      body: {
        slot: mSlot.payload().slotNotExist,
        floorplan 
      }
    }
    const res = mockhttp.response()
    const inspector = new va.Validator(new va.ValidateSlotInFloorplan())
    await inspector.validate(req, res, mockhttp.next)
    expect(res.status).toHaveBeenCalledWith(HTTP.NOT_FOUND)
    expect(res.data.msg).toContain(
      `slot ${req.body.slot.name} not found in floorplan`)
  })

  it('successfully validates floorplan exists', async () => {
    await tuFlrplan.create(mFlrPlan.payload().towerOneFlr1) 
    const req = mockhttp.request({
      floorplan: mFlrPlan.payload().towerOneFlr1
    }) 
    const res = mockhttp.response()
    const inspector = new va.Validator(new va.ValidateFloorplan())
    await inspector.validate(req, res, mockhttp.next)
    expect(mockhttp.next).toHaveBeenCalled()
    expect(req.body).toHaveProperty('floorplan')
  })


  it('throws floorplan not exist', async () => {
    const req = mockhttp.request({
      floorplan: mFlrPlan.payload().towerOneFlr1
    }) 
    const res = mockhttp.response()
    const inspector = new va.Validator(new va.ValidateFloorplan())
    await inspector.validate(req, res, mockhttp.next)
    expect(res.status).toHaveBeenCalledWith(HTTP.NOT_FOUND)
    expect(res.data.msg).toContain('floorplan not found')
  })

  it('successfully validates slot company and user company match', async () => {
    await tuFlrplan.create(mFlrPlan.payload().towerOneFlr1) 
    await tuUser.create(mUser.payload().createUserNonAdmin)

    let req = mockhttp.request(
      mBook.payload().userNonAdmin
    )
    const res = mockhttp.response()
    const next = mockhttp.next

    //inspect reserveTo
    const inspector = new va.Validator()
    inspector.setValidation(new va.ValidateReservedTo())
    await inspector.validate(req, res, next)
    expect(req.body.reservedTo).toHaveProperty('_id')

    //inspect slot
    inspector.setValidation(new va.ValidateSlot())
    await inspector.validate(req, res, next)
    expect(req.body.slot).toHaveProperty('_id')
    
    inspector.setValidation(new va.ValidateSlotCompany)
    await inspector.validate(req, res, next)
    expect(next).toBeCalledTimes(3)
  })

  it('throws mismatch slot company and user company', async () => {
    await tuFlrplan.create(mFlrPlan.payload().towerOneFlr1) 
    await tuUser.create(mUser.payload().createUserNonAdmin)

    let req = mockhttp.request(
      mBook.payload().userNonAdminCompanyMismatch
    )
    const res = mockhttp.response()
    const next = mockhttp.next

    //inspect reserveTo
    const inspector = new va.Validator()
    inspector.setValidation(new va.ValidateReservedTo())
    await inspector.validate(req, res, next)
    expect(req.body.reservedTo).toHaveProperty('_id')

    //inspect slot
    inspector.setValidation(new va.ValidateSlot())
    await inspector.validate(req, res, next)
    expect(req.body.slot).toHaveProperty('_id')
    
    inspector.setValidation(new va.ValidateSlotCompany)
    await inspector.validate(req, res, next)
    expect(res.status).toHaveBeenLastCalledWith(HTTP.BAD_REQUEST)
    expect(res.data.msg).toContain('mismatch')
  })

  it('successfully validates reservedTo User', async () => {
    await tuFlrplan.create(mFlrPlan.payload().towerOneFlr1) 
    await tuUser.create(mUser.payload().createUserNonAdmin)

    let req = mockhttp.request(
      mBook.payload().userNonAdmin
    )
    const res = mockhttp.response()
    const next = mockhttp.next

    //inspect reserveTo
    const inspector = new va.Validator()
    inspector.setValidation(new va.ValidateReservedTo())
    await inspector.validate(req, res, next)
    expect(req.body.reservedTo).toHaveProperty('_id')
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('throws user not found in validate reservedTo', async () => {
    await tuFlrplan.create(mFlrPlan.payload().towerOneFlr1) 

    let req = mockhttp.request(
      mBook.payload().userNonAdmin
    )
    const res = mockhttp.response()
    const next = mockhttp.next

    //inspect reserveTo
    const inspector = new va.Validator()
    inspector.setValidation(new va.ValidateReservedTo())
    await inspector.validate(req, res, next)
    expect(res.status).toHaveBeenLastCalledWith(HTTP.NOT_FOUND)
    expect(res.data.msg).toContain('user not found')
  })

})
