import express from 'express'
import payloadInspector from '../middleware/validate.js'
import { BookController } from '../controllers/controllers.js'

//TODO add verify User or verify Jwt
const bookControl = new BookController()


const router = express.Router()
router.post('/create', 
  payloadInspector.reservedTo.inspect,
  payloadInspector.slot.inspect,
  payloadInspector.floorplan.inspect,
  payloadInspector.slotInFloorplan.inspect,
  bookControl.create
)

export default router
