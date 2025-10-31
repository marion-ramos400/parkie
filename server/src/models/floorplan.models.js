import mongoose from 'mongoose'
import { Slot, slotSchema } from './slot.models.js'
const floorplanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  floor: {
    type: String,
    required: true,
  },
  building: {
    type: String,
    default: ''
  },
  img: {
    data: Buffer,
    contentType: String,
  }
})

floorplanSchema.pre('deleteOne', async function(next) {
  const flrPlanId = this.getQuery()._id
  const items = await Slot.find({ floorplan: flrPlanId})
  const res = await Slot.deleteMany({ floorplan: flrPlanId })
  next()
})

const FloorPlan = mongoose.model('FloorPlan', floorplanSchema)
export { 
  floorplanSchema,
  FloorPlan,
}
