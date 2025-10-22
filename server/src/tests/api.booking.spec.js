
import { 
  describe, 
  test, 
  it, 
  expect, 
  vi,
  afterEach,
  beforeEach,
  beforeAll,
  afterAll,
  } from 'vitest'
import axios from 'axios'
import HTTP from '../http/codes.js'
import { connectDB } from '../db/utils.js'
import { BACKEND_URL } from '../env.js'
import { MockBooking, MockFloorPlan } from './mock.payload.js'
import { FloorPlanController } from '../controllers/controllers.js'
import { Booking } from '../models/models.js'
import { TestUtils } from './utils.js'

describe('api router booking', async () => {
  let mBooking;
  let mFlrPlan;
  let tuFlrplan;

  beforeAll(async () => {
    await connectDB()
  })

  beforeEach(() => {
    mBooking = new MockBooking()
    mFlrPlan = new MockFloorPlan()
    tuFlrplan = new TestUtils(new FloorPlanController())
  })
  
  afterEach(async () => {
    await tuFlrplan.delete()
  })

  it('returns http status 201 created', async () => {
    await tuFlrplan.create(mFlrPlan.payload().towerOneFlr1) 

    let response;
    const payload = mBooking.payload().tower1Flr1SlotA2
    await axios.post(
      BACKEND_URL + '/booking/create',
      payload
      )
      .then(res => response = res)
      .catch(err => {
        console.error(err.message)
        console.log(err.response.data)
      })
      .finally(() => {
        expect(response.status).toBe(HTTP.CREATED)
        expect(response.data.msg).toContain('successfully created booking')
        expect(
          response.data).toHaveProperty('ticketnum')
        Booking.findOneAndDelete({ ticketnum: response.data.ticketnum }).exec()
      })
  })
})
