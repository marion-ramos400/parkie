import qs from 'qs'
import InterfaceController from './interface.controller.js'
import Send from '../http/response.js'
import { FloorPlan, Slot, User } from '../models/models.js'

class FloorPlanController extends InterfaceController {
  async create(req, res) {
    try {
      const { slots, ...other } = req.body
      const floorplan = await FloorPlan.create(other)
      for(let i = 0; i < slots.length; i++) {
        slots[i].floorplan = floorplan
        const item = await Slot.create(slots[i])
      }
      await floorplan.save()
      Send.created(res, null, 'floorplan created') 
    }
    catch (err) {
      Send.error(res, null, 
        `Error creating floorplan: ${err.message}`)
    }
  }

  async get(req, res) {
    try {
      //get using filters
      const query = qs.parse(req.query)
      const floorplan = await FloorPlan.findOne(query)
      if (!floorplan) {
        return Send.notFound(res, null, 'floorplan not found')
      }
      const { name, floor, building } = floorplan
      const slotsDb = await Slot.find({ floorplan: floorplan._id })
      const outSlots = slotsDb.map(item => {
        const data = item._doc
        const { _id, __v, floorplan, ...props } = data
        return props
      })
      Send.success(
        res,
        { name, floor, building, slots: outSlots }
      )
    }
    catch (err) {
      Send.error(res, null, `Error retrieving floorplan: ${err.message}`)
    }
  }

  async update(req, res) {
    try {
      const { name, floor, building,  slots } = req.body
      const floorplan = await FloorPlan.findOne({ name })
      if (!floorplan) {
        return Send.notFound(res, null, 'floorplan not found')
      }
      
      //replace slots
      await Slot.deleteMany({ floorplan: floorplan._id })
      for (let i = 0; i < slots.length; i++) {
        slots[i].floorplan = floorplan
        const item = await Slot.create(slots[i])
      }
      const { modifiedCount } = await FloorPlan.updateOne(
        { name }, 
        { floor, building }
      )
      if (modifiedCount < 1) {
        return Send.notFound(
          res, { modifiedCount },
          `Unable to modify floorplan: ${name}`
        )
      }
      Send.success(res, null, 'Successfully updated floorplan')
    }
    catch (err) {
      Send.errorMsg(res, `Error updating floorplan: ${err.message}`)
    }
  }

  async delete(req, res) {
    try {
      const { name } = req.body
      const floorplan = await FloorPlan.findOne({ name })
      await FloorPlan.deleteOne({ _id: floorplan._id })
      Send.success(res, null, 
        `successfully deleted: ${name}`)
    }
    catch (err) {
      Send.error(res, null, 
        `Error deleting floorplan: ${err.message}`)
    }
  }

  async getCompanyFloorplans(req, res) {
    try {
      //parse query from previous middleware
      //get company from user
      const { user } = req.body
      const { company } = await User.findOne({ _id: user.id })
      const slots = await Slot.find({ company })

      let floorplansStr = slots.map(item => item.floorplan.toString())
      floorplansStr = new Set(floorplansStr)
      floorplansStr = [...floorplansStr]

      const floorplans = []
      for ( const fp of floorplansStr ) {
        const { name, floor, building } = await FloorPlan.findOne({ _id: fp })
        const slotsFp = await Slot.find({ floorplan: { _id: fp }, company })
        floorplans.push(
          {
            name,
            floor,
            building,
            slots: slotsFp
          }
        )
      }

      Send.success(res, { floorplans: floorplans }, undefined)
    }
    catch (err) {
      Send.errorMsg(res, 
        `Error getting company floorplans: ${err.message}`)
    }
  }
}

export default FloorPlanController
