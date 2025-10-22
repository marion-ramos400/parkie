import express from 'express'
import {
  SlotInspector,
  FloorPlanInspector,
  SlotInFloorPlanInspector,
} from '../middleware/validate.js'
import { BookController } from '../controllers/controllers.js'

//TODO add verify User or verify Jwt
const bookControl = new BookController()
const validators = {
  slot: new SlotInspector(),
  floorplan: new FloorPlanInspector(),
  slotInFloorplan: new SlotInFloorPlanInspector()
}


const router = express.Router()
router.post('/create', 
  validators.slot.inspect, 
  validators.floorplan.inspect, 
  validators.slotInFloorplan.inspect,
  bookControl.create
)

export default router
