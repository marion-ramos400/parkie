import mongoose from 'mongoose'
import { slotSchema } from './slot.models.js'
const floorplanSchema = new mongoose.Schema({
  floor: {
    type: String,
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
