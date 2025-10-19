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

const delay = ms => new Promise(res => setTimeout(res, ms));

describe('controller floorplan', async () => {
  let mockhttp;
  let mFloorPlan;
  let fpControl = new FloorPlanController()
  const deleteMockObjects = async () => {
    await delay(100)
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
    const req = mockhttp.request(mFloorPlan.payload().towerOneFlr1)
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

  it('successfully retrieves floorplan with filter floor and building', async () => {
    const req = mockhttp.request(mFloorPlan.payload().towerOneFlr1)
    const res = mockhttp.response()
    await fpControl.create(req, res) 

    req.query = mFloorPlan.query().bldgShimmyFlr1
    await fpControl.get(req, res)
    expect(res.status).toHaveBeenLastCalledWith(HTTP.SUCCESS)
    expect(res.data).toHaveProperty('name')
  })

  it('returns not found when floorplan not exist', async () => {
    const req = mockhttp.request(mFloorPlan.payload().towerOneFlr1)
    const res = mockhttp.response()
    req.query = mFloorPlan.query().bldgTowerOneFlr1
    await fpControl.get(req, res)
    expect(res.status).toHaveBeenLastCalledWith(HTTP.NOT_FOUND)
    expect(res.data.msg).toContain('not found')
  })

  it('successfully overwrites floorplan slots', async () => {
    let req = mockhttp.request(mFloorPlan.payload().towerOneFlr1)
    const res = mockhttp.response()
    await fpControl.create(req, res)
    req = mockhttp.request(mFloorPlan.payload().overwriteSlots)
    await fpControl.update(req, res) 
    expect(res.status).toHaveBeenLastCalledWith(HTTP.SUCCESS)
    //add checking of output
    req.query = mFloorPlan.query().bldgTowerOneFlr1
    await fpControl.get(req, res)
    expect(res.status).toHaveBeenLastCalledWith(HTTP.SUCCESS)
    expect(res.data.slots[0]).toEqual(
      mFloorPlan.payload().overwriteSlots.slots[0])
  })

  it('fails update returns not found when floorplan not exist, and slots remain unedited', async () => {
    let req = mockhttp.request(mFloorPlan.payload().towerOneFlr1)
    const res = mockhttp.response()
    await fpControl.create(req, res)
    req = mockhttp.request(mFloorPlan.payload().overwriteSlots)
    req.body.name = "nonExistentFloorplan"
    await fpControl.update(req, res) 
    expect(res.status).toHaveBeenLastCalledWith(HTTP.NOT_FOUND)
    //add checking of output
    req.query = mFloorPlan.query().bldgTowerOneFlr1
    await fpControl.get(req, res)
    expect(res.status).toHaveBeenLastCalledWith(HTTP.SUCCESS)
    expect(res.data.slots[0]).toEqual(
      mFloorPlan.payload().towerOneFlr1.slots[0])
  })
})
