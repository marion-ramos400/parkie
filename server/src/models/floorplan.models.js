import mongoose from 'mongoose'
import { slotSchema } from './slot.models.js'
const floorplanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  floor: {
    type: mongoose.Schema.Types.Int32,
    required: true,
  },
  building: {
    type: String,
    default: ''
  },
  slots: [slotSchema]
})

const FloorPlan = mongoose.model('FloorPlan', floorplanSchema)
export default FloorPlan
