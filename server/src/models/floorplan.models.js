import mongoose from 'mongoose'
import { Slot, slotSchema } from './slot.models.js'
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

floorplanSchema.pre('deleteOne', async function(next) {
  const flrPlanId = this.getQuery()._id
  const items = await Slot.find({ floorplan: flrPlanId})
  const res = await Slot.deleteMany({ floorplan: flrPlanId })
  next()
})

const FloorPlan = mongoose.model('FloorPlan', floorplanSchema)
export default FloorPlan
