import mongoose from 'mongoose'
import { slotSchema } from './slot.models.js'

const bookingSchema = new mongoose.Schema({
  floor: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  building: {
    type: String,
    default: ''
  },
  reservedTo: {
    type: String,
    required: true
  },
  dateBooking: {
    type: Date
  },
  dateReserved: {
    type: Date
  },
  from: {
    type: Date
  },
  to: {
    type: Date
  },
  ticketnum: {
    type: String,
    required: true,
    unique: true
  },
  slot: {
    type: slotSchema
  }
})

const Booking = mongoose.model('Booking', bookingSchema)
export default Booking

