import InterfaceController from './interface.controller.js'
import { Booking, FloorPlan, Slot } from '../models/models.js'
import Send from '../http/response.js'

class BookController extends InterfaceController {
  async create(req, res) {
    try {
      const { floorplan, slot, ...data } = req.body
      const flrplan = await FloorPlan.findOne({ name: floorplan.name })   
      if (!flrplan) {
        return Send.badRequest(
          res, null, 
          'Error creating booking:'
          + `floorplan ${floorplan.name} not found`)
      }
      const slotItem = await Slot.findOne({ 
          floorplan: flrplan._id,
          name: slot.name 
        })
      if (!slotItem) {
        return Send.badRequest(
          res, null, 
          'Error creating booking:'
          + `slot ${slot.name} not found`)
      }
      const booking = await Booking.create({ 
        ...data, 
        slot: slotItem._id,
        floorplan: flrplan._id, })
      if (!booking) {
        return Send.errorMsg(
          res, null, 
          'Unable to create booking:')
      }
      Send.created(res, req.body, 'successfully created booking')
    }
    catch (err) {
      Send.errorMsg(res, 
        `Error creating booking: ${err.message}`
      )
    }
  }

  async delete(req, res) {
    try {
      const { ticketnum } = req.body
      const booking = await Booking.deleteOne({ ticketnum })
    }
    catch (err) {
      Send.errorMsg(res, 
        `Error deleting booking: ${err.message}`)
    }
  }
}

export default BookController
