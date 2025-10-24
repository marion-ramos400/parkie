import crypto from 'crypto'
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
      //generate ticketnum
      const ticketnum = generateTicketNum(req.body)
      const booking = await Booking.create({ 
        ...data, 
        ticketnum,
        dtBooked: new Date(),
        slot: slotItem._id,
        floorplan: flrplan._id, 
      })
      if (!booking) {
        return Send.errorMsg(
          res, null, 
          'Unable to create booking:')
      }
      await Slot.updateOne(
        { _id: slotItem._id },
        { isBooked: true }
      )
      req.body.ticketnum = ticketnum 
      Send.created(res, req.body, 'successfully created booking')
    }
    catch (err) {
      Send.errorMsg(res, 
        `Error creating booking: ${err.message}`
      )
    }
  }

  async get(req, res) {
    try {

    }
    catch (err) {
      Send.errorMsg(res, 
        `Error retrieving booking: ${err.message}`
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

const generateTicketNum = (data, type="PARKING") => {
  const { dtFrom, dtTo, slot, floorplan } = data
  const str = dtFrom.toString() 
    + dtTo.toString()
    + slot.name
    + floorplan.name
  const hash = crypto.createHash('sha256')
  hash.update(str)
  const hexStr = hash.digest('hex') 
  const ticketnum = hexStr.substring(hexStr.length-9, hexStr.length-1)
  return `P${ticketnum.toUpperCase()}` 
}

export default BookController
