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
import { TestUtils, delay } from './utils.js'
import HTTP from '../http/codes.js'
import { BookController, FloorPlanController } from '../controllers/controllers.js'
import { MockBooking, MockFloorPlan } from './mock.payload.js'
import { deleteMockPayloadDb } from './utils.js'
import Mock from './mock.js'

describe('controller booking', async () => {
  let mockhttp;
  let mBooking;
  let mFlrPlan;
  let bkControl = new BookController()
  let tuFlrplan;

  beforeAll( async () => {
    await connectDB()
  })
  beforeEach(() => {
    mockhttp = new Mock()
    mBooking = new MockBooking()
    mFlrPlan = new MockFloorPlan()
    tuFlrplan = new TestUtils(new FloorPlanController())
  })
  afterEach(async () => {
//    await deleteMockPayloadDb(mBooking.payload(), bkControl)
    await tuFlrplan.delete()
  })

  it('successfully creates booking', async () => {
    await tuFlrplan.create(mFlrPlan.payload().towerOneFlr1)

    const req = mockhttp.request(mBooking.payload().tower1Flr1SlotA2)
    const res = mockhttp.response()
    await bkControl.create(req, res)
    expect(res.status).toHaveBeenCalledWith(HTTP.CREATED)
    expect(res.data.msg).toContain('created')
    req.body.ticketnum = res.data.ticketnum
    await bkControl.delete(req, res)
  })
})


