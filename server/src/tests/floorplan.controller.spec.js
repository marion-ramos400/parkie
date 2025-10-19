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
import { FloorPlanController } from '../controllers/controllers.js'
import { MockFloorPlan } from './mock.payload.js'
import Mock from './mock.js'


describe('controller floorplan', async () => {
  let mockhttp;
  let mFloorPlan;
  let fpControl = new FloorPlanController()
  const deleteMockObjects = async () => {
    for(const [key, value] of Object.entries(mFloorPlan.payload())) {
      await fpControl.delete(mockhttp.request(value), mockhttp.response())
    }
  }
  beforeAll( async () => {
    await connectDB()
  })
  beforeEach(() => {
    mockhttp = new Mock()
    mFloorPlan = new MockFloorPlan()
  })
  afterEach(async () => {
//    console.dir(mFloorPlan.payload(), { depth: null })
    await deleteMockObjects()
  })

  it('successfully creates floorplan', async () => {
    const req = mockhttp.request(mFloorPlan.payload().floorPlan1Shimmy)
    const res = mockhttp.response()
    await fpControl.create(req, res) 
    expect(res.status).toHaveBeenCalledWith(HTTP.CREATED)
    expect(res.data.msg).toContain('created')
  })

  it('throws error name parameter required', async () => {
    const req = mockhttp.request(mFloorPlan.payload().floorPlanNoName)
    const res = mockhttp.response()
    await fpControl.create(req, res) 
    expect(res.status).toHaveBeenCalledWith(HTTP.ERROR)
    expect(res.data.msg).toContain('Path `name` is required')

  })
})
