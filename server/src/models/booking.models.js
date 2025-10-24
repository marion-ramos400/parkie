import mongoose from 'mongoose'
import { slotSchema } from './slot.models.js'
import { floorplanSchema } from './floorplan.models.js'

const bookingSchema = new mongoose.Schema({
  ticketnum: {
    type: String,
    required: true,
    unique: true
  },
  reservedTo: { //should be linked to User //company can be from User
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dtBooked: {
    type: Date
  },
  dtFrom: {
    type: Date
  },
  dtTo: {
    type: Date
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot'
  },
  floorplan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FloorPlan'
  }
})

const Booking = mongoose.model('Booking', bookingSchema)
export default Booking

