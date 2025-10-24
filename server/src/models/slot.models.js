import mongoose from 'mongoose'
const slotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
//  floor: {
//    type: String,
//  },
  company: {
    type: String,
    required: true
  },
//  building: {
//    type: String,
//    default: ''
//  },
  type: {
    type: String, //PARKING | OFFICE
    default: ''
  },
  isBooked: {
    type: Boolean,
    required: true,
    default: false
  },
  uiRect: Object,
  floorplan: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'FloorPlan',
    required: true,
  }
})

const Slot = mongoose.model('Slot', slotSchema)
export {
  Slot,
  slotSchema
}
