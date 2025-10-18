
import mongoose from 'mongoose'
const slotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  floor: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  building: {
    type: String,
    default: ''
  },
  type: {
    type: String, //PARKING | OFFICE
    default: ''
  },
  isBooked: {
    type: Boolean,
    required: true,
    default: false
  },
  uiRect: {
    type: Map,
    of: mongoose.Schema.Types.Int32 //x, y, w, h
  }
})

const Slot = mongoose.model('Slot', slotSchema)
export {
  Slot,
  slotSchema
}
